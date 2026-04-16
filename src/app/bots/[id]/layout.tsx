import type { Metadata } from 'next';
import { BotService } from '@/services/bot.service';

const BASE_URL = 'https://andrewaltair.ge';

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    try {
        const bot = await BotService.getBotById(id);

        if (!bot) {
            return {
                title: 'AI ბოტი | andrewaltair.ge',
                robots: { index: false },
            };
        }

        const title = `${bot.name} - AI ბოტი | andrewaltair.ge`;
        const description = bot.shortDescription || bot.description?.slice(0, 155) || 'AI ბოტი andrewaltair.ge მარკეტფლეისზე';
        const canonical = `${BASE_URL}/bots/${id}`;

        return {
            title,
            description,
            alternates: { canonical },
            openGraph: {
                title,
                description,
                url: canonical,
                type: 'website',
                images: [{ url: '/og.png', width: 1200, height: 630 }],
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
            },
        };
    } catch {
        return {
            title: 'AI ბოტი | andrewaltair.ge',
            robots: { index: false },
        };
    }
}

export default function BotLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
