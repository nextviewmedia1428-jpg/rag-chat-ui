'use client'
import { useEffect, useRef } from 'react'

/* ── Node definitions ───────────────────────────────────────────── */
const DEFS = [
  // label, color, "r,g,b", focusSections[], baseRadius, baseSize
  // Larger radii = nodes spread across the full screen; zoom range is (1.6 → 0.4) for drama
  ['HR Docs',          '#1A6B3C', '26,107,60',   [0,2,3],   210, 5.0],
  ['IT Runbook',       '#FF4D3D', '255,77,61',   [0,2,3],   290, 4.5],
  ['Customer FAQ',     '#E8A020', '232,160,32',  [0,2,3],   255, 4.5],
  ['Sales Guide',      '#7DAF8B', '125,175,139', [0,2,3,4], 320, 4.5],
  ['Finance',          '#1A6B3C', '26,107,60',   [0],       185, 4.0],
  ['Product Specs',    '#FF4D3D', '255,77,61',   [0],       355, 3.5],
  ['Policies',         '#E8A020', '232,160,32',  [0],       235, 3.5],
  ['Upload Docs',      '#E8A020', '232,160,32',  [1],       220, 5.5],
  ['Knowledge Graph',  '#1A6B3C', '26,107,60',   [1],       195, 6.0],
  ['Query',            '#FF4D3D', '255,77,61',   [1,3],     260, 5.0],
  ['Entities',         '#7DAF8B', '125,175,139', [1],       300, 4.0],
  ['Relations',        '#E8A020', '232,160,32',  [1],       355, 3.5],
  ['WhatsApp',         '#7DAF8B', '125,175,139', [5],       230, 5.5],
  ['Voice Agent',      '#1A6B3C', '26,107,60',   [5],       285, 5.0],
  ['Web Chat',         '#E8A020', '232,160,32',  [5],       250, 4.5],
  ['Slack',            '#FF4D3D', '255,77,61',   [5],       325, 4.5],
  ['Email',            '#7DAF8B', '125,175,139', [5],       375, 4.0],
  ['Customer Support', '#1A6B3C', '26,107,60',   [4],       220, 5.5],
  ['HR Onboarding',    '#E8A020', '232,160,32',  [4],       275, 5.0],
  ['IT Helpdesk',      '#FF4D3D', '255,77,61',   [4],       200, 5.5],
  ['Sales Intel',      '#7DAF8B', '125,175,139', [4,3],     310, 4.5],
  ['CRM',              '#7DAF8B', '125,175,139', [5,3],     380, 4.0],
] as const

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

const TRAIL = 18

export function ScrollNodeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rmo = window.matchMedia('(prefers-reduced-motion:reduce)').matches

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2)
      canvas.width  = innerWidth  * dpr
      canvas.height = innerHeight * dpr
      canvas.style.width  = innerWidth  + 'px'
      canvas.style.height = innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    addEventListener('resize', resize)

    // Build live node array from defs
    const rand = () => Math.random()
    const nodes = DEFS.map(([label, color, rgb, focus, bR, bSz]) => ({
      label: label as string,
      color: color as string,
      rgb:   rgb   as string,
      focus: focus as readonly number[],
      bR:    bR    as number,
      bSz:   bSz   as number,
      angle: rand() * Math.PI * 2,
      speed: (rand() * 0.038 + 0.01) * (rand() < 0.5 ? 1 : -1),
      bobA:  8  + rand() * 16,
      bobF:  0.28 + rand() * 0.45,
      phase: rand() * Math.PI * 2,
      ff:    0.4, // focusFactor, starts at hero level
      trail: [] as { x: number; y: number }[],
    }))

    // Hub
    let hub = { x: innerWidth * 0.74, y: innerHeight * 0.44 }
    let hubT = { ...hub }
    let secIdx = 0

    const updateHub = () => {
      const sels = Array.from(document.querySelectorAll<HTMLElement>('section[data-hub-x]'))
      const center = scrollY + innerHeight * 0.5
      let best = 0, bestD = Infinity
      sels.forEach((el, i) => {
        const d = Math.abs((el.offsetTop + el.offsetHeight * 0.5) - center)
        if (d < bestD) { bestD = d; best = i }
      })
      const el = sels[best]
      if (!el) return
      secIdx = best
      hubT.x = parseFloat(el.dataset.hubX ?? '74') / 100 * innerWidth
      hubT.y = parseFloat(el.dataset.hubY ?? '44') / 100 * innerHeight
    }
    addEventListener('scroll', updateHub, { passive: true })
    setTimeout(updateHub, 80)

    let t = 0, raf = 0

    const draw = () => {
      const W = innerWidth, H = innerHeight
      if (!rmo) t += 0.016

      // Glide hub (same spring coefficient as the reference design)
      hub.x += (hubT.x - hub.x) * 0.035
      hub.y += (hubT.y - hub.y) * 0.035

      ctx.clearRect(0, 0, W, H)

      for (const n of nodes) {
        // Focus factor target: hero = 0.4 for all, other sections = 1.0 if featured, 0.05 otherwise
        const tgt = secIdx === 0 ? 0.38 : (n.focus.includes(secIdx) ? 1.0 : 0.04)
        n.ff += (tgt - n.ff) * 0.055  // ponytail: slightly faster lerp = snappier zoom without jarring

        const ff  = n.ff
        const eR  = n.bR  * lerp(1.6, 0.38, ff)   // unfocused drift far out, focused pull close
        const eSz = n.bSz * lerp(0.5, 2.2, ff)     // focused nodes grow noticeably larger
        const op  = lerp(0.06, 0.92, ff)

        const ang = n.angle + (rmo ? 0 : t * n.speed)
        const bob = Math.sin(t * n.bobF + n.phase) * n.bobA
        const nx  = hub.x + Math.cos(ang) * eR
        const ny  = hub.y + Math.sin(ang) * eR * 0.62 + bob

        if (!rmo) {
          n.trail.push({ x: nx, y: ny })
          if (n.trail.length > TRAIL) n.trail.shift()
        }

        // Constellation trail
        if (n.trail.length > 1 && ff > 0.12) {
          for (let k = 1; k < n.trail.length; k++) {
            ctx.strokeStyle = `rgba(${n.rgb},${(k / n.trail.length) * 0.22 * op})`
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(n.trail[k-1].x, n.trail[k-1].y)
            ctx.lineTo(n.trail[k].x,   n.trail[k].y)
            ctx.stroke()
          }
        }

        // Connector line hub→node
        if (ff > 0.05) {
          const g = ctx.createLinearGradient(hub.x, hub.y, nx, ny)
          g.addColorStop(0, `rgba(${n.rgb},${0.14 * op})`)
          g.addColorStop(1, `rgba(${n.rgb},0)`)
          ctx.strokeStyle = g
          ctx.lineWidth = 1
          ctx.beginPath(); ctx.moveTo(hub.x, hub.y); ctx.lineTo(nx, ny); ctx.stroke()
        }

        // Node dot
        ctx.beginPath(); ctx.arc(nx, ny, eSz, 0, Math.PI * 2)
        ctx.fillStyle = n.color
        ctx.globalAlpha = op * 0.85
        ctx.fill()
        ctx.globalAlpha = 1

        // Ring
        if (ff > 0.15) {
          ctx.beginPath(); ctx.arc(nx, ny, eSz + 3, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${n.rgb},${0.18 * op})`
          ctx.lineWidth = 1; ctx.stroke()
        }

        // Label — fades in once node is focused enough
        if (ff > 0.55 && n.label) {
          ctx.font = '10px IBM Plex Mono, monospace'
          ctx.textAlign = 'left'
          ctx.fillStyle = `rgba(107,94,82,${Math.min((ff - 0.55) * 2.2, 0.65)})`
          ctx.fillText(n.label, nx + eSz + 6, ny + 3.5)
        }
      }

      // Hub node (IKnowIt brain — always on top)
      ctx.beginPath(); ctx.arc(hub.x, hub.y, 9, 0, Math.PI * 2)
      ctx.fillStyle = '#1A6B3C'; ctx.fill()
      ctx.beginPath(); ctx.arc(hub.x, hub.y, 15, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(26,107,60,0.22)'; ctx.lineWidth = 1.5; ctx.stroke()

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
      removeEventListener('scroll', updateHub)
    }
  }, [])

  return (
    <canvas ref={canvasRef} aria-hidden
      style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', zIndex:0, pointerEvents:'none' }} />
  )
}
