import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: '#faf8f5',
        }}
      >
        {/* Left section */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '80px',
            gap: '24px',
          }}
        >
          {/* Gold accent bar */}
          <div
            style={{
              width: 48,
              height: 4,
              backgroundColor: '#c4983f',
            }}
          />

          {/* Brand name */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: '#111111',
              letterSpacing: '-2px',
              lineHeight: 1,
            }}
          >
            GOD LIFE
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: '#c4983f',
              letterSpacing: '8px',
              textTransform: 'uppercase' as const,
              marginTop: '-12px',
            }}
          >
            AI
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 20,
              color: '#6b6b6b',
              lineHeight: 1.6,
              maxWidth: 400,
              marginTop: '8px',
            }}
          >
            TRAIN. TRACK. TRANSFORM.
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 16,
              color: '#999999',
              lineHeight: 1.6,
              maxWidth: 400,
            }}
          >
            매일 아침, 반드시 들어오세요. 당신은 분명 갓생을 살게 될 것입니다.
          </div>
        </div>

        {/* Right section - Module list */}
        <div
          style={{
            width: 400,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '28px',
            backgroundColor: '#111111',
            padding: '60px',
          }}
        >
          {[
            { name: 'DESTINY NAVIGATOR', color: '#c4983f' },
            { name: 'SUCCESS CODE', color: '#c4983f' },
            { name: 'DISCIPLINE MASTERY', color: '#9333ea' },
            { name: 'SELF EPISTLE', color: '#059669' },
            { name: 'MONEY FLOW', color: '#d97706' },
          ].map((m) => (
            <div
              key={m.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: m.color,
                  letterSpacing: '4px',
                  textAlign: 'center',
                }}
              >
                {m.name}
              </div>
              <div
                style={{
                  width: 24,
                  height: 2,
                  backgroundColor: '#333333',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
