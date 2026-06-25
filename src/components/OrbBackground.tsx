// Ambient floating orbs — shown on every page behind content
// Canvas node animation layered on top; orbs provide depth on non-hero sections
export function OrbBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      <div className="orb" style={{ width: 560, height: 560, background: 'rgba(26,107,60,0.09)',  top: '-80px',  right: '8%',  animationDelay: '0s'   }} />
      <div className="orb" style={{ width: 420, height: 420, background: 'rgba(232,160,32,0.07)', bottom: '18%', left: '4%',   animationDelay: '-9s'  }} />
      <div className="orb" style={{ width: 340, height: 340, background: 'rgba(255,77,61,0.055)', top: '42%',   right: '22%', animationDelay: '-17s' }} />
    </div>
  )
}
