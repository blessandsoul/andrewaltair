import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

// nodejs (not edge): the edge runtime can't reliably fetch the site's own
// /fonts asset (same-zone subrequest behind Cloudflare 500'd), and edge has no
// fs. nodejs reads the bundled Georgian font straight off disk.
export const runtime = 'nodejs';

// Load once per cold start. Wrapped so a missing file degrades to no-custom-font
// (Latin renders, Georgian would tofu) instead of crashing the whole route.
function loadGeorgianFonts() {
  try {
    const dir = join(process.cwd(), 'public', 'fonts');
    return [
      { name: 'Noto Sans Georgian', data: readFileSync(join(dir, 'NotoSansGeorgian-Regular.ttf')), weight: 400 as const, style: 'normal' as const },
      { name: 'Noto Sans Georgian', data: readFileSync(join(dir, 'NotoSansGeorgian-Bold.ttf')), weight: 700 as const, style: 'normal' as const },
    ];
  } catch (e) {
    console.error('[og] Georgian font load failed:', e);
    return undefined;
  }
}
const GEORGIAN_FONTS = loadGeorgianFonts();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get('title') || 'Andrew Altair';
    const description = searchParams.get('description') || 'AI ექსპერტი საქართველოში';
    const type = searchParams.get('type') || 'default';
    const tags = searchParams.get('tags')?.split(',') || [];
    const date = searchParams.get('date');


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
            backgroundColor: '#030712', // Zinc 950
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), 
              radial-gradient(circle at 75% 75%, rgba(34, 211, 238, 0.15) 0%, transparent 50%)
            `,
            position: 'relative',
            fontFamily: '"Noto Sans Georgian", sans-serif',
          }}
        >
          {/* Grid Pattern Background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)',
            }}
          />

          {/* Glowing Orb Effect */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
              filter: 'blur(80px)',
              zIndex: 0,
            }}
          />

          {/* Main Content Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: type === 'post' ? 'flex-start' : 'center',
              justifyContent: 'center',
              padding: '80px',
              zIndex: 1,
              width: '100%',
              maxWidth: '1200px',
            }}
          >
            {/* Header Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '40px',
                backgroundColor: 'rgba(31, 41, 55, 0.6)',
                border: '1px solid rgba(75, 85, 99, 0.4)',
                borderRadius: '50px',
                padding: '8px 24px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#22d3ee', // Cyan 400
                  borderRadius: '50%',
                  boxShadow: '0 0 10px #22d3ee',
                }}
              />
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#e5e7eb', // Gray 200
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Andrew Altair • AI ექსპერტი
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                // Adaptive size so long Georgian titles render FULLY (no clip).
                fontSize: title.length > 90 ? '46px' : title.length > 60 ? '58px' : title.length > 40 ? '70px' : '84px',
                fontWeight: 800,
                background: 'linear-gradient(to right, #ffffff, #a5f3fc)', // White to Cyan 200
                backgroundClip: 'text',
                color: 'transparent',
                textAlign: type === 'post' ? 'left' : 'center',
                lineHeight: 1.1,
                margin: '0 0 24px 0',
                letterSpacing: '-0.02em',
                textShadow: '0 0 40px rgba(34, 211, 238, 0.2)',
              }}
            >
              {title}
            </h1>

            {/* Description — hidden for insight cards (title-only per directive) */}
            {type !== 'insight' && description && (
              <p
                style={{
                  fontSize: '32px',
                  color: '#9ca3af', // Gray 400
                  textAlign: type === 'post' ? 'left' : 'center',
                  lineHeight: 1.5,
                  margin: '0 0 40px 0',
                  maxWidth: '1000px',
                }}
              >
                {description}
              </p>
            )}

            {/* Meta Info Row (Tags & Date) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                marginTop: '10px',
              }}
            >
              {tags.length > 0 && tags.slice(0, 3).map((tag, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    color: '#818cf8', // Indigo 400
                    padding: '8px 20px',
                    borderRadius: '12px',
                    fontSize: '20px',
                    fontWeight: 500,
                  }}
                >
                  #{tag}
                </div>
              ))}

              {date && (
                <div
                  style={{
                    color: '#6b7280', // Gray 500
                    fontSize: '20px',
                    fontWeight: 500,
                  }}
                >
                  {new Date(date).toLocaleDateString('ka-GE', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              )}
            </div>

            {/* Bottom Bar: Stats — default view only; hidden for post + insight */}
            {type !== 'post' && type !== 'insight' && (
              <div
                style={{
                  display: 'flex',
                  gap: '60px',
                  marginTop: '60px',
                  paddingTop: '40px',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                {[
                  { label: 'გამოცდილება', value: '8+ წელი' },
                  { label: 'პროექტი', value: '100+' },
                  { label: 'კლიენტი', value: '50+' },
                ].map((stat, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '32px', fontWeight: 700, color: '#f3f4f6' }}>{stat.value}</span>
                    <span style={{ fontSize: '18px', color: '#6b7280', marginTop: '4px' }}>{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Domain */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div style={{ width: '8px', height: '8px', background: '#22d3ee', borderRadius: '50%' }} />
            <span
              style={{
                fontSize: '24px',
                color: '#e5e7eb',
                fontWeight: 600,
                fontFamily: 'monospace',
              }}
            >
              andrewaltair.ge
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        ...(GEORGIAN_FONTS ? { fonts: GEORGIAN_FONTS } : {}),
      }
    );
  } catch (error) {
    console.error('OG Image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
