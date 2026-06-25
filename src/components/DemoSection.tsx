'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { GraphViz } from './GraphViz'
import { useRenderStatus } from './RenderStatus'

const DEMO_DOCS = [
  { name: 'Company_Overview.pdf',        pages: 8,  icon: '🏭', file: 'abc_electronics_company_overview.pdf'    },
  { name: 'Product_Catalogue.pdf',       pages: 12, icon: '📦', file: 'abc_electronics_product_catalogue.pdf'   },
  { name: 'Warranty_and_Service.pdf',    pages: 14, icon: '🔧', file: 'abc_electronics_warranty_and_service.pdf' },
  { name: 'HR_Policy_Manual.pdf',        pages: 28, icon: '📋', file: 'abc_electronics_hr_policy.pdf'           },
]

const PERSONAS_DEMO = [
  { key: 'abc-general-secretary', label: 'General Secretary', icon: '🏢' },
  { key: 'abc-hr-support',        label: 'HR Support',        icon: '📋' },
  { key: 'abc-customer-support',  label: 'Customer Support',  icon: '🎧' },
  { key: 'abc-sales-team',        label: 'Sales Assistant',   icon: '💼' },
  { key: 'abc-sales-trainer',     label: 'Sales Trainer',     icon: '🎓' },
]

const SUGGESTIONS: Record<string, string[]> = {
  'abc-general-secretary': [
    'What does ABC Electronics manufacture and where?',
    'What is the maternity leave policy?',
    'How do I register my ABC Electronics product for warranty?',
  ],
  'abc-hr-support': [
    'How many casual leaves do I get and can I carry them forward?',
    'When is gratuity paid and how is it calculated?',
    'What is the notice period for a Manager-level employee?',
  ],
  'abc-customer-support': [
    'What does error code E1 mean on my front-load washing machine?',
    'My refrigerator compressor warranty — how many years is it?',
    'How do I book a service request for my AC?',
  ],
  'abc-sales-team': [
    'What are the key features of the CoolPro 1.5T AC and its price?',
    'Compare the ProWash Combo vs a standard front-load washer.',
    'What commercial laundry machines does ABC Electronics offer?',
  ],
  'abc-sales-trainer': [
    'Quiz me on the AirSmart AC — what makes it different?',
    'How do I handle the objection "LG is better for washing machines"?',
    'What is the key selling story for the CleanMaster dishwasher?',
  ],
}

export function DemoSection() {
  const renderStatus = useRenderStatus()
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [input, setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [persona, setPersona] = useState('abc-general-secretary')
  const [activatedIds, setActivatedIds] = useState<string[]>([])
  const [chunks, setChunks] = useState<string[]>([])
  const chatScrollRef = useRef<HTMLDivElement>(null)

  // Scroll only the chat container (not the page) — fixes page-jump bug
  useEffect(() => {
    if (messages.length === 0) return
    const el = chatScrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])
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
      const reply = data.reply ?? 'Something went wrong. Try again.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      if (data.chunks?.length) setChunks(data.chunks)
      const entities = [...new Set((reply.match(/\b[A-Z][A-Za-z0-9]*(?:[\s-][A-Z][A-Za-z0-9]*)*\b/g) ?? [])
        .filter((s: string) => s.length >= 3))]
      setActivatedIds(entities as string[])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Demo server is waking up — it may take 30s on first query. Try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const suggestions = SUGGESTIONS[persona] ?? SUGGESTIONS['it-helpdesk']

  return (
    <section id="demo" className="px-6 md:px-10 py-24" data-hub-x="24" data-hub-y="62">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-mono mb-5 transition-colors ${
            renderStatus === 'ok'
              ? 'border-[rgba(26,107,60,0.2)] bg-[#EBF5EF] text-[#1A6B3C]'
              : renderStatus === 'warming'
              ? 'border-[rgba(232,160,32,0.3)] bg-[#FDF6E6] text-[#E8A020]'
              : renderStatus === 'offline'
              ? 'border-[rgba(255,77,61,0.2)] bg-[#FFF0EE] text-[#FF4D3D]'
              : 'border-[#E8E0D5] bg-[#FAF7F2] text-[#6B5E52]'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              renderStatus === 'ok' ? 'bg-[#1A6B3C] animate-pulse'
              : renderStatus === 'warming' ? 'bg-[#E8A020] animate-pulse'
              : renderStatus === 'offline' ? 'bg-[#FF4D3D]'
              : 'bg-[#6B5E52] animate-pulse'
            }`} />
            {renderStatus === 'ok'       && 'Live — AI Graph Online · No login required'}
            {renderStatus === 'warming'  && 'AI Graph Warming Up — Chat works via knowledge base'}
            {renderStatus === 'offline'  && 'AI server offline — Chat works via knowledge base'}
            {renderStatus === 'checking' && 'Connecting to AI Graph…'}
          </div>
          <h2 className="font-serif text-[36px] md:text-[42px] text-[#1C1510] mb-3">Try It Right Now</h2>
          <p className="text-sm text-[#6B5E52] max-w-md mx-auto">
            Chatting with ABC Electronics — trained on HR policy, product catalogue, warranty terms, and company overview.
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
                  ? 'bg-[#EBF5EF] border-[rgba(26,107,60,0.3)] text-[#1A6B3C]'
                  : 'border-[#E8E0D5] text-[#6B5E52] hover:border-[#1C1510]/20 hover:text-[#1C1510] bg-white'
              }`}
            >
              <span>{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>

        {/* Top row: docs list + chat + chunks */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_240px] gap-5 mb-5">

          {/* Docs list */}
          <div className="rounded-2xl border border-[#E8E0D5] bg-white p-4 shadow-sm self-start">
            <div className="text-[10px] text-[#1A6B3C] font-mono tracking-widest mb-3 uppercase">Indexed Documents</div>
            <div className="space-y-0">
              {DEMO_DOCS.map((doc, i) => (
                <div key={doc.name} className={`flex items-center gap-3 py-2.5 ${i < DEMO_DOCS.length - 1 ? 'border-b border-[#F1EDE5]' : ''}`}>
                  <span className="text-base flex-shrink-0">{doc.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[#1C1510] truncate">{doc.name}</div>
                    <div className="text-[10px] text-[#6B5E52]">{doc.pages} pages</div>
                  </div>
                  <a
                    href={`/Mock%20Documents/${doc.file}`}
                    download
                    className="text-[9px] text-[#1A6B3C] bg-[#EBF5EF] border border-[rgba(26,107,60,0.2)] rounded-full px-2 py-0.5 flex-shrink-0 hover:bg-[#D8EDE1] transition"
                  >
                    ↓ PDF
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="rounded-2xl border border-[#E8E0D5] glass flex flex-col h-[560px]">
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#E8E0D5] flex-shrink-0">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${renderStatus === 'ok' ? 'bg-[#1A6B3C] animate-pulse' : 'bg-[#E8A020] animate-pulse'}`} />
              <span className="text-sm font-medium text-[#1C1510]">IKnowIt Agent</span>
              <span className="text-[10px] text-[#6B5E52] font-mono ml-auto">
                {renderStatus === 'ok' ? 'LightRAG + pgvector · dual retrieval' : 'Knowledge base · graph warming'}
              </span>
            </div>

            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center pt-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EBF5EF] border border-[rgba(26,107,60,0.2)] flex items-center justify-center text-2xl mb-4">🧠</div>
                  <div className="text-sm font-semibold text-[#1C1510] mb-1">Ask me anything</div>
                  <div className="text-xs text-[#6B5E52] mb-6 max-w-xs">
                    Trained on ABC Electronics documents — HR policy, product catalogue, warranty terms, and company overview.
                  </div>
                  <div className="space-y-2 w-full max-w-sm">
                    {suggestions.map(s => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="w-full text-left text-xs text-[#6B5E52] border border-[#E8E0D5] hover:border-[rgba(26,107,60,0.3)] hover:text-[#1A6B3C] bg-[#FAF7F2] hover:bg-[#EBF5EF] rounded-xl px-4 py-2.5 transition"
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
                          ? 'bg-[#EBF5EF] text-[#1A6B3C] border border-[rgba(26,107,60,0.2)]'
                          : 'bg-[#FAF7F2] text-[#1C1510] border border-[#E8E0D5]'
                      }`}>
                        {m.content}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#FAF7F2] border border-[#E8E0D5] rounded-2xl px-5 py-3.5">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#1A6B3C]"
                          style={{ animation: `bounce-dot 1s ease-in-out ${i * 0.18}s infinite` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#E8E0D5] flex-shrink-0">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-[10px] text-[#6B5E52]">Demo · no login required</span>
                <span className="font-mono text-[10px] text-[#6B5E52]">{10 - messages.filter(m => m.role === 'user').length} replies left</span>
              </div>
              {messages.length >= 10 ? (
                <div className="text-center text-xs text-[#6B5E52] py-1">
                  Demo limit reached.{' '}
                  <Link href="/login" className="text-[#1A6B3C] hover:underline">Sign in for unlimited access →</Link>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); send(input) }} className="flex gap-2">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask anything about the documents…"
                    className="flex-1 bg-[#FAF7F2] border border-[#E8E0D5] focus:border-[rgba(26,107,60,0.4)] focus:outline-none rounded-xl px-4 py-2.5 text-sm text-[#1C1510] placeholder:text-[#6B5E52]/50 transition"
                  />
                  <button type="submit" disabled={loading || !input.trim()}
                    className="rounded-xl bg-[#1A6B3C] hover:bg-[#15572f] disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2.5 text-sm font-semibold text-white transition flex-shrink-0">
                    →
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Retrieved chunks panel */}
          <div className="rounded-2xl border border-[#E8E0D5] bg-white flex flex-col h-[560px]">
            <div className="px-4 py-3 border-b border-[#F1EDE5] flex-shrink-0">
              <div className="text-[10px] text-[#1A6B3C] font-mono tracking-widest uppercase">Retrieved Chunks</div>
              <div className="text-[10px] text-[#6B5E52] mt-0.5">pgvector semantic search</div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
              {chunks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="text-2xl mb-2">🔍</div>
                  <p className="text-xs text-[#6B5E52]">Relevant document chunks will appear here after your first query.</p>
                </div>
              ) : (
                chunks.map((c, i) => (
                  <div key={i} className="rounded-xl border border-[#F1EDE5] bg-[#FAF7F2] p-3">
                    <div className="text-[9px] font-mono text-[#1A6B3C] mb-1.5">chunk {i + 1}</div>
                    <p className="text-[10px] text-[#6B5E52] leading-relaxed line-clamp-6">{c}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Knowledge Graph — full width below */}
        <div className="rounded-2xl border border-[#E8E0D5] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] text-[#1A6B3C] font-mono tracking-widest uppercase">Knowledge Graph</div>
              <div className="text-[10px] text-[#6B5E52] mt-0.5">LightRAG entity relationships · highlighted nodes from last query</div>
            </div>
            {activatedIds.length > 0 && (
              <span className="text-[9px] font-mono text-[#1A6B3C] bg-[#EBF5EF] border border-[rgba(26,107,60,0.2)] rounded-full px-2.5 py-1">
                {activatedIds.length} active nodes
              </span>
            )}
          </div>
          <GraphViz activatedIds={activatedIds} />
        </div>
      </div>
    </section>
  )
}
