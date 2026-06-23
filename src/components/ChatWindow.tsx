'use client'

import { useEffect, useRef, useState } from 'react'
import { Message, Persona } from '@/lib/types'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'
import { useChat } from '@/hooks/useChat'
import { TokenUsageBadge } from './TokenUsageBadge'

const DAILY_LIMIT = 50000

interface Props {
  conversationId: string
  persona: Persona
  initialMessages?: Message[]
}

export function ChatWindow({ conversationId, persona, initialMessages = [] }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [tokensRemaining, setTokensRemaining] = useState(DAILY_LIMIT)
  const { messages, isLoading, error, sendMessage } = useChat({
    conversationId,
    persona,
    initialMessages,
    onTokensUpdate: setTokensRemaining,
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-gray-400 text-sm">
            Upload a PDF and start asking questions.
          </div>
        )}
        {messages.map(m => <MessageBubble key={m.id} message={m} />)}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="text-center text-sm text-red-500 py-2">{error}</div>
        )}
        <div ref={bottomRef} />
      </div>
      <TokenUsageBadge remaining={tokensRemaining} limit={DAILY_LIMIT} />
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  )
}
