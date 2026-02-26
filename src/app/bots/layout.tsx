import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI ბოტები',
    description: 'AI ბოტების მარკეტფლეისი — პირველი საქართველოში. ChatGPT, Claude და სხვა AI ბოტები ბიზნესისა და კრეატიული სამუშაოებისთვის.',
    openGraph: {
        title: 'AI ბოტები მარკეტფლეისი',
        description: 'AI ბოტების მარკეტფლეისი — პირველი საქართველოში.',
        type: 'website',
        images: [{ url: '/og.png', width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AI ბოტები',
        description: 'AI ბოტების მარკეტფლეისი — პირველი საქართველოში.',
    },
    alternates: {
        canonical: 'https://andrewaltair.ge/bots',
    },
};

export default function BotsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
