'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { PERSONAS } from '@/lib/personas'
import { DemoSection } from '@/components/DemoSection'

const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } }

const STACK = ['LightRAG GraphRAG', 'OpenAI GPT-4o', 'Supabase pgvector', 'Next.js', 'Vercel', 'n8n', 'WhatsApp API', 'Voice Agents']

/* ── Hero knowledge graph SVG (light-themed) ───────────────────── */
function KnowledgeGraphHero() {
  const cx = 300, cy = 240
  const nodes = [
    { id: 'HR Handbook',    x:  95, y:  90, color: '#4DA2FF' },
    { id: 'IT Runbook',     x: 510, y: 105, color: '#86EFAC' },
    { id: 'Customer FAQ',   x: 555, y: 320, color: '#FCA5A5' },
    { id: 'Sales Guide',    x: 420, y: 440, color: '#C4B5FD' },
    { id: 'Finance Policy', x: 145, y: 430, color: '#FDE68A' },
    { id: 'Product Specs',  x:  55, y: 280, color: '#5EEAD4' },
  ]

  return (
    <svg viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4DA2FF" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#4DA2FF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4DA2FF" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#4DA2FF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Center ambient glow */}
      <circle cx={cx} cy={cy} r="130" fill="url(#centerGlow)" />

      {/* Edges */}
      {nodes.map((n, i) => (
        <g key={n.id}>
          <line x1={cx} y1={cy} x2={n.x} y2={n.y} stroke="#CBD5E1" strokeOpacity="0.7" strokeWidth="1" />
          <circle r="2.5" fill="#4DA2FF" opacity="0.7">
            <animateMotion dur={`${2.5 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`}>
              <mpath href={`#hpath-${i}`} />
            </animateMotion>
            <animate attributeName="opacity" values="0;1;1;0" dur={`${2.5 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
          </circle>
          <path id={`hpath-${i}`} d={`M${n.x},${n.y} L${cx},${cy}`} visibility="hidden" />
        </g>
      ))}

      {/* Outer doc nodes */}
      {nodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r="32" fill="url(#nodeGlow)" />
          <circle cx={n.x} cy={n.y} r="22" fill="#FFFFFF" stroke={n.color} strokeOpacity="0.7" strokeWidth="1.5" />
          <circle cx={n.x} cy={n.y} r="22" fill="none" stroke={n.color} strokeOpacity="0.2" strokeWidth="8">
            <animate attributeName="r" values="22;30;22" dur="3s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.2;0;0.2" dur="3s" repeatCount="indefinite" />
          </circle>
          <text x={n.x} y={n.y - 30} textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="system-ui,sans-serif" letterSpacing="0.3">{n.id}</text>
          <rect x={n.x - 7} y={n.y - 8} width="14" height="16" rx="2" fill={n.color} fillOpacity="0.2" stroke={n.color} strokeOpacity="0.6" strokeWidth="1" />
          <line x1={n.x - 4} y1={n.y - 3} x2={n.x + 4} y2={n.y - 3} stroke={n.color} strokeOpacity="0.7" strokeWidth="1" />
          <line x1={n.x - 4} y1={n.y + 1} x2={n.x + 4} y2={n.y + 1} stroke={n.color} strokeOpacity="0.7" strokeWidth="1" />
          <line x1={n.x - 4} y1={n.y + 5} x2={n.x + 2} y2={n.y + 5} stroke={n.color} strokeOpacity="0.7" strokeWidth="1" />
        </g>
      ))}

      {/* Central brain node */}
      <circle cx={cx} cy={cy} r="58" fill="#EFF6FF" stroke="#4DA2FF" strokeOpacity="0.4" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r="58" fill="none" stroke="#4DA2FF" strokeOpacity="0.1" strokeWidth="14">
        <animate attributeName="r" values="58;72;58" dur="4s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.1;0;0.1" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r="48" fill="#DBEAFE" fillOpacity="0.5" stroke="#4DA2FF" strokeOpacity="0.25" strokeWidth="1" />
      {/* Neural nodes */}
      {([
        [cx - 14, cy - 12], [cx + 14, cy - 12],
        [cx, cy - 20], [cx - 20, cy + 4], [cx + 20, cy + 4], [cx, cy + 16],
      ] as [number,number][]).map(([nx, ny], i) => (
        <circle key={i} cx={nx} cy={ny} r="3.5" fill="#4DA2FF" fillOpacity="0.6">
          <animate attributeName="fill-opacity" values="0.6;1;0.6" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Neural connections */}
      {([
        [cx - 14, cy - 12, cx, cy - 20],
        [cx + 14, cy - 12, cx, cy - 20],
        [cx - 14, cy - 12, cx - 20, cy + 4],
        [cx + 14, cy - 12, cx + 20, cy + 4],
        [cx - 20, cy + 4, cx, cy + 16],
        [cx + 20, cy + 4, cx, cy + 16],
        [cx - 14, cy - 12, cx + 14, cy - 12],
      ] as [number,number,number,number][]).map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4DA2FF" strokeOpacity="0.4" strokeWidth="1" />
      ))}
      <text x={cx} y={cy + 32} textAnchor="middle" fill="#4DA2FF" fontSize="12" fontWeight="600" fontFamily="system-ui,sans-serif" letterSpacing="1">IKnowIt</text>
      <text x={cx} y={cy + 46} textAnchor="middle" fill="#64748B" fontSize="7.5" fontFamily="system-ui,sans-serif" letterSpacing="0.5">Knowledge Brain</text>
    </svg>
  )
}

/* ── Integration diagram (light-themed) ─────────────────────────── */
function IntegrationDiagram() {
  const channels = [
    { icon: '💬', label: 'WhatsApp',   color: '#25D366' },
    { icon: '🎤', label: 'Voice Agent', color: '#4DA2FF' },
    { icon: '🌐', label: 'Web Chat',    color: '#60B3FF' },
    { icon: '⚡', label: 'Slack',       color: '#E01E5A' },
    { icon: '📧', label: 'Email',        color: '#94A3B8' },
  ]

  return (
    <div className="max-w-3xl mx-auto">
      {/* Intelligence layer */}
      <motion.div
        variants={fade}
        className="rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] p-6 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-32 rounded-full bg-[#4DA2FF]/8 blur-2xl" />
        </div>
        <div className="relative">
          <div className="text-[10px] text-[#4DA2FF] font-mono tracking-widest mb-3 uppercase">Intelligence Layer</div>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 rounded-xl bg-white border border-[#BFDBFE] px-4 py-2.5 shadow-sm">
              <span className="text-lg">🧠</span>
              <div className="text-left">
                <div className="text-sm font-semibold text-[#0F172A]">IKnowIt Agent</div>
                <div className="text-[10px] text-[#64748B]">Knowledge Graph + Dual Retrieval</div>
              </div>
            </div>
            <span className="text-[#94A3B8] text-xs">←</span>
            <div className="flex gap-2 flex-wrap justify-center">
              {['HR Docs', 'IT Runbook', 'Sales Guide', '+ more'].map(d => (
                <span key={d} className="text-[10px] text-[#64748B] border border-[#E2E8F0] bg-white rounded-lg px-2 py-1">{d}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Connector lines */}
      <div className="flex justify-center items-center py-3 gap-8">
        {channels.map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-px h-6 bg-gradient-to-b from-[#4DA2FF]/40 to-transparent" />
            <div
              className="w-1.5 h-1.5 rounded-full bg-[#4DA2FF]"
              style={{ animation: `bounce-dot 1.5s ease-in-out ${i * 0.15}s infinite` }}
            />
            <div className="w-px h-3 bg-gradient-to-b from-[#4DA2FF]/20 to-transparent" />
          </div>
        ))}
      </div>

      {/* Communication layer */}
      <motion.div variants={fade} className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="text-[10px] text-[#94A3B8] font-mono tracking-widest mb-4 text-center uppercase">Communication Layer</div>
        <div className="flex gap-3 justify-center flex-wrap">
          {channels.map(ch => (
            <div
              key={ch.label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-[#CBD5E1] hover:shadow-sm transition px-5 py-4 min-w-[90px]"
            >
              <span className="text-2xl">{ch.icon}</span>
              <span className="text-xs text-[#64748B] font-medium">{ch.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

/* ── Main page ──────────────────────────────────────────────────── */
export default function HomePage() {
  const personas = Object.values(PERSONAS)

  return (
    <div className="min-h-screen text-[#0F172A] overflow-x-hidden">

      {/* ─── NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 border-b border-[#E2E8F0] bg-white/85 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="2.5" fill="#4DA2FF" />
              <circle cx="6" cy="6" r="5" stroke="#4DA2FF" strokeOpacity="0.4" strokeWidth="1" />
            </svg>
          </div>
          <span className="font-bold tracking-tight text-[#0F172A]">IKnow<span className="text-[#4DA2FF]">It</span></span>
        </Link>
        <div className="flex items-center gap-6">
          <a href="#how-it-works" className="text-sm text-[#64748B] hover:text-[#0F172A] transition hidden md:block">How it works</a>
          <a href="#personas"     className="text-sm text-[#64748B] hover:text-[#0F172A] transition hidden md:block">Personas</a>
          <a href="#demo"         className="text-sm text-[#64748B] hover:text-[#0F172A] transition hidden md:block">Live Demo</a>
          <Link href="/login" className="rounded-xl bg-[#0F172A] hover:bg-[#1E293B] px-4 py-2 text-sm font-semibold text-white transition shadow-sm">
            Get started
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section id="hero" className="relative min-h-screen flex items-center pt-20">
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

          {/* Left: text */}
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fade} className="inline-flex items-center gap-2 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-1.5 text-xs text-[#4DA2FF] mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4DA2FF] animate-pulse" />
              AI Document Intelligence
            </motion.div>

            <motion.h1 className="text-5xl lg:text-6xl font-bold leading-[1.06] tracking-tight" variants={stagger}>
              <motion.span variants={fade} className="block text-[#0F172A]">One Agent.</motion.span>
              <motion.span variants={fade} className="block text-[#4DA2FF]">Trained on Your Docs.</motion.span>
              <motion.span variants={fade} className="block text-[#0F172A]">Knows It All.</motion.span>
            </motion.h1>

            <motion.p variants={fade} className="mt-6 text-base text-[#64748B] leading-relaxed max-w-md">
              Upload your policies, runbooks, and product specs. We build a knowledge graph and train one AI agent that becomes your team&apos;s single source of truth — instantly.
            </motion.p>

            <motion.div variants={fade} className="mt-10 flex items-center gap-4 flex-wrap">
              <a href="#demo" className="rounded-xl bg-[#4DA2FF] hover:bg-[#60B3FF] px-6 py-3 text-sm font-semibold text-white transition shadow-lg shadow-[#4DA2FF]/25">
                See it live →
              </a>
              <Link href="/login" className="rounded-xl border border-[#E2E8F0] hover:border-[#BFDBFE] bg-white hover:bg-[#EFF6FF] px-6 py-3 text-sm font-medium text-[#64748B] hover:text-[#4DA2FF] transition shadow-sm">
                Train your own agent
              </Link>
            </motion.div>

            <motion.div variants={fade} className="mt-8 flex items-center gap-6 flex-wrap">
              {['No login to demo', '2-week deployment', 'Any communication channel'].map(s => (
                <div key={s} className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                  <span className="w-1 h-1 rounded-full bg-[#4DA2FF] flex-shrink-0" />
                  {s}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: knowledge graph */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            className="hidden lg:block relative"
          >
            <div className="relative h-[520px] rounded-2xl overflow-hidden border border-[#E2E8F0] bg-white shadow-sm">
              <div className="absolute inset-0 flex items-center justify-center">
                <KnowledgeGraphHero />
              </div>

              {/* Floating stat cards */}
              <motion.div
                className="absolute top-6 right-6 rounded-xl bg-white shadow-md border border-[#E2E8F0] px-4 py-3"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="text-[10px] text-[#94A3B8] mb-0.5">Queries resolved today</div>
                <div className="text-2xl font-bold text-[#4DA2FF]">3,412</div>
              </motion.div>

              <motion.div
                className="absolute bottom-32 left-5 rounded-xl bg-white shadow-md border border-[#E2E8F0] px-4 py-3"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
              >
                <div className="text-[10px] text-[#94A3B8] mb-0.5">AI confidence score</div>
                <div className="text-xl font-bold text-[#0F172A]">94%</div>
                <div className="mt-1.5 h-1 w-20 rounded-full bg-[#E2E8F0]">
                  <div className="h-full w-[94%] rounded-full bg-[#4DA2FF]" />
                </div>
              </motion.div>

              {/* Inline chat preview */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="rounded-xl bg-white/90 backdrop-blur border border-[#E2E8F0] p-4 shadow-sm">
                  <div className="text-[10px] text-[#94A3B8] mb-2 font-mono">IKnowIt Agent · Live</div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-[11px] text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 leading-relaxed">
                        What is the maternity leave policy?
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <span className="text-[11px] text-[#1D4ED8] bg-[#EFF6FF] rounded-lg px-3 py-2 max-w-[80%] leading-relaxed border border-[#BFDBFE]">
                        26 weeks paid maternity leave per the Maternity Benefit Act 2017. Applies from Day 1.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-[#4DA2FF] to-transparent"
            animate={{ scaleY: [1, 0.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </section>

      {/* ─── TECH MARQUEE ─── */}
      <div className="border-y border-[#E2E8F0] py-4 overflow-hidden bg-white/60 backdrop-blur-sm">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex gap-16 whitespace-nowrap"
        >
          {[...STACK, ...STACK].map((item, i) => (
            <span key={i} className="text-sm text-[#94A3B8] font-medium tracking-wide">{item}</span>
          ))}
        </motion.div>
      </div>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="px-6 md:px-10 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-14">
            <p className="text-[#4DA2FF] text-xs font-mono tracking-widest uppercase mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">From documents to intelligence<br />in three steps</h2>
            <p className="text-sm text-[#64748B] max-w-md mx-auto">We don&apos;t just search your files. We map the relationships between every concept, entity, and fact across your entire documentation.</p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: '01', icon: '📄', title: 'Upload Your Docs',
                desc: 'PDFs, runbooks, policies, SOPs — any format. Our pipeline extracts and structures every page.',
                detail: 'Supports PDF, DOCX, TXT. 4MB limit on demo tier; unlimited on enterprise.',
              },
              {
                step: '02', icon: '🕸', title: 'Build the Knowledge Graph',
                desc: 'LightRAG extracts entities, relationships, and facts — building a graph of how everything connects.',
                detail: 'Not keyword search. The graph understands context: who reports to whom, what policy governs what.',
              },
              {
                step: '03', icon: '⚡', title: 'Query at Any Depth',
                desc: 'Dual retrieval: graph context + semantic search, merged. Every answer is grounded in your documents.',
                detail: "Ask 'What is the escalation path for a P1 IT incident?' — it reasons across multiple docs to answer.",
              },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                variants={fade}
                className="group relative rounded-2xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] hover:border-[#BFDBFE] hover:shadow-sm p-7 transition-all duration-300"
              >
                <div className="text-[10px] font-mono text-[#4DA2FF] tracking-widest mb-4">{s.step}</div>
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-semibold text-[#0F172A] mb-2">{s.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed mb-3">{s.desc}</p>
                <p className="text-xs text-[#94A3B8] italic leading-relaxed border-t border-[#E2E8F0] pt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {s.detail}
                </p>
                {i < 2 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#4DA2FF]/40 text-lg">→</div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CASE STUDY ─── */}
      <section id="case-study" className="px-6 md:px-10 py-24 bg-[#F1F5F9]/80">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300 bg-yellow-50 px-4 py-1.5 text-xs text-yellow-700 mb-5">
              ⚠ Dummy company — real methodology. Client identity protected for confidentiality.
            </div>
            <p className="text-[#4DA2FF] text-xs font-mono tracking-widest uppercase mb-3">Case Study</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">Stellaris Group</h2>
            <p className="text-sm text-[#64748B] max-w-md mx-auto">
              A ₹18,200 Cr Indian conglomerate. 31,000 employees. 6 business verticals. Knowledge siloed across every department.
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Problem */}
            <motion.div variants={fade} className="space-y-6">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-7 shadow-sm">
                <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-widest mb-5">The Problem</h3>
                <blockquote className="text-lg text-[#0F172A] leading-relaxed font-light border-l-2 border-[#4DA2FF] pl-5 mb-5">
                  &ldquo;We have 31,000 people, six businesses, and a support team drowning in questions they&apos;ve answered before.&rdquo;
                </blockquote>
                <div className="space-y-3">
                  {[
                    { num: '71%',    desc: 'of all support tickets were repeat questions with documented answers' },
                    { num: '22 days', desc: 'average time for a new hire to reach full productivity' },
                    { num: '72%',    desc: 'of IT team time spent on L1 tickets already in the runbook' },
                    { num: '4,200',  desc: 'monthly tickets audited — 38 failure patterns identified' },
                  ].map(({ num, desc }) => (
                    <div key={num} className="flex items-start gap-4">
                      <span className="text-[#4DA2FF] font-bold text-sm min-w-[70px] pt-0.5">{num}</span>
                      <span className="text-sm text-[#64748B]">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div variants={fade} className="space-y-4">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-7 shadow-sm">
                <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-widest mb-5">The Results — 90 Days Post-Deploy</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: '68%',   label: 'tickets resolved by AI' },
                    { val: '42 sec', label: 'avg first response (was 6.8hr)' },
                    { val: '94%',   label: 'employee adoption, Month 3' },
                    { val: '12 wks', label: 'brief to live deploy' },
                    { val: '₹4.2 Cr', label: 'saved in Year 1' },
                    { val: '3,400+', label: 'daily queries handled' },
                  ].map(({ val, label }) => (
                    <div key={label} className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 hover:border-[#BFDBFE] transition">
                      <div className="text-xl font-bold text-[#4DA2FF]">{val}</div>
                      <div className="text-[10px] text-[#94A3B8] mt-0.5 leading-tight">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
                <div className="text-[10px] text-[#94A3B8] font-mono mb-3 uppercase tracking-widest">Timeline</div>
                <div className="space-y-2">
                  {[
                    { week: 'Week 1–2',   title: 'Audit & Discovery',      desc: '4,200 tickets. 38 failure patterns.' },
                    { week: 'Week 3–5',   title: 'Knowledge Engineering',  desc: 'Docs cleaned, structured, graph built.' },
                    { week: 'Week 6–9',   title: 'Build & Tune',           desc: '5 AI personas built and tested.' },
                    { week: 'Week 10–12', title: 'Deploy & Measure',       desc: 'WhatsApp, web, Slack, CRM sidebar.' },
                  ].map((t, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="text-[9px] font-mono text-[#4DA2FF] tracking-widest min-w-[72px] pt-0.5">{t.week}</span>
                      <div>
                        <span className="text-xs font-medium text-[#0F172A]">{t.title}</span>
                        <span className="text-xs text-[#94A3B8] ml-2">{t.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── LIVE DEMO ─── */}
      <DemoSection />

      {/* ─── PERSONAS ─── */}
      <section id="personas" className="px-6 md:px-10 py-24 bg-[#F1F5F9]/80">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-14">
            <p className="text-[#4DA2FF] text-xs font-mono tracking-widest uppercase mb-3">Personas</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">One Brain. Many Voices.</h2>
            <p className="text-sm text-[#64748B] max-w-lg mx-auto">
              The same knowledge graph powers multiple specialised agents — each with a different persona, tone, and use case. One source of truth, many communication styles.
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {personas.map(p => (
              <motion.div key={p.slug} variants={fade}>
                <Link
                  href={`/personas/${p.slug}`}
                  className="group flex flex-col h-full rounded-2xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] hover:border-[#BFDBFE] hover:shadow-sm transition-all duration-300 p-6 relative overflow-hidden"
                >
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">{p.icon}</div>
                      <span className="text-[9px] text-emerald-600 border border-emerald-200 bg-emerald-50 rounded-full px-2 py-0.5">Live</span>
                    </div>
                    <h3 className="font-semibold text-[#0F172A] group-hover:text-[#4DA2FF] transition mb-1">{p.label}</h3>
                    <p className="text-xs text-[#4DA2FF]/80 mb-3 font-medium italic">{p.tagline}</p>
                    <p className="text-xs text-[#64748B] leading-relaxed mb-5">{p.description}</p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {p.caseStudy.metrics.slice(0, 2).map(m => (
                        <div key={m.label} className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3">
                          <div className="text-sm font-bold text-[#4DA2FF]">{m.value}</div>
                          <div className="text-[10px] text-[#94A3B8] mt-0.5 leading-tight">{m.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] group-hover:text-[#4DA2FF] transition">
                      <span>Chat with this persona →</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Build yours */}
            <motion.div variants={fade}>
              <Link
                href="/login"
                className="group flex flex-col h-full min-h-[280px] rounded-2xl border border-dashed border-[#CBD5E1] hover:border-[#4DA2FF]/50 hover:bg-[#EFF6FF]/50 transition-all duration-300 p-6 items-center justify-center text-center"
              >
                <div className="w-12 h-12 rounded-xl border border-dashed border-[#CBD5E1] group-hover:border-[#4DA2FF]/50 flex items-center justify-center text-2xl mb-4 transition-all group-hover:scale-110">
                  🛠
                </div>
                <h3 className="font-semibold text-[#0F172A] group-hover:text-[#4DA2FF] transition">Build yours</h3>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed max-w-[160px]">
                  Upload your documents. Define your persona. Live in 2 weeks.
                </p>
                <div className="mt-4 text-xs text-[#94A3B8] group-hover:text-[#4DA2FF] transition">Start free →</div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── INTEGRATION LAYER ─── */}
      <section id="integration" className="px-6 md:px-10 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-14">
            <p className="text-[#4DA2FF] text-xs font-mono tracking-widest uppercase mb-3">Integrations</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">Intelligence layer meets<br />any communication channel</h2>
            <p className="text-sm text-[#64748B] max-w-md mx-auto">
              Your knowledge graph is the brain. WhatsApp, voice agents, web chat — these are just the mouths. Plug the brain in anywhere.
            </p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <IntegrationDiagram />
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-6 md:px-10 py-24 relative overflow-hidden bg-[#F1F5F9]/60">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] rounded-full bg-[#4DA2FF]/6 blur-3xl" />
        </div>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-2xl mx-auto text-center relative">
          <motion.h2 variants={fade} className="text-4xl font-bold text-[#0F172A] mb-4">
            Ready to build your <span className="text-[#4DA2FF]">knowledge agent?</span>
          </motion.h2>
          <motion.p variants={fade} className="text-[#64748B] mb-8 leading-relaxed text-sm max-w-md mx-auto">
            Your documents. Your team. Your use case. We build and deploy in 2 weeks. The same stack running in the demo above.
          </motion.p>
          <motion.div variants={fade} className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/login" className="rounded-xl bg-[#4DA2FF] hover:bg-[#60B3FF] px-8 py-3.5 text-sm font-semibold text-white transition shadow-lg shadow-[#4DA2FF]/25">
              Start with your docs →
            </Link>
            <a href="#demo" className="rounded-xl border border-[#E2E8F0] hover:border-[#BFDBFE] bg-white hover:bg-[#EFF6FF] px-8 py-3.5 text-sm font-medium text-[#64748B] hover:text-[#4DA2FF] transition shadow-sm">
              Try the live demo first
            </a>
          </motion.div>
        </motion.div>
      </section>

      <footer className="border-t border-[#E2E8F0] px-6 md:px-10 py-6 bg-white/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#94A3B8]">
          <span>IKnowIt — AI Document Intelligence</span>
          <span>LightRAG · Supabase pgvector · OpenAI · Next.js · Vercel</span>
        </div>
      </footer>
    </div>
  )
}
