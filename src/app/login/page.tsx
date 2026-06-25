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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="relative z-10 w-full max-w-sm px-6">

        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-8 h-8 rounded-xl bg-[#EBF5EF] border border-[rgba(26,107,60,0.2)] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="3"   fill="#1A6B3C" />
              <circle cx="7" cy="7" r="5.5" stroke="#1A6B3C" strokeOpacity="0.4" strokeWidth="1" />
              <circle cx="7" cy="7" r="7"   stroke="#1A6B3C" strokeOpacity="0.15" strokeWidth="0.5" />
            </svg>
          </div>
          <span className="font-serif text-[19px] italic text-[#1C1510]">
            i<span className="text-[#1A6B3C]">Know</span>It
          </span>
        </div>

        <div className="rounded-2xl border border-[#E8E0D5] bg-white/90 backdrop-blur-xl p-8 shadow-sm">
          <h1 className="font-serif text-[22px] mb-1 text-[#1C1510]">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-sm text-[#6B5E52] mb-7">
            {isSignUp ? 'Upload your docs. Build your agent.' : 'Sign in to your knowledge agent'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#6B5E52] mb-1.5">Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#E8E0D5] bg-[#FAF7F2] focus:border-[rgba(26,107,60,0.5)] focus:outline-none focus:bg-white px-4 py-2.5 text-sm text-[#1C1510] placeholder:text-[#6B5E52]/40 transition"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B5E52] mb-1.5">Password</label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#E8E0D5] bg-[#FAF7F2] focus:border-[rgba(26,107,60,0.5)] focus:outline-none focus:bg-white px-4 py-2.5 text-sm text-[#1C1510] placeholder:text-[#6B5E52]/40 transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-[#FF4D3D]/20 bg-[#FFF0EE] px-3 py-2">
                <p className="text-xs text-[#FF4D3D]">{error}</p>
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full rounded-xl bg-[#1A6B3C] hover:bg-[#15572f] disabled:opacity-50 disabled:cursor-not-allowed py-3 text-sm font-semibold text-white transition shadow-md shadow-[rgba(26,107,60,0.2)]"
            >
              {loading ? '…' : isSignUp ? 'Create account' : 'Sign in →'}
            </button>
          </form>

          <button
            onClick={() => { setIsSignUp(!isSignUp); setError('') }}
            className="mt-5 w-full text-center text-xs text-[#6B5E52]/60 hover:text-[#6B5E52] transition"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        <p className="text-center text-[10px] text-[#6B5E52]/50 mt-6">
          By signing in you agree to our terms. Data stored securely on Supabase.
        </p>
      </div>
    </div>
  )
}
