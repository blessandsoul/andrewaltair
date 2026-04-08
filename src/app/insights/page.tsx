export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { InsightsFeed } from '@/components/insights';
import { InsightService } from '@/services/insight.service';

export const metadata: Metadata = {
    title: 'Insights | Andrew Altair',
    description: 'მოკლე ანალიტიკა და კომენტარები ხელოვნური ინტელექტისა და ტექნოლოგიების სამყაროდან.',
    openGraph: {
        title: 'Insights | Andrew Altair',
        description: 'მოკლე ანალიტიკა და კომენტარები ხელოვნური ინტელექტისა და ტექნოლოგიების სამყაროდან.',
        type: 'website',
    },
};

export default async function InsightsPage({
    searchParams,
}: {
    searchParams: Promise<{ tag?: string }>;
}) {
    const { tag } = await searchParams;

    const { insights, pagination } = await InsightService.getAllInsights({
        status: 'published',
        limit: 10,
        tag: tag || null,
    });

    // Get popular tags for filter
    const allInsights = await InsightService.getAllInsights({
        status: 'published',
        limit: 100,
    });

    const tagCounts: Record<string, number> = {};
    for (const insight of allInsights.insights) {
        for (const t of (insight.tags || [])) {
            tagCounts[t] = (tagCounts[t] || 0) + 1;
        }
    }

    const popularTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([t]) => t);

    const serializedInsights = JSON.parse(JSON.stringify(insights));

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-10 max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-foreground mb-3">
                        Insights
                    </h1>
                    <p className="text-muted-foreground">
                        მოკლე ანალიტიკა და კომენტარები AI სამყაროდან
                    </p>
                </div>

                <InsightsFeed
                    initialInsights={serializedInsights}
                    initialHasMore={pagination.page < pagination.pages}
                    activeTag={tag}
                    allTags={popularTags}
                />
            </div>
        </main>
    );
}
