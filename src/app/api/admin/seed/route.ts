import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import OpenAI from 'openai'
import { extractText } from 'unpdf'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const LR = process.env.LIGHTRAG_URL
const BASE = process.env.NEXT_PUBLIC_APP_URL
const DEMO_USER_ID = process.env.DEMO_USER_ID
const SEED_SECRET = process.env.SEED_SECRET

const CHUNK_SIZE = 1500
const CHUNK_OVERLAP = 150

const DEMO_DOCS = [
  { pdf: 'abc_electronics_company_overview.pdf',     label: 'Company_Overview.pdf' },
  { pdf: 'abc_electronics_product_catalogue.pdf',    label: 'Product_Catalogue.pdf' },
  { pdf: 'abc_electronics_warranty_and_service.pdf', label: 'Warranty_and_Service.pdf' },
  { pdf: 'abc_electronics_hr_policy.pdf',            label: 'HR_Policy_Manual.pdf' },
]

function chunkText(text: string): string[] {
  const chunks: string[] = []
  for (let i = 0; i < text.length; i += CHUNK_SIZE - CHUNK_OVERLAP) {
    chunks.push(text.slice(i, i + CHUNK_SIZE))
    if (i + CHUNK_SIZE >= text.length) break
  }
  return chunks
}

// One-time admin endpoint to seed Supabase pgvector + LightRAG with demo docs.
// Call with: POST /api/admin/seed  Header: x-seed-secret: <SEED_SECRET>
// Idempotent — skips if demo chunks already exist.
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-seed-secret')
  if (!SEED_SECRET || secret !== SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!DEMO_USER_ID || !BASE) {
    return NextResponse.json({ error: 'DEMO_USER_ID or NEXT_PUBLIC_APP_URL not configured' }, { status: 500 })
  }

  const admin = createAdminClient()

  // Idempotency check
  const { count } = await admin
    .from('document_chunks')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', DEMO_USER_ID)

  if ((count ?? 0) > 0) {
    return NextResponse.json({ message: 'Already seeded', chunk_count: count })
  }

  const results = []

  for (const doc of DEMO_DOCS) {
    const url = `${BASE}/Mock%20Documents/${encodeURIComponent(doc.pdf)}`
    const fetched = await fetch(url)
    if (!fetched.ok) { results.push({ doc: doc.label, error: `fetch failed ${fetched.status}` }); continue }

    const buffer = Buffer.from(await fetched.arrayBuffer())

    // Upload to LightRAG (best-effort)
    if (LR) {
      try {
        const form = new FormData()
        form.append('file', new Blob([buffer], { type: 'application/pdf' }), doc.label)
        await fetch(`${LR}/documents/upload`, {
          method: 'POST', body: form, signal: AbortSignal.timeout(45000),
        })
      } catch { /* non-fatal */ }
    }

    // Extract text + embed into pgvector
    const { text } = await extractText(new Uint8Array(buffer), { mergePages: true })
    const fullText = typeof text === 'string' ? text : (text as string[]).join('\n')
    if (fullText.trim().length < 50) { results.push({ doc: doc.label, error: 'empty text' }); continue }

    const { data: docRecord } = await admin
      .from('documents')
      .insert({ user_id: DEMO_USER_ID, filename: doc.label, status: 'processing' })
      .select()
      .single()
    if (!docRecord) { results.push({ doc: doc.label, error: 'db insert failed' }); continue }

    const chunks = chunkText(fullText)
    for (let i = 0; i < chunks.length; i += 10) {
      const batch = chunks.slice(i, i + 10)
      const embRes = await openai.embeddings.create({ model: 'text-embedding-3-small', input: batch })
      await admin.from('document_chunks').insert(
        batch.map((content, j) => ({
          document_id: docRecord.id,
          user_id: DEMO_USER_ID,
          content,
          embedding: JSON.stringify(embRes.data[j].embedding),
        }))
      )
    }

    await admin.from('documents').update({ status: 'ready' }).eq('id', docRecord.id)
    results.push({ doc: doc.label, chunks: chunks.length })
  }

  return NextResponse.json({ seeded: true, results })
}
