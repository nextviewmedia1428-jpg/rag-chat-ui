import { createClient } from '@/lib/supabase-server'
import { ChatWindow } from '@/components/ChatWindow'
import { Message } from '@/lib/types'
import { redirect } from 'next/navigation'

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: conv } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!conv) redirect('/chat')

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  return (
    <ChatWindow
      conversationId={id}
      persona={conv.persona}
      initialMessages={(messages ?? []) as Message[]}
    />
  )
}
