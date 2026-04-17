import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Submit Bot',
    robots: { index: false, follow: false },
    alternates: { canonical: '/bots/add' },
};

export default function AddBotLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
