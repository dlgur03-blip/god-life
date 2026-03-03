import { ImageResponse } from 'next/og';
import { getMetResult } from '@/app/actions/met';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Image({ params }: Props) {
  const { id } = await params;
  const data = await getMetResult(id);

  if (!data) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#faf9f7',
            color: '#1a1a1a',
            fontSize: 40,
          }}
        >
          Not Found
        </div>
      ),
      { ...size }
    );
  }

  const scores = data.scores;
  const dimensions = [
    { label: 'APR', value: scores.approach },
    { label: 'AVD', value: scores.avoidance },
    { label: 'INT', value: scores.intrinsic },
    { label: 'EXT', value: scores.extrinsic },
    { label: 'ACH', value: scores.achievement },
    { label: 'AFF', value: scores.affiliation },
    { label: 'POW', value: scores.power },
    { label: 'AUT', value: scores.autonomy },
    { label: 'COM', value: scores.competence },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#faf9f7',
          padding: '60px',
          gap: '20px',
        }}
      >
        {/* Emoji */}
        <div style={{ fontSize: 80 }}>{data.archetypeEmoji}</div>

        {/* Title */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: '#1a1a1a',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          {data.archetypeName}
        </div>

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 4,
            backgroundColor: '#a08050',
          }}
        />

        {/* Summary */}
        <div
          style={{
            fontSize: 22,
            color: '#5c5c5c',
            textAlign: 'center',
            maxWidth: 700,
          }}
        >
          {data.summaryShort}
        </div>

        {/* Score bars */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '20px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '900px',
          }}
        >
          {dimensions.map((d) => (
            <div
              key={d.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 6,
                  backgroundColor: '#d4cfc6',
                  borderRadius: 3,
                  overflow: 'hidden',
                  display: 'flex',
                }}
              >
                <div
                  style={{
                    width: `${d.value}%`,
                    height: '100%',
                    backgroundColor: '#a08050',
                    borderRadius: 3,
                  }}
                />
              </div>
              <div style={{ fontSize: 10, color: '#5c5c5c' }}>
                {d.label}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            fontSize: 16,
            color: '#a08050',
            marginTop: '10px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          MET · GOD LIFE MAKER
        </div>
      </div>
    ),
    { ...size }
  );
}
