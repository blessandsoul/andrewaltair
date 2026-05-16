import type { Metadata } from 'next'

const BASE_URL = 'https://andrewaltair.ge'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const canonical = `${BASE_URL}/tools/${id}`

    return {
        title: 'AI Tool | Andrew Altair',
        description: 'AI ინსტრუმენტი — andrewaltair.ge.',
        alternates: { canonical },
        openGraph: {
            title: 'AI Tool | Andrew Altair',
            description: 'AI ინსტრუმენტი — andrewaltair.ge.',
            type: 'website',
            url: canonical,
        },
    }
}

export default function ToolLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
