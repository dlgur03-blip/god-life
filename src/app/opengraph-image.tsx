import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'GOD LIFE MAKER - Design Your Destiny'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          backgroundImage: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #0f172a 70%)',
          position: 'relative',
        }}
      >
        {/* Decorative Grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.5,
          }}
        />

        {/* Glow Effect */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            background: '#06b6d4',
            filter: 'blur(120px)',
            opacity: 0.15,
            borderRadius: '50%',
            top: '-100px',
          }}
        />

        {/* Main Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '40px 80px',
            borderRadius: '20px',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            boxShadow: '0 0 40px rgba(6, 182, 212, 0.1)',
          }}
        >
            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ 
                    fontSize: 70, 
                    fontWeight: 900, 
                    color: '#fbbf24', // Gold
                    textShadow: '0 0 20px rgba(251, 191, 36, 0.3)',
                    letterSpacing: '-2px',
                    fontFamily: 'sans-serif',
                }}>
                    GOD LIFE
                </div>
                <div style={{ 
                    fontSize: 70, 
                    fontWeight: 900, 
                    color: '#22d3ee', // Cyan
                    textShadow: '0 0 20px rgba(34, 211, 238, 0.3)',
                    letterSpacing: '-2px',
                    fontFamily: 'sans-serif',
                }}>
                    MAKER
                </div>
            </div>

            {/* Subtitle */}
            <div
            style={{
                marginTop: 20,
                fontSize: 28,
                color: '#94a3b8',
                textAlign: 'center',
                fontFamily: 'sans-serif',
                fontWeight: 500,
            }}
            >
            Architect your destiny. Master your discipline.
            </div>
            
            {/* Tagline / Modules */}
            <div style={{ display: 'flex', marginTop: 40, gap: '15px' }}>
                {['Destiny', 'Success', 'Discipline', 'Bio-Hacking'].map((tag) => (
                    <div
                        key={tag}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: 'rgba(6, 182, 212, 0.1)',
                            border: '1px solid rgba(6, 182, 212, 0.3)',
                            borderRadius: '50px',
                            color: '#22d3ee',
                            fontSize: 16,
                            fontWeight: 600,
                        }}
                    >
                        {tag}
                    </div>
                ))}
            </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}