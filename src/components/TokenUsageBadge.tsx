'use client'

interface Props { remaining: number; limit: number }

export function TokenUsageBadge({ remaining, limit }: Props) {
  const pct = Math.round((remaining / limit) * 100)
  const color = pct > 50 ? '#1A6B3C' : pct > 20 ? '#E8A020' : '#FF4D3D'
  return (
    <div className="px-4 py-2 border-t border-[#E8E0D5] bg-[#FAF7F2]">
      <div className="flex justify-between text-[10px] font-mono text-[#6B5E52] mb-1">
        <span>Daily tokens</span>
        <span style={{ color }}>{remaining.toLocaleString()} remaining</span>
      </div>
      <div className="h-1 w-full rounded-full bg-[#E8E0D5]">
        <div className="h-1 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}
