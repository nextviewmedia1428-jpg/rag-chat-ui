'use client'

import { useState, KeyboardEvent } from 'react'

interface Props {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')

  function handleSend() {
    const msg = value.trim()
    if (!msg || disabled) return
    setValue('')
    onSend(msg)
  }

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-end gap-2 border-t border-gray-200 p-4">
      <textarea
        className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        rows={1}
        placeholder="Ask something about your documents…"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKey}
        disabled={disabled}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-40"
      >
        Send
      </button>
    </div>
  )
}
