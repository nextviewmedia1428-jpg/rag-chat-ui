'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { PERSONAS } from '@/lib/personas'
import { HeroParticles } from '@/components/HeroParticles'

const COMPANY = {
  name: 'Stellaris Group',
  founded: '1989',
  hq: 'Mumbai',
  revenue: '₹18,200 Cr',
  employees: '31,000+',
  verticals: '6 business verticals',
  listed: 'BSE & NSE',
}

const IMPACT = [
  { value: '₹4.2 Cr', label: 'saved in Year 1', sub: 'Across all 5 AI systems combined' },
  { value: '3,400', label: 'AI queries / day', sub: 'Across the 31,000-person organisation' },
  { value: '12 weeks', label: 'from brief to deployment', sub: 'Concept → live, across all 5 bots' },
  { value: '94%', label: 'employee adoption', sub: 'By Month 3, without a single mandate' },
]

const TIMELINE = [
  { week: 'Week 1–2', title: 'Audit & Discovery', desc: 'We mapped every repeating query, ticket, and manual process across the organisation. 4,200 tickets audited. 38 failure patterns identified.' },
  { week: 'Week 3–5', title: 'Knowledge Engineering', desc: 'Policy documents, runbooks, product specs, and 3 years of ticket history — cleaned, structured, and loaded into the AI knowledge graph.' },
  { week: 'Week 6–9', title: 'Build & Tune', desc: '5 AI assistants built, each with custom personas, tone, and variable prompt systems. Tested against real historical queries for accuracy.' },
  { week: 'Week 10–12', title: 'Deploy & Measure', desc: 'Rolled out to live channels: customer portal, WhatsApp, internal intranet, Slack, and CRM sidebar. Metrics tracked from Day 1.' },
]

const fade = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

export default function HomePage() {
  const personas = Object.values(PERSONAS)

  return (
    <div className="min-h-screen bg-[#060A0F] text-white overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/[0.06] bg-[#060A0F]/80 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="white" fillOpacity="0.9"/>
            </svg>
          </div>
          <span className="font-semibold tracking-tight text-white">stellaris<span className="text-teal-400">.ai</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/personas" className="text-sm text-gray-400 hover:text-white transition">Case studies</Link>
          <Link href="/login" className="rounded-lg bg-teal-600 hover:bg-teal-500 px-4 py-1.5 text-sm font-medium transition">
            Try the demo
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Particle background */}
        <div className="absolute inset-0">
          <HeroParticles className="opacity-60" />
        </div>

        {/* Gradient overlay so text is legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060A0F] via-[#060A0F]/90 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060A0F] via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-20">
          <motion.div
            className="max-w-2xl"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {/* Badge */}
            <motion.div variants={fade} className="inline-flex items-center gap-2.5 rounded-full border border-teal-500/30 bg-teal-950/40 px-4 py-1.5 text-xs text-teal-400 mb-8 backdrop-blur">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Case Study · Stellaris Group · FY2025
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fade} className="text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Five AI assistants.
              <br />
              <span className="text-teal-400">One brain.</span>
              <br />
              Zero overhead.
            </motion.h1>

            <motion.p variants={fade} className="mt-6 text-lg text-gray-400 leading-relaxed max-w-lg">
              We replaced 5 manual workflows at Stellaris Group — a ₹18,200 Cr Indian conglomerate — with a unified AI system. Customer support, HR, sales intelligence, IT helpdesk, and internal ops. Here's exactly what we built.
            </motion.p>

            {/* Mini stats */}
            <motion.div variants={fade} className="mt-8 flex items-center gap-6 flex-wrap">
              {['31,000 employees', '3,400 queries / day', '₹4.2 Cr saved'].map(s => (
                <div key={s} className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="w-1 h-1 rounded-full bg-teal-500" />
                  {s}
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fade} className="mt-10 flex items-center gap-4">
              <a
                href="#case-study"
                className="rounded-xl bg-teal-600 hover:bg-teal-500 px-6 py-3 text-sm font-semibold transition shadow-lg shadow-teal-900/40"
              >
                See what we built →
              </a>
              <Link
                href="/login"
                className="rounded-xl border border-white/15 hover:border-white/30 bg-white/[0.04] hover:bg-white/[0.07] px-6 py-3 text-sm font-medium text-gray-300 hover:text-white transition backdrop-blur"
              >
                Try the live demo
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs text-gray-500 tracking-widest uppercase">Scroll</span>
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-teal-500 to-transparent"
            animate={{ scaleY: [1, 0.4, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </section>

      {/* THE CLIENT */}
      <section id="case-study" className="px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Company card */}
            <motion.div variants={fade}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">The Client</div>
                    <h2 className="text-2xl font-bold text-white">Stellaris Group</h2>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-teal-950/60 border border-teal-800/40 px-3 py-1 text-xs text-teal-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    Engagement active
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: 'Founded', val: COMPANY.founded },
                    { label: 'HQ', val: COMPANY.hq },
                    { label: 'Revenue', val: COMPANY.revenue },
                    { label: 'Employees', val: COMPANY.employees },
                    { label: 'Verticals', val: COMPANY.verticals },
                    { label: 'Listed', val: COMPANY.listed },
                  ].map(({ label, val }) => (
                    <div key={label} className="rounded-xl bg-white/[0.04] p-3">
                      <div className="text-[10px] uppercase text-gray-500 mb-0.5">{label}</div>
                      <div className="text-sm font-medium text-white">{val}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="text-xs text-gray-500 mb-1">Engagement value</div>
                  <div className="text-sm text-gray-300">₹8.4L (setup) + ₹72K/month retainer</div>
                </div>
              </div>
            </motion.div>

            {/* Brief text */}
            <motion.div variants={fade} className="space-y-6">
              <div>
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-3">The Brief</div>
                <blockquote className="text-xl text-gray-300 leading-relaxed font-light border-l-2 border-teal-500 pl-5">
                  "We have 31,000 people, six businesses, and a support team drowning in questions they've answered before. Every department is hoarding the same knowledge. Find us a way out."
                </blockquote>
                <p className="mt-3 text-sm text-gray-500">— Rajan Krishnamurthy, CHRO & CIO (Interim), Stellaris Group</p>
              </div>

              <div className="space-y-3">
                {[
                  { num: '4,200', desc: 'support tickets/month — 71% were repeat questions' },
                  { num: '22 days', desc: 'average time for new hires to reach full productivity' },
                  { num: '72%', desc: 'of IT team\'s time spent on L1 tickets from the runbook' },
                  { num: '₹0', desc: 'of institutional knowledge was searchable across divisions' },
                ].map(({ num, desc }) => (
                  <div key={num} className="flex items-start gap-3">
                    <span className="text-teal-400 font-bold text-sm min-w-[60px]">{num}</span>
                    <span className="text-sm text-gray-400">{desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* HOW WE BUILT IT */}
      <section className="px-8 py-20 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-3">Process</div>
            <h2 className="text-3xl font-bold">12 weeks. No magic. Just structure.</h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {TIMELINE.map((t, i) => (
              <motion.div
                key={t.week}
                variants={fade}
                className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-teal-500/30 hover:bg-white/[0.05] transition-all group"
              >
                <div className="absolute -top-3 left-5 rounded-full bg-teal-600 px-2.5 py-0.5 text-[10px] font-mono text-white">
                  {t.week}
                </div>
                <div className="text-2xl font-bold text-teal-400 mb-2 mt-2 font-mono">0{i + 1}</div>
                <h3 className="font-semibold text-white mb-2">{t.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHAT WE BUILT */}
      <section id="personas" className="px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-3">The Deliverables</div>
            <h2 className="text-3xl font-bold">Five AI assistants. One unified knowledge graph.</h2>
            <p className="text-gray-400 mt-3 max-w-xl">Each bot trained on the real docs. Each one live. Click any to try it — the conversations are real.</p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {personas.map(p => (
              <motion.div key={p.slug} variants={fade}>
                <Link
                  href={`/personas/${p.slug}`}
                  className="group flex flex-col h-full rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-teal-500/40 transition-all duration-300 p-6 relative overflow-hidden"
                >
                  {/* Glow on hover */}
                  <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'radial-gradient(400px at 50% 0%, rgba(20,184,166,0.08), transparent)' }}
                  />

                  <div className="relative">
                    <div className="text-3xl mb-4">{p.icon}</div>
                    <h3 className="font-semibold text-white group-hover:text-teal-400 transition-colors text-lg">{p.label}</h3>
                    <p className="text-xs text-teal-500/80 mt-1 mb-3 font-medium">{p.tagline}</p>
                    <p className="text-xs text-gray-500 leading-relaxed mb-5">{p.description}</p>

                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {p.caseStudy.metrics.slice(0, 2).map(m => (
                        <div key={m.label} className="rounded-xl bg-black/30 border border-white/[0.06] p-3">
                          <div className="text-base font-bold text-teal-400">{m.value}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">{m.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 group-hover:text-teal-400 transition-colors">
                      <span>See case study + try live chat</span>
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
                className="group flex flex-col h-full min-h-[280px] rounded-2xl border border-dashed border-white/20 hover:border-teal-500/50 bg-transparent hover:bg-white/[0.03] transition-all duration-300 p-6 items-center justify-center text-center"
              >
                <div className="w-12 h-12 rounded-xl border border-dashed border-white/20 group-hover:border-teal-500/50 flex items-center justify-center text-2xl mb-4 transition-colors">
                  🛠
                </div>
                <h3 className="font-semibold text-white group-hover:text-teal-400 transition">Build yours</h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed max-w-[180px]">Upload your documents. Define your persona. We deploy it anywhere.</p>
                <div className="mt-4 text-xs text-gray-600 group-hover:text-teal-400 transition">Get started →</div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* IMPACT NUMBERS */}
      <section className="px-8 py-24 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-3">The Results</div>
            <h2 className="text-3xl font-bold">Numbers from the live system.</h2>
            <p className="text-gray-500 mt-2">Pulled from Stellaris Group's dashboards, 90 days post-deployment.</p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {IMPACT.map(item => (
              <motion.div
                key={item.value}
                variants={fade}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center hover:border-teal-500/30 transition"
              >
                <div className="text-4xl font-bold text-teal-400 tracking-tight">{item.value}</div>
                <div className="text-sm font-medium text-white mt-2">{item.label}</div>
                <div className="text-xs text-gray-600 mt-1">{item.sub}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-28 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] rounded-full bg-teal-600/5 blur-3xl" />
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center relative"
        >
          <motion.div variants={fade} className="text-xs uppercase tracking-widest text-gray-500 mb-4">Ready?</motion.div>
          <motion.h2 variants={fade} className="text-4xl font-bold mb-4">
            What does your <span className="text-teal-400">version</span> look like?
          </motion.h2>
          <motion.p variants={fade} className="text-gray-400 mb-8 leading-relaxed">
            We built this for Stellaris Group in 12 weeks. Your organisation has different documents, different channels, different problems. Same approach. Tell us what you're solving.
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

      <footer className="border-t border-white/[0.06] px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-gray-600">
          <span>stellaris.ai — A case study by an independent AI automation team</span>
          <span>Built on LightRAG · Supabase pgvector · OpenAI · Next.js</span>
        </div>
      </footer>
    </div>
  )
}
