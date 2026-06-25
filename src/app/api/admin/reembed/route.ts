import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createAdminClient } from '@/lib/supabase-server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// POST /api/admin/reembed  — re-embeds all chunks with null/string embeddings for DEMO_USER_ID
export async function POST() {
  const DEMO_ID = process.env.DEMO_USER_ID
  if (!DEMO_ID) return NextResponse.json({ error: 'DEMO_USER_ID not set' }, { status: 400 })

  const admin = createAdminClient()

  // Fetch all chunks for demo user (embedding column will be null or unparseable string)
  const { data: chunks, error } = await admin
    .from('document_chunks')
    .select('id, content')
    .eq('user_id', DEMO_ID)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!chunks?.length) return NextResponse.json({ message: 'No chunks found', total: 0 })

  console.log(`[reembed] Found ${chunks.length} chunks for ${DEMO_ID} — re-embedding in batches of 10`)

  let updated = 0
  for (let i = 0; i < chunks.length; i += 10) {
    const batch = chunks.slice(i, i + 10)
    const embRes = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: batch.map(c => c.content),
    })
    for (let j = 0; j < batch.length; j++) {
      const { error: upErr } = await admin
        .from('document_chunks')
        .update({ embedding: embRes.data[j].embedding })
        .eq('id', batch[j].id)
      if (upErr) console.error(`[reembed] Failed chunk ${batch[j].id}:`, upErr.message)
      else updated++
    }
    console.log(`[reembed] batch ${i / 10 + 1}: ${Math.min(i + 10, chunks.length)}/${chunks.length} done`)
  }

  return NextResponse.json({ message: 'Done', total: chunks.length, updated })
}
