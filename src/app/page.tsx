import Link from 'next/link'
import { PERSONAS } from '@/lib/personas'

const PAIN_POINTS = [
  {
    before: 'Support agents spend 60% of their day answering the same 20 questions.',
    after: 'AI handles first contact on all repeat queries — agents only see what needs a human.',
  },
  {
    before: 'New hires take 3 weeks to find answers that exist in a PDF somewhere.',
    after: 'Self-serve HR answers on day 1. Onboarding TAT down 40%.',
  },
  {
    before: "Sales reps lose deals because they couldn't recall the right spec in time.",
    after: 'Real-time answers during discovery calls. 23% faster deal closure.',
  },
  {
    before: 'IT tickets pile up for issues already documented in the runbook.',
    after: '55% of L1 tickets resolved without IT team involvement.',
  },
]

export default function HomePage() {
  const personas = Object.values(PERSONAS)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-gray-950/90 backdrop-blur z-50">
        <span className="font-bold text-white tracking-tight">DocChat <span className="text-teal-400">AI</span></span>
        <div className="flex items-center gap-4">
          <Link href="/personas" className="text-sm text-gray-400 hover:text-white transition">Use cases</Link>
          <Link href="/login" className="rounded-lg bg-teal-600 hover:bg-teal-500 px-4 py-1.5 text-sm font-medium transition">Sign in</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-28 text-center">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-96 w-96 rounded-full bg-teal-600/10 blur-3xl animate-pulse" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-950/60 border border-teal-800/60 px-4 py-1.5 text-xs text-teal-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Built for Meridian Corp · 5 bots · 3,200 queries / day
          </div>
          <h1 className="text-5xl font-bold leading-tight tracking-tight">
            Your documents.<br />
            <span className="text-teal-400">Your AI.</span> Deployed anywhere.
          </h1>
          <p className="mt-6 text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
            We turn your content into a trained AI assistant — live on your website, WhatsApp, app, or email in hours, not months.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <a href="#personas" className="rounded-xl bg-teal-600 hover:bg-teal-500 px-6 py-3 text-sm font-semibold transition">
              See real examples →
            </a>
            <Link href="/login" className="rounded-xl border border-white/20 hover:border-white/40 px-6 py-3 text-sm font-medium text-gray-300 hover:text-white transition">
              Try free
            </Link>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-3">Your knowledge exists. Your customers just cannot access it.</h2>
        <p className="text-center text-gray-500 text-sm mb-12">Every organisation has answers. The problem is retrieval.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PAIN_POINTS.map((p, i) => (
            <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-6 hover:border-teal-500/30 transition">
              <p className="text-sm text-red-400/80 mb-4 leading-relaxed">✕  {p.before}</p>
              <p className="text-sm text-teal-400 leading-relaxed">✓  {p.after}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Persona Gallery */}
      <section id="personas" className="px-6 py-20 bg-black/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-4">
            <span className="text-xs uppercase tracking-widest text-gray-500">Case Study</span>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Here is what we built for Meridian Corp</h2>
          <p className="text-center text-gray-500 text-sm mb-12 max-w-xl mx-auto">
            One knowledge base. Five AI assistants. Deployed across customer support, HR, sales, IT, and internal ops.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {personas.map(p => (
              <Link
                key={p.slug}
                href={`/personas/${p.slug}`}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-teal-500/40 transition-all p-6"
              >
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="font-semibold text-white group-hover:text-teal-400 transition">{p.label}</h3>
                <p className="text-xs text-teal-500 mt-1 mb-3">{p.tagline}</p>
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  {p.caseStudy.metrics.slice(0, 2).map(m => (
                    <div key={m.label} className="rounded-lg bg-black/30 p-2">
                      <div className="text-sm font-bold text-teal-400">{m.value}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">{m.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs text-gray-500 group-hover:text-teal-400 transition">Try it →</div>
              </Link>
            ))}
            <Link
              href="/chat?persona=custom"
              className="group flex flex-col rounded-2xl border border-dashed border-white/20 hover:border-teal-500/40 bg-transparent hover:bg-white/5 transition-all p-6 items-center justify-center text-center"
            >
              <div className="text-3xl mb-3">🛠</div>
              <h3 className="font-semibold text-white">Build your own</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">Upload your docs. Set your persona. Deploy anywhere.</p>
              <div className="mt-4 text-xs text-gray-500 group-hover:text-teal-400 transition">Get started →</div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to build yours?</h2>
          <p className="text-gray-400 mb-8">We handle the AI. You handle the business. First deployment in under a week.</p>
          <Link href="/login" className="inline-block rounded-xl bg-teal-600 hover:bg-teal-500 px-8 py-3.5 text-sm font-semibold transition">
            Get started free →
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-xs text-gray-600">
        DocChat AI · Built on LightRAG + Supabase pgvector + OpenAI
      </footer>
    </div>
  )
}
