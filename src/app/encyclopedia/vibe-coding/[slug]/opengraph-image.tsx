import { ImageResponse } from 'next/og'
import { getArticleById } from '@/data/vibeCodingContent'

export const runtime = 'edge'

export const alt = 'Vibe Coding Article'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
    const article = getArticleById(params.slug)
    const title = article?.title || 'Vibe Coding Article'

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
                    backgroundColor: '#0a0a0a', // Dark background
                    color: 'white',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px 80px',
                        border: '2px solid #333',
                        borderRadius: '20px',
                        backgroundColor: '#111',
                        boxShadow: '0 10px 50px rgba(0,0,0,0.5)',
                    }}
                >
                    <div style={{ fontSize: 24, marginBottom: 20, color: '#888', textTransform: 'uppercase', letterSpacing: '4px' }}>
                        VIBE CODING ENCYCLOPEDIA
                    </div>
                    <div
                        style={{
                            fontSize: 72,
                            fontWeight: 900,
                            textAlign: 'center',
                            lineHeight: 1.1,
                            marginBottom: 30,
                            background: 'linear-gradient(to right, #fff, #aaa)',
                            backgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        {title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ fontSize: 30, color: '#666' }}>
                            andrewaltair.ge
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
