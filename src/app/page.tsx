'use client'

import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { PERSONAS } from '@/lib/personas'
import { HeroParticles } from '@/components/HeroParticles'

// ─ Animated count-up ─
function CountUp({ to, format = String }: { to: number; format?: (n: number) => string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-80px' })
  useEffect(() => {
    if (!inView) return
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min((t - t0) / 1800, 1)
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, to])
  return <span ref={ref}>{format(val)}</span>
}

const IMPACT = [
  { to: 42, format: (n: number) => `₹${(n / 10).toFixed(1)} Cr`, label: 'saved, Year 1', sub: 'All 5 systems combined' },
  { to: 3400, format: (n: number) => n.toLocaleString('en-IN'), label: 'queries handled / day', sub: 'Across 31,000 employees' },
  { to: 12, format: (n: number) => `${n} wks`, label: 'brief to live deploy', sub: 'From kickoff to production' },
  { to: 94, format: (n: number) => `${n}%`, label: 'employee adoption', sub: 'Month 3, no mandates issued' },
]

const TIMELINE = [
  {
    week: 'Week 1–2', title: 'Audit & Discovery',
    desc: 'Mapped every repeating query, ticket, and manual process. 4,200 tickets audited. 38 failure patterns found.',
    detail: 'The first week was all listening. We sat in on support calls, dug through 3 years of ticket history, and mapped everything that was breaking.',
  },
  {
    week: 'Week 3–5', title: 'Knowledge Engineering',
    desc: 'Policy docs, runbooks, product specs — cleaned, structured, and loaded into the knowledge graph.',
    detail: 'The HR handbook alone existed in 14 versions across 3 SharePoints. Week 3 was brutal.',
  },
  {
    week: 'Week 6–9', title: 'Build & Tune',
    desc: '5 AI assistants built, each with custom personas, tone, and variable prompt systems.',
    detail: 'We tested every bot against 500 real historical queries before it saw a live user.',
  },
  {
    week: 'Week 10–12', title: 'Deploy & Measure',
    desc: 'Rolled out to customer portal, WhatsApp, intranet, Slack, and CRM sidebar.',
    detail: 'Metrics from Day 1. No waiting for monthly reports — we built dashboards into the handoff.',
  },
]

const STACK = ['OpenAI GPT-4o', 'LightRAG GraphRAG', 'Supabase pgvector', 'Next.js App Router', 'Vercel', 'n8n', 'WhatsApp API', 'Slack API']

const COMPANY = { founded: '1989', revenue: '₹18,200 Cr', employees: '31,000+', verticals: '6 verticals', listed: 'BSE & NSE' }

const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

export default function HomePage() {
  const personas = Object.values(PERSONAS)

  return (
    <div className="min-h-screen bg-[#060A0F] text-white overflow-x-hidden">

      {/* ─── NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/[0.06] bg-[#060A0F]/80 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="white" fillOpacity="0.9" />
            </svg>
          </div>
          <span className="font-semibold tracking-tight">stellaris<span className="text-teal-400">.ai</span></span>
        </div>
        <div className="flex items-center gap-5">
          <Link href="#about" className="text-sm text-gray-400 hover:text-white transition hidden md:block">About</Link>
          <Link href="/personas" className="text-sm text-gray-400 hover:text-white transition hidden md:block">Case studies</Link>
          <Link href="/login" className="rounded-lg bg-teal-600 hover:bg-teal-500 px-4 py-1.5 text-sm font-medium transition">
            Try the demo
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0">
          <HeroParticles className="opacity-45" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#060A0F] via-[#060A0F]/85 to-[#060A0F]/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060A0F] via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

          {/* Left: text */}
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fade} className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/40 px-4 py-1.5 text-xs text-teal-400 mb-8 backdrop-blur">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Case Study · Stellaris Group · FY2025
            </motion.div>

            {/* Letter-by-letter headline */}
            <motion.h1
              className="text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03, delayChildren: 0.1 } } }}
            >
              {'Five AI assistants.'.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } } }}
                  style={{ display: ch === ' ' ? 'inline' : 'inline-block' }}
                >
                  {ch === ' ' ? ' ' : ch}
                </motion.span>
              ))}
              <br />
              <motion.span variants={fade} className="text-teal-400">One brain.</motion.span>
              <br />
              <motion.span variants={fade}>Zero overhead.</motion.span>
            </motion.h1>

            <motion.p variants={fade} className="mt-6 text-base text-gray-400 leading-relaxed max-w-md">
              We replaced 5 manual workflows at Stellaris Group — a ₹18,200 Cr Indian conglomerate with 31,000 employees — with a unified AI system. Here's the full build, live and testable.
            </motion.p>

            <motion.div variants={fade} className="mt-10 flex items-center gap-4 flex-wrap">
              <a
                href="#case-study"
                className="group relative rounded-xl bg-teal-600 hover:bg-teal-500 px-6 py-3 text-sm font-semibold transition shadow-lg shadow-teal-900/40 overflow-hidden"
              >
                <span className="relative z-10">See what we built →</span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </a>
              <Link
                href="/login"
                className="rounded-xl border border-white/15 hover:border-white/30 bg-white/[0.04] hover:bg-white/[0.07] px-6 py-3 text-sm font-medium text-gray-300 hover:text-white transition"
              >
                Try the live system
              </Link>
            </motion.div>

            <motion.div variants={fade} className="mt-8 flex items-center gap-6 flex-wrap">
              {['₹4.2 Cr saved', '3,400 queries/day', '12 wks to deploy'].map(s => (
                <div key={s} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-1 h-1 rounded-full bg-teal-500 flex-shrink-0" />
                  {s}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: visual with floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="hidden lg:block relative"
          >
            {/* Main panel — shows image if /public/images/hero-visual.jpg exists, else gradient */}
            <div
              className="relative h-[540px] rounded-2xl overflow-hidden border border-white/10"
              style={{
                backgroundImage: 'url(/images/hero-visual.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                background: 'linear-gradient(135deg, #0d1f2d 0%, #0a1628 60%, #061a1f 100%)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#060A0F] via-[#060A0F]/10 to-transparent" />

              {/* Floating card: live queries */}
              <motion.div
                className="absolute top-6 right-6 rounded-xl bg-white/[0.08] backdrop-blur-xl border border-white/15 px-4 py-3 shadow-xl"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="text-[10px] text-gray-400 mb-0.5">Live queries today</div>
                <div className="text-2xl font-bold text-teal-400">3,412</div>
              </motion.div>

              {/* Floating card: resolution time */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 right-6 rounded-xl bg-white/[0.08] backdrop-blur-xl border border-white/15 px-4 py-3 shadow-xl"
                animate={{ y: [-5, 3, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="text-[10px] text-gray-400 mb-1">AI confidence</div>
                <div className="text-2xl font-bold text-white">94%</div>
                <div className="mt-2 h-1.5 w-24 rounded-full bg-white/10">
                  <div className="h-full w-[94%] rounded-full bg-teal-500" />
                </div>
              </motion.div>

              {/* Floating card: resolution time */}
              <motion.div
                className="absolute bottom-40 left-5 rounded-xl bg-white/[0.08] backdrop-blur-xl border border-white/15 px-4 py-3 shadow-xl"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
              >
                <div className="text-[10px] text-gray-400 mb-0.5">Avg resolution time</div>
                <div className="flex items-end gap-2 mt-0.5">
                  <span className="text-xl font-bold text-white">12 min</span>
                  <span className="text-xs text-teal-400 pb-0.5">↓ from 4.5 hrs</span>
                </div>
              </motion.div>

              {/* Bottom chat preview */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="rounded-xl bg-black/70 backdrop-blur border border-white/[0.08] p-4">
                  <div className="text-[10px] text-gray-500 mb-2 font-mono">IT Helpdesk · Live chat</div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-[11px] text-gray-300 bg-white/[0.06] rounded-lg px-3 py-2 max-w-[65%] leading-relaxed">
                        How do I reset my VPN password?
                      </span>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <span className="text-[11px] text-teal-300 bg-teal-950/70 rounded-lg px-3 py-2 max-w-[75%] leading-relaxed">
                        Go to portal.stellaris.com → My Account → Security → Reset VPN. Takes ~2 min. No IT ticket needed.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-25">
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-teal-500 to-transparent"
            animate={{ scaleY: [1, 0.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </section>

      {/* ─── TECH STACK MARQUEE ─── */}
      <div className="border-y border-white/[0.05] py-4 overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="flex gap-16 whitespace-nowrap"
        >
          {[...STACK, ...STACK].map((item, i) => (
            <span key={i} className="text-sm text-gray-600 font-medium tracking-wide">{item}</span>
          ))}
        </motion.div>
      </div>

      {/* ─── THE CLIENT ─── */}
      <section id="case-study" className="px-6 md:px-10 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={stagger} initial="hidden" whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start"
          >
            <motion.div variants={fade} className="space-y-6">
              <div>
                <p className="text-gray-500 text-sm mb-3">The client</p>
                <h2 className="text-3xl font-bold leading-snug">Stellaris Group came to us with a specific frustration.</h2>
              </div>

              <blockquote className="text-xl text-gray-300 leading-relaxed font-light border-l-2 border-teal-500 pl-5">
                "We have 31,000 people, six businesses, and a support team drowning in questions they've answered before. Every department is hoarding the same knowledge. Find us a way out."
              </blockquote>
              <p className="text-sm text-gray-500">— Rajan Krishnamurthy, CHRO & CIO (Interim), Stellaris Group</p>

              <p className="text-sm text-gray-400 leading-relaxed">
                Before touching a single line of code, we audited 4,200 support tickets. The pattern was obvious:
              </p>

              <div className="space-y-3.5">
                {[
                  { num: '71%', desc: 'of all tickets were repeat questions with known answers' },
                  { num: '22 days', desc: 'average time for a new hire to reach full productivity' },
                  { num: '72%', desc: 'of IT team\'s time spent on L1 tickets already in the runbook' },
                  { num: '₹0', desc: 'of institutional knowledge was searchable across all six divisions' },
                ].map(({ num, desc }) => (
                  <div key={num} className="flex items-start gap-4">
                    <span className="text-teal-400 font-bold text-sm min-w-[68px] pt-0.5">{num}</span>
                    <span className="text-sm text-gray-400">{desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fade} className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold">Stellaris Group</h3>
                  <span className="text-xs text-teal-400 bg-teal-950/60 border border-teal-800/40 rounded-full px-3 py-1">Engagement active</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    ['Founded', COMPANY.founded], ['HQ', 'Nariman Point, Mumbai'],
                    ['Revenue', COMPANY.revenue], ['Employees', COMPANY.employees],
                    ['Verticals', COMPANY.verticals], ['Listed', COMPANY.listed],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-xl bg-white/[0.04] p-3">
                      <div className="text-[10px] text-gray-600 mb-0.5">{k}</div>
                      <div className="text-sm font-medium">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/[0.08] pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Contract</span>
                    <span className="text-teal-400 font-medium">₹8.4L setup + ₹72K/mo retainer</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Timeline</span>
                    <span className="text-gray-300">12 weeks to full deployment</span>
                  </div>
                </div>
              </div>

              {/* Discovery image slot */}
              <div
                className="h-52 rounded-2xl overflow-hidden border border-white/[0.08] relative"
                style={{
                  backgroundImage: 'url(/images/discovery.png)',
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  background: 'linear-gradient(135deg, #0f1f2d 0%, #0d1a20 100%)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-xs text-gray-400 italic">Discovery session, Week 1 — mapping the ticket taxonomy</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── TIMELINE ─── */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-12">
            <p className="text-gray-500 text-sm mb-2">How we work</p>
            <h2 className="text-3xl font-bold">12 weeks. No magic. Just structure.</h2>
          </motion.div>

          <div className="relative">
            {/* Connecting line — desktop only */}
            <div className="hidden lg:block absolute top-8 left-10 right-10 h-px bg-gradient-to-r from-transparent via-teal-500/25 to-transparent" />

            <motion.div
              variants={stagger} initial="hidden" whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {TIMELINE.map((t, i) => (
                <motion.div
                  key={t.week}
                  variants={fade}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-teal-500/30 hover:bg-white/[0.05] transition-all group cursor-default"
                >
                  {/* Timeline dot */}
                  <div className="hidden lg:block absolute -top-[17px] left-7 w-3 h-3 rounded-full border-2 border-teal-500/60 bg-[#060A0F] z-10" />

                  <div className="text-[10px] font-mono text-teal-500 tracking-widest mb-3">{t.week}</div>
                  <div className="text-2xl font-bold text-gray-700 font-mono mb-3">0{i + 1}</div>
                  <h3 className="font-semibold text-white mb-2">{t.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{t.desc}</p>
                  {/* Reveal on hover — the honest detail */}
                  <p className="text-xs text-gray-600 italic leading-relaxed border-t border-white/[0.06] pt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {t.detail}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── WHAT WE BUILT ─── */}
      <section id="personas" className="px-6 md:px-10 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-12">
            <p className="text-gray-500 text-sm mb-2">The deliverables</p>
            <h2 className="text-3xl font-bold">Five AI assistants. All live. All testable.</h2>
            <p className="text-gray-500 mt-2 text-sm max-w-lg">
              Click any to read the case study and chat with the actual bot — same knowledge base running in production.
            </p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {personas.map(p => (
              <motion.div key={p.slug} variants={fade}>
                <Link
                  href={`/personas/${p.slug}`}
                  className="group flex flex-col h-full rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-teal-500/40 transition-all duration-300 p-6 relative overflow-hidden"
                >
                  <div
                    className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'radial-gradient(400px at 50% 0%, rgba(20,184,166,0.07), transparent)' }}
                  />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">{p.icon}</div>
                      <span className="text-[10px] text-teal-500 border border-teal-800/40 bg-teal-950/40 rounded-full px-2 py-0.5">Live</span>
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-teal-400 transition text-base mb-1">{p.label}</h3>
                    <p className="text-xs text-teal-500/80 mb-3 font-medium italic">{p.tagline}</p>
                    <p className="text-xs text-gray-500 leading-relaxed mb-5">{p.description}</p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {p.caseStudy.metrics.slice(0, 2).map(m => (
                        <div key={m.label} className="rounded-xl bg-black/30 border border-white/[0.06] p-3">
                          <div className="text-sm font-bold text-teal-400">{m.value}</div>
                          <div className="text-[10px] text-gray-600 mt-0.5 leading-tight">{m.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 group-hover:text-teal-400 transition">
                      <span>Read case study + chat live</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Build your own */}
            <motion.div variants={fade}>
              <Link
                href="/chat?persona=custom"
                className="group flex flex-col h-full min-h-[280px] rounded-2xl border border-dashed border-white/20 hover:border-teal-500/50 hover:bg-white/[0.02] transition-all duration-300 p-6 items-center justify-center text-center"
              >
                <div className="w-12 h-12 rounded-xl border border-dashed border-white/20 group-hover:border-teal-500/50 flex items-center justify-center text-2xl mb-4 transition-all duration-300 group-hover:scale-110">
                  🛠
                </div>
                <h3 className="font-semibold text-white group-hover:text-teal-400 transition">Build yours</h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed max-w-[170px]">
                  Upload your documents. Define your persona. Live in 2 weeks.
                </p>
                <div className="mt-4 text-xs text-gray-600 group-hover:text-teal-400 transition">Start free →</div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── IMPACT NUMBERS ─── */}
      <section className="px-6 md:px-10 py-24 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-12">
            <p className="text-gray-500 text-sm mb-2">Results — 90 days post-deploy</p>
            <h2 className="text-3xl font-bold">The numbers from the live system.</h2>
            <p className="text-gray-600 mt-2 text-sm">
              Pulled from Mixpanel and Supabase dashboards. Not estimates.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {IMPACT.map(item => (
              <motion.div
                key={item.label}
                variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center hover:border-teal-500/30 transition"
              >
                <div className="text-4xl font-bold text-teal-400 tracking-tight">
                  <CountUp to={item.to} format={item.format} />
                </div>
                <div className="text-sm font-medium text-white mt-2">{item.label}</div>
                <div className="text-xs text-gray-600 mt-1 leading-tight">{item.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT THE BUILDER ─── */}
      <section id="about" className="px-6 md:px-10 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={stagger} initial="hidden" whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center"
          >
            {/* Photo — replace /images/builder.jpg with your headshot */}
            <motion.div variants={fade} className="order-2 lg:order-1">
              <div
                className="relative h-[480px] rounded-2xl overflow-hidden border border-white/10"
                style={{
                  backgroundImage: 'url(/images/builder.png)',
                  backgroundSize: 'cover', backgroundPosition: 'top center',
                  background: 'linear-gradient(135deg, #0d1f2d 0%, #081520 100%)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#060A0F] via-[#060A0F]/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="rounded-xl bg-white/[0.07] backdrop-blur border border-white/10 p-4">
                    <div className="text-sm font-semibold text-white">[Your Name]</div>
                    <div className="text-xs text-teal-400 mt-0.5">AI Automation · n8n · LightRAG · Next.js</div>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs text-gray-500">Based in India</span>
                      <span className="w-1 h-1 rounded-full bg-gray-700" />
                      <span className="flex items-center gap-1.5 text-xs text-teal-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                        Available for projects
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div variants={fade} className="order-1 lg:order-2 space-y-5">
              <div>
                <p className="text-gray-500 text-sm mb-3">About the builder</p>
                <h2 className="text-3xl font-bold leading-snug">
                  I build AI systems that run without babysitting.
                </h2>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm">
                The Stellaris Group build on this page is real — the same system you can interact with right now, deployed across live channels with thousands of queries hitting it every day. I built it end-to-end: knowledge engineering, AI configuration, full-stack deployment, and the monitoring to know when something breaks.
              </p>
              <p className="text-gray-400 leading-relaxed text-sm">
                My background is in workflow automation — n8n, APIs, no-code infrastructure. I use that foundation to build AI products that are actually maintainable. If a system needs a human in the loop to keep running, in my view it's not done.
              </p>
              <p className="text-gray-400 leading-relaxed text-sm">
                I work with international clients on Upwork. If you have a knowledge problem — support, onboarding, sales ops, internal tools — and you want something live in weeks rather than quarters, tell me what you're solving.
              </p>
              <div className="flex items-center gap-5 pt-2 flex-wrap">
                <Link
                  href="/login"
                  className="rounded-xl bg-teal-600 hover:bg-teal-500 px-6 py-3 text-sm font-semibold transition shadow-lg shadow-teal-900/30"
                >
                  Try the live system →
                </Link>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-white transition"
                >
                  Hire via Upwork ↗
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-6 md:px-10 py-24 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[300px] rounded-full bg-teal-600/5 blur-3xl" />
        </div>
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center relative"
        >
          <motion.h2 variants={fade} className="text-4xl font-bold mb-4">
            What does your <span className="text-teal-400">version</span> look like?
          </motion.h2>
          <motion.p variants={fade} className="text-gray-400 mb-8 leading-relaxed text-sm max-w-md mx-auto">
            Different documents. Different channels. Different problem. Same approach. Tell me what you're trying to solve.
          </motion.p>
          <motion.div variants={fade} className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/personas"
              className="rounded-xl bg-teal-600 hover:bg-teal-500 px-8 py-3.5 text-sm font-semibold transition shadow-xl shadow-teal-900/30"
            >
              Explore all 5 case studies →
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-white/15 hover:border-white/30 bg-white/[0.04] hover:bg-white/[0.07] px-8 py-3.5 text-sm font-medium text-gray-300 hover:text-white transition"
            >
              Try the live system
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <footer className="border-t border-white/[0.05] px-6 md:px-10 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <span>stellaris.ai — Built by an independent AI automation specialist</span>
          <span>LightRAG · Supabase pgvector · OpenAI · Next.js · Vercel</span>
        </div>
      </footer>
    </div>
  )
}
