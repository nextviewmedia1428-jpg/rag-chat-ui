'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Conversation, Persona, PERSONA_LABELS } from '@/lib/types'
import { useAuth } from './AuthProvider'

interface Props {
  persona: Persona
  onPersonaChange: (p: Persona) => void
  systemPrompt: string
  onSystemPromptChange: (s: string) => void
}

export function Sidebar({ persona, onPersonaChange, systemPrompt, onSystemPromptChange }: Props) {
  const { signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [promptOpen, setPromptOpen] = useState(false)

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

  async function deleteConversation(id: string, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    await fetch(`/api/conversations?id=${id}`, { method: 'DELETE' })
    setConversations(prev => prev.filter(c => c.id !== id))
    if (pathname === `/chat/${id}`) router.push('/chat')
  }

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-gray-50 h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <Link href="/" className="block text-xs font-semibold text-gray-500 mb-2 hover:text-gray-800 transition">← Back to home</Link>
        <button
          onClick={newChat}
          className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          + New Chat
        </button>
      </div>

      {/* Persona */}
      <div className="p-3 border-b border-gray-200">
        <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Persona</label>
        <select
          value={persona}
          onChange={e => onPersonaChange(e.target.value as Persona)}
          className="w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(PERSONA_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        {/* Collapsible system prompt */}
        <button
          onClick={() => setPromptOpen(o => !o)}
          className="mt-2 w-full flex items-center justify-between text-xs text-gray-400 hover:text-gray-600 transition"
        >
          <span>System prompt</span>
          <span>{promptOpen ? '▲' : '▼'}</span>
        </button>
        {promptOpen && (
          <textarea
            value={systemPrompt}
            onChange={e => onSystemPromptChange(e.target.value)}
            rows={5}
            placeholder="Describe how the assistant should behave…"
            className="mt-1 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      {/* Conversations */}
      <nav className="flex-1 overflow-y-auto p-2">
        <p className="px-1 py-1 text-xs text-gray-400 uppercase tracking-wide">Conversations</p>
        {conversations.length === 0 && (
          <p className="px-2 py-2 text-xs text-gray-400">No chats yet</p>
        )}
        {conversations.map(c => (
          <div key={c.id} className="group flex items-center">
            <Link
              href={`/chat/${c.id}`}
              className={`flex-1 truncate rounded-lg px-3 py-2 text-sm transition hover:bg-gray-200 ${pathname === `/chat/${c.id}` ? 'bg-gray-200 font-medium' : 'text-gray-700'}`}
            >
              {c.title}
            </Link>
            <button
              onClick={e => deleteConversation(c.id, e)}
              className="mr-1 hidden group-hover:block rounded p-1 text-gray-400 hover:text-red-500 transition"
              title="Delete"
            >
              ×
            </button>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 flex gap-2">
        <Link
          href="/upload"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-xs text-center text-gray-600 hover:bg-gray-100 transition"
        >
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
