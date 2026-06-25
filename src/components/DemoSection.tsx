'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { GraphViz } from './GraphViz'

const DEMO_DOCS = [
  { name: 'HR_Handbook_v7.2.pdf',    pages: 312, icon: '📋', chunks: 840 },
  { name: 'IT_Runbook_v8.3.pdf',     pages:  89, icon: '💻', chunks: 412 },
  { name: 'Customer_FAQ_v4.1.pdf',   pages:  48, icon: '🎧', chunks: 310 },
  { name: 'Sales_Guide_Q1_2025.pdf', pages:  67, icon: '💼', chunks: 388 },
]

const PERSONAS_DEMO = [
  { key: 'it-helpdesk',       label: 'IT Helpdesk',       icon: '💻' },
  { key: 'hr-onboarding',     label: 'HR Onboarding',     icon: '📋' },
  { key: 'customer-support',  label: 'Customer Support',  icon: '🎧' },
  { key: 'sales-intelligence', label: 'Sales Intel',      icon: '💼' },
]

const SUGGESTIONS: Record<string, string[]> = {
  'it-helpdesk': [
    'How do I reset my VPN password?',
    "My laptop won't connect to corporate Wi-Fi",
    'How do I request new software?',
  ],
  'hr-onboarding': [
    'What is the maternity leave policy?',
    'How many casual leaves do I get per year?',
    'What happens to earned leave if I resign?',
  ],
  'customer-support': [
    'How do I claim warranty for my HomeConnect Pro?',
    'What is the refund policy?',
    'My AirPure filter needs replacement — how?',
  ],
  'sales-intelligence': [
    'What are the key differentiators vs WorkflowMax?',
    'What objection response for "too expensive"?',
    'What certifications does StellarOps hold?',
  ],
}

export function DemoSection() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [input, setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [persona, setPersona] = useState('it-helpdesk')
  const [tab, setTab]       = useState<'chat' | 'graph'>('chat')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])
  useEffect(() => { setMessages([]) }, [persona])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading || messages.length >= 10) return
    const userMsg = { role: 'user' as const, content: trimmed }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/demo-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, persona, history: messages }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply ?? 'Something went wrong. Try again.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Demo server is waking up — it may take 30s on first query. Try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const suggestions = SUGGESTIONS[persona] ?? SUGGESTIONS['it-helpdesk']

  return (
    <section id="demo" className="px-6 md:px-10 py-24">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-1.5 text-xs text-[#4DA2FF] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4DA2FF] animate-pulse" />
            Live Demo — No login required
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-3">Try It Right Now</h2>
          <p className="text-sm text-[#64748B] max-w-md mx-auto">
            Chatting with the Stellaris knowledge brain — trained on HR, IT, Customer Support, and Sales docs.
          </p>
        </div>

        {/* Persona switcher */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
          {PERSONAS_DEMO.map(p => (
            <button
              key={p.key}
              onClick={() => setPersona(p.key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition border ${
                persona === p.key
                  ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#4DA2FF]'
                  : 'border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1] hover:text-[#0F172A] bg-white'
              }`}
            >
              <span>{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">

          {/* Left: docs + graph */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <div className="text-[10px] text-[#4DA2FF] font-mono tracking-widest mb-3 uppercase">Indexed Documents</div>
              <div className="space-y-0">
                {DEMO_DOCS.map((doc, i) => (
                  <div key={doc.name} className={`flex items-center gap-3 py-2.5 ${i < DEMO_DOCS.length - 1 ? 'border-b border-[#F1F5F9]' : ''}`}>
                    <span className="text-base flex-shrink-0">{doc.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[#0F172A] truncate">{doc.name}</div>
                      <div className="text-[10px] text-[#94A3B8]">{doc.pages} pages · {doc.chunks} chunks</div>
                    </div>
                    <span className="text-[9px] text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 flex-shrink-0">Ready</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-[#F1F5F9] grid grid-cols-2 gap-2">
                {[
                  { label: 'Total pages',    val: '516' },
                  { label: 'Chunks indexed', val: '1,950' },
                  { label: 'Entities mapped', val: '124' },
                  { label: 'Relations',       val: '318' },
                ].map(s => (
                  <div key={s.label} className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] p-2">
                    <div className="text-sm font-bold text-[#4DA2FF]">{s.val}</div>
                    <div className="text-[9px] text-[#94A3B8]">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Knowledge Graph — intentionally dark panel */}
            <div className="hidden lg:block rounded-2xl border border-[#E2E8F0] bg-[#0F172A] p-3 shadow-sm">
              <div className="text-[10px] text-[#4DA2FF] font-mono tracking-widest mb-2 uppercase">Knowledge Graph</div>
              <GraphViz />
            </div>
          </div>

          {/* Right: chat */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm flex flex-col" style={{ minHeight: 520 }}>
            {/* Mobile tabs */}
            <div className="lg:hidden flex border-b border-[#E2E8F0]">
              {(['chat', 'graph'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-3 text-xs font-medium capitalize transition ${tab === t ? 'text-[#4DA2FF] border-b-2 border-[#4DA2FF]' : 'text-[#64748B]'}`}
                >
                  {t === 'chat' ? '💬 Chat' : '🕸 Knowledge Graph'}
                </button>
              ))}
            </div>

            {/* Desktop chat header */}
            <div className="hidden lg:flex items-center gap-3 px-5 py-3.5 border-b border-[#E2E8F0]">
              <span className="w-2 h-2 rounded-full bg-[#4DA2FF] animate-pulse flex-shrink-0" />
              <span className="text-sm font-medium text-[#0F172A]">IKnowIt Agent</span>
              <span className="text-[10px] text-[#94A3B8] ml-auto">LightRAG + GPT-4o mini · dual retrieval</span>
            </div>

            {/* Mobile graph */}
            {tab === 'graph' && (
              <div className="lg:hidden flex-1 p-4 bg-[#0F172A] rounded-b-2xl">
                <GraphViz />
              </div>
            )}

            {/* Chat view */}
            {tab === 'chat' && (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ maxHeight: 400 }}>
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center pt-8">
                      <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-2xl mb-4">🧠</div>
                      <div className="text-sm font-semibold text-[#0F172A] mb-1">Ask me anything</div>
                      <div className="text-xs text-[#64748B] mb-6 max-w-xs">I know everything across all 4 indexed documents for the {PERSONAS_DEMO.find(p => p.key === persona)?.label} persona.</div>
                      <div className="space-y-2 w-full max-w-sm">
                        {suggestions.map(s => (
                          <button
                            key={s}
                            onClick={() => send(s)}
                            className="w-full text-left text-xs text-[#64748B] border border-[#E2E8F0] hover:border-[#BFDBFE] hover:text-[#4DA2FF] bg-[#F8FAFC] hover:bg-[#EFF6FF] rounded-xl px-4 py-2.5 transition"
                          >
                            {s} →
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <AnimatePresence initial={false}>
                      {messages.map((m, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            m.role === 'user'
                              ? 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]'
                              : 'bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0]'
                          }`}>
                            {m.content}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-5 py-3.5">
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map(i => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-[#4DA2FF]"
                              style={{ animation: `bounce-dot 1s ease-in-out ${i * 0.18}s infinite` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-[#E2E8F0]">
                  {messages.length >= 10 ? (
                    <div className="text-center text-xs text-[#64748B] py-1">
                      Demo limit reached.{' '}
                      <Link href="/login" className="text-[#4DA2FF] hover:underline">Sign in for unlimited access →</Link>
                    </div>
                  ) : (
                    <form onSubmit={e => { e.preventDefault(); send(input) }} className="flex gap-2">
                      <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask anything about the documents…"
                        className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#BFDBFE] focus:outline-none rounded-xl px-4 py-2.5 text-sm text-[#0F172A] placeholder:text-[#CBD5E1] transition"
                      />
                      <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="rounded-xl bg-[#4DA2FF] hover:bg-[#60B3FF] disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2.5 text-sm font-semibold text-white transition flex-shrink-0"
                      >
                        →
                      </button>
                    </form>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
