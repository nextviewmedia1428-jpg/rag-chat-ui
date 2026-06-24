import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase-server'

const DAILY_LIMIT = parseInt(process.env.DAILY_TOKEN_LIMIT ?? '50000')

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const today = new Date().toISOString().slice(0, 10)
  const { data } = await admin
    .from('token_usage')
    .select('tokens')
    .eq('user_id', user.id)
    .eq('date', today)
    .single()

  const used = data?.tokens ?? 0
  return NextResponse.json({ used, remaining: Math.max(0, DAILY_LIMIT - used), limit: DAILY_LIMIT })
}
