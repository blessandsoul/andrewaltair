import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Bots ფასები',
    description: 'AI ბოტების ფასები და გეგმები — free, premium, private. აირჩიე შენი ბიზნესისთვის შესაფერისი პაკეტი.',
    alternates: { canonical: '/bots/pricing' },
    openGraph: {
        title: 'AI Bots ფასები | Andrew Altair',
        description: 'AI ბოტების ფასები და გეგმები — free, premium, private.',
        type: 'website',
        url: 'https://andrewaltair.ge/bots/pricing',
    },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
