'use client'

import { useEffect, useRef, useState } from 'react'

interface GNode {
  id: string
  type: string
  description: string
  filePath: string
  degree: number
}

interface GEdge { source: string; target: string; label: string }

interface Tooltip { sx: number; sy: number; flip: boolean; node: GNode }

const PH_NODES: GNode[] = [
  { id: 'Stellaris Group', type: 'organization', description: 'Parent conglomerate founded 1989, Nariman Point Mumbai. ₹18,200 Cr revenue, 31,000+ employees across 6 business verticals. Listed on BSE & NSE.', filePath: '', degree: 8 },
  { id: 'HR Department',   type: 'organization', description: 'Manages employee lifecycle, leave policies, onboarding, benefits, and HR grievances.', filePath: '', degree: 4 },
  { id: 'IT Department',   type: 'organization', description: 'Infrastructure and helpdesk team handling L1/L2 tickets, VPN, device management.', filePath: '', degree: 4 },
  { id: 'Casual Leave',    type: 'concept',      description: '12 working days per financial year. Cannot be carried forward. Application must be submitted 24 hrs in advance.', filePath: '', degree: 2 },
  { id: 'StellarOps',      type: 'product',      description: 'B2B automation platform. Available in Starter (₹8,500/mo), Growth (₹22,000/mo), Enterprise (custom) tiers.', filePath: '', degree: 3 },
  { id: 'VPN Policy',      type: 'concept',      description: 'Cisco AnyConnect. TOTP required. Must be reset via portal.stellaris.com before raising an IT ticket.', filePath: '', degree: 2 },
  { id: 'Meenakshi Nair',  type: 'person',       description: 'CFO, Stellaris Group. Reports to the Board. Oversees Finance Controller and treasury operations.', filePath: '', degree: 2 },
]
const PH_EDGES: GEdge[] = [
  { source: 'Stellaris Group', target: 'HR Department',  label: 'has' },
  { source: 'Stellaris Group', target: 'IT Department',  label: 'has' },
  { source: 'HR Department',   target: 'Casual Leave',   label: 'administers' },
  { source: 'IT Department',   target: 'VPN Policy',     label: 'enforces' },
  { source: 'Stellaris Group', target: 'StellarOps',     label: 'produces' },
  { source: 'Stellaris Group', target: 'Meenakshi Nair', label: 'employs' },
]

export function GraphViz({ activatedIds = [] }: { activatedIds?: string[] }) {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const animRef      = useRef(0)
  const pulseRef     = useRef(0)
  const posRef       = useRef<Map<string, { x: number; y: number; vx: number; vy: number }>>(new Map())
  const nodesRef     = useRef<GNode[]>(PH_NODES)
  const edgesRef     = useRef<GEdge[]>(PH_EDGES)
  const hoveredRef   = useRef<string | null>(null)
  const activatedRef = useRef<Set<string>>(new Set())

  // View state — pan + zoom
  const viewRef  = useRef({ x: 0, y: 0, scale: 1, dpr: 1 })
  const logRef   = useRef({ w: 0, h: 0 })

  // Drag state
  const dragRef  = useRef<{ active: boolean; sx: number; sy: number; ox: number; oy: number }>({ active: false, sx: 0, sy: 0, ox: 0, oy: 0 })
  // Mouse screen coords (raw, no transform)
  const mouseRef = useRef({ x: -9999, y: -9999 })

  const [tooltip,      setTooltip]      = useState<Tooltip | null>(null)
  const [selectedNode, setSelectedNode] = useState<GNode | null>(null)
  const [loaded,       setLoaded]       = useState(false)
  const [cursor,       setCursor]       = useState<'crosshair' | 'pointer' | 'grab' | 'grabbing'>('crosshair')

  // Keep activatedRef live — animation loop reads this every frame
  useEffect(() => {
    activatedRef.current = new Set(activatedIds.map(s => s.toLowerCase()))
  }, [activatedIds])

  // ── Fetch real graph ─────────────────────────────────────────
  useEffect(() => {
    fetch('/api/graph')
      .then(r => r.json())
      .then((data: { nodes?: unknown[]; edges?: unknown[] }) => {
        if (!data.nodes?.length) return
        type RN = { id: string; properties?: { entity_type?: string; description?: string; file_path?: string } }
        type RE = { source: string; target: string; properties?: { keywords?: string } }

        const deg = new Map<string, number>()
        ;(data.nodes as RN[]).forEach(n => deg.set(n.id, 0))
        ;(data.edges as RE[] ?? []).forEach(e => {
          deg.set(e.source, (deg.get(e.source) ?? 0) + 1)
          deg.set(e.target, (deg.get(e.target) ?? 0) + 1)
        })
        const top = new Set([...deg.entries()].sort((a, b) => b[1] - a[1]).slice(0, 50).map(([id]) => id))

        nodesRef.current = (data.nodes as RN[]).filter(n => top.has(n.id)).map(n => ({
          id: n.id,
          type: n.properties?.entity_type ?? 'concept',
          description: (n.properties?.description ?? '').split('<SEP>').join('\n\n'),
          filePath: (n.properties?.file_path ?? '').split('<SEP>')[0],
          degree: deg.get(n.id) ?? 0,
        }))
        edgesRef.current = (data.edges as RE[] ?? [])
          .filter(e => top.has(e.source) && top.has(e.target))
          .map(e => ({ source: e.source, target: e.target, label: e.properties?.keywords ?? '' }))

        posRef.current.clear()
        setLoaded(true)
      })
      .catch(() => {})
  }, [])

  // ── Canvas loop ───────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setup = () => {
      const dpr = window.devicePixelRatio || 1
      const lw  = canvas.offsetWidth  || 260   // ponytail: fallback prevents all nodes init at (0,0)
      const lh  = canvas.offsetHeight || 380
      viewRef.current.dpr = dpr
      logRef.current = { w: lw, h: lh }
      canvas.width  = lw * dpr
      canvas.height = lh * dpr

      nodesRef.current.forEach((n, i) => {
        if (!posRef.current.has(n.id)) {
          const a = (i / nodesRef.current.length) * Math.PI * 2
          const r = Math.min(lw, lh) * 0.3
          posRef.current.set(n.id, {
            x: lw / 2 + Math.cos(a) * r * (0.4 + Math.random() * 0.6),
            y: lh / 2 + Math.sin(a) * r * (0.4 + Math.random() * 0.6),
            vx: 0, vy: 0,
          })
        }
      })
    }
    setup()
    window.addEventListener('resize', setup)

    const tick = () => {
      const { dpr }  = viewRef.current
      const { w: lw, h: lh } = logRef.current
      const view     = viewRef.current
      const allNodes = nodesRef.current
      const allEdges = edgesRef.current
      const pos      = posRef.current
      const activated = activatedRef.current
      pulseRef.current += 0.025

      const isFiltered   = activated.size > 0
      const displayNodes = isFiltered ? allNodes.filter(n => activated.has(n.id.toLowerCase())) : allNodes
      const displaySet   = new Set(displayNodes.map(n => n.id))
      const displayEdges = allEdges.filter(e => displaySet.has(e.source) && displaySet.has(e.target))

      // — Physics on all nodes —
      allNodes.forEach(a => {
        const pa = pos.get(a.id); if (!pa) return
        allNodes.forEach(b => {
          if (a.id === b.id) return
          const pb = pos.get(b.id); if (!pb) return
          const dx = pa.x - pb.x, dy = pa.y - pb.y
          const d2 = dx * dx + dy * dy
          if (d2 < 0.01) {
            // nodes at same position — random nudge so repulsion can act
            pa.vx += (Math.random() - 0.5) * 3; pa.vy += (Math.random() - 0.5) * 3
            return
          }
          const d = Math.sqrt(d2)
          const f = 500 / d2
          pa.vx += (dx / d) * f; pa.vy += (dy / d) * f
        })
        pa.vx += (lw / 2 - pa.x) * 0.005
        pa.vy += (lh / 2 - pa.y) * 0.005
      })
      allEdges.forEach(e => {
        const ps = pos.get(e.source), pt = pos.get(e.target)
        if (!ps || !pt) return
        const dx = pt.x - ps.x, dy = pt.y - ps.y
        const d = Math.sqrt(dx * dx + dy * dy) || 1
        const f = (d - 80) * 0.038
        ps.vx += (dx / d) * f; ps.vy += (dy / d) * f
        pt.vx -= (dx / d) * f; pt.vy -= (dy / d) * f
      })
      allNodes.forEach(n => {
        const p = pos.get(n.id); if (!p) return
        p.vx *= 0.86; p.vy *= 0.86
        p.x = Math.max(28, Math.min(lw - 28, p.x + p.vx))
        p.y = Math.max(28, Math.min(lh - 28, p.y + p.vy))
      })

      // — Render: reset to DPR base, then apply view transform —
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, lw, lh)
      ctx.translate(view.x, view.y)
      ctx.scale(view.scale, view.scale)

      // Edges
      displayEdges.forEach(e => {
        const ps = pos.get(e.source), pt = pos.get(e.target)
        if (!ps || !pt) return
        ctx.beginPath(); ctx.moveTo(ps.x, ps.y); ctx.lineTo(pt.x, pt.y)
        ctx.strokeStyle = isFiltered ? 'rgba(255,255,255,0.45)' : 'rgba(200,200,200,0.13)'
        ctx.lineWidth   = (isFiltered ? 1.2 : 0.8) / view.scale
        ctx.stroke()
        if (isFiltered && e.label) {
          const mx = (ps.x + pt.x) / 2, my = (ps.y + pt.y) / 2
          ctx.font      = `${8 / view.scale}px system-ui`
          ctx.fillStyle = 'rgba(150,220,210,0.75)'
          ctx.textAlign = 'center'
          ctx.fillText(e.label, mx, my - 3 / view.scale)
        }
      })

      // — Hover detection in world space —
      const wx = (mouseRef.current.x - view.x) / view.scale
      const wy = (mouseRef.current.y - view.y) / view.scale
      const hitR = 20 / view.scale

      let newHovered: string | null = null, nearDist = hitR
      displayNodes.forEach(n => {
        const p = pos.get(n.id); if (!p) return
        const d = Math.sqrt((p.x - wx) ** 2 + (p.y - wy) ** 2)
        if (d < nearDist) { nearDist = d; newHovered = n.id }
      })
      if (newHovered !== hoveredRef.current) {
        hoveredRef.current = newHovered
        if (newHovered) {
          const p    = pos.get(newHovered)!
          const node = displayNodes.find(n => n.id === newHovered)!
          // Convert world → screen for tooltip position
          const sx = p.x * view.scale + view.x
          const sy = p.y * view.scale + view.y
          setTooltip({ sx, sy, flip: sx > lw * 0.65, node })
          setCursor('pointer')
        } else {
          setTooltip(null)
          setCursor(dragRef.current.active ? 'grabbing' : 'crosshair')
        }
      }

      // Nodes
      displayNodes.forEach((n, i) => {
        const p = pos.get(n.id); if (!p) return
        const isHov  = n.id === hoveredRef.current
        const pulse  = Math.sin(pulseRef.current + i * 0.5) * 0.5 + 0.5
        const baseR  = isFiltered
          ? Math.max(5, Math.min(10, 4 + n.degree * 0.6))
          : Math.max(2.5, Math.min(7, 2 + n.degree * 0.45))
        const r = isHov ? baseR + 2 : baseR

        if (isFiltered || isHov) {
          const gr = (r + 10 + pulse * 6) / view.scale
          const g  = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, gr)
          g.addColorStop(0, `rgba(255,255,255,${0.18 + pulse * 0.12})`)
          g.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.beginPath(); ctx.arc(p.x, p.y, gr, 0, Math.PI * 2)
          ctx.fillStyle = g; ctx.fill()
        }

        ctx.beginPath(); ctx.arc(p.x, p.y, r / view.scale, 0, Math.PI * 2)
        ctx.fillStyle = (isFiltered || n.degree >= 4)
          ? `rgba(255,255,255,${0.88 + pulse * 0.12})`
          : `rgba(180,180,180,${0.55 + pulse * 0.1})`
        ctx.fill()

        // Click ring on selected
        if (selectedNode?.id === n.id) {
          ctx.beginPath(); ctx.arc(p.x, p.y, (r + 4) / view.scale, 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(94,234,212,0.8)'; ctx.lineWidth = 1.5 / view.scale; ctx.stroke()
        }

        const showLabel = isFiltered || n.degree >= 4 || isHov
        if (showLabel) {
          const fs = (isFiltered ? 11 : Math.max(9, Math.min(12, 8 + n.degree * 0.4))) / view.scale
          ctx.font        = `${isFiltered ? '500 ' : ''}${fs}px system-ui, sans-serif`
          ctx.textAlign   = 'center'
          ctx.shadowColor = 'rgba(0,0,0,0.95)'
          ctx.shadowBlur  = 6
          ctx.fillStyle   = isFiltered ? 'rgba(255,255,255,0.95)' : 'rgba(215,215,215,0.85)'
          ctx.fillText(n.id, p.x, p.y - (r + 5) / view.scale)
          ctx.shadowBlur  = 0
        }
      })

      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', setup) }
  }, [loaded]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Pointer handlers ──────────────────────────────────────────
  const toScreenCoords = (e: React.MouseEvent | React.WheelEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = toScreenCoords(e)
    mouseRef.current = { x, y }
    if (dragRef.current.active) {
      viewRef.current.x = dragRef.current.ox + (x - dragRef.current.sx)
      viewRef.current.y = dragRef.current.oy + (y - dragRef.current.sy)
      setCursor('grabbing')
    }
  }

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = toScreenCoords(e)
    dragRef.current = { active: true, sx: x, sy: y, ox: viewRef.current.x, oy: viewRef.current.y }
    setCursor('grabbing')
  }

  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current
    const { x, y } = toScreenCoords(e)
    // Only fire click if mouse didn't move much (not a drag)
    const moved = Math.sqrt((x - drag.sx) ** 2 + (y - drag.sy) ** 2)
    if (drag.active && moved < 5) {
      // Click — find node in world space
      const view = viewRef.current
      const wx = (x - view.x) / view.scale
      const wy = (y - view.y) / view.scale
      const activated = activatedRef.current
      const isFiltered = activated.size > 0
      const displayNodes = isFiltered ? nodesRef.current.filter(n => activated.has(n.id.toLowerCase())) : nodesRef.current
      let nearest: GNode | null = null, nearDist = 20 / view.scale
      displayNodes.forEach(n => {
        const p = posRef.current.get(n.id); if (!p) return
        const d = Math.sqrt((p.x - wx) ** 2 + (p.y - wy) ** 2)
        if (d < nearDist) { nearDist = d; nearest = n }
      })
      setSelectedNode(prev => (nearest && prev?.id !== nearest.id) ? nearest : null)
    }
    dragRef.current.active = false
    setCursor(hoveredRef.current ? 'pointer' : 'crosshair')
  }

  const onMouseLeave = () => {
    mouseRef.current = { x: -9999, y: -9999 }
    hoveredRef.current = null
    dragRef.current.active = false
    setTooltip(null)
    setCursor('crosshair')
  }

  const onWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const { x: sx, y: sy } = toScreenCoords(e)
    const view     = viewRef.current
    const factor   = e.deltaY < 0 ? 1.12 : 0.89
    const newScale = Math.max(0.25, Math.min(4, view.scale * factor))
    // Zoom centered on mouse: keep world point under mouse fixed
    const wx = (sx - view.x) / view.scale
    const wy = (sy - view.y) / view.scale
    viewRef.current = { ...view, scale: newScale, x: sx - wx * newScale, y: sy - wy * newScale }
  }

  const resetView = () => {
    viewRef.current = { ...viewRef.current, x: 0, y: 0, scale: 1 }
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-[#080b0b] border border-white/[0.07]" style={{ height: 380 }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full select-none"
        style={{ cursor, imageRendering: 'auto' }}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onWheel={onWheel}
      />

      {/* Reset zoom button */}
      <button
        onClick={resetView}
        className="absolute top-2.5 right-2.5 rounded-md bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 px-2 py-1 text-[9px] text-gray-400 hover:text-white transition font-mono"
      >
        reset view
      </button>

      {/* Hover tooltip — only when no node selected */}
      {tooltip && !selectedNode && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            left: tooltip.flip ? tooltip.sx - 14 : tooltip.sx + 14,
            top: Math.max(6, tooltip.sy - 38),
            transform: tooltip.flip ? 'translateX(-100%)' : undefined,
          }}
        >
          <div className="rounded-lg bg-[#0d1515]/95 border border-white/10 backdrop-blur-sm px-3 py-2.5 shadow-2xl w-52">
            <div className="text-xs font-semibold text-white mb-1">{tooltip.node.id}</div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-teal-400 bg-teal-950/70 border border-teal-800/40 rounded px-1.5 py-0.5 uppercase">{tooltip.node.type}</span>
              <span className="text-[9px] text-gray-500">{tooltip.node.degree} link{tooltip.node.degree !== 1 ? 's' : ''}</span>
              <span className="text-[9px] text-gray-600 italic">click for full text</span>
            </div>
          </div>
        </div>
      )}

      {/* Selected node — full info panel */}
      {selectedNode && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#0a1212]/97 border-t border-white/[0.08] backdrop-blur-md z-30 max-h-52 flex flex-col">
          <div className="flex items-start justify-between px-4 pt-3 pb-2 border-b border-white/[0.06]">
            <div>
              <div className="text-sm font-semibold text-white leading-snug">{selectedNode.id}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] text-teal-400 bg-teal-950/60 border border-teal-800/40 rounded px-1.5 py-0.5 uppercase">{selectedNode.type}</span>
                <span className="text-[9px] text-gray-500">{selectedNode.degree} connection{selectedNode.degree !== 1 ? 's' : ''}</span>
                {selectedNode.filePath && (
                  <span className="text-[9px] text-gray-600 truncate max-w-[140px]">📄 {selectedNode.filePath}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-500 hover:text-white text-xl leading-none ml-4 mt-0.5 flex-shrink-0"
            >
              ×
            </button>
          </div>
          <div className="overflow-y-auto px-4 py-3">
            <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedNode.description}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-2.5 left-3 pointer-events-none" style={{ display: selectedNode ? 'none' : undefined }}>
        {activatedIds.length > 0
          ? <span className="text-[9px] text-white/35 font-mono">{activatedIds.length} nodes · last query · scroll to zoom · drag to pan</span>
          : <span className="text-[9px] text-white/20 font-mono">scroll to zoom · drag to pan · click node for details</span>
        }
      </div>
    </div>
  )
}
