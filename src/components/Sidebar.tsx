'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Conversation, Persona } from '@/lib/types'
import { PersonaSelector } from './PersonaSelector'
import { useAuth } from './AuthProvider'

interface Props {
  persona: Persona
  onPersonaChange: (p: Persona) => void
}

export function Sidebar({ persona, onPersonaChange }: Props) {
  const { signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [conversations, setConversations] = useState<Conversation[]>([])

  useEffect(() => {
    fetch('/api/conversations')
      .then(r => r.json())
      .then(data => Array.isArray(data) && setConversations(data))
  }, [pathname])

  async function newChat() {
    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ persona }),
    })
    const conv = await res.json()
    router.push(`/chat/${conv.id}`)
    setConversations(prev => [conv, ...prev])
  }

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-gray-50 h-full">
      <div className="p-3 border-b border-gray-200">
        <button
          onClick={newChat}
          className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          + New Chat
        </button>
      </div>

      <div className="p-3 border-b border-gray-200">
        <label className="block text-xs text-gray-500 mb-1">Persona</label>
        <PersonaSelector value={persona} onChange={onPersonaChange} />
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {conversations.map(c => (
          <Link
            key={c.id}
            href={`/chat/${c.id}`}
            className={`block truncate rounded-lg px-3 py-2 text-sm transition hover:bg-gray-200 ${pathname === `/chat/${c.id}` ? 'bg-gray-200 font-medium' : 'text-gray-700'}`}
          >
            {c.title}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-200 flex gap-2">
        <Link href="/upload" className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-xs text-center text-gray-600 hover:bg-gray-100 transition">
          Upload PDF
        </Link>
        <button
          onClick={signOut}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-600 hover:bg-gray-100 transition"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
