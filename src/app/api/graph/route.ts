import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.LIGHTRAG_URL
  if (!url) return NextResponse.json({ nodes: [], edges: [] })
  const controller = new AbortController()
  setTimeout(() => controller.abort(), 7000)
  try {
    const res = await fetch(`${url}/graphs?label=Stellaris+Group`, {
      signal: controller.signal,
      cache: 'no-store',
    })
    if (!res.ok) return NextResponse.json({ nodes: [], edges: [] })
    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json({ nodes: [], edges: [] })
  }
}
