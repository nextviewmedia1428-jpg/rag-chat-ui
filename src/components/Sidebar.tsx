'use client'

import { useEffect, useState, useRef } from 'react'
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

interface Doc { id: string; filename: string; status: string }

export function Sidebar({ persona, onPersonaChange, systemPrompt, onSystemPromptChange }: Props) {
  const { signOut } = useAuth()
  const router   = useRouter()
  const pathname = usePathname()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [docs,          setDocs]          = useState<Doc[]>([])
  const [promptOpen,    setPromptOpen]    = useState(false)
  const [docsOpen,      setDocsOpen]      = useState(false)
  const [editingId,     setEditingId]     = useState<string | null>(null)
  const [editTitle,     setEditTitle]     = useState('')
  const editRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/conversations')
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return
        setConversations(data)
        // ponytail: intentionally do NOT auto-redirect to first conv — user lands on /chat and picks one
      })
    fetch('/api/documents')
      .then(r => r.json())
      .then(data => Array.isArray(data) && setDocs(data))
  }, [pathname, router])

  useEffect(() => {
    if (editingId) editRef.current?.focus()
  }, [editingId])

  async function newChat() {
    const res  = await fetch('/api/conversations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ persona }) })
    const conv = await res.json()
    router.push(`/chat/${conv.id}`)
    setConversations(prev => [conv, ...prev])
  }

  async function deleteConversation(id: string, e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation()
    await fetch(`/api/conversations?id=${id}`, { method: 'DELETE' })
    setConversations(prev => prev.filter(c => c.id !== id))
    if (pathname === `/chat/${id}`) router.push('/chat')
  }

  function startRename(c: Conversation, e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation()
    setEditingId(c.id); setEditTitle(c.title ?? '')
  }

  async function commitRename(id: string) {
    const title = editTitle.trim()
    setEditingId(null)
    if (!title) return
    await fetch('/api/conversations', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, title }) })
    setConversations(prev => prev.map(c => c.id === id ? { ...c, title } : c))
  }

  return (
    <aside className="flex w-64 flex-col border-r border-[#E8E0D5] bg-[#FAF7F2] h-full">
      {/* Header */}
      <div className="p-3 border-b border-[#E8E0D5]">
        <Link href="/" className="block font-serif italic text-[15px] text-[#1C1510] mb-3 hover:text-[#1A6B3C] transition">
          ← i<span className="text-[#1A6B3C]">Know</span>It
        </Link>
        <button onClick={newChat}
          className="w-full rounded-xl bg-[#1A6B3C] hover:bg-[#15572f] px-3 py-2.5 text-sm font-semibold text-white transition shadow-sm shadow-[rgba(26,107,60,0.2)]">
          + New Chat
        </button>
      </div>

      {/* Persona */}
      <div className="p-3 border-b border-[#E8E0D5]">
        <label className="block text-[10px] font-mono text-[#6B5E52] mb-1.5 uppercase tracking-widest">Assistant style</label>
        <select value={persona} onChange={e => onPersonaChange(e.target.value as Persona)}
          className="w-full rounded-xl border border-[#E8E0D5] bg-white px-3 py-2 text-sm text-[#1C1510] focus:outline-none focus:border-[rgba(26,107,60,0.4)] transition">
          {Object.entries(PERSONA_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <button onClick={() => setPromptOpen(o => !o)}
          className="mt-2.5 w-full flex items-center justify-between text-[11px] text-[#6B5E52] hover:text-[#1C1510] transition">
          <span>AI instructions</span>
          <span className="font-mono">{promptOpen ? '▲' : '▼'}</span>
        </button>
        {promptOpen && (
          <textarea value={systemPrompt} onChange={e => onSystemPromptChange(e.target.value)} rows={5}
            placeholder="Describe how the assistant should behave…"
            className="mt-1.5 w-full rounded-xl border border-[#E8E0D5] bg-white px-3 py-2 text-xs text-[#1C1510] resize-none focus:outline-none focus:border-[rgba(26,107,60,0.4)] transition placeholder:text-[#6B5E52]/40" />
        )}
      </div>

      {/* Conversations */}
      <nav className="flex-1 overflow-y-auto p-2">
        <p className="px-2 py-1.5 text-[10px] font-mono text-[#6B5E52] uppercase tracking-widest">Conversations</p>
        {conversations.length === 0 && (
          <p className="px-3 py-2 text-xs text-[#6B5E52]">Upload a document, then start your first chat.</p>
        )}
        {conversations.map(c => (
          <div key={c.id} className="group flex items-center">
            {editingId === c.id ? (
              <input ref={editRef} value={editTitle} onChange={e => setEditTitle(e.target.value)}
                onBlur={() => commitRename(c.id)}
                onKeyDown={e => { if (e.key === 'Enter') commitRename(c.id); if (e.key === 'Escape') setEditingId(null) }}
                className="flex-1 mx-1 rounded-xl border border-[rgba(26,107,60,0.4)] bg-white px-3 py-1.5 text-sm text-[#1C1510] focus:outline-none"
              />
            ) : (
              <Link href={`/chat/${c.id}`}
                className={`flex-1 truncate rounded-xl px-3 py-2 text-sm transition ${
                  pathname === `/chat/${c.id}` ? 'bg-[#EBF5EF] text-[#1A6B3C] font-medium' : 'text-[#1C1510] hover:bg-white hover:shadow-sm'
                }`}>
                {c.title || 'Untitled'}
              </Link>
            )}
            <div className="mr-1 hidden group-hover:flex gap-0.5 flex-shrink-0">
              <button onClick={e => startRename(c, e)} title="Rename"
                className="rounded-lg p-1 text-[#6B5E52] hover:text-[#1A6B3C] transition text-xs">✏</button>
              <button onClick={e => deleteConversation(c.id, e)} title="Delete"
                className="rounded-lg p-1 text-[#6B5E52] hover:text-[#FF4D3D] transition">×</button>
            </div>
          </div>
        ))}
      </nav>

      {/* My Documents */}
      {docs.length > 0 && (
        <div className="border-t border-[#E8E0D5] p-2">
          <button onClick={() => setDocsOpen(o => !o)}
            className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-mono text-[#6B5E52] uppercase tracking-widest hover:text-[#1C1510] transition">
            <span>My Documents ({docs.length})</span>
            <span>{docsOpen ? '▲' : '▼'}</span>
          </button>
          {docsOpen && docs.map(d => (
            <div key={d.id} className="flex items-center gap-2 px-2 py-1.5">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${d.status === 'ready' ? 'bg-[#1A6B3C]' : 'bg-[#E8A020] animate-pulse'}`} />
              <span className="text-xs text-[#1C1510] truncate">{d.filename}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-[#E8E0D5] flex gap-2">
        <Link href="/upload"
          className="flex-1 rounded-xl border border-[#E8E0D5] bg-white hover:border-[rgba(26,107,60,0.3)] hover:bg-[#EBF5EF] px-3 py-2 text-xs text-center text-[#1C1510] transition">
          Add document
        </Link>
        <button onClick={signOut}
          className="flex-1 rounded-xl border border-[#E8E0D5] bg-white hover:bg-[#FAF7F2] px-3 py-2 text-xs text-[#1C1510] transition">
          Sign out
        </button>
      </div>
    </aside>
  )
}
