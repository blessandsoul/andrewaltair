export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import Link from 'next/link';
import { TbClock, TbFlame, TbTrophy, TbSwords, TbSearch, TbUserQuestion, TbAffiliate } from 'react-icons/tb';

import { ForumService } from '@/services/forum.service';
import { ForumTopicCard, type ForumTopicCardData } from '@/components/forum/ForumTopicCard';
import { ForumDisclaimer } from '@/components/forum/ForumDisclaimer';
import { ForumAskCouncil } from '@/components/forum/ForumAskCouncil';
import { HotQuote, type HotQuoteData } from '@/components/forum/HotQuote';
import { cn } from '@/lib/utils';

const DESC = 'საქართველოს ისტორიული პირები განიხილავენ დღევანდელ ამბებს — AI-წარმოსახული დებატი.';

export const metadata: Metadata = {
    title: 'ფორუმი',
    description: DESC,
    alternates: { canonical: '/forum' },
    openGraph: {
        title: 'ფორუმი | Andrew Altair',
        description: DESC,
        type: 'website',
        url: 'https://andrewaltair.ge/forum',
    },
};

export default async function ForumPage({
    searchParams,
}: {
    searchParams: Promise<{ sort?: string }>;
}) {
    const { sort } = await searchParams;
    const hot = sort === 'hot';
    const { topics } = await ForumService.getAllTopics({
        status: 'published',
        limit: 30,
        sort: hot ? 'hot' : 'new',
    });
    const serialized = JSON.parse(JSON.stringify(topics)) as ForumTopicCardData[];
    const hotQuote = JSON.parse(JSON.stringify((await ForumService.getHotQuote()) ?? null)) as HotQuoteData | null;

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="text-center mb-6 max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-foreground mb-3">ფორუმი</h1>
                    <p className="text-muted-foreground">
                        საქართველოს ისტორიული პირები განიხილავენ დღევანდელ ამბებს
                    </p>
                </div>

                <div className="max-w-2xl mx-auto mb-6">
                    <ForumDisclaimer />
                </div>

                <div className="max-w-2xl mx-auto mb-8">
                    <ForumAskCouncil />
                </div>

                {hotQuote && (
                    <div className="max-w-2xl mx-auto mb-8">
                        <HotQuote quote={hotQuote} />
                    </div>
                )}

                {/* Controls: sort toggle + section nav */}
                <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
                    <div className="inline-flex rounded-full border border-border p-0.5 text-sm">
                        <Link
                            href="/forum"
                            className={cn(
                                "inline-flex items-center gap-1 rounded-full px-3 py-1.5 transition-colors",
                                !hot ? "bg-primary text-white" : "text-on-surface-variant hover:bg-muted",
                            )}
                        >
                            <TbClock className="w-4 h-4" />
                            ახალი
                        </Link>
                        <Link
                            href="/forum?sort=hot"
                            className={cn(
                                "inline-flex items-center gap-1 rounded-full px-3 py-1.5 transition-colors",
                                hot ? "bg-primary text-white" : "text-on-surface-variant hover:bg-muted",
                            )}
                        >
                            <TbFlame className="w-4 h-4" />
                            ცხელი
                        </Link>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <Link href="/forum/leaderboard" className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary">
                            <TbTrophy className="w-4 h-4" />
                            <span className="hidden sm:inline">ლიდერბორდი</span>
                        </Link>
                        <Link href="/forum/duel" className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary">
                            <TbSwords className="w-4 h-4" />
                            <span className="hidden sm:inline">დუელი</span>
                        </Link>
                        <Link href="/forum/search" className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary">
                            <TbSearch className="w-4 h-4" />
                            <span className="hidden sm:inline">ძებნა</span>
                        </Link>
                        <Link href="/forum/quiz" className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary">
                            <TbUserQuestion className="w-4 h-4" />
                            <span className="hidden sm:inline">ტესტი</span>
                        </Link>
                        <Link href="/forum/map" className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary">
                            <TbAffiliate className="w-4 h-4" />
                            <span className="hidden sm:inline">რუკა</span>
                        </Link>
                    </div>
                </div>

                {serialized.length === 0 ? (
                    <p className="text-center text-muted-foreground py-16">თემები ჯერ არ არის.</p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2">
                        {serialized.map((t) => (
                            <ForumTopicCard key={t.id} topic={t} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
