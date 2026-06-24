import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase-server'
import { PERSONA_PROMPTS, Persona } from '@/lib/types'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const LIGHTRAG_URL = process.env.LIGHTRAG_URL
const DAILY_TOKEN_LIMIT = parseInt(process.env.DAILY_TOKEN_LIMIT ?? '50000')

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { conversation_id, message, persona = 'assistant', system_prompt, knowledge_base } = await req.json()
  if (!conversation_id || !message?.trim()) {
    return NextResponse.json({ error: 'conversation_id and message required' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Check daily token limit
  const today = new Date().toISOString().slice(0, 10)
  const { data: usage } = await admin
    .from('token_usage')
    .select('tokens')
    .eq('user_id', user.id)
    .eq('date', today)
    .single()
  if ((usage?.tokens ?? 0) >= DAILY_TOKEN_LIMIT) {
    return NextResponse.json({ error: 'daily_limit_exceeded' }, { status: 429 })
  }

  // Fetch conversation history (last 10 messages)
  const { data: history } = await admin
    .from('messages')
    .select('role, content')
    .eq('conversation_id', conversation_id)
    .order('created_at', { ascending: true })
    .limit(10)

  // Save user message
  await admin.from('messages').insert({ conversation_id, role: 'user', content: message })

  // Dual retrieval — run in parallel (text + entities + semantic)
  const [semanticResults, lightragResult, lightragEntitiesResult] = await Promise.allSettled([
    semanticSearch(message, user.id, admin),
    lightragQuery(message),
    lightragQueryData(message),
  ])

  const semanticContext = semanticResults.status === 'fulfilled' ? semanticResults.value : []
  const lightragContext = lightragResult.status === 'fulfilled' ? lightragResult.value : ''
  const lightragEntities = lightragEntitiesResult.status === 'fulfilled' ? lightragEntitiesResult.value : []

  // Merge context (deduplicate similar chunks)
  const contextParts: string[] = []
  if (lightragContext) contextParts.push(`[Graph RAG]\n${lightragContext}`)
  if (semanticContext.length) {
    contextParts.push(`[Semantic Search]\n${semanticContext.join('\n\n---\n\n')}`)
  }
  const context = contextParts.join('\n\n===\n\n')

  const basePrompt = (system_prompt?.trim()) || PERSONA_PROMPTS[persona as Persona] || PERSONA_PROMPTS.assistant
  const kbSection = knowledge_base?.trim() ? `\n\n## Built-in Knowledge Base\n${knowledge_base}` : ''
  const contextSection = context ? `\n\n## Uploaded Document Context\n${context}` : ''
  const systemPrompt = `${basePrompt}${kbSection}${contextSection}${!context && !knowledge_base ? '\n\nNo documents have been uploaded yet. Let the user know they can upload PDFs to get document-grounded answers.' : ''}`

  const messages = [
    ...(history ?? []).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: message },
  ]

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1024,
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
  })

  const reply = response.choices[0].message.content ?? ''
  const tokensUsed = response.usage?.total_tokens ?? 0

  // Save assistant reply + update token usage
  await Promise.all([
    admin.from('messages').insert({ conversation_id, role: 'assistant', content: reply }),
    admin.from('token_usage').upsert(
      { user_id: user.id, date: today, tokens: (usage?.tokens ?? 0) + tokensUsed },
      { onConflict: 'user_id,date' }
    ),
    admin.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversation_id),
  ])

  return NextResponse.json({
    reply,
    tokens_used: tokensUsed,
    tokens_remaining: Math.max(0, DAILY_TOKEN_LIMIT - (usage?.tokens ?? 0) - tokensUsed),
    sources: {
      graphrag: lightragContext,
      graphrag_entities: lightragEntities,
      semantic: semanticContext,
    },
  })
}

async function semanticSearch(query: string, userId: string, admin: ReturnType<typeof createAdminClient>): Promise<string[]> {
  const embeddingRes = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  })
  const embedding = embeddingRes.data[0].embedding

  const { data } = await (await Promise.resolve(admin)).rpc('match_chunks', {
    query_embedding: embedding,
    filter_user_id: userId,
    match_count: 5,
  })
  return (data ?? []).map((r: { content: string }) => r.content)
}

interface LightragEntity {
  entity_name: string
  entity_type: string
  description: string
  file_path?: string
}

async function lightragQueryData(query: string): Promise<LightragEntity[]> {
  if (!LIGHTRAG_URL) return []
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(`${LIGHTRAG_URL}/query/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, mode: 'hybrid', top_k: 8 }),
      signal: controller.signal,
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data?.data?.entities ?? []).map((e: LightragEntity) => ({
      entity_name: e.entity_name,
      entity_type: e.entity_type,
      description: (e.description ?? '').split('<SEP>')[0].slice(0, 150),
      file_path: (e.file_path ?? '').split('<SEP>')[0],
    }))
  } catch {
    return []
  } finally {
    clearTimeout(timeout)
  }
}

async function lightragQuery(query: string): Promise<string> {
  if (!LIGHTRAG_URL) return ''
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(`${LIGHTRAG_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, mode: 'hybrid', top_k: 5 }),
      signal: controller.signal,
    })
    if (!res.ok) return ''
    const data = await res.json()
    return data.response ?? data.result ?? ''
  } catch {
    return ''
  } finally {
    clearTimeout(timeout)
  }
}
