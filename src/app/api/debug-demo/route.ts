import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createAdminClient } from '@/lib/supabase-server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const DEMO_ID = process.env.DEMO_USER_ID

export async function GET(req: Request) {
  if (!DEMO_ID) return NextResponse.json({ error: 'DEMO_USER_ID not set' })

  const admin = createAdminClient()
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') ?? 'when was the company founded'

  // Embed the test query and run match_chunks with NO threshold
  const embRes = await openai.embeddings.create({ model: 'text-embedding-3-small', input: q })
  const { data, error } = await admin.rpc('match_chunks', {
    query_embedding: embRes.data[0].embedding,
    filter_user_id: DEMO_ID,
    match_count: 10,
  })

  return NextResponse.json({
    demo_user_id: DEMO_ID,
    query: q,
    rpc_error: error?.message ?? null,
    results: (data ?? []).map((r: { content: string; similarity: number }) => ({
      similarity: Math.round(r.similarity * 1000) / 1000,
      content_preview: r.content.slice(0, 120),
    })),
  })
}
