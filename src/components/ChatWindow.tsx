'use client'

import { useEffect, useRef, useState } from 'react'
import { Message, Persona } from '@/lib/types'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'
import { useChat } from '@/hooks/useChat'
import { TokenUsageBadge } from './TokenUsageBadge'
import { useChatContext } from '@/lib/chat-context'

const DAILY_LIMIT = 50000

interface Props {
  conversationId: string
  persona: Persona
  initialMessages?: Message[]
}

export function ChatWindow({ conversationId, persona, initialMessages = [] }: Props) {
  const scrollRef  = useRef<HTMLDivElement>(null)
  const [tokensRemaining, setTokensRemaining] = useState(DAILY_LIMIT)
  const { systemPrompt, knowledgeBase } = useChatContext()

  useEffect(() => {
    fetch('/api/tokens')
      .then(r => r.json())
      .then(d => { if (typeof d.remaining === 'number') setTokensRemaining(d.remaining) })
      .catch(() => {})
  }, [])

  const { messages, isLoading, error, sendMessage } = useChat({
    conversationId,
    persona,
    systemPrompt: systemPrompt || undefined,
    knowledgeBase: knowledgeBase || undefined,
    initialMessages,
    onTokensUpdate: setTokensRemaining,
  })

  // Scroll messages container (not the page) to bottom
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, isLoading])

  return (
    <div className="flex h-full flex-col bg-[#FAF7F2]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 min-h-0">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-center px-6">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EBF5EF] border border-[rgba(26,107,60,0.2)] flex items-center justify-center text-2xl mx-auto mb-3">🧠</div>
              <p className="text-sm text-[#6B5E52]">Upload a document and start asking questions.</p>
            </div>
          </div>
        )}
        {messages.map(m => <MessageBubble key={m.id} message={m} />)}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="glass-cream rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1.5">
                {[0, 150, 300].map(d => (
                  <span key={d} className="w-2 h-2 bg-[#1A6B3C] rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        {error && <div className="text-center text-sm text-[#FF4D3D] py-2">{error}</div>}
      </div>
      <TokenUsageBadge remaining={tokensRemaining} limit={DAILY_LIMIT} />
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  )
}
