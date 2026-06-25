import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase-server'

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, title } = await req.json().catch(() => ({}))
  if (!id || !title) return NextResponse.json({ error: 'id and title required' }, { status: 400 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('conversations')
    .update({ title: title.slice(0, 120) })
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id, title')
    .single()

  if (error) return NextResponse.json({ error: 'DB error' }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const admin = createAdminClient()
  await admin.from('conversations').delete().eq('id', id).eq('user_id', user.id)
  return NextResponse.json({ ok: true })
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = await createAdminClient()
  const { data } = await admin
    .from('conversations')
    .select('id, title, persona, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(50)

  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { persona = 'assistant' } = await req.json().catch(() => ({}))
  const admin = await createAdminClient()
  const { data, error } = await admin
    .from('conversations')
    .insert({ user_id: user.id, persona })
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'DB error' }, { status: 500 })
  return NextResponse.json(data)
}
