import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Affiliate Program',
    description: 'გახდი Andrew Altair affiliate partner — გაიყიდე AI ბოტები და მიიღე საკომისიო.',
    alternates: { canonical: '/bots/affiliate' },
    robots: { index: false, follow: true },
};

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
