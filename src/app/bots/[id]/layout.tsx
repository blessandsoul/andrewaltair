import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BotService } from '@/services/bot.service';

const BASE_URL = 'https://andrewaltair.ge';

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    // No try/catch: a wrapping catch would swallow NEXT_NOT_FOUND and serve a
    // noindex placeholder with HTTP 200 (soft-404). DB errors surface as 500.
    const bot = await BotService.getBotById(id);

    // notFound() in generateMetadata fires BEFORE streaming commits a 200
    if (!bot) notFound();

    const title = `${bot.name} — AI ბოტი`;
    const description = bot.shortDescription || bot.description?.slice(0, 155) || 'AI ბოტი andrewaltair.ge მარკეტფლეისზე';
    // canonical prefers the human-readable codename over a raw ObjectId
    const canonical = `${BASE_URL}/bots/${(bot as any).slug || bot.codename || id}`;

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
}

export default function BotLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
