import { NextRequest, NextResponse } from 'next/server'

const LR = process.env.LIGHTRAG_URL

export async function POST(req: NextRequest) {
  if (!LR) return NextResponse.json({ text: '' })
  const { query } = await req.json()
  if (!query?.trim()) return NextResponse.json({ text: '' })

  try {
    const res = await fetch(`${LR}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, mode: 'mix', top_k: 5, response_type: 'Multiple Paragraphs' }),
      signal: AbortSignal.timeout(25000),
    })
    if (!res.ok) return NextResponse.json({ text: '' })
    const data = await res.json()
    return NextResponse.json({ text: data.response ?? data.result ?? '' })
  } catch {
    return NextResponse.json({ text: '' })
  }
}
