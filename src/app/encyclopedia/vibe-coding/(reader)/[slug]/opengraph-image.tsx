import { ImageResponse } from 'next/og';
import { getArticleById } from '@/data/vibeCodingContent';

export const runtime = 'edge';
export const alt = 'Vibe Coding Article';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
    const article = getArticleById(params.slug);
    const title = article?.title || 'Vibe Coding Encyclopedia';

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #111827, #374151)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: '40px',
                    }}
                >
                    <h1
                        style={{
                            fontSize: '60px',
                            fontWeight: 'bold',
                            color: 'white',
                            marginBottom: '20px',
                            lineHeight: 1.2,
                            background: 'linear-gradient(to right, #a855f7, #ec4899)',
                            backgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        {title}
                    </h1>
                    <div
                        style={{
                            fontSize: '30px',
                            color: '#d1d5db',
                            marginTop: '20px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        Andrew Altair • Vibe Coding
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
