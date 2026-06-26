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

export interface AgentConfig {
  name: string
  company: string
  tone: string
}

interface ChatContextValue {
  systemPrompt: string
  setSystemPrompt: (s: string) => void
  knowledgeBase: string
  setKnowledgeBase: (kb: string) => void
  lastSources: Sources | null
  setLastSources: (s: Sources | null) => void
  agentConfig: AgentConfig
  setAgentConfig: (c: AgentConfig) => void
  connectedDocIds: string[]
  setConnectedDocIds: (ids: string[]) => void
}

export const ChatContext = createContext<ChatContextValue>({
  systemPrompt: '',
  setSystemPrompt: () => {},
  knowledgeBase: '',
  setKnowledgeBase: () => {},
  lastSources: null,
  setLastSources: () => {},
  agentConfig: { name: '', company: '', tone: 'Professional' },
  setAgentConfig: () => {},
  connectedDocIds: [],
  setConnectedDocIds: () => {},
})

export const useChatContext = () => useContext(ChatContext)
