import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{
        width: 32, height: 32,
        background: '#1A6B3C',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'serif',
        fontSize: 20,
        fontStyle: 'italic',
        fontWeight: 700,
        color: 'white',
        letterSpacing: '-1px',
      }}>
        i
      </div>
    ),
    { ...size }
  )
}
