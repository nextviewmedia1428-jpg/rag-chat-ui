'use client'

import { useEffect, useRef, useState } from 'react'

interface GNode {
  id: string
  type: string
  description: string
  degree: number
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
}

const PLACEHOLDER_NODES: GNode[] = [
  { id: 'Stellaris Group', type: 'organization', description: 'Parent conglomerate, ₹18,200 Cr revenue', degree: 8 },
  { id: 'HR Department', type: 'organization', description: 'Manages employee lifecycle', degree: 4 },
  { id: 'IT Department', type: 'organization', description: 'Infrastructure and L1/L2 helpdesk', degree: 4 },
  { id: 'Casual Leave', type: 'concept', description: '12 working days per year', degree: 2 },
  { id: 'StellarOps', type: 'product', description: 'B2B automation platform', degree: 3 },
  { id: 'VPN Policy', type: 'concept', description: 'Cisco AnyConnect, TOTP required', degree: 2 },
  { id: 'Meenakshi Nair', type: 'person', description: 'CFO, Stellaris Group', degree: 2 },
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
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const animRef      = useRef(0)
  const pulseRef     = useRef(0)
  const mouseRef     = useRef({ x: -9999, y: -9999 })
  const posRef       = useRef<Map<string, { x: number; y: number; vx: number; vy: number }>>(new Map())
  const nodesRef     = useRef<GNode[]>(PLACEHOLDER_NODES)
  const edgesRef     = useRef<GEdge[]>(PLACEHOLDER_EDGES)
  const hoveredRef   = useRef<string | null>(null)
  // ← live ref so the animation loop always reads the latest activated set
  const activatedRef = useRef<Set<string>>(new Set())

  const [tooltip, setTooltip] = useState<Tooltip | null>(null)
  const [loaded, setLoaded]   = useState(false)

  // Keep activatedRef in sync with prop — no re-render, no stale closure
  useEffect(() => {
    activatedRef.current = new Set(activatedIds.map(s => s.toLowerCase()))
  }, [activatedIds])

  // ── Fetch real graph ─────────────────────────────────────
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

        const topIds = new Set(
          [...degMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 50).map(([id]) => id)
        )

        nodesRef.current = (data.nodes as RawNode[])
          .filter(n => topIds.has(n.id))
          .map(n => ({
            id: n.id,
            type: n.properties?.entity_type ?? 'concept',
            description: (n.properties?.description ?? '').split('<SEP>')[0].slice(0, 140),
            degree: degMap.get(n.id) ?? 0,
          }))

        edgesRef.current = (data.edges as RawEdge[] ?? [])
          .filter(e => topIds.has(e.source) && topIds.has(e.target))
          .map(e => ({ source: e.source, target: e.target, label: e.properties?.keywords ?? '' }))

        posRef.current.clear()
        setLoaded(true)
      })
      .catch(() => {})
  }, [])

  // ── Canvas loop ──────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Store logical size separately for drawing coordinates
    let logW = 0, logH = 0

    const setup = () => {
      const dpr = window.devicePixelRatio || 1
      logW = canvas.offsetWidth
      logH = canvas.offsetHeight
      // Physical pixels = logical × dpr → crisp on retina
      canvas.width  = logW * dpr
      canvas.height = logH * dpr
      ctx.scale(dpr, dpr)

      nodesRef.current.forEach((n, i) => {
        if (!posRef.current.has(n.id)) {
          const a = (i / nodesRef.current.length) * Math.PI * 2
          const r = Math.min(logW, logH) * 0.3
          posRef.current.set(n.id, {
            x: logW / 2 + Math.cos(a) * r * (0.5 + Math.random() * 0.5),
            y: logH / 2 + Math.sin(a) * r * (0.5 + Math.random() * 0.5),
            vx: 0, vy: 0,
          })
        }
      })
    }
    setup()
    window.addEventListener('resize', setup)

    const tick = () => {
      const allNodes  = nodesRef.current
      const allEdges  = edgesRef.current
      const pos       = posRef.current
      const activated = activatedRef.current   // ← always fresh
      pulseRef.current += 0.025

      const isFiltered   = activated.size > 0
      const displayNodes = isFiltered ? allNodes.filter(n => activated.has(n.id.toLowerCase())) : allNodes
      const displaySet   = new Set(displayNodes.map(n => n.id))
      const displayEdges = allEdges.filter(e => displaySet.has(e.source) && displaySet.has(e.target))

      // — Physics on ALL nodes (positions stay stable when filter toggles) —
      allNodes.forEach(a => {
        const pa = pos.get(a.id); if (!pa) return
        allNodes.forEach(b => {
          if (a.id === b.id) return
          const pb = pos.get(b.id); if (!pb) return
          const dx = pa.x - pb.x, dy = pa.y - pb.y
          const d  = Math.sqrt(dx * dx + dy * dy) || 1
          const f  = 500 / (d * d)
          pa.vx += (dx / d) * f; pa.vy += (dy / d) * f
        })
        pa.vx += (logW / 2 - pa.x) * 0.005
        pa.vy += (logH / 2 - pa.y) * 0.005
      })
      allEdges.forEach(e => {
        const ps = pos.get(e.source), pt = pos.get(e.target)
        if (!ps || !pt) return
        const dx = pt.x - ps.x, dy = pt.y - ps.y
        const d  = Math.sqrt(dx * dx + dy * dy) || 1
        const f  = (d - 80) * 0.038
        ps.vx += (dx / d) * f; ps.vy += (dy / d) * f
        pt.vx -= (dx / d) * f; pt.vy -= (dy / d) * f
      })
      allNodes.forEach(n => {
        const p = pos.get(n.id); if (!p) return
        p.vx *= 0.86; p.vy *= 0.86
        p.x = Math.max(28, Math.min(logW - 28, p.x + p.vx))
        p.y = Math.max(28, Math.min(logH - 28, p.y + p.vy))
      })

      // — Draw —
      ctx.clearRect(0, 0, logW, logH)

      // Edges
      displayEdges.forEach(e => {
        const ps = pos.get(e.source), pt = pos.get(e.target)
        if (!ps || !pt) return
        ctx.beginPath()
        ctx.moveTo(ps.x, ps.y)
        ctx.lineTo(pt.x, pt.y)
        ctx.strokeStyle = isFiltered ? 'rgba(255,255,255,0.45)' : 'rgba(200,200,200,0.13)'
        ctx.lineWidth   = isFiltered ? 1.2 : 0.8
        ctx.stroke()

        // Relation label in filtered mode
        if (isFiltered && e.label) {
          const mx = (ps.x + pt.x) / 2, my = (ps.y + pt.y) / 2
          ctx.font      = '8px system-ui'
          ctx.fillStyle = 'rgba(150,220,210,0.75)'
          ctx.textAlign = 'center'
          ctx.fillText(e.label, mx, my - 3)
        }
      })

      // — Hover detection —
      let newHovered: string | null = null
      let nearDist = 28
      displayNodes.forEach(n => {
        const p = pos.get(n.id); if (!p) return
        const d = Math.sqrt((p.x - mouseRef.current.x) ** 2 + (p.y - mouseRef.current.y) ** 2)
        if (d < nearDist) { nearDist = d; newHovered = n.id }
      })
      if (newHovered !== hoveredRef.current) {
        hoveredRef.current = newHovered
        if (newHovered) {
          const p    = pos.get(newHovered)!
          const node = displayNodes.find(n => n.id === newHovered)!
          setTooltip({ x: p.x, y: p.y, flip: p.x > logW * 0.65, node })
        } else {
          setTooltip(null)
        }
      }

      // Nodes
      displayNodes.forEach((n, i) => {
        const p        = pos.get(n.id); if (!p) return
        const isHov    = n.id === hoveredRef.current
        const pulse    = Math.sin(pulseRef.current + i * 0.5) * 0.5 + 0.5
        const baseR    = isFiltered
          ? Math.max(5, Math.min(10, 4 + n.degree * 0.6))
          : Math.max(2.5, Math.min(7, 2 + n.degree * 0.45))
        const r = isHov ? baseR + 2 : baseR

        // Glow
        if (isFiltered || isHov) {
          const glowR = r + 10 + pulse * 6
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR)
          g.addColorStop(0, `rgba(255,255,255,${0.18 + pulse * 0.12})`)
          g.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.beginPath(); ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2)
          ctx.fillStyle = g; ctx.fill()
        }

        // Dot
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = (isFiltered || n.degree >= 4)
          ? `rgba(255,255,255,${0.88 + pulse * 0.12})`
          : `rgba(180,180,180,${0.55 + pulse * 0.1})`
        ctx.fill()

        // Label
        const showLabel = isFiltered || n.degree >= 4 || isHov
        if (showLabel) {
          const fs = isFiltered ? 11 : Math.max(9, Math.min(12, 8 + n.degree * 0.4))
          ctx.font        = `${isFiltered ? '500 ' : ''}${fs}px system-ui, sans-serif`
          ctx.textAlign   = 'center'
          ctx.shadowColor = 'rgba(0,0,0,0.95)'
          ctx.shadowBlur  = 7
          ctx.fillStyle   = isFiltered ? 'rgba(255,255,255,0.95)' : 'rgba(215,215,215,0.85)'
          ctx.fillText(n.id, p.x, p.y - r - 5)
          ctx.shadowBlur  = 0
        }
      })

      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', setup) }
  }, [loaded]) // eslint-disable-line react-hooks/exhaustive-deps

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect(); if (!rect) return
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }
  const onMouseLeave = () => {
    mouseRef.current = { x: -9999, y: -9999 }
    hoveredRef.current = null
    setTooltip(null)
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-[#080b0b] border border-white/[0.07]" style={{ height: 380 }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        style={{ imageRendering: 'pixelated' }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />

      {tooltip && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            left: tooltip.flip ? tooltip.x - 14 : tooltip.x + 14,
            top: Math.max(6, tooltip.y - 38),
            transform: tooltip.flip ? 'translateX(-100%)' : undefined,
          }}
        >
          <div className="rounded-lg bg-[#0d1515]/95 border border-white/10 backdrop-blur-sm px-3 py-2.5 shadow-2xl w-52">
            <div className="text-xs font-semibold text-white leading-snug mb-1">{tooltip.node.id}</div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[9px] text-teal-400 bg-teal-950/70 border border-teal-800/40 rounded px-1.5 py-0.5 uppercase tracking-wide">
                {tooltip.node.type}
              </span>
              <span className="text-[9px] text-gray-500">{tooltip.node.degree} link{tooltip.node.degree !== 1 ? 's' : ''}</span>
            </div>
            {tooltip.node.description && (
              <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-3">{tooltip.node.description}</p>
            )}
          </div>
        </div>
      )}

      <div className="absolute bottom-2.5 left-3">
        {activatedIds.length > 0
          ? <span className="text-[9px] text-white/40 font-mono">{activatedIds.length} nodes · last query subgraph</span>
          : <span className="text-[9px] text-white/20 font-mono">full knowledge graph · ask a question to focus</span>
        }
      </div>
    </div>
  )
}
