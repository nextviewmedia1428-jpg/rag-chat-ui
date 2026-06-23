'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { Sidebar } from '@/components/Sidebar'
import { Persona } from '@/lib/types'
import { useEffect } from 'react'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()
  const [persona, setPersona] = useState<Persona>('assistant')

  useEffect(() => {
    if (user === null) router.push('/login')
  }, [user, router])

  if (!user) return null

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar persona={persona} onPersonaChange={setPersona} />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
