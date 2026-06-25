import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { PERSONAS } from '@/lib/personas'
import { createAdminClient } from '@/lib/supabase-server'

const openai  = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const LR      = process.env.LIGHTRAG_URL
const DEMO_ID = process.env.DEMO_USER_ID  // UUID of the seeded demo Supabase user

// ponytail: embedded KB as fallback; real RAG when DEMO_USER_ID is seeded. 10-msg cap enforced client-side.
export async function POST(req: NextRequest) {
  const { message, persona = 'customer-support', history = [] } = await req.json()
  if (!message?.trim()) return NextResponse.json({ error: 'message required' }, { status: 400 })

  const def = PERSONAS[persona] ?? PERSONAS['customer-support']
  const resolvedPrompt = def.promptTemplate.replace(/\{\{(\w+)\}\}/g, (_, k) => def.variables[k] ?? k)

  // Try real RAG first (requires DEMO_USER_ID to be seeded)
  let ragContext = ''
  if (DEMO_ID) {
    const [semantic, lightrag] = await Promise.allSettled([
      semanticSearch(message),
      lightragQuery(message),
    ])
    const semanticChunks = semantic.status === 'fulfilled' ? semantic.value : []
    const lgContext       = lightrag.status === 'fulfilled' ? lightrag.value : ''

    const parts: string[] = []
    if (lgContext)             parts.push(`[Graph RAG]\n${lgContext}`)
    if (semanticChunks.length) parts.push(`[Semantic Search]\n${semanticChunks.join('\n\n---\n\n')}`)
    ragContext = parts.join('\n\n===\n\n')
  }

  const knowledgeSection = ragContext
    ? `\n\n## Knowledge Base (retrieved)\n${ragContext}`
    : `\n\n## Built-in Knowledge Base\n${def.knowledgeBase}`

  const systemPrompt = `${resolvedPrompt}${knowledgeSection}

Keep answers concise and grounded in the knowledge base above. This is a live demo — be helpful and impressive.`

  const messages = [
    ...(history as { role: string; content: string }[])
      .slice(-8)
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: message },
  ]

  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 512,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    })
    return NextResponse.json({
      reply: res.choices[0].message.content ?? '',
      source: ragContext ? 'rag' : 'embedded',
    })
  } catch {
    return NextResponse.json({ error: 'AI error' }, { status: 500 })
  }
}

async function semanticSearch(query: string): Promise<string[]> {
  if (!DEMO_ID) return []
  const admin = createAdminClient()
  const embRes = await openai.embeddings.create({ model: 'text-embedding-3-small', input: query })
  const { data } = await admin.rpc('match_chunks', {
    query_embedding: embRes.data[0].embedding,
    filter_user_id: DEMO_ID,
    match_count: 5,
  })
  return (data ?? []).map((r: { content: string }) => r.content)
}

async function lightragQuery(query: string): Promise<string> {
  if (!LR) return ''
  try {
    const res = await fetch(`${LR}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, mode: 'mix', top_k: 5 }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return ''
    const data = await res.json()
    return data.response ?? data.result ?? ''
  } catch { return '' }
}
