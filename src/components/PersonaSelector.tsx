'use client'

import { Persona, PERSONA_LABELS } from '@/lib/types'

interface Props {
  value: Persona
  onChange: (p: Persona) => void
}

export function PersonaSelector({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as Persona)}
      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {(Object.entries(PERSONA_LABELS) as [Persona, string][]).map(([key, label]) => (
        <option key={key} value={key}>{label}</option>
      ))}
    </select>
  )
}
