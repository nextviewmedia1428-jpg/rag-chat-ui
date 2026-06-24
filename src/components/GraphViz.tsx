'use client'

import { useEffect, useRef, useState } from 'react'

interface GraphNode {
  id: string
  label: string
  x?: number
  y?: number
}

interface GraphLink {
  source: string
  target: string
}

// Placeholder nodes shown when LightRAG graph is empty
const PLACEHOLDER_NODES: GraphNode[] = [
  { id: '1', label: 'Company Policy' },
  { id: '2', label: 'Employee Benefits' },
  { id: '3', label: 'Product Features' },
  { id: '4', label: 'Support Workflow' },
  { id: '5', label: 'Knowledge Base' },
  { id: '6', label: 'Escalation Rules' },
  { id: '7', label: 'Pricing Tiers' },
]

const PLACEHOLDER_LINKS: GraphLink[] = [
  { source: '5', target: '1' },
  { source: '5', target: '3' },
  { source: '5', target: '4' },
  { source: '1', target: '2' },
  { source: '3', target: '7' },
  { source: '4', target: '6' },
  { source: '2', target: '6' },
]

export function GraphViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const [nodes] = useState<GraphNode[]>(PLACEHOLDER_NODES)
  const [links] = useState<GraphLink[]>(PLACEHOLDER_LINKS)
  const posRef = useRef<Map<string, { x: number; y: number; vx: number; vy: number }>>(new Map())
  const pulseRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    canvas.width = W
    canvas.height = H

    // Initialize positions
    nodes.forEach((n, i) => {
      if (!posRef.current.has(n.id)) {
        const angle = (i / nodes.length) * Math.PI * 2
        posRef.current.set(n.id, {
          x: W / 2 + Math.cos(angle) * W * 0.3,
          y: H / 2 + Math.sin(angle) * H * 0.3,
          vx: 0,
          vy: 0,
        })
      }
    })

    function tick() {
      const pos = posRef.current
      pulseRef.current += 0.04

      // Simple force simulation
      nodes.forEach(a => {
        const pa = pos.get(a.id)!
        // Repulsion
        nodes.forEach(b => {
          if (a.id === b.id) return
          const pb = pos.get(b.id)!
          const dx = pa.x - pb.x
          const dy = pa.y - pb.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const force = 800 / (dist * dist)
          pa.vx += (dx / dist) * force
          pa.vy += (dy / dist) * force
        })
        // Center gravity
        pa.vx += (W / 2 - pa.x) * 0.003
        pa.vy += (H / 2 - pa.y) * 0.003
      })

      // Link attraction
      links.forEach(l => {
        const ps = pos.get(l.source)
        const pt = pos.get(l.target)
        if (!ps || !pt) return
        const dx = pt.x - ps.x
        const dy = pt.y - ps.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const force = (dist - 80) * 0.05
        ps.vx += (dx / dist) * force
        ps.vy += (dy / dist) * force
        pt.vx -= (dx / dist) * force
        pt.vy -= (dy / dist) * force
      })

      // Apply velocity with damping
      nodes.forEach(n => {
        const p = pos.get(n.id)!
        p.vx *= 0.85
        p.vy *= 0.85
        p.x = Math.max(30, Math.min(W - 30, p.x + p.vx))
        p.y = Math.max(20, Math.min(H - 20, p.y + p.vy))
      })

      // Draw
      ctx!.clearRect(0, 0, W, H)

      // Links
      links.forEach((l, i) => {
        const ps = pos.get(l.source)
        const pt = pos.get(l.target)
        if (!ps || !pt) return
        const pulse = Math.sin(pulseRef.current + i) * 0.5 + 0.5
        ctx!.beginPath()
        ctx!.moveTo(ps.x, ps.y)
        ctx!.lineTo(pt.x, pt.y)
        ctx!.strokeStyle = `rgba(20, 184, 166, ${0.15 + pulse * 0.2})`
        ctx!.lineWidth = 1
        ctx!.stroke()
      })

      // Nodes
      nodes.forEach((n, i) => {
        const p = pos.get(n.id)!
        const pulse = Math.sin(pulseRef.current + i * 0.7) * 0.5 + 0.5

        // Glow
        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, 18)
        grad.addColorStop(0, `rgba(20, 184, 166, ${0.3 + pulse * 0.3})`)
        grad.addColorStop(1, 'rgba(20, 184, 166, 0)')
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, 18, 0, Math.PI * 2)
        ctx!.fillStyle = grad
        ctx!.fill()

        // Node circle
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, 5, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(94, 234, 212, ${0.7 + pulse * 0.3})`
        ctx!.fill()

        // Label
        ctx!.font = '10px system-ui'
        ctx!.fillStyle = 'rgba(200, 200, 200, 0.85)'
        ctx!.textAlign = 'center'
        ctx!.fillText(n.label, p.x, p.y - 10)
      })

      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [nodes, links])

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-[#0a0f0f] border border-teal-900/40" style={{ height: 200 }}>
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-2 left-3 text-[10px] text-teal-600/60 font-mono">GraphRAG · knowledge graph</div>
    </div>
  )
}
