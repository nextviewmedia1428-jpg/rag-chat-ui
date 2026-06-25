// Pure CSS aurora orbs — fixed behind all content, pointer-events-none
// Same pattern as everswap.com / sui.io: blurred drifting gradient blobs
export function AuroraBackground() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Orb 1 — electric blue, top-left */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-5%',
        width: 700,
        height: 700,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(77,162,255,0.22) 0%, rgba(77,162,255,0) 70%)',
        filter: 'blur(72px)',
        animation: 'orb-1 28s ease-in-out infinite',
      }} />

      {/* Orb 2 — indigo/purple, top-right */}
      <div style={{
        position: 'absolute',
        top: '5%',
        right: '-8%',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(99,102,241,0) 70%)',
        filter: 'blur(80px)',
        animation: 'orb-2 34s ease-in-out infinite',
      }} />

      {/* Orb 3 — cyan, bottom-right */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.14) 0%, rgba(6,182,212,0) 70%)',
        filter: 'blur(90px)',
        animation: 'orb-3 22s ease-in-out infinite',
      }} />

      {/* Orb 4 — deeper blue, bottom-left */}
      <div style={{
        position: 'absolute',
        bottom: '-5%',
        left: '15%',
        width: 550,
        height: 550,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.16) 0%, rgba(37,99,235,0) 70%)',
        filter: 'blur(85px)',
        animation: 'orb-4 30s ease-in-out infinite',
      }} />
    </div>
  )
}
