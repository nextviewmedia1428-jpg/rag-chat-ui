import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.LIGHTRAG_URL
  if (!url) return NextResponse.json({ nodes: [], edges: [] })
  const controller = new AbortController()
  setTimeout(() => controller.abort(), 9000)
  try {
    const res = await fetch(`${url}/graphs?label=*`, {
      signal: controller.signal,
      cache: 'no-store',
    })
    if (!res.ok) return NextResponse.json({ nodes: [], edges: [] })
    const data = await res.json()

    // Filter to top 50 nodes by degree server-side — keeps payload small
    type RN = { id: string; properties?: Record<string, string> }
    type RE = { source: string; target: string; properties?: Record<string, string> }
    const nodes: RN[] = data.nodes ?? []
    const edges: RE[] = data.edges ?? []

    const deg = new Map<string, number>()
    nodes.forEach(n => deg.set(n.id, 0))
    edges.forEach(e => {
      deg.set(e.source, (deg.get(e.source) ?? 0) + 1)
      deg.set(e.target, (deg.get(e.target) ?? 0) + 1)
    })
    const top = new Set([...deg.entries()].sort((a, b) => b[1] - a[1]).slice(0, 50).map(([id]) => id))
    const filteredNodes = nodes.filter(n => top.has(n.id))
    const filteredEdges = edges.filter(e => top.has(e.source) && top.has(e.target))

    return NextResponse.json({ nodes: filteredNodes, edges: filteredEdges })
  } catch {
    return NextResponse.json({ nodes: [], edges: [] })
  }
}
