import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { PERSONAS } from '@/lib/personas'
import { createAdminClient } from '@/lib/supabase-server'

const openai  = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const LR      = process.env.LIGHTRAG_URL
const DEMO_ID = process.env.DEMO_USER_ID

export async function POST(req: NextRequest) {
  const { message, persona = 'customer-support', history = [] } = await req.json()
  if (!message?.trim()) return NextResponse.json({ error: 'message required' }, { status: 400 })

  const def = PERSONAS[persona] ?? PERSONAS['customer-support']
  const resolvedPrompt = def.promptTemplate.replace(/\{\{(\w+)\}\}/g, (_, k) => def.variables[k] ?? k)

  let pgRaw: { content: string; similarity: number }[] = []
  let pgvectorChunks: string[] = []
  let lightragText = ''

  if (DEMO_ID) {
    const [pgResult, lrResult] = await Promise.allSettled([
      queryPgvector(message),
      queryLightrag(message),
    ])

    pgRaw          = pgResult.status === 'fulfilled' ? pgResult.value : []
    lightragText   = lrResult.status === 'fulfilled' ? lrResult.value : ''
    pgvectorChunks = pgRaw.map(r => r.content)

    console.log('\n═══ DEMO-CHAT RETRIEVAL ═══')
    console.log('Query:', message)
    console.log(`\n── pgvector (threshold ≥0.5, top ${pgRaw.length} matched) ──`)
    if (pgRaw.length === 0) {
      console.log('  (no chunks above threshold)')
    } else {
      pgRaw.forEach((r, i) => console.log(`  [${i + 1}] similarity=${r.similarity} — ${r.content.slice(0, 180)}…`))
    }
    console.log('\n── LightRAG (mix, top_k=5) ──')
    console.log(lightragText.slice(0, 600) || '  (empty — Render cold or no graph)')
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

async function queryPgvector(query: string): Promise<{ content: string; similarity: number }[]> {
  const admin = createAdminClient()
  const embRes = await openai.embeddings.create({ model: 'text-embedding-3-small', input: query })
  const { data, error } = await admin.rpc('match_chunks', {
    query_embedding: embRes.data[0].embedding,
    filter_user_id: DEMO_ID,
    match_count: 5,
    match_threshold: 0.5,
  })
  if (error) { console.error('pgvector error:', error.message); return [] }
  return (data ?? []).map((r: { content: string; similarity: number }) => ({
    content: r.content,
    similarity: Math.round(r.similarity * 1000) / 1000,
  }))
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
