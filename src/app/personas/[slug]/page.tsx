'use client'

import { useState, useEffect, use, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PERSONAS, resolvePrompt } from '@/lib/personas'
import { ChatContext } from '@/lib/chat-context'
import { ChatWindow } from '@/components/ChatWindow'
import { GraphViz } from '@/components/GraphViz'
import { useAuth } from '@/components/AuthProvider'

function PersonaPageInner({ slug }: { slug: string }) {
  const { user } = useAuth()
  const router = useRouter()
  const persona = PERSONAS[slug]
  const [varValues, setVarValues] = useState<Record<string, string>>(persona?.variables ?? {})
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [kbOpen, setKbOpen] = useState(false)

  const systemPrompt = persona ? resolvePrompt(persona.promptTemplate, varValues) : ''
  const knowledgeBase = persona?.knowledgeBase ?? ''

  useEffect(() => {
    if (!user) return
    // Create a dedicated conversation for this persona demo
    fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ persona: 'custom', title: persona?.label ?? slug }),
    })
      .then(r => r.json())
      .then(conv => conv.id && setConversationId(conv.id))
  }, [user, slug, persona?.label])

  if (!persona) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Persona not found. <Link href="/personas" className="ml-2 text-blue-500 underline">Back to gallery</Link>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <p className="text-gray-600">Sign in to try this demo</p>
        <Link href="/login" className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Sign in →</Link>
      </div>
    )
  }

  return (
    <ChatContext.Provider value={{
      systemPrompt,
      setSystemPrompt: () => {},
      knowledgeBase,
      setKnowledgeBase: () => {},
    }}>
      <div className="flex h-screen overflow-hidden bg-gray-950 text-white">

        {/* Left — Case Study */}
        <div className="w-1/2 flex flex-col overflow-y-auto border-r border-white/10">
          {/* Top bar */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-gray-900/60 backdrop-blur sticky top-0 z-10">
            <Link href="/personas" className="text-xs text-gray-400 hover:text-white transition">← All use cases</Link>
          </div>

          <div className="px-8 py-8 flex flex-col gap-8">
            {/* Hero */}
            <div>
              <div className="text-4xl mb-3">{persona.icon}</div>
              <h1 className="text-2xl font-bold text-white">{persona.label}</h1>
              <p className="text-teal-400 font-medium mt-1">{persona.tagline}</p>
              <p className="text-gray-400 text-sm mt-3 leading-relaxed">{persona.description}</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              {persona.caseStudy.metrics.map(m => (
                <div key={m.label} className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <div className="text-2xl font-bold text-teal-400">{m.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Story */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2">The Problem</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{persona.caseStudy.problem}</p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Our Solution</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{persona.caseStudy.solution}</p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2">The Outcome</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{persona.caseStudy.outcome}</p>
              </div>
            </div>

            {/* Knowledge base collapsible */}
            <div>
              <button
                onClick={() => setKbOpen(o => !o)}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition"
              >
                <span className="uppercase tracking-widest">Knowledge Base</span>
                <span className="text-teal-500">{kbOpen ? '▲' : '▼'}</span>
              </button>
              {kbOpen && (
                <pre className="mt-3 text-xs text-gray-400 bg-black/40 rounded-lg p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap">
                  {persona.knowledgeBase}
                </pre>
              )}
            </div>

            {/* Graph viz */}
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">GraphRAG Knowledge Graph</p>
              <GraphViz />
              <p className="text-xs text-gray-600 mt-2">Entity-relationship graph built by LightRAG from the knowledge base above. Enterprise tier includes real-time graph indexing.</p>
            </div>
          </div>
        </div>

        {/* Right — Chat */}
        <div className="w-1/2 flex flex-col bg-gray-900 overflow-hidden">
          {/* Variable slots */}
          <div className="px-4 py-3 border-b border-white/10 bg-gray-950/60">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">Customise this bot</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(varValues).map(([key, val]) => (
                <div key={key}>
                  <label className="block text-[10px] text-gray-500 mb-0.5 capitalize">{key.replace(/_/g, ' ')}</label>
                  <input
                    value={val}
                    onChange={e => setVarValues(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 overflow-hidden">
            {conversationId ? (
              <div className="h-full flex flex-col">
                <ChatWindow
                  conversationId={conversationId}
                  persona="custom"
                />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500 text-sm">
                Setting up your demo…
              </div>
            )}
          </div>
        </div>
      </div>
    </ChatContext.Provider>
  )
}

export default function PersonaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-gray-500">Loading…</div>}>
      <PersonaPageInner slug={slug} />
    </Suspense>
  )
}
