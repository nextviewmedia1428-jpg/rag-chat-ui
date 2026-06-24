'use client'

import { createContext, useContext } from 'react'

export interface GraphEntity {
  entity_name: string
  entity_type: string
  description: string
  file_path?: string
}

export interface Sources {
  graphrag: string
  graphrag_entities: GraphEntity[]
  semantic: string[]
}

interface ChatContextValue {
  systemPrompt: string
  setSystemPrompt: (s: string) => void
  knowledgeBase: string
  setKnowledgeBase: (kb: string) => void
  lastSources: Sources | null
  setLastSources: (s: Sources | null) => void
}

export const ChatContext = createContext<ChatContextValue>({
  systemPrompt: '',
  setSystemPrompt: () => {},
  knowledgeBase: '',
  setKnowledgeBase: () => {},
  lastSources: null,
  setLastSources: () => {},
})

export const useChatContext = () => useContext(ChatContext)
