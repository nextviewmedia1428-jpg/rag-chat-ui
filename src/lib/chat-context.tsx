'use client'

import { createContext, useContext } from 'react'

interface ChatContextValue {
  systemPrompt: string
  setSystemPrompt: (s: string) => void
  knowledgeBase: string
  setKnowledgeBase: (kb: string) => void
}

export const ChatContext = createContext<ChatContextValue>({
  systemPrompt: '',
  setSystemPrompt: () => {},
  knowledgeBase: '',
  setKnowledgeBase: () => {},
})

export const useChatContext = () => useContext(ChatContext)
