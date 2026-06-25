import { NextResponse } from 'next/server'

const LR = process.env.LIGHTRAG_URL
const BASE = process.env.NEXT_PUBLIC_APP_URL

const DEMO_PDFS = [
  'abc_electronics_company_overview.pdf',
  'abc_electronics_product_catalogue.pdf',
  'abc_electronics_warranty_and_service.pdf',
  'abc_electronics_hr_policy.pdf',
]

// Re-uploads demo PDFs to LightRAG after a cold start resets the graph.
// Pgvector chunks in Supabase persist across restarts — only LightRAG needs re-seeding.
export async function POST() {
  if (!LR || !BASE) return NextResponse.json({ error: 'not configured' }, { status: 500 })

  const results = await Promise.allSettled(
    DEMO_PDFS.map(async (name) => {
      const url = `${BASE}/Mock%20Documents/${encodeURIComponent(name)}`
      const file = await fetch(url)
      if (!file.ok) throw new Error(`fetch failed: ${name} (${file.status})`)
      const blob = await file.blob()
      const form = new FormData()
      form.append('file', blob, name)
      const res = await fetch(`${LR}/documents/upload`, {
        method: 'POST',
        body: form,
        signal: AbortSignal.timeout(30000),
      })
      if (!res.ok) throw new Error(`LightRAG upload failed: ${name}`)
      return name
    })
  )

  const synced = results.filter(r => r.status === 'fulfilled').length
  const errors = results
    .filter(r => r.status === 'rejected')
    .map(r => (r as PromiseRejectedResult).reason?.message)

  return NextResponse.json({ synced, total: DEMO_PDFS.length, errors })
}
