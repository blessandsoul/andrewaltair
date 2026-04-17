import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI 2026 - სრული გზამკვლევი',
    description: 'AI 2026 ენციკლოპედია - ხელოვნური ინტელექტის მდგომარეობა 2026 წელს. მოდელები, ტრენდები, პროგნოზები.',
    alternates: { canonical: '/encyclopedia/ai-2026' },
    openGraph: {
        title: 'AI 2026 - სრული გზამკვლევი | Andrew Altair',
        description: 'AI 2026 ენციკლოპედია - ხელოვნური ინტელექტის მდგომარეობა 2026 წელს.',
        type: 'website',
        url: 'https://andrewaltair.ge/encyclopedia/ai-2026',
    },
};

export default function AI2026LandingLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
