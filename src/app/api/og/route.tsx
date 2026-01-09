import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const title = searchParams.get('title') || 'Andrew Altair';
    const description = searchParams.get('description') || 'AI ინოვატორი და კონტენტ კრეატორი';
    const type = searchParams.get('type') || 'default';

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
            backgroundColor: '#0a0a0f',
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(34, 211, 238, 0.15) 0%, transparent 50%)',
            position: 'relative',
          }}
        >
          {/* Grid Pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
              zIndex: 1,
            }}
          >
            {/* Logo/Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '40px',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                border: '2px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '50px',
                padding: '12px 32px',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#22d3ee',
                  borderRadius: '50%',
                }}
              />
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#6366f1',
                  letterSpacing: '-0.02em',
                }}
              >
                AI ინოვატორი და კონტენტ კრეატორი
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: type === 'post' ? '64px' : '96px',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textAlign: 'center',
                lineHeight: 1.1,
                margin: '0 0 32px 0',
                maxWidth: '1000px',
              }}
            >
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p
                style={{
                  fontSize: '32px',
                  color: '#a1a1aa',
                  textAlign: 'center',
                  lineHeight: 1.4,
                  margin: 0,
                  maxWidth: '900px',
                }}
              >
                {description}
              </p>
            )}

            {/* Stats */}
            <div
              style={{
                display: 'flex',
                gap: '48px',
                marginTop: '48px',
              }}
            >
              {[
                { label: 'წელი გამოცდილება', value: '8+' },
                { label: 'გამომწერი', value: '50K+' },
                { label: 'სტატია', value: '200+' },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '36px',
                      fontWeight: 700,
                      color: '#e4e4e7',
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      fontSize: '18px',
                      color: '#71717a',
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Domain */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '60px',
              fontSize: '24px',
              color: '#71717a',
              fontWeight: 500,
            }}
          >
            andrewaltair.ge
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG Image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
