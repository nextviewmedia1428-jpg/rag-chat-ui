import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { PERSONAS } from '@/lib/personas'
import { createAdminClient } from '@/lib/supabase-server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const LR     = process.env.LIGHTRAG_URL

export async function POST(req: NextRequest) {
  // Read env var per-request so it's never stale from a cold-start snapshot
  const DEMO_ID = process.env.DEMO_USER_ID

  const { message, persona = 'customer-support', history = [] } = await req.json()
  if (!message?.trim()) return NextResponse.json({ error: 'message required' }, { status: 400 })

  console.log('\n═══ DEMO-CHAT REQUEST ═══')
  console.log('Query   :', message)
  console.log('DEMO_ID :', DEMO_ID ?? '❌ NOT SET')

  const def = PERSONAS[persona] ?? PERSONAS['customer-support']
  const resolvedPrompt = def.promptTemplate.replace(/\{\{(\w+)\}\}/g, (_, k) => def.variables[k] ?? k)

  let pgRaw: { content: string; similarity: number }[] = []
  let pgvectorChunks: string[] = []
  let lightragText = ''

  if (!DEMO_ID) {
    console.log('⚠️  DEMO_ID missing — skipping RAG, using embedded KB')
  } else {
    console.log('▶ Running pgvector + LightRAG in parallel…')
    const [pgResult, lrResult] = await Promise.allSettled([
      queryPgvector(message, DEMO_ID),
      queryLightrag(message),
    ])

    if (pgResult.status === 'rejected') console.error('pgvector threw:', pgResult.reason)
    if (lrResult.status === 'rejected') console.error('LightRAG threw:', lrResult.reason)

    pgRaw          = pgResult.status === 'fulfilled' ? pgResult.value : []
    lightragText   = lrResult.status === 'fulfilled' ? lrResult.value : ''
    pgvectorChunks = pgRaw.map(r => r.content)

    console.log(`\n── pgvector → ${pgRaw.length} chunks after threshold filter ──`)
    if (pgRaw.length === 0) {
      console.log('  (zero chunks — RPC error above, or all similarities below threshold)')
    } else {
      pgRaw.forEach((r, i) => console.log(`  [${i + 1}] sim=${r.similarity} — ${r.content.slice(0, 150)}…`))
    }
    console.log(`\n── LightRAG → ${lightragText.length} chars ──`)
    console.log(lightragText.slice(0, 300) || '  (empty)')
    console.log('═══════════════════════════\n')
  }

  const parts: string[] = []
  if (lightragText)       parts.push(`[Graph RAG]\n${lightragText}`)
  if (pgvectorChunks.length) parts.push(`[Semantic Search]\n${pgvectorChunks.join('\n\n---\n\n')}`)
  const ragContext = parts.join('\n\n===\n\n')

  const knowledgeSection = ragContext
    ? `\n\n## Knowledge Base (retrieved)\n${ragContext}`
    : `\n\n## Built-in Knowledge Base\n${def.knowledgeBase}`

  const systemPrompt = `${resolvedPrompt}${knowledgeSection}

Keep answers concise and grounded in the knowledge base above. This is a live demo — be helpful and impressive.`

  const chatMessages = [
    ...(history as { role: string; content: string }[])
      .slice(-8)
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: message },
  ]

  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 512,
      messages: [{ role: 'system', content: systemPrompt }, ...chatMessages],
    })
    return NextResponse.json({
      reply: res.choices[0].message.content ?? '',
      source: ragContext ? 'rag' : 'embedded',
      pgvectorChunks: pgRaw,   // [{ content, similarity }]
      lightragText,
    })
  } catch {
    return NextResponse.json({ error: 'AI error' }, { status: 500 })
  }
}

async function queryPgvector(query: string, userId: string): Promise<{ content: string; similarity: number }[]> {
  console.log('  [pgvector] embedding query…')
  const admin = createAdminClient()
  const embRes = await openai.embeddings.create({ model: 'text-embedding-3-small', input: query })
  console.log(`  [pgvector] embedding done (${embRes.data[0].embedding.length}d), calling match_chunks for user ${userId}…`)

  const { data, error } = await admin.rpc('match_chunks', {
    query_embedding: embRes.data[0].embedding,
    filter_user_id: userId,
    match_count: 10,
    match_threshold: 0,   // no DB-level filter — log raw scores first, filter in app
  })

  if (error) {
    console.error('  [pgvector] RPC ERROR:', error.message)
    return []
  }

  console.log(`  [pgvector] RPC returned ${(data ?? []).length} raw rows`)
  ;(data ?? []).forEach((r: { similarity: number; content: string }, i: number) =>
    console.log(`    raw[${i}] sim=${Math.round(r.similarity * 1000) / 1000} — ${r.content.slice(0, 80)}…`)
  )

  const filtered = (data ?? [])
    .map((r: { content: string; similarity: number }) => ({
      content: r.content,
      similarity: Math.round(r.similarity * 1000) / 1000,
    }))
    .filter((r: { similarity: number }) => r.similarity >= 0.3)
    .slice(0, 5)

  console.log(`  [pgvector] after threshold(0.3): ${filtered.length} chunks`)
  return filtered
}

async function queryLightrag(query: string): Promise<string> {
  if (!LR) return ''
  try {
    const res = await fetch(`${LR}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, mode: 'mix', top_k: 5, response_type: 'Multiple Paragraphs' }),
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) { console.error('LightRAG query failed:', res.status); return '' }
    const data = await res.json()
    return data.response ?? data.result ?? ''
  } catch (e) {
    console.error('LightRAG timeout/error:', e)
    return ''
  }
}
