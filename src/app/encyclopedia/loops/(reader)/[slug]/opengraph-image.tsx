import { ImageResponse } from 'next/og';
import { getArticleById } from '@/data/loopsContent';

export const runtime = 'edge';
export const alt = 'Loops Encyclopedia';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
    const article = getArticleById(params.slug);
    const title = article?.title || 'ციკლები (Loops)';

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #1e1b4b, #312e81)',
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
                            marginBottom: '20px',
                            lineHeight: 1.2,
                            color: '#ffffff',
                        }}
                    >
                        {title}
                    </h1>
                    <div
                        style={{
                            fontSize: '30px',
                            color: '#c7d2fe',
                            marginTop: '20px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        Andrew Altair • Loops
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
