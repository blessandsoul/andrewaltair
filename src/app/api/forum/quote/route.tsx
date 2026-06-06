import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

import { getForumPersona } from '@/lib/georgian-forum-personas';

export const runtime = 'edge';

/**
 * GET /api/forum/quote?persona=<id>&text=<quote>
 * Shareable 1080×1080 quote card: persona portrait + their line + ANDREWALTAIR.GE.
 * Edge + query-params only (no DB): the share button passes the text it already has.
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams, origin } = new URL(request.url);
        const personaId = searchParams.get('persona') || '';
        const text = (searchParams.get('text') || '').slice(0, 400).trim();
        const persona = getForumPersona(personaId);
        const name = persona?.name || 'დიდებულთა საბჭო';
        const era = persona?.era || '';
        const portrait = persona ? `${origin}/forum-personas/${persona.id}.png` : '';

        const fontData = await fetch(new URL('/fonts/NotoSansGeorgian.ttf', origin)).then((r) => r.arrayBuffer());
        const fs = text.length > 240 ? 38 : text.length > 150 ? 46 : 56;

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        backgroundColor: '#0b0a0f',
                        backgroundImage:
                            'radial-gradient(circle at 28% 18%, rgba(124,58,237,0.20), transparent 55%), radial-gradient(circle at 82% 90%, rgba(224,64,251,0.15), transparent 55%)',
                        padding: '76px',
                        fontFamily: 'NotoG',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                        {portrait ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={portrait} width={132} height={132} style={{ borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.15)' }} alt="" />
                        ) : null}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: 46, color: '#ffffff', fontWeight: 700 }}>{name}</div>
                            <div style={{ fontSize: 28, color: '#b9b6c6' }}>{era}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', fontSize: fs, color: '#ffffff', lineHeight: 1.35 }}>„{text}"</div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 30, color: '#e040fb', fontWeight: 700, letterSpacing: 2 }}>ANDREWALTAIR.GE</div>
                        <div style={{ fontSize: 26, color: '#8a8796' }}>დიდებულთა საბჭო</div>
                    </div>
                </div>
            ),
            { width: 1080, height: 1080, fonts: [{ name: 'NotoG', data: fontData, weight: 400, style: 'normal' }] },
        );
    } catch {
        return new Response('quote image error', { status: 500 });
    }
}
