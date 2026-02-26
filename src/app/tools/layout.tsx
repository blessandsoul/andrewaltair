import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI ინსტრუმენტები',
    description: 'საუკეთესო AI ინსტრუმენტები ერთ ადგილას. ტექსტის გენერაცია, სურათები, კოდი, ავტომატიზაცია — ყველაფერი ქართულ ბაზარზე.',
    openGraph: {
        title: 'AI ინსტრუმენტები',
        description: 'საუკეთესო AI ინსტრუმენტები ერთ ადგილას.',
        type: 'website',
        images: [{ url: '/og.png', width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AI ინსტრუმენტები',
        description: 'საუკეთესო AI ინსტრუმენტები ერთ ადგილას.',
    },
    alternates: {
        canonical: 'https://andrewaltair.ge/tools',
    },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
