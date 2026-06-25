'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

export default function LoginPage() {
  const { signIn, signUp } = useAuth()
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_LIGHTRAG_URL
    if (url) fetch(url + '/').catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password)
    setLoading(false)
    if (err) { setError(err); return }
    router.push('/chat')
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">

      {/* Left: hero text (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-center w-full max-w-md mr-16">
        <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#1A6B3C] mb-5 flex items-center gap-2">
          AI Document Intelligence <span className="w-5 h-px bg-[#1A6B3C] inline-block" />
        </div>
        <h1 className="font-serif text-[52px] leading-[1.05] text-[#1C1510] mb-6">
          Ready to unlock your<br/><em className="italic text-[#1A6B3C]">documents</em>?
        </h1>
        <p className="text-[16px] text-[#6B5E52] leading-relaxed mb-8 max-w-sm">
          Upload your PDFs. We build a knowledge graph. Your team gets instant answers — no more searching through folders.
        </p>

        {/* What you can do */}
        <div className="space-y-3 mb-10">
          {[
            { icon: '📤', t: 'Upload any PDF',         d: 'Policies, runbooks, manuals, FAQs' },
            { icon: '🧠', t: 'Ask natural questions',  d: 'Gets answers from the whole document' },
            { icon: '🔗', t: 'Graph-aware retrieval',  d: 'Connects facts across multiple docs' },
          ].map(({ icon, t, d }) => (
            <div key={t} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EBF5EF] border border-[rgba(26,107,60,0.15)] flex items-center justify-center text-lg flex-shrink-0">{icon}</div>
              <div>
                <div className="text-sm font-semibold text-[#1C1510]">{t}</div>
                <div className="text-xs text-[#6B5E52]">{d}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Limitations */}
        <div className="rounded-2xl border border-[rgba(232,160,32,0.3)] bg-[#FDF6E6] p-5">
          <p className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#E8A020] mb-3">Free tier limitations</p>
          <ul className="space-y-1.5 text-xs text-[#6B5E52]">
            <li className="flex gap-2"><span className="text-[#E8A020]">—</span> PDF only (no DOCX, images, or scanned docs)</li>
            <li className="flex gap-2"><span className="text-[#E8A020]">—</span> Max 4 MB per file (Vercel Hobby limit)</li>
            <li className="flex gap-2"><span className="text-[#E8A020]">—</span> 50,000 tokens / day across all chats</li>
            <li className="flex gap-2"><span className="text-[#E8A020]">—</span> LightRAG knowledge graph not available on free tier — multi-tenant isolation requires a dedicated instance per user. Chat uses semantic search (pgvector) only.</li>
          </ul>
        </div>
      </div>

      {/* Right: form */}
      <div className="w-full max-w-sm">
        {/* Mobile-only heading */}
        <div className="lg:hidden text-center mb-8">
          <h1 className="font-serif text-[34px] text-[#1C1510] mb-1">
            Unlock your <em className="italic text-[#1A6B3C]">docs</em>
          </h1>
          <p className="text-sm text-[#6B5E52]">Your documents. One AI agent. Instant answers.</p>
        </div>

        <div className="rounded-2xl glass-cream p-8 shadow-sm">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-lg bg-[#1A6B3C] flex items-center justify-center text-white text-[12px] font-bold">i</div>
            <span className="font-serif italic text-[17px] text-[#1C1510]">i<span className="text-[#1A6B3C]">Know</span>It</span>
          </div>

          <h2 className="font-serif text-[20px] mb-1 text-[#1C1510]">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-sm text-[#6B5E52] mb-6">
            {isSignUp ? 'Start building your knowledge agent.' : 'Sign in to your knowledge agent.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#6B5E52] mb-1.5">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#E8E0D5] bg-white/80 focus:border-[rgba(26,107,60,0.5)] focus:outline-none focus:bg-white px-4 py-2.5 text-sm text-[#1C1510] placeholder:text-[#6B5E52]/40 transition"
                placeholder="you@company.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B5E52] mb-1.5">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#E8E0D5] bg-white/80 focus:border-[rgba(26,107,60,0.5)] focus:outline-none focus:bg-white px-4 py-2.5 text-sm text-[#1C1510] placeholder:text-[#6B5E52]/40 transition"
                placeholder="••••••••" />
            </div>
            {error && (
              <div className="rounded-xl border border-[rgba(255,77,61,0.2)] bg-[#FFF0EE] px-3 py-2">
                <p className="text-xs text-[#FF4D3D]">{error}</p>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full rounded-xl bg-[#1A6B3C] hover:bg-[#15572f] disabled:opacity-50 py-3 text-sm font-semibold text-white transition shadow-md shadow-[rgba(26,107,60,0.2)]">
              {loading ? '…' : isSignUp ? 'Create account' : 'Sign in →'}
            </button>
          </form>

          <button onClick={() => { setIsSignUp(!isSignUp); setError('') }}
            className="mt-5 w-full text-center text-xs text-[#6B5E52]/60 hover:text-[#6B5E52] transition">
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        <p className="text-center text-[10px] text-[#6B5E52]/50 mt-5">
          Data stored securely on Supabase · No credit card required
        </p>
      </div>
    </div>
  )
}
