'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { PERSONAS } from '@/lib/personas'
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

/* ── Marquee items with icons ────────────────────────────────────── */
const STACK = [
  { icon: '🕸', label: 'LightRAG GraphRAG' },
  { icon: '◎', label: 'OpenAI GPT-4o' },
  { icon: '⚡', label: 'Supabase pgvector' },
  { icon: '▲', label: 'Next.js' },
  { icon: '▲', label: 'Vercel' },
  { icon: '⟳', label: 'n8n' },
  { icon: '💬', label: 'WhatsApp API' },
  { icon: '🎙', label: 'Voice Agents' },
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
  const personas = Object.values(PERSONAS)

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
          <a href="#personas"     className="hover:text-[#1C1510] transition">Personas</a>
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
              {['No login to demo', '2-week deployment', 'Any communication channel'].map(s => (
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
            <span key={i} className="flex items-center gap-2 font-mono text-[12px] text-[#6B5E52]">
              <span className="text-[14px]">{item.icon}</span>
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
                className="group rounded-2xl border border-[#E8E0D5] bg-white hover:shadow-md p-8 transition-all duration-300 relative">
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
        </div>
      </section>

      {/* ─── CASE STUDY ─── */}
      <section id="case-study" className="px-6 md:px-12 py-28 bg-white/60" data-hub-x="78" data-hub-y="36">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-14">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] border border-[rgba(232,160,32,0.3)] bg-[#FDF6E6] text-[#E8A020] px-4 py-1.5 rounded-full mb-6">
              ⚠ Dummy company — real methodology. Client identity protected for confidentiality.
            </div>
            <Eyebrow>Case Study</Eyebrow>
            <h2 className="font-serif text-[38px] md:text-[44px] mb-3 text-[#1C1510]">Stellaris Group</h2>
            <p className="text-[16px] text-[#6B5E52] max-w-[540px] leading-relaxed">
              A ₹18,200 Cr Indian conglomerate. 31,000 employees. 6 business verticals. Knowledge siloed across every department.
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Problem */}
            <motion.div variants={fade} className="rounded-2xl bg-[#1C1510] text-white p-9">
              <blockquote className="font-serif text-[21px] leading-[1.5] font-normal border-l-[3px] border-[#E8A020] pl-5 mb-7 italic">
                &ldquo;We have 31,000 people, six businesses, and a support team drowning in questions they&apos;ve answered before.&rdquo;
              </blockquote>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { num: '71%',    desc: 'of all support tickets were repeat questions with documented answers' },
                  { num: '22 days', desc: 'average time for a new hire to reach full productivity' },
                  { num: '72%',    desc: 'of IT team time spent on L1 tickets already in the runbook' },
                  { num: '4,200',  desc: 'monthly tickets audited — 38 failure patterns identified' },
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
                    { val: '68%',   label: 'resolved by AI' },
                    { val: '42 sec', label: 'avg first response' },
                    { val: '94%',   label: 'employee adoption' },
                    { val: '12 wks', label: 'brief to live deploy' },
                    { val: '₹4.2 Cr', label: 'saved in Year 1' },
                    { val: '3,400+', label: 'daily queries' },
                  ].map(({ val, label }) => (
                    <div key={label} className="rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] p-4">
                      <b className="block font-mono text-[18px] text-[#1A6B3C]">{val}</b>
                      <span className="text-[11px] text-[#6B5E52]">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#E8E0D5] pt-5 space-y-2.5">
                  {[
                    { wk: 'Wk 1–2',   t: 'Audit & Discovery',    d: '4,200 tickets, 38 failure patterns.' },
                    { wk: 'Wk 3–5',   t: 'Knowledge Engineering', d: 'Docs cleaned, structured, graph built.' },
                    { wk: 'Wk 6–9',   t: 'Build & Tune',          d: '5 AI personas built and tested.' },
                    { wk: 'Wk 10–12', t: 'Deploy & Measure',      d: 'WhatsApp, web, Slack, CRM sidebar.' },
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

      {/* ─── PERSONAS ─── */}
      <section id="personas" className="px-6 md:px-12 py-28 bg-white/60" data-hub-x="73" data-hub-y="24">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-14">
            <Eyebrow>Personas</Eyebrow>
            <h2 className="font-serif text-[42px] md:text-[48px] mb-4 text-[#1C1510]">One Brain. Many Voices.</h2>
            <p className="text-[17px] text-[#6B5E52] max-w-lg mx-auto leading-relaxed">
              The same knowledge graph powers multiple specialised agents — each with a different persona, tone, and use case.
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {personas.map(p => (
              <motion.div key={p.slug} variants={fade}>
                <Link href={`/personas/${p.slug}`}
                  className="group flex flex-col h-full rounded-2xl border border-[#E8E0D5] bg-white hover:shadow-md hover:border-[rgba(26,107,60,0.3)] transition-all duration-300 p-7">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[26px]">{p.icon}</span>
                    <span className="font-mono text-[9px] bg-[#EBF5EF] text-[#1A6B3C] border border-[rgba(26,107,60,0.2)] rounded-full px-2.5 py-1">LIVE</span>
                  </div>
                  <h3 className="font-bold text-[16px] text-[#1C1510] mb-1 group-hover:text-[#1A6B3C] transition">{p.label}</h3>
                  <p className="text-[#1A6B3C] text-[13px] font-semibold mb-2.5">{p.tagline}</p>
                  <p className="text-[13px] text-[#6B5E52] leading-relaxed mb-5 flex-1">{p.description}</p>
                  <div className="grid grid-cols-2 gap-2.5 mb-4">
                    {p.caseStudy.metrics.slice(0, 2).map(m => (
                      <div key={m.label} className="rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] p-3">
                        <b className="block font-mono text-[14px] text-[#FF4D3D]">{m.value}</b>
                        <span className="text-[10px] text-[#6B5E52] leading-tight">{m.label}</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-[12.5px] text-[#1A6B3C] font-bold group-hover:underline">Chat with this persona →</span>
                </Link>
              </motion.div>
            ))}

            {/* Build yours */}
            <motion.div variants={fade}>
              <Link href="/login"
                className="group flex flex-col h-full min-h-[280px] rounded-2xl border border-dashed border-[#E8E0D5] hover:border-[rgba(26,107,60,0.4)] hover:bg-[#EBF5EF]/30 transition-all duration-300 p-7 items-center justify-center text-center">
                <div className="text-[30px] mb-3.5">🛠</div>
                <h3 className="font-bold text-[#1C1510] mb-1.5">Build yours</h3>
                <p className="text-[13px] text-[#6B5E52] leading-relaxed max-w-[160px] mb-4">Upload your documents. Define your persona. Live in 2 weeks.</p>
                <span className="text-[12.5px] text-[#1A6B3C] font-bold">Start free →</span>
              </Link>
            </motion.div>
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
