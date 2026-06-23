'use client'

interface Props {
  remaining: number
  limit: number
}

export function TokenUsageBadge({ remaining, limit }: Props) {
  const pct = Math.round((remaining / limit) * 100)
  const color = pct > 50 ? 'text-green-600' : pct > 20 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="px-3 py-2 text-xs text-gray-500">
      <div className="flex justify-between mb-1">
        <span>Daily tokens</span>
        <span className={color}>{remaining.toLocaleString()} left</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-200">
        <div
          className={`h-1.5 rounded-full transition-all ${pct > 50 ? 'bg-green-500' : pct > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
