import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase-server'
import OpenAI from 'openai'
import { extractText } from 'unpdf'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const LIGHTRAG_URL = process.env.LIGHTRAG_URL
const CHUNK_SIZE = 1500  // chars ≈ 375 tokens
const CHUNK_OVERLAP = 150
const DAILY_TOKEN_LIMIT = parseInt(process.env.DAILY_TOKEN_LIMIT ?? '50000')

function chunkText(text: string): string[] {
  const chunks: string[] = []
  for (let i = 0; i < text.length; i += CHUNK_SIZE - CHUNK_OVERLAP) {
    chunks.push(text.slice(i, i + CHUNK_SIZE))
    if (i + CHUNK_SIZE >= text.length) break
  }
  return chunks
}

async function extractTextFromPDF(buffer: Buffer, hasMistralKey: boolean): Promise<string> {
  // Try Mistral OCR first if key is available (handles image-heavy PDFs)
  if (hasMistralKey) {
    try {
      const base64 = buffer.toString('base64')
      const res = await fetch('https://api.mistral.ai/v1/ocr', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral-ocr-latest',
          document: { type: 'document_url', document_url: `data:application/pdf;base64,${base64}` },
        }),
      })
      if (res.ok) {
        const data = await res.json()
        const text = data.pages?.map((p: { markdown: string }) => p.markdown).join('\n\n') ?? ''
        if (text.trim().length > 100) return text
      }
    } catch {
      // fall through to pdf-parse
    }
  }
  const { text } = await extractText(new Uint8Array(buffer), { mergePages: true })
  const merged = typeof text === 'string' ? text : (text as string[]).join('\n')
  console.log('[upload] extracted text length:', merged.length)
  return merged
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file || file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'PDF file required' }, { status: 400 })
  }
  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 4MB on free hosting)' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Create document record
  const { data: doc, error: docErr } = await admin
    .from('documents')
    .insert({ user_id: user.id, filename: file.name, status: 'processing' })
    .select()
    .single()
  if (docErr) return NextResponse.json({ error: 'DB error' }, { status: 500 })

  // Process synchronously — Vercel kills background tasks after response is sent
  await processDocument(doc.id, user.id, file, admin)

  const { data: updated } = await admin.from('documents').select('status').eq('id', doc.id).single()
  return NextResponse.json({ document_id: doc.id, status: updated?.status ?? 'processing' })
}

async function processDocument(
  docId: string,
  userId: string,
  file: File,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin: any
) {
  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const text = await extractTextFromPDF(buffer, !!process.env.MISTRAL_API_KEY)

    if (text.trim().length < 50) {
      console.error('[upload] Extracted text too short — scanned/image PDF?', text.length)
      await admin.from('documents').update({ status: 'error' }).eq('id', docId)
      return
    }

    // 1. Send to LightRAG
    if (LIGHTRAG_URL) {
      try {
        const lrRes = await fetch(`${LIGHTRAG_URL}/api/v1/insert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        })
        const lrBody = await lrRes.text()
        console.log('[upload] LightRAG insert status:', lrRes.status, lrBody.slice(0, 200))
      } catch (e) {
        console.error('[upload] LightRAG insert error:', e)
      }
    }

    // 2. Chunk + embed → Supabase pgvector
    const chunks = chunkText(text)
    for (let i = 0; i < chunks.length; i += 10) {
      const batch = chunks.slice(i, i + 10)
      const embeddingRes = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: batch,
      })
      const rows = batch.map((content, j) => ({
        document_id: docId,
        user_id: userId,
        content,
        embedding: JSON.stringify(embeddingRes.data[j].embedding),
      }))
      await admin.from('document_chunks').insert(rows)
    }

    await admin.from('documents').update({ status: 'ready' }).eq('id', docId)
  } catch (err) {
    console.error('[upload] processDocument failed:', err)
    await admin.from('documents').update({ status: 'error' }).eq('id', docId)
  }
}

// Status polling endpoint
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const docId = req.nextUrl.searchParams.get('doc_id')
  if (!docId) return NextResponse.json({ error: 'doc_id required' }, { status: 400 })

  const admin = createAdminClient()
  const { data } = await admin
    .from('documents')
    .select('id, status, filename')
    .eq('id', docId)
    .eq('user_id', user.id)
    .single()

  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}
