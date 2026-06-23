'use client'

import { useState, useCallback } from 'react'
import { Message, Persona } from '@/lib/types'

interface UseChatOptions {
  conversationId: string
  persona: Persona
  initialMessages?: Message[]
  onTokensUpdate?: (remaining: number) => void
}

export function useChat({ conversationId, persona, initialMessages = [], onTokensUpdate }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    setError(null)
    const userMsg: Message = {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: conversationId, message: content, persona }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error === 'daily_limit_exceeded' ? 'Daily token limit reached. Try again tomorrow.' : 'Something went wrong.')
        return
      }
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        conversation_id: conversationId,
        role: 'assistant',
        content: data.reply,
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, assistantMsg])
      if (onTokensUpdate) onTokensUpdate(data.tokens_remaining)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [conversationId, persona, onTokensUpdate])

  return { messages, isLoading, error, sendMessage }
}
