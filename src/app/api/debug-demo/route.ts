import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET() {
  const DEMO_ID = process.env.DEMO_USER_ID

  if (!DEMO_ID) {
    return NextResponse.json({ error: 'DEMO_USER_ID not set in env' })
  }

  const admin = createAdminClient()

  // Count chunks for this user
  const { count, error: countErr } = await admin
    .from('document_chunks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', DEMO_ID)

  // Get a sample chunk (no embedding, just text preview)
  const { data: sample, error: sampleErr } = await admin
    .from('document_chunks')
    .select('id, content, user_id')
    .eq('user_id', DEMO_ID)
    .limit(2)

  // List all distinct user_ids in the table (to verify which UUID has data)
  const { data: users, error: usersErr } = await admin
    .from('document_chunks')
    .select('user_id')
    .limit(200)

  const distinctUsers = users
    ? [...new Set(users.map((r: { user_id: string }) => r.user_id))]
    : []

  return NextResponse.json({
    demo_user_id: DEMO_ID,
    chunks_for_demo_user: count ?? 0,
    count_error: countErr?.message ?? null,
    sample_error: sampleErr?.message ?? null,
    sample: (sample ?? []).map((r: { id: string; content: string; user_id: string }) => ({
      id: r.id,
      user_id: r.user_id,
      content_preview: r.content.slice(0, 120),
    })),
    all_user_ids_in_table: distinctUsers,
    users_error: usersErr?.message ?? null,
  })
}
