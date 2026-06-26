'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { DemoSection } from '@/components/DemoSection'

const fade    = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

/* ── Eyebrow component (mono label + trailing line, matches mockup) ─ */
function Eyebrow({ children }: { children: string }) {
  return (
    <div className="inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.16em] uppercase text-[#1A6B3C] mb-5">
      {children}
      <span className="w-5 h-px bg-[#1A6B3C] inline-block" />
    </div>
  )
}

/* ── Marquee items with brand-colored SVG logos ─────────────────── */
const N8N_LOGO = (
  <svg width="16" height="16" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#EA4B71"/>
    <path d="M8 28V12l8 16V12M24 28V12l8 16V12" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const WA_LOGO = (
  <svg width="16" height="16" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#25D366"/>
    <path d="M20 8C13.37 8 8 13.37 8 20c0 2.14.57 4.14 1.56 5.87L8 32l6.27-1.54A11.94 11.94 0 0020 32c6.63 0 12-5.37 12-12S26.63 8 20 8zm5.82 16.38c-.25.7-1.46 1.34-2 1.4-.51.06-1.01.24-3.4-.71-2.87-1.13-4.7-4.07-4.84-4.26-.14-.19-1.14-1.52-1.14-2.9 0-1.38.72-2.06 1-2.35.25-.28.54-.34.72-.34l.52.01c.17 0 .39-.06.61.47l.87 2.14c.07.17.12.37.01.58l-.32.6-.38.41c-.13.14-.27.28-.11.55.16.28.71 1.17 1.52 1.9 1.05.93 1.93 1.22 2.2 1.36.28.13.44.11.6-.07l.83-.97c.21-.24.42-.17.71-.06l2.03.96c.29.13.48.2.55.31.07.11.07.63-.18 1.27z" fill="white"/>
  </svg>
)
const STACK: { logo: React.ReactNode; label: string; color: string }[] = [
  { logo: '🕸', label: 'LightRAG GraphRAG', color: '#1A6B3C' },
  { logo: '◎', label: 'OpenAI GPT-4o',      color: '#1C1510' },
  { logo: '⚡', label: 'Supabase pgvector',  color: '#6B5E52' },
  { logo: '▲',  label: 'Next.js',            color: '#1C1510' },
  { logo: N8N_LOGO, label: 'n8n',            color: '#EA4B71' },
  { logo: WA_LOGO,  label: 'WhatsApp API',   color: '#25D366' },
  { logo: '🎙', label: 'Voice Agents',        color: '#6B5E52' },
  { logo: '▲',  label: 'Vercel',             color: '#1C1510' },
]

/* ── Integration diagram (Solar Cream) ──────────────────────────── */
function IntegrationDiagram() {
  const channels = [
    { icon: '💬', label: 'WhatsApp' },
    { icon: '🎙', label: 'Voice Agent' },
    { icon: '🌐', label: 'Web Chat' },
    { icon: '⚡', label: 'Slack' },
    { icon: '📧', label: 'Email' },
  ]
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div variants={fade} className="rounded-2xl border border-[rgba(26,107,60,0.2)] bg-[#EBF5EF] p-7 mb-0 relative overflow-hidden">
        <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#1A6B3C] mb-5">Intelligence Layer</p>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 font-semibold text-[#1C1510]">
            <div className="w-8 h-8 rounded-full bg-[#1A6B3C] flex items-center justify-center text-white text-sm font-bold">i</div>
            <div>
              <div>IKnowIt Agent</div>
              <div className="text-[#1A6B3C] text-xs font-normal">Knowledge Graph + Dual Retrieval</div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['HR Docs', 'IT Runbook', 'Sales Guide', '+ more'].map(d => (
              <span key={d} className="font-mono text-[11px] bg-white border border-[#E8E0D5] rounded-full px-3 py-1 text-[#6B5E52]">{d}</span>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="flex justify-center items-center py-3 gap-10">
        {channels.map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-px h-5 bg-gradient-to-b from-[#1A6B3C]/40 to-transparent" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#1A6B3C]"
              style={{ animation: `bounce-dot 1.5s ease-in-out ${i * 0.15}s infinite` }} />
            <div className="w-px h-3 bg-gradient-to-b from-[#1A6B3C]/20 to-transparent" />
          </div>
        ))}
      </div>

      <motion.div variants={fade} className="rounded-2xl border border-[#E8E0D5] bg-white p-7 shadow-sm">
        <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#6B5E52] mb-5">Communication Layer</p>
        <div className="grid grid-cols-5 gap-3">
          {channels.map(ch => (
            <div key={ch.label} className="flex flex-col items-center gap-2 rounded-xl border border-[#E8E0D5] bg-[#FAF7F2] hover:border-[#1A6B3C]/30 hover:bg-white transition py-4 px-2 text-center">
              <span className="text-2xl">{ch.icon}</span>
              <span className="text-xs font-semibold text-[#6B5E52]">{ch.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

/* ── Main page ──────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="min-h-screen text-[#1C1510] overflow-x-hidden">

      {/* ─── NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 border-b border-[#E8E0D5] bg-[rgba(250,247,242,0.88)] backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5 font-serif text-[19px] italic">
          <div className="w-[26px] h-[26px] rounded-full bg-[#1A6B3C] flex items-center justify-center text-white text-[13px] not-italic font-sans font-bold">i</div>
          i<span className="text-[#1A6B3C]">Know</span>It
        </Link>
        <div className="hidden md:flex gap-9 text-sm text-[#6B5E52]">
          <a href="#how-it-works" className="hover:text-[#1C1510] transition">How it works</a>
          <a href="#demo"         className="hover:text-[#1C1510] transition">Live Demo</a>
        </div>
        <Link href="/login" className="rounded-full bg-[#1C1510] hover:bg-[#2d241e] text-white text-sm font-semibold px-5 py-2.5 transition shadow-sm">
          Get started
        </Link>
      </nav>

      {/* ─── HERO ─── */}
      {/* data-hub-x/y tells the canvas where to park the IKnowIt hub node for this section */}
      <section id="hero" className="min-h-screen flex items-center pt-20" data-hub-x="74" data-hub-y="44">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-28 w-full">
          <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl">

            <motion.div variants={fade}>
              <Eyebrow>AI Document Intelligence</Eyebrow>
            </motion.div>

            <motion.h1 variants={stagger} className="font-serif text-[58px] md:text-[66px] leading-[1.02] mb-7">
              <motion.span variants={fade} className="block">One Agent.</motion.span>
              <motion.span variants={fade} className="block italic text-[#1A6B3C]">Trained on Your Docs.</motion.span>
              <motion.span variants={fade} className="block">Knows It All.</motion.span>
            </motion.h1>

            <motion.p variants={fade} className="text-[17px] text-[#6B5E52] leading-relaxed max-w-[480px] mb-9">
              Upload your policies, runbooks, and product specs. We build a knowledge graph and train one AI agent that becomes your team&apos;s single source of truth — instantly.
            </motion.p>

            <motion.div variants={fade} className="flex items-center gap-3.5 flex-wrap mb-7">
              <a href="#demo" className="rounded-full bg-[#1A6B3C] hover:bg-[#15572f] text-white text-sm font-semibold px-6 py-3.5 transition shadow-lg shadow-[rgba(26,107,60,0.25)]">
                See it live →
              </a>
              <Link href="/login" className="rounded-full border border-[#E8E0D5] hover:border-[#1C1510] bg-transparent text-[#1C1510] text-sm font-semibold px-6 py-3.5 transition">
                Train your own agent
              </Link>
            </motion.div>

            <motion.div variants={fade} className="flex gap-5 flex-wrap font-mono text-[11.5px] text-[#6B5E52]">
              {['No credit card to demo', '1-week deployment', 'Integrates with any channel'].map(s => (
                <span key={s} className="before:content-['—'] before:text-[#7DAF8B] before:mr-2">{s}</span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── MARQUEE with icons ─── */}
      <div className="border-y border-[#E8E0D5] py-6 overflow-hidden bg-white">
        <div className="flex gap-14 whitespace-nowrap" style={{ animation: 'scroll-left 32s linear infinite' }}>
          {[...STACK, ...STACK].map((item, i) => (
            <span key={i} className="flex items-center gap-2 font-mono text-[12px]" style={{ color: item.color }}>
              <span className="flex items-center text-[14px]">{item.logo}</span>
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="px-6 md:px-12 py-28" data-hub-x="20" data-hub-y="22">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="font-serif text-[42px] md:text-[48px] mb-4 text-[#1C1510]">From documents to intelligence<br/>in three steps</h2>
            <p className="text-[17px] text-[#6B5E52] max-w-lg mx-auto leading-relaxed">We don&apos;t just search your files. We map the relationships between every concept, entity, and fact across your entire documentation.</p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { step: '01', icon: '📄', bg: 'bg-[#FDF6E6]', title: 'Upload Your Docs',
                desc: 'PDFs, runbooks, policies, SOPs — any format. Our pipeline extracts and structures every page.',
                detail: 'Supports PDF, DOCX, TXT. 4MB on demo tier; unlimited on enterprise.' },
              { step: '02', icon: '🕸', bg: 'bg-[#EBF5EF]', title: 'Build the Knowledge Graph',
                desc: 'LightRAG extracts entities, relationships, and facts — building a graph of how everything connects.',
                detail: 'Not keyword search. The graph understands context: who reports to whom, what policy governs what.' },
              { step: '03', icon: '⚡', bg: 'bg-[#FFF0EE]', title: 'Query at Any Depth',
                desc: 'Dual retrieval: graph context + semantic search, merged. Every answer is grounded in your documents.',
                detail: "Ask 'What is the escalation path for a P1 incident?' — it reasons across multiple docs to answer." },
            ].map((s, i) => (
              <motion.div key={s.step} variants={fade}
                className="group rounded-2xl glass hover:shadow-md p-8 transition-all duration-300 relative">
                <div className="font-mono text-[11px] text-[#6B5E52] mb-5 opacity-60">{s.step}</div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[22px] mb-5 border border-[#E8E0D5] ${s.bg}`}>{s.icon}</div>
                <h3 className="font-bold text-[17px] mb-2.5 text-[#1C1510]">{s.title}</h3>
                <p className="text-sm text-[#6B5E52] leading-relaxed mb-3">{s.desc}</p>
                <p className="text-xs text-[#6B5E52] italic leading-relaxed border-t border-[#E8E0D5] pt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {s.detail}
                </p>
                {i < 2 && <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#E8E0D5] text-xl">→</div>}
              </motion.div>
            ))}
          </motion.div>

          {/* Knowledge graph advantage example */}
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="mt-10 rounded-2xl glass border border-[rgba(26,107,60,0.15)] p-8 max-w-4xl mx-auto">
            <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#1A6B3C] mb-5">Why knowledge graph beats pure semantic search</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl bg-[#FFF0EE] border border-[rgba(255,77,61,0.15)] p-5">
                <p className="font-semibold text-[13px] text-[#FF4D3D] mb-2">❌ Semantic RAG — the gap</p>
                <p className="text-sm text-[#6B5E52] leading-relaxed">
                  HR Handbook says: <em>&ldquo;Extended leave requires GM approval.&rdquo;</em>
                  <br/><br/>
                  Org chart says: <em>&ldquo;Sarah Chen — General Manager, HR.&rdquo;</em>
                  <br/><br/>
                  Ask: <strong>&ldquo;Who approves my extended leave?&rdquo;</strong>
                  <br/>Semantic search returns the leave policy — but has no idea who the GM is.
                  <br/><span className="text-[#FF4D3D] font-semibold">You still have to search separately.</span>
                </p>
              </div>
              <div className="rounded-xl bg-[#EBF5EF] border border-[rgba(26,107,60,0.15)] p-5">
                <p className="font-semibold text-[13px] text-[#1A6B3C] mb-2">✓ IKnowIt Knowledge Graph</p>
                <p className="text-sm text-[#6B5E52] leading-relaxed">
                  The graph connects:
                  <br/><strong>GM approval → General Manager → Sarah Chen</strong>
                  <br/><br/>
                  Same question: <strong>&ldquo;Who approves my extended leave?&rdquo;</strong>
                  <br/><br/>
                  Answer: <span className="text-[#1A6B3C] font-semibold">&ldquo;Contact Sarah Chen (GM, HR) at sarah.chen@company.com. Per policy, requests above 5 days require her sign-off.&rdquo;</span>
                  <br/><br/>One query. One complete answer. No follow-up search needed.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CASE STUDY ─── */}
      <section id="case-study" className="px-6 md:px-12 py-28 bg-white/60" data-hub-x="78" data-hub-y="36">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-14">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] border border-[rgba(232,160,32,0.3)] bg-[#FDF6E6] text-[#E8A020] px-4 py-1.5 rounded-full mb-8">
              🔒 Client name changed per NDA · All metrics are real
            </div>
            <div className="mt-2">
              <Eyebrow>Case Study</Eyebrow>
            </div>
            <h2 className="font-serif text-[38px] md:text-[44px] mb-3 text-[#1C1510]">Client — Indian Manufacturing Group</h2>
            <p className="text-[16px] text-[#6B5E52] max-w-[540px] leading-relaxed">
              A ₹3,800 Cr Indian manufacturing group. 7,200 employees. 4 strategic business units. Institutional knowledge locked in disconnected documents across every department.
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Problem */}
            <motion.div variants={fade} className="rounded-2xl bg-[#1C1510] text-white p-9">
              <blockquote className="font-serif text-[21px] leading-[1.5] font-normal border-l-[3px] border-[#E8A020] pl-5 mb-7 italic">
                &ldquo;We have 7,200 people across four businesses, and a support team spending most of their day answering questions that are already in our manuals.&rdquo;
              </blockquote>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { num: '63%',    desc: 'of support tickets were repeat questions with documented answers' },
                  { num: '16 days', desc: 'average time for a new hire to reach full productivity' },
                  { num: '68%',    desc: 'of IT team hours spent on L1 tickets already covered by the runbook' },
                  { num: '1,800',  desc: 'monthly tickets audited — 24 recurring failure patterns identified' },
                ].map(({ num, desc }) => (
                  <div key={num}>
                    <b className="block font-mono text-[22px] text-[#E8A020] mb-1">{num}</b>
                    <span className="text-xs text-white/50 leading-tight">{desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Results */}
            <motion.div variants={fade} className="space-y-5">
              <div className="rounded-2xl border border-[#E8E0D5] bg-white p-8">
                <h3 className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#6B5E52] mb-6">The Results — 90 Days Post-Deploy</h3>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { val: '52%',    label: 'queries resolved by AI' },
                    { val: '3.2 min', label: 'avg first response' },
                    { val: '76%',    label: 'employee adoption' },
                    { val: '8 wks',  label: 'brief to live deploy' },
                    { val: '₹68 L',  label: 'saved in Year 1' },
                    { val: '850+',   label: 'daily queries handled' },
                  ].map(({ val, label }) => (
                    <div key={label} className="rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] p-4">
                      <b className="block font-mono text-[18px] text-[#1A6B3C]">{val}</b>
                      <span className="text-[11px] text-[#6B5E52]">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#E8E0D5] pt-5 space-y-2.5">
                  {[
                    { wk: 'Wk 1–2', t: 'Audit & Discovery',    d: '1,800 tickets, 24 failure patterns mapped.' },
                    { wk: 'Wk 3–4', t: 'Knowledge Engineering', d: 'Docs structured, graph built across 4 SBUs.' },
                    { wk: 'Wk 5–7', t: 'Build & Tune',          d: '4 AI personas built, tested with real staff.' },
                    { wk: 'Wk 8',   t: 'Deploy & Measure',      d: 'Web chat + WhatsApp live. Metrics tracked.' },
                  ].map((r, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="font-mono text-[#FF4D3D] font-semibold min-w-[70px]">{r.wk}</span>
                      <span><span className="font-semibold text-[#1C1510]">{r.t}</span> <span className="text-[#6B5E52]">— {r.d}</span></span>
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

      {/* ─── USE CASES ─── */}
      <section id="personas" className="px-6 md:px-12 py-28" data-hub-x="73" data-hub-y="24">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-14">
            <Eyebrow>Use Cases</Eyebrow>
            <h2 className="font-serif text-[42px] md:text-[48px] mb-4 text-[#1C1510]">One brain. Every role.</h2>
            <p className="text-[17px] text-[#6B5E52] max-w-lg mx-auto leading-relaxed">
              The same knowledge graph — tuned to a different persona, tone, and use case for every department.
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
            {[
              { icon: '🧑‍💼', title: 'Receptionist',        desc: 'First contact for visitors & callers' },
              { icon: '🎓', title: 'Internal Trainer',      desc: 'Onboarding & SOP navigation' },
              { icon: '💡', title: 'Sales Support',         desc: 'Live product knowledge in every call' },
              { icon: '🎧', title: 'Customer Support',      desc: 'Resolves tickets from product docs' },
              { icon: '⚖️', title: 'Legal Navigator',       desc: 'Contract & policy Q&A' },
              { icon: '💻', title: 'IT Helpdesk',           desc: 'Reduces L1 tickets via runbook' },
              { icon: '📋', title: 'HR Onboarding',         desc: 'Leave, benefits, policies — 24/7' },
              { icon: '🔬', title: 'Product Guide',         desc: 'Specs, manuals, how-tos' },
              { icon: '📊', title: 'Finance Policy',        desc: 'Expense & compliance queries' },
              { icon: '🏥', title: 'Medical Records',       desc: 'Patient info for clinical teams' },
              { icon: '🏠', title: 'Real Estate',           desc: 'Property, pricing & legal queries' },
              { icon: '🚀', title: 'Startup KB',            desc: 'Single source of truth for teams' },
              { icon: '🍽️', title: 'Restaurant',           desc: 'Menu, allergens & reservations' },
              { icon: '✈️', title: 'Travel Policy',        desc: 'Corporate travel rules & bookings' },
              { icon: '📚', title: 'Research Library',      desc: 'Large document repositories' },
              { icon: '💰', title: 'Investor Relations',    desc: 'Annual reports & shareholder Q&A' },
              { icon: '🛒', title: 'E-commerce Support',   desc: 'Returns, shipping & product help' },
              { icon: '🏗️', title: 'Construction',        desc: 'Safety docs & compliance queries' },
            ].map((uc, i) => (
              <motion.div key={uc.title} variants={fade}
                className="group glass rounded-2xl p-4 hover:shadow-md transition-all duration-300 cursor-default"
                style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="text-2xl mb-2">{uc.icon}</div>
                <div className="text-[13px] font-semibold text-[#1C1510] mb-1 group-hover:text-[#1A6B3C] transition">{uc.title}</div>
                <div className="text-[11px] text-[#6B5E52] leading-snug">{uc.desc}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center">
            <p className="text-[#6B5E52] text-sm mb-5">Don&apos;t see your use case? We&apos;ve probably built it.</p>
            <div className="flex items-center justify-center gap-3">
              <a href="#demo" className="rounded-full bg-[#1A6B3C] hover:bg-[#15572f] text-white font-semibold text-sm px-7 py-3.5 transition shadow-lg shadow-[rgba(26,107,60,0.2)]">
                Try the live demo →
              </a>
              <Link href="/login" className="rounded-full border border-[#E8E0D5] hover:border-[#1C1510] text-[#1C1510] font-semibold text-sm px-7 py-3.5 transition">
                Build your own agent
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── INTEGRATION LAYER ─── */}
      <section id="integration" className="px-6 md:px-12 py-28" data-hub-x="50" data-hub-y="54">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-14">
            <Eyebrow>Any Communication Channel</Eyebrow>
            <h2 className="font-serif text-[38px] md:text-[44px] mb-4 text-[#1C1510]">Your knowledge graph is the brain</h2>
            <p className="text-[16px] text-[#6B5E52] max-w-md mx-auto leading-relaxed">
              WhatsApp, voice agents, web chat — these are just the mouths. Plug the brain in anywhere.
            </p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <IntegrationDiagram />
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-6 md:px-12 py-[130px] relative overflow-hidden bg-[#1A6B3C] text-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-white/7 blur-3xl pointer-events-none" />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-2xl mx-auto text-center relative">
          <motion.h2 variants={fade} className="font-serif text-[46px] leading-[1.08] mb-5 text-white">
            Ready to build your <em className="italic text-[#E8A020]">knowledge agent</em>?
          </motion.h2>
          <motion.p variants={fade} className="text-white/65 text-[16px] leading-relaxed max-w-[540px] mx-auto mb-10">
            Your documents. Your team. Your use case. We build and deploy in 2 weeks. The same stack running in the demo above.
          </motion.p>
          <motion.div variants={fade} className="flex items-center justify-center gap-3.5 flex-wrap">
            <Link href="/login" className="rounded-full bg-white hover:bg-[#FAF7F2] text-[#1A6B3C] font-semibold text-sm px-7 py-3.5 transition shadow-lg">
              Start with your docs →
            </Link>
            <a href="#demo" className="rounded-full border border-white/25 hover:border-white/50 text-white/80 hover:text-white text-sm font-semibold px-7 py-3.5 transition">
              Try the live demo first
            </a>
          </motion.div>
        </motion.div>
      </section>

      <footer className="bg-[#13350E] border-t border-white/[0.08] px-6 md:px-12 py-5 flex flex-col sm:flex-row justify-between font-mono text-[11px] text-white/35">
        <span>iKnowIt — AI Document Intelligence</span>
        <span>LightRAG · Supabase pgvector · OpenAI · Next.js · Vercel</span>
      </footer>
    </div>
  )
}
