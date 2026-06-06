import { readFileSync } from 'fs';
import { join } from 'path';
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

import { getForumPersona } from '@/lib/georgian-forum-personas';

// Node runtime (NOT edge): we read the bundled font + portrait straight off disk, so the
// card never depends on the container being able to fetch its own public URL (which fails
// behind the proxy and was rendering tofu boxes + a blank portrait).
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function publicFile(rel: string): Buffer | null {
    try {
        return readFileSync(join(process.cwd(), 'public', rel));
    } catch {
        return null;
    }
}

/** GET /api/forum/quote?persona=<id>&text=<quote> → 1080×1080 shareable card. */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const personaId = searchParams.get('persona') || '';
        const text = (searchParams.get('text') || '').slice(0, 400).trim() || 'დიდებულთა საბჭო';
        const persona = getForumPersona(personaId);
        const name = persona?.name || 'დიდებულთა საბჭო';
        const era = persona?.era || '';

        const pbuf = persona ? publicFile(`forum-personas/${persona.id}.png`) : null;
        const portrait = pbuf ? `data:image/png;base64,${pbuf.toString('base64')}` : '';

        const reg = publicFile('fonts/NotoSansGeorgian-Regular.ttf');
        const bold = publicFile('fonts/NotoSansGeorgian-Bold.ttf');
        const fonts: { name: string; data: Buffer; weight: 400 | 700; style: 'normal' }[] = [];
        if (reg) fonts.push({ name: 'NotoG', data: reg, weight: 400, style: 'normal' });
        if (bold) fonts.push({ name: 'NotoG', data: bold, weight: 700, style: 'normal' });

        const fs2 = text.length > 240 ? 38 : text.length > 150 ? 46 : 56;

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

                    <div style={{ display: 'flex', fontSize: fs2, color: '#ffffff', lineHeight: 1.35 }}>„{text}"</div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 30, color: '#e040fb', fontWeight: 700, letterSpacing: 2 }}>ANDREWALTAIR.GE</div>
                        <div style={{ fontSize: 26, color: '#8a8796' }}>დიდებულთა საბჭო</div>
                    </div>
                </div>
            ),
            { width: 1080, height: 1080, ...(fonts.length ? { fonts } : {}) },
        );
    } catch (e) {
        return new Response('quote image error: ' + (e instanceof Error ? e.message : 'unknown'), { status: 500 });
    }
}
