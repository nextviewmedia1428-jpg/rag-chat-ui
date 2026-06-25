import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { PERSONAS } from '@/lib/personas'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ponytail: embedded KB, no auth, no DB writes. 10-msg cap enforced client-side.
export async function POST(req: NextRequest) {
  const { message, persona = 'it-helpdesk', history = [] } = await req.json()
  if (!message?.trim()) return NextResponse.json({ error: 'message required' }, { status: 400 })

  const def = PERSONAS[persona] ?? PERSONAS['it-helpdesk']
  const resolvedPrompt = def.promptTemplate.replace(/\{\{(\w+)\}\}/g, (_, k) => def.variables[k] ?? k)

  const systemPrompt = `${resolvedPrompt}

## Knowledge Base
${def.knowledgeBase}

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
    return NextResponse.json({ reply: res.choices[0].message.content ?? '' })
  } catch {
    return NextResponse.json({ error: 'AI error' }, { status: 500 })
  }
}
