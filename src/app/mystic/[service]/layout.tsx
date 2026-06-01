import type { Metadata } from 'next'

const BASE_URL = 'https://andrewaltair.ge'

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }): Promise<Metadata> {
    const { service } = await params
    const canonical = `${BASE_URL}/mystic/${service}`

    return {
        title: 'Mystic | Andrew Altair',
        description: 'მისტიკური სერვისი — andrewaltair.ge.',
        robots: {
            index: false,
            follow: true,
            googleBot: { index: false, follow: true },
        },
        alternates: { canonical },
        openGraph: {
            title: 'Mystic | Andrew Altair',
            description: 'მისტიკური სერვისი — andrewaltair.ge.',
            type: 'website',
            url: canonical,
        },
    }
}

export default function MysticServiceLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
