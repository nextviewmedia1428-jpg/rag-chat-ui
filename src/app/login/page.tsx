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
          <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="3"   fill="#4DA2FF" />
              <circle cx="7" cy="7" r="5.5" stroke="#4DA2FF" strokeOpacity="0.4" strokeWidth="1" />
              <circle cx="7" cy="7" r="7"   stroke="#4DA2FF" strokeOpacity="0.15" strokeWidth="0.5" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-[#0F172A]">IKnow<span className="text-[#4DA2FF]">It</span></span>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white/90 backdrop-blur-xl p-8 shadow-sm">
          <h1 className="text-xl font-bold mb-1 text-[#0F172A]">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-sm text-[#64748B] mb-7">
            {isSignUp ? 'Upload your docs. Build your agent.' : 'Sign in to your knowledge agent'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus:border-[#4DA2FF]/60 focus:outline-none focus:bg-white px-4 py-2.5 text-sm text-[#0F172A] placeholder:text-[#CBD5E1] transition"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">Password</label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus:border-[#4DA2FF]/60 focus:outline-none focus:bg-white px-4 py-2.5 text-sm text-[#0F172A] placeholder:text-[#CBD5E1] transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full rounded-xl bg-[#4DA2FF] hover:bg-[#60B3FF] disabled:opacity-50 disabled:cursor-not-allowed py-3 text-sm font-semibold text-white transition shadow-md shadow-[#4DA2FF]/20"
            >
              {loading ? '…' : isSignUp ? 'Create account' : 'Sign in →'}
            </button>
          </form>

          <button
            onClick={() => { setIsSignUp(!isSignUp); setError('') }}
            className="mt-5 w-full text-center text-xs text-[#94A3B8] hover:text-[#64748B] transition"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        <p className="text-center text-[10px] text-[#94A3B8] mt-6">
          By signing in you agree to our terms. Data stored securely on Supabase.
        </p>
      </div>
    </div>
  )
}
