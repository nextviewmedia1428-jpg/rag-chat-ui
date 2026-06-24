'use client'

import { useState, use, Suspense } from 'react'
import Link from 'next/link'
import { PERSONAS, resolvePrompt } from '@/lib/personas'
import { ChatContext, Sources } from '@/lib/chat-context'
import { ChatWindow } from '@/components/ChatWindow'
import { GraphViz } from '@/components/GraphViz'
import { useAuth } from '@/components/AuthProvider'
import { useEffect } from 'react'

function SourcesPanel({ sources }: { sources: Sources | null }) {
  const [tab, setTab] = useState<'graphrag' | 'pgvector'>('graphrag')
  if (!sources) {
    return (
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
        <p className="text-xs text-gray-600 italic">Send a message to see retrieval sources.</p>
      </div>
    )
  }
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
      <div className="flex border-b border-white/[0.07]">
        {(['graphrag', 'pgvector'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-[11px] font-medium transition ${tab === t ? 'text-teal-400 border-b border-teal-500 -mb-px' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {t === 'graphrag' ? `GraphRAG · ${sources.graphrag_entities.length} entities` : `pgvector · ${sources.semantic.length} chunks`}
          </button>
        ))}
      </div>

      <div className="p-3 max-h-56 overflow-y-auto space-y-2">
        {tab === 'graphrag' ? (
          sources.graphrag_entities.length > 0 ? (
            sources.graphrag_entities.map((e, i) => (
              <div key={i} className="rounded-lg bg-black/30 border border-white/[0.06] p-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-white">{e.entity_name}</span>
                  <span className="text-[9px] text-teal-500 bg-teal-950/50 border border-teal-800/30 rounded px-1.5 py-0.5 uppercase">{e.entity_type}</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">{e.description}</p>
                {e.file_path && (
                  <p className="text-[9px] text-gray-700 mt-1 truncate">📄 {e.file_path}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-600 italic py-2">No GraphRAG entities retrieved for this query.</p>
          )
        ) : (
          sources.semantic.length > 0 ? (
            sources.semantic.map((chunk, i) => (
              <div key={i} className="rounded-lg bg-black/30 border border-white/[0.06] p-2.5">
                <div className="text-[9px] text-gray-600 mb-1 font-mono">chunk {i + 1}</div>
                <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-4">{chunk}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-600 italic py-2">No pgvector chunks retrieved. Upload PDFs to enable semantic search.</p>
          )
        )}
      </div>
    </div>
  )
}

function PersonaPageInner({ slug }: { slug: string }) {
  const { user } = useAuth()
  const persona = PERSONAS[slug]
  const [varValues, setVarValues] = useState<Record<string, string>>(persona?.variables ?? {})
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [kbOpen, setKbOpen] = useState(false)
  const [lastSources, setLastSources] = useState<Sources | null>(null)

  const systemPrompt  = persona ? resolvePrompt(persona.promptTemplate, varValues) : ''
  const knowledgeBase = persona?.knowledgeBase ?? ''

  // Activated node IDs from last GraphRAG response
  const activatedIds = lastSources?.graphrag_entities.map(e => e.entity_name) ?? []

  useEffect(() => {
    if (!user) return
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
        Persona not found. <Link href="/personas" className="ml-2 text-blue-500 underline">Back</Link>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <p className="text-gray-600 text-sm">Sign in to try this demo</p>
        <Link href="/login" className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white hover:bg-teal-500">Sign in →</Link>
      </div>
    )
  }

  return (
    <ChatContext.Provider value={{
      systemPrompt,
      setSystemPrompt: () => {},
      knowledgeBase,
      setKnowledgeBase: () => {},
      lastSources,
      setLastSources,
    }}>
      <div className="flex h-screen overflow-hidden bg-gray-950 text-white">

        {/* ── Left: case study + graph + sources ── */}
        <div className="w-1/2 flex flex-col overflow-y-auto border-r border-white/10">
          <div className="sticky top-0 z-10 flex items-center gap-3 px-6 py-3.5 border-b border-white/10 bg-gray-900/70 backdrop-blur">
            <Link href="/personas" className="text-xs text-gray-400 hover:text-white transition">← All use cases</Link>
          </div>

          <div className="px-7 py-7 flex flex-col gap-7">
            {/* Hero */}
            <div>
              <div className="text-4xl mb-3">{persona.icon}</div>
              <h1 className="text-2xl font-bold">{persona.label}</h1>
              <p className="text-teal-400 font-medium mt-1 text-sm">{persona.tagline}</p>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">{persona.description}</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              {persona.caseStudy.metrics.map(m => (
                <div key={m.label} className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-4">
                  <div className="text-2xl font-bold text-teal-400">{m.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Story */}
            <div className="space-y-4">
              {[
                { label: 'The problem', text: persona.caseStudy.problem },
                { label: 'Our solution', text: persona.caseStudy.solution },
                { label: 'The outcome', text: persona.caseStudy.outcome },
              ].map(({ label, text }) => (
                <div key={label}>
                  <h3 className="text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">{label}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            {/* Knowledge base collapsible */}
            <div>
              <button
                onClick={() => setKbOpen(o => !o)}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition"
              >
                <span className="uppercase tracking-widest">Knowledge base</span>
                <span className="text-teal-500">{kbOpen ? '▲' : '▼'}</span>
              </button>
              {kbOpen && (
                <pre className="mt-3 text-[10px] text-gray-400 bg-black/40 rounded-lg p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap max-h-64">
                  {persona.knowledgeBase}
                </pre>
              )}
            </div>

            {/* Graph viz */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">Knowledge graph</p>
                {activatedIds.length > 0 && (
                  <span className="text-[10px] text-teal-400">{activatedIds.length} nodes activated by last query</span>
                )}
              </div>
              <GraphViz activatedIds={activatedIds} />
              <p className="text-[10px] text-gray-700 mt-1.5">
                Hover any node to inspect. Bright nodes were retrieved by the last query.
              </p>
            </div>

            {/* Retrieval sources panel */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2.5">Retrieval sources</p>
              <SourcesPanel sources={lastSources} />
            </div>
          </div>
        </div>

        {/* ── Right: chat ── */}
        <div className="w-1/2 flex flex-col bg-gray-900 overflow-hidden">
          {/* Variable slots */}
          <div className="px-4 py-3 border-b border-white/10 bg-gray-950/50">
            <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest">Customise this bot</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(varValues).map(([key, val]) => (
                <div key={key}>
                  <label className="block text-[9px] text-gray-600 mb-0.5 capitalize">{key.replace(/_/g, ' ')}</label>
                  <input
                    value={val}
                    onChange={e => setVarValues(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full rounded-md bg-white/[0.05] border border-white/[0.08] px-2 py-1 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {conversationId ? (
              <ChatWindow conversationId={conversationId} persona="custom" />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-600 text-sm">
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
