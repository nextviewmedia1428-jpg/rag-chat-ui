'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { Sidebar } from '@/components/Sidebar'
import { Persona, PERSONA_PROMPTS } from '@/lib/types'
import { ChatContext, AgentConfig } from '@/lib/chat-context'

function ChatLayoutInner({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [persona, setPersona] = useState<Persona>('assistant')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [knowledgeBase, setKnowledgeBase] = useState('')
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({ name: '', company: '', tone: 'Professional' })
  const [connectedDocIds, setConnectedDocIds] = useState<string[]>([])

  useEffect(() => {
    if (user === null) router.push('/login')
  }, [user, router])

  useEffect(() => {
    const p = searchParams.get('persona') as Persona | null
    if (p && p in PERSONA_PROMPTS) {
      setPersona(p)
      setSystemPrompt(PERSONA_PROMPTS[p])
    }
  }, [searchParams])

  const handlePersonaChange = (p: Persona) => {
    setPersona(p)
    setSystemPrompt(PERSONA_PROMPTS[p])
    setKnowledgeBase('')
  }

  if (!user) return null

  return (
    <ChatContext.Provider value={{
      systemPrompt, setSystemPrompt,
      knowledgeBase, setKnowledgeBase,
      lastSources: null, setLastSources: () => {},
      agentConfig, setAgentConfig,
      connectedDocIds, setConnectedDocIds,
    }}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          persona={persona}
          onPersonaChange={handlePersonaChange}
          systemPrompt={systemPrompt}
          onSystemPromptChange={setSystemPrompt}
        />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </ChatContext.Provider>
  )
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <ChatLayoutInner>{children}</ChatLayoutInner>
    </Suspense>
  )
}
