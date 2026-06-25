import { NextResponse } from 'next/server'

const LR = process.env.LIGHTRAG_URL

export async function GET() {
  if (!LR) return NextResponse.json({ status: 'unreachable' })
  const start = Date.now()
  try {
    // 1. Check Render is up
    const health = await fetch(`${LR}/health`, {
      signal: AbortSignal.timeout(6000),
      cache: 'no-store',
    })
    const latency = Date.now() - start
    if (!health.ok) return NextResponse.json({ status: 'unreachable', latency_ms: latency })

    // 2. Check graph has documents (graph resets on Render cold start even if server is "up")
    try {
      const docs = await fetch(`${LR}/documents`, {
        signal: AbortSignal.timeout(4000),
        cache: 'no-store',
      })
      if (docs.ok) {
        const data = await docs.json()
        // LightRAG returns { statuses: { filename: 'processed'|... } }
        const hasDocuments = Object.keys(data?.statuses ?? {}).length > 0
        if (!hasDocuments) {
          return NextResponse.json({ status: 'cold', latency_ms: latency })
        }
      }
    } catch { /* if /documents fails, assume ok — don't block */ }

    return NextResponse.json({ status: 'ok', latency_ms: latency })
  } catch {
    return NextResponse.json({ status: 'unreachable', latency_ms: Date.now() - start })
  }
}
