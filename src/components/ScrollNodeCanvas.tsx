'use client'

import { useEffect, useRef } from 'react'

/* ── Pastel palette ─────────────────────────────────────────────── */
const P = {
  blue:   '#93C5FD',
  yellow: '#FDE68A',
  green:  '#86EFAC',
  red:    '#FCA5A5',
  purple: '#C4B5FD',
  teal:   '#5EEAD4',
  orange: '#FED7AA',
}

/* ── Math ───────────────────────────────────────────────────────── */
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }
function smooth(t: number) { const x = clamp(t, 0, 1); return x * x * (3 - 2 * x) }

function hex3(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]
}

/* ── Section configs ────────────────────────────────────────────── */
interface N { rx: number; ry: number; sz: number; color: string; label?: string }
interface E { from: number; to: number }
interface Cfg { nodes: N[]; edges: E[] }

const CONFIGS: Cfg[] = [
  /* 0 — Hero: central brain + doc nodes orbiting */
  {
    nodes: [
      { rx: .52, ry: .46, sz: 14, color: P.blue,   label: 'IKnowIt' },
      { rx: .22, ry: .25, sz:  9, color: P.yellow, label: 'HR Docs' },
      { rx: .76, ry: .23, sz:  8, color: P.green,  label: 'IT Runbook' },
      { rx: .84, ry: .57, sz:  8, color: P.red,    label: 'Customer FAQ' },
      { rx: .54, ry: .78, sz:  8, color: P.purple, label: 'Sales Guide' },
      { rx: .2,  ry: .65, sz:  7, color: P.teal,   label: 'Finance' },
      { rx: .12, ry: .42, sz:  6, color: P.orange, label: 'Runbook' },
      { rx: .42, ry: .17, sz:  6, color: P.yellow, label: 'Specs' },
    ],
    edges: [
      { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }, { from: 0, to: 4 },
      { from: 0, to: 5 }, { from: 0, to: 6 }, { from: 0, to: 7 },
      { from: 1, to: 7 }, { from: 5, to: 6 },
    ],
  },
  /* 1 — How it works: 3-step left→right flow */
  {
    nodes: [
      { rx: .16, ry: .44, sz: 12, color: P.yellow, label: 'Upload Docs' },
      { rx: .5,  ry: .44, sz: 14, color: P.blue,   label: 'Knowledge Graph' },
      { rx: .84, ry: .44, sz: 12, color: P.green,  label: 'Query & Answer' },
      { rx: .08, ry: .23, sz:  5, color: P.orange, label: 'PDF' },
      { rx: .16, ry: .67, sz:  5, color: P.yellow, label: 'DOCX' },
      { rx: .5,  ry: .21, sz:  5, color: P.purple, label: 'Entities' },
      { rx: .5,  ry: .67, sz:  5, color: P.teal,   label: 'Relations' },
      { rx: .84, ry: .26, sz:  5, color: P.green,  label: 'Answer' },
    ],
    edges: [
      { from: 3, to: 0 }, { from: 4, to: 0 },
      { from: 0, to: 1 },
      { from: 1, to: 5 }, { from: 1, to: 6 },
      { from: 1, to: 2 },
      { from: 2, to: 7 },
    ],
  },
  /* 2 — Case study: corporate hierarchy */
  {
    nodes: [
      { rx: .5,  ry: .17, sz: 13, color: P.blue,   label: 'Stellaris Group' },
      { rx: .2,  ry: .42, sz:  9, color: P.yellow, label: 'HR Dept' },
      { rx: .5,  ry: .42, sz:  9, color: P.green,  label: 'IT Dept' },
      { rx: .8,  ry: .42, sz:  9, color: P.red,    label: 'Sales' },
      { rx: .1,  ry: .68, sz:  6, color: P.purple, label: '380 hrs saved' },
      { rx: .35, ry: .72, sz:  6, color: P.teal,   label: '85% fewer queries' },
      { rx: .58, ry: .7,  sz:  6, color: P.orange, label: '55% auto-resolved' },
      { rx: .82, ry: .68, sz:  6, color: P.yellow, label: '−47% ramp' },
    ],
    edges: [
      { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 },
      { from: 1, to: 4 }, { from: 1, to: 5 },
      { from: 2, to: 6 }, { from: 3, to: 7 },
    ],
  },
  /* 3 — Demo: query flow */
  {
    nodes: [
      { rx: .1,  ry: .48, sz: 10, color: P.purple, label: 'You' },
      { rx: .5,  ry: .48, sz: 14, color: P.blue,   label: 'IKnowIt' },
      { rx: .82, ry: .22, sz:  8, color: P.yellow, label: 'HR Docs' },
      { rx: .88, ry: .44, sz:  8, color: P.green,  label: 'IT Runbook' },
      { rx: .82, ry: .66, sz:  8, color: P.red,    label: 'Customer FAQ' },
      { rx: .66, ry: .8,  sz:  6, color: P.teal,   label: 'Sales Guide' },
      { rx: .3,  ry: .28, sz:  5, color: P.orange, label: 'Query' },
      { rx: .3,  ry: .68, sz:  5, color: P.green,  label: 'Answer' },
    ],
    edges: [
      { from: 0, to: 6 }, { from: 6, to: 1 },
      { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 1, to: 4 }, { from: 1, to: 5 },
      { from: 1, to: 7 }, { from: 7, to: 0 },
    ],
  },
  /* 4 — Personas: star topology */
  {
    nodes: [
      { rx: .5,  ry: .44, sz: 15, color: P.blue,   label: 'Knowledge Brain' },
      { rx: .2,  ry: .22, sz: 10, color: P.yellow, label: 'Customer Support' },
      { rx: .8,  ry: .22, sz: 10, color: P.green,  label: 'HR Onboarding' },
      { rx: .88, ry: .58, sz: 10, color: P.red,    label: 'IT Helpdesk' },
      { rx: .5,  ry: .78, sz: 10, color: P.purple, label: 'Sales Intel' },
      { rx: .12, ry: .58, sz: 10, color: P.teal,   label: 'Knowledge Hub' },
    ],
    edges: [
      { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 },
      { from: 0, to: 4 }, { from: 0, to: 5 },
    ],
  },
  /* 5 — Integration: two-tier */
  {
    nodes: [
      { rx: .5,  ry: .3,  sz: 15, color: P.blue,   label: 'IKnowIt' },
      { rx: .28, ry: .14, sz:  7, color: P.yellow, label: 'Your Docs' },
      { rx: .52, ry: .1,  sz:  7, color: P.orange, label: 'Knowledge Graph' },
      { rx: .74, ry: .14, sz:  7, color: P.teal,   label: 'Policies' },
      { rx: .1,  ry: .65, sz: 10, color: P.green,  label: 'WhatsApp' },
      { rx: .3,  ry: .72, sz:  9, color: P.yellow, label: 'Voice Agent' },
      { rx: .52, ry: .74, sz:  9, color: P.blue,   label: 'Web Chat' },
      { rx: .72, ry: .72, sz:  9, color: P.red,    label: 'Slack' },
      { rx: .9,  ry: .65, sz:  8, color: P.purple, label: 'Email' },
    ],
    edges: [
      { from: 1, to: 0 }, { from: 2, to: 0 }, { from: 3, to: 0 },
      { from: 0, to: 4 }, { from: 0, to: 5 }, { from: 0, to: 6 }, { from: 0, to: 7 }, { from: 0, to: 8 },
    ],
  },
]

const SECTION_IDS = ['hero', 'how-it-works', 'case-study', 'demo', 'personas', 'integration']

/* ── Component ──────────────────────────────────────────────────── */
export function ScrollNodeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    /* Resize */
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width  = window.innerWidth  * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width  = window.innerWidth  + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    /* Scroll → section index + local progress */
    const sRef = { idx: 0, lt: 0 }

    const onScroll = () => {
      const els = SECTION_IDS.map(id => document.getElementById(id))
      const center = window.scrollY + window.innerHeight * 0.5
      let si = 0
      for (let i = 0; i < els.length; i++) {
        if (els[i] && (els[i]!.offsetTop <= center)) si = i
      }
      sRef.idx = si
      const cur = els[si], nxt = els[si + 1]
      if (cur && nxt) {
        sRef.lt = clamp((center - cur.offsetTop) / (nxt.offsetTop - cur.offsetTop), 0, 1)
      } else {
        sRef.lt = 1
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    /* Node pool */
    const pool = Array.from({ length: 12 }, (_, i) => ({
      x: .5,  y: .5,
      tx: .5, ty: .5,
      sz: 0,  tsz: 0,
      op: 0,
      c:  hex3(P.blue) as [number,number,number],
      tc: hex3(P.blue) as [number,number,number],
      label: '',
      pulse: i * 0.73,
    }))

    /* Travel dots */
    const tdots: { ei: number; t: number; sp: number; op: number }[] = []
    let prevSec = -1
    let prevMs  = 0
    const startMs = performance.now()
    let raf = 0

    const tick = (ms: number) => {
      const dt = clamp(ms - prevMs, 0, 50) / 1000
      prevMs = ms

      const W = window.innerWidth
      const H = window.innerHeight
      const si = sRef.idx
      // Hero section: time-driven reveal (1.5 s) so nodes animate in on load
      const heroReveal = clamp((ms - startMs) / 1500, 0, 1)
      const lt = si === 0 ? heroReveal : sRef.lt
      const cfg = CONFIGS[si]

      /* Reset dots on section change */
      if (si !== prevSec) {
        prevSec = si
        tdots.length = 0
        cfg.edges.forEach((_, i) =>
          tdots.push({ ei: i, t: Math.random(), sp: 0.1 + Math.random() * 0.2, op: 0 })
        )
      }

      /* Set targets */
      cfg.nodes.forEach((n, i) => {
        if (i >= pool.length) return
        const rev = smooth(clamp(lt * 1.8 - i * 0.12, 0, 1))
        pool[i].tx = lerp(.5, n.rx, rev)
        pool[i].ty = lerp(.5, n.ry, rev)
        pool[i].tsz = n.sz * rev
        pool[i].tc = hex3(n.color)
        pool[i].label = n.label ?? ''
      })
      for (let i = cfg.nodes.length; i < pool.length; i++) {
        pool[i].tx = .5; pool[i].ty = .5; pool[i].tsz = 0
      }

      /* Spring physics */
      const sp = 1 - Math.pow(0.02, dt)
      pool.forEach(p => {
        p.x  = lerp(p.x,  p.tx, sp)
        p.y  = lerp(p.y,  p.ty, sp)
        p.sz = lerp(p.sz, p.tsz, sp)
        p.op = lerp(p.op, p.tsz > 0.5 ? 1 : 0, sp)
        p.c[0] = Math.round(lerp(p.c[0], p.tc[0], sp))
        p.c[1] = Math.round(lerp(p.c[1], p.tc[1], sp))
        p.c[2] = Math.round(lerp(p.c[2], p.tc[2], sp))
      })

      /* Dots */
      tdots.forEach((d, i) => {
        d.t = (d.t + d.sp * dt) % 1
        d.op = lerp(d.op, smooth(clamp(lt * 3 - i * 0.25, 0, 1)), 0.06)
      })

      /* Draw */
      ctx.clearRect(0, 0, W, H)
      const now = ms / 1000

      /* Edges */
      cfg.edges.forEach((e, i) => {
        const a = pool[e.from], b = pool[e.to]
        if (!a || !b) return
        const edgeT = smooth(clamp(lt * 2.8 - i * 0.3, 0, 1))
        const ax = a.x * W, ay = a.y * H
        const bx = b.x * W, by = b.y * H
        ctx.beginPath()
        ctx.moveTo(ax, ay)
        ctx.lineTo(lerp(ax, bx, edgeT), lerp(ay, by, edgeT))
        ctx.strokeStyle = `rgba(148,163,184,${Math.min(a.op, b.op) * 0.28})`
        ctx.lineWidth = 1
        ctx.stroke()
      })

      /* Travel dots */
      tdots.forEach(d => {
        const e = cfg.edges[d.ei]
        if (!e || d.op < 0.05) return
        const a = pool[e.from], b = pool[e.to]
        if (!a || !b) return
        ctx.beginPath()
        ctx.arc(lerp(a.x * W, b.x * W, d.t), lerp(a.y * H, b.y * H, d.t), 2.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(77,162,255,${d.op * 0.8})`
        ctx.fill()
      })

      /* Nodes */
      pool.forEach(p => {
        if (p.op < 0.02 || p.sz < 0.5) return
        const x = p.x * W, y = p.y * H
        const r = p.sz * (Math.sin(now * 1.3 + p.pulse) * 0.08 + 0.92)
        const [cr, cg, cb] = p.c

        /* Glow halo */
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.5)
        g.addColorStop(0, `rgba(${cr},${cg},${cb},${0.18 * p.op})`)
        g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
        ctx.beginPath(); ctx.arc(x, y, r * 3.5, 0, Math.PI * 2)
        ctx.fillStyle = g; ctx.fill()

        /* Circle */
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle   = `rgba(${cr},${cg},${cb},${0.88 * p.op})`
        ctx.fill()
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${0.55 * p.op})`
        ctx.lineWidth   = 1.5
        ctx.stroke()

        /* Label */
        if (p.sz >= 7 && p.op > 0.5 && p.label) {
          const fs = Math.max(9, p.sz * 0.7)
          ctx.font      = `500 ${fs}px -apple-system,system-ui,sans-serif`
          ctx.textAlign = 'center'
          ctx.fillStyle = `rgba(15,23,42,${p.op * 0.6})`
          ctx.fillText(p.label, x, y + r + 12)
        }
      })

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
