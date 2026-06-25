'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number
  pulse: number
}

export function HeroParticles({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -999, y: -999 })
  const animRef = useRef(0)
  const particlesRef = useRef<Particle[]>([])
  const tRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const spawn = () => {
      const W = canvas.offsetWidth, H = canvas.offsetHeight
      canvas.width = W; canvas.height = H
      particlesRef.current = Array.from({ length: 90 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.8 + 0.8,
        pulse: Math.random() * Math.PI * 2,
      }))
    }
    spawn()
    window.addEventListener('resize', spawn)

    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    canvas.addEventListener('mousemove', onMouse)
    canvas.addEventListener('mouseleave', () => { mouseRef.current = { x: -999, y: -999 } })

    const tick = () => {
      tRef.current += 0.008
      const W = canvas.width, H = canvas.height
      const particles = particlesRef.current
      const mouse = mouseRef.current
      ctx.clearRect(0, 0, W, H)

      for (const p of particles) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < 14400) {
          const d = Math.sqrt(d2)
          p.vx += (dx / d) * 0.6
          p.vy += (dy / d) * 0.6
        }
        p.vx *= 0.98; p.vy *= 0.98
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) { p.x = 0; p.vx *= -1 }
        if (p.x > W) { p.x = W; p.vx *= -1 }
        if (p.y < 0) { p.y = 0; p.vy *= -1 }
        if (p.y > H) { p.y = H; p.vy *= -1 }
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 140) {
            const alpha = (1 - d / 140) * 0.22
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            // electric blue lines
            ctx.strokeStyle = `rgba(77, 162, 255, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      for (const p of particles) {
        const glow = Math.sin(tRef.current * 1.5 + p.pulse) * 0.3 + 0.7
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5)
        grad.addColorStop(0, `rgba(77, 162, 255, ${0.35 * glow})`)
        grad.addColorStop(1, 'rgba(77, 162, 255, 0)')
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * glow, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(77, 162, 255, ${0.75 * glow})`
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', spawn)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
