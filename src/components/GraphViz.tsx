'use client'

import { useEffect, useRef, useState } from 'react'

interface GNode {
  id: string
  type: string
  description: string
}

interface GEdge {
  source: string
  target: string
  label: string
}

interface Tooltip {
  x: number
  y: number
  flip: boolean
  node: GNode
  degree: number
}

// Colour per entity type
function dotColor(type: string, activated: boolean): string {
  if (activated) return 'rgba(255,255,255,0.95)'
  const map: Record<string, string> = {
    organization: 'rgba(94,234,212,0.80)',
    person:       'rgba(167,139,250,0.80)',
    concept:      'rgba(96,165,250,0.70)',
    product:      'rgba(52,211,153,0.70)',
    process:      'rgba(251,191,36,0.70)',
    event:        'rgba(248,113,113,0.70)',
  }
  return map[type] ?? 'rgba(94,234,212,0.60)'
}

const PLACEHOLDER_NODES: GNode[] = [
  { id: 'Stellaris Group', type: 'organization', description: 'Parent conglomerate, ₹18,200 Cr revenue' },
  { id: 'HR Department', type: 'organization', description: 'Manages employee lifecycle and benefits' },
  { id: 'IT Department', type: 'organization', description: 'Infrastructure and L1/L2 helpdesk' },
  { id: 'Casual Leave', type: 'concept', description: '12 working days per year' },
  { id: 'StellarOps', type: 'product', description: 'B2B automation platform, three tiers' },
  { id: 'VPN Policy', type: 'concept', description: 'Cisco AnyConnect, TOTP required' },
  { id: 'Meenakshi Nair', type: 'person', description: 'CFO, Stellaris Group' },
]
const PLACEHOLDER_EDGES: GEdge[] = [
  { source: 'Stellaris Group', target: 'HR Department', label: 'has' },
  { source: 'Stellaris Group', target: 'IT Department', label: 'has' },
  { source: 'HR Department', target: 'Casual Leave', label: 'administers' },
  { source: 'IT Department', target: 'VPN Policy', label: 'enforces' },
  { source: 'Stellaris Group', target: 'StellarOps', label: 'produces' },
  { source: 'Stellaris Group', target: 'Meenakshi Nair', label: 'employs' },
]

export function GraphViz({ activatedIds = [] }: { activatedIds?: string[] }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const animRef    = useRef(0)
  const pulseRef   = useRef(0)
  const mouseRef   = useRef({ x: -9999, y: -9999 })
  const posRef     = useRef<Map<string, { x: number; y: number; vx: number; vy: number }>>(new Map())
  const nodesRef   = useRef<GNode[]>(PLACEHOLDER_NODES)
  const edgesRef   = useRef<GEdge[]>(PLACEHOLDER_EDGES)
  const degreeRef  = useRef<Map<string, number>>(new Map())
  const hoveredRef = useRef<string | null>(null)

  const [tooltip, setTooltip]       = useState<Tooltip | null>(null)
  const [graphLoaded, setLoaded]    = useState(false)
  const activatedSet = new Set(activatedIds.map(s => s.toLowerCase()))

  // ── Fetch real graph ──────────────────────────────────────
  useEffect(() => {
    fetch('/api/graph')
      .then(r => r.json())
      .then((data: { nodes?: unknown[]; edges?: unknown[] }) => {
        if (!data.nodes?.length) return

        type RawNode = { id: string; properties?: { entity_type?: string; description?: string } }
        type RawEdge = { source: string; target: string; properties?: { keywords?: string } }

        const degMap = new Map<string, number>()
        ;(data.nodes as RawNode[]).forEach(n => degMap.set(n.id, 0))
        ;(data.edges as RawEdge[] ?? []).forEach(e => {
          degMap.set(e.source, (degMap.get(e.source) ?? 0) + 1)
          degMap.set(e.target, (degMap.get(e.target) ?? 0) + 1)
        })

        // top 50 by degree
        const topIds = new Set(
          [...degMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 50).map(([id]) => id)
        )

        nodesRef.current = (data.nodes as RawNode[])
          .filter(n => topIds.has(n.id))
          .map(n => ({
            id: n.id,
            type: n.properties?.entity_type ?? 'concept',
            description: (n.properties?.description ?? '').split('<SEP>')[0].slice(0, 130),
          }))

        edgesRef.current = (data.edges as RawEdge[] ?? [])
          .filter(e => topIds.has(e.source) && topIds.has(e.target))
          .map(e => ({ source: e.source, target: e.target, label: e.properties?.keywords ?? '' }))

        degreeRef.current = degMap
        posRef.current.clear()
        setLoaded(true)
      })
      .catch(() => {})
  }, [])

  // ── Canvas loop ───────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setup = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const W = canvas.width, H = canvas.height
      nodesRef.current.forEach((n, i) => {
        if (!posRef.current.has(n.id)) {
          const a = (i / nodesRef.current.length) * Math.PI * 2
          const r = Math.min(W, H) * 0.33
          posRef.current.set(n.id, {
            x: W / 2 + Math.cos(a) * r * (0.4 + Math.random() * 0.6),
            y: H / 2 + Math.sin(a) * r * (0.4 + Math.random() * 0.6),
            vx: 0, vy: 0,
          })
        }
      })
    }
    setup()
    window.addEventListener('resize', setup)

    const tick = () => {
      const nodes = nodesRef.current
      const edges = edgesRef.current
      const pos   = posRef.current
      const W     = canvas.width
      const H     = canvas.height
      pulseRef.current += 0.022

      // — Physics —
      nodes.forEach(a => {
        const pa = pos.get(a.id); if (!pa) return
        nodes.forEach(b => {
          if (a.id === b.id) return
          const pb = pos.get(b.id); if (!pb) return
          const dx = pa.x - pb.x, dy = pa.y - pb.y
          const d  = Math.sqrt(dx * dx + dy * dy) || 1
          const f  = 550 / (d * d)
          pa.vx += (dx / d) * f; pa.vy += (dy / d) * f
        })
        pa.vx += (W / 2 - pa.x) * 0.004
        pa.vy += (H / 2 - pa.y) * 0.004
      })
      edges.forEach(e => {
        const ps = pos.get(e.source), pt = pos.get(e.target)
        if (!ps || !pt) return
        const dx = pt.x - ps.x, dy = pt.y - ps.y
        const d  = Math.sqrt(dx * dx + dy * dy) || 1
        const f  = (d - 72) * 0.042
        ps.vx += (dx / d) * f; ps.vy += (dy / d) * f
        pt.vx -= (dx / d) * f; pt.vy -= (dy / d) * f
      })
      nodes.forEach(n => {
        const p = pos.get(n.id); if (!p) return
        p.vx *= 0.87; p.vy *= 0.87
        p.x = Math.max(18, Math.min(W - 18, p.x + p.vx))
        p.y = Math.max(18, Math.min(H - 18, p.y + p.vy))
      })

      // — Draw —
      ctx.clearRect(0, 0, W, H)

      // edges
      edges.forEach(e => {
        const ps = pos.get(e.source), pt = pos.get(e.target)
        if (!ps || !pt) return
        const aAct = activatedSet.has(e.source.toLowerCase())
        const bAct = activatedSet.has(e.target.toLowerCase())
        ctx.beginPath()
        ctx.moveTo(ps.x, ps.y)
        ctx.lineTo(pt.x, pt.y)
        ctx.strokeStyle = (aAct && bAct) ? 'rgba(94,234,212,0.60)' : 'rgba(94,234,212,0.09)'
        ctx.lineWidth   = (aAct && bAct) ? 1.4 : 0.7
        ctx.stroke()
      })

      // nodes
      let newHovered: string | null = null
      let nearDist = 26
      nodes.forEach(n => {
        const p = pos.get(n.id); if (!p) return
        const d = Math.sqrt((p.x - mouseRef.current.x) ** 2 + (p.y - mouseRef.current.y) ** 2)
        if (d < nearDist) { nearDist = d; newHovered = n.id }
      })

      if (newHovered !== hoveredRef.current) {
        hoveredRef.current = newHovered
        if (newHovered) {
          const p = pos.get(newHovered)!
          const node = nodes.find(n => n.id === newHovered)!
          const flipX = p.x > W * 0.65
          setTooltip({ x: p.x, y: p.y, flip: flipX, node, degree: degreeRef.current.get(newHovered) ?? 0 })
        } else {
          setTooltip(null)
        }
      }

      nodes.forEach((n, i) => {
        const p = pos.get(n.id); if (!p) return
        const isAct     = activatedSet.has(n.id.toLowerCase())
        const isHovered = n.id === hoveredRef.current
        const pulse     = Math.sin(pulseRef.current + i * 0.45) * 0.5 + 0.5
        const color     = dotColor(n.type, isAct)
        const r         = isAct ? 6.5 + pulse * 1.2 : isHovered ? 5.5 : 3.5

        // glow
        if (isAct) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 22 + pulse * 7)
          g.addColorStop(0, `rgba(94,234,212,${0.5 + pulse * 0.35})`)
          g.addColorStop(1, 'rgba(94,234,212,0)')
          ctx.beginPath(); ctx.arc(p.x, p.y, 22 + pulse * 7, 0, Math.PI * 2)
          ctx.fillStyle = g; ctx.fill()
        } else if (isHovered) {
          ctx.beginPath(); ctx.arc(p.x, p.y, 13, 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(94,234,212,0.35)'; ctx.lineWidth = 1.5; ctx.stroke()
        }

        // dot
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = color; ctx.fill()
      })

      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', setup) }
  // ponytail: re-run when graph loads so new nodes get positions
  }, [graphLoaded]) // eslint-disable-line react-hooks/exhaustive-deps

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = canvasRef.current?.getBoundingClientRect()
    if (!r) return
    mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  const onMouseLeave = () => {
    mouseRef.current = { x: -9999, y: -9999 }
    hoveredRef.current = null
    setTooltip(null)
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-[#070c0c] border border-teal-900/30" style={{ height: 380 }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />

      {/* Obsidian-style tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-20 transition-none"
          style={{
            left:  tooltip.flip ? tooltip.x - 14 : tooltip.x + 14,
            top:   Math.max(6, tooltip.y - 36),
            transform: tooltip.flip ? 'translateX(-100%)' : undefined,
          }}
        >
          <div className="rounded-lg bg-[#0e1a1a]/95 border border-teal-700/40 backdrop-blur-sm px-3 py-2.5 shadow-2xl w-52">
            <div className="text-xs font-semibold text-white leading-snug mb-1">{tooltip.node.id}</div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[9px] text-teal-400 bg-teal-950/70 border border-teal-800/40 rounded px-1.5 py-0.5 uppercase tracking-wide">
                {tooltip.node.type}
              </span>
              {tooltip.degree > 0 && (
                <span className="text-[9px] text-gray-500">{tooltip.degree} connection{tooltip.degree !== 1 ? 's' : ''}</span>
              )}
            </div>
            {tooltip.node.description && (
              <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-3">{tooltip.node.description}</p>
            )}
          </div>
        </div>
      )}

      {/* Type legend */}
      <div className="absolute top-2.5 right-3 flex flex-col gap-1 opacity-70">
        {[
          { type: 'organization', color: 'bg-teal-400' },
          { type: 'person',       color: 'bg-violet-400' },
          { type: 'concept',      color: 'bg-blue-400' },
          { type: 'product',      color: 'bg-emerald-400' },
        ].map(({ type, color }) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
            <span className="text-[9px] text-gray-600">{type}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="absolute bottom-2 left-3 flex items-center gap-3">
        <span className="text-[9px] text-teal-700/60 font-mono">GraphRAG · knowledge graph</span>
        {activatedIds.length > 0 && (
          <span className="text-[9px] text-teal-400/80 font-mono">{activatedIds.length} nodes lit</span>
        )}
      </div>
    </div>
  )
}
