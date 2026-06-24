import Link from 'next/link'
import { PERSONAS } from '@/lib/personas'

export default function PersonasPage() {
  const list = Object.values(PERSONAS)
  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition">← Back to home</Link>
        <h1 className="mt-6 text-3xl font-bold">Use Cases</h1>
        <p className="text-gray-400 mt-2 mb-10">Five AI assistants we built for Meridian Corp — one knowledge base, five specialized bots.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map(p => (
            <Link
              key={p.slug}
              href={`/personas/${p.slug}`}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-teal-500/40 transition-all p-6"
            >
              <div className="text-3xl mb-3">{p.icon}</div>
              <h2 className="font-semibold text-white group-hover:text-teal-400 transition">{p.label}</h2>
              <p className="text-xs text-teal-500 mt-1 mb-3">{p.tagline}</p>
              <p className="text-xs text-gray-400 leading-relaxed mb-4 flex-1">{p.description}</p>
              <div className="grid grid-cols-2 gap-2">
                {p.caseStudy.metrics.slice(0, 2).map(m => (
                  <div key={m.label} className="rounded-lg bg-black/30 p-2">
                    <div className="text-sm font-bold text-teal-400">{m.value}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">{m.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-gray-500 group-hover:text-teal-400 transition">See case study →</div>
            </Link>
          ))}

          {/* Build your own */}
          <Link
            href="/chat?persona=custom"
            className="group flex flex-col rounded-2xl border border-dashed border-white/20 hover:border-teal-500/40 bg-transparent hover:bg-white/5 transition-all p-6 items-center justify-center text-center"
          >
            <div className="text-3xl mb-3">🛠</div>
            <h2 className="font-semibold text-white">Build your own</h2>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">Upload your docs. Define your persona. Deploy on your channels.</p>
            <div className="mt-4 text-xs text-gray-500 group-hover:text-teal-400 transition">Get started →</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
