import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { InsightsFeed } from '@/components/insights';
import { InsightService } from '@/services/insight.service';
import { slugToRawTag } from '@/lib/slug';

// The page reads searchParams (request-dynamic), but the Mongo reads below are
// memoized via unstable_cache — the old force-dynamic version ran TWO live
// collection scans (100 docs for the tag map + the page query) on every hit,
// including every crawler hit. Tag 'insights' is busted on publish.
const getCachedTagCounts = unstable_cache(
    async (): Promise<Record<string, number>> => {
        const all = await InsightService.getAllInsights({ status: 'published', limit: 100 });
        const tagCounts: Record<string, number> = {};
        for (const insight of all.insights) {
            for (const t of (insight.tags || [])) {
                tagCounts[t] = (tagCounts[t] || 0) + 1;
            }
        }
        return JSON.parse(JSON.stringify(tagCounts));
    },
    ['insights-tagmap'],
    { revalidate: 600, tags: ['insights'] }
);

const getCachedInsightsPage = unstable_cache(
    async (tag: string | null) => {
        const { insights, pagination } = await InsightService.getAllInsights({
            status: 'published',
            limit: 10,
            tag,
        });
        // serialize inside the cached fn — the cache stores plain JSON
        return JSON.parse(JSON.stringify({ insights, pagination }));
    },
    ['insights-listing'],
    { revalidate: 120, tags: ['insights'] }
);

export async function generateMetadata(props: {
    searchParams: Promise<{ tag?: string }>;
}): Promise<Metadata> {
    const { tag } = await props.searchParams;
    return {
        title: 'AI ინსაითები — დღის სიახლეები',
        description: 'მოკლე ანალიტიკა და კომენტარები ხელოვნური ინტელექტისა და ტექნოლოგიების სამყაროდან.',
        // ?tag= variants flooded GSC as duplicates — noindex,follow collapses them
        ...(tag ? { robots: { index: false, follow: true } } : {}),
        alternates: { canonical: '/insights' },
        openGraph: {
            title: 'Insights | Andrew Altair',
            description: 'მოკლე ანალიტიკა და კომენტარები ხელოვნური ინტელექტისა და ტექნოლოგიების სამყაროდან.',
            type: 'website',
            url: 'https://andrewaltair.ge/insights',
        },
    };
}

export default async function InsightsPage({
    searchParams,
}: {
    searchParams: Promise<{ tag?: string }>;
}) {
    const { tag } = await searchParams;

    // Tag map for the filter URL param — cached, no per-request collection scan.
    const tagCounts = await getCachedTagCounts();

    const popularTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([t]) => t);

    // Resolve tag slug → raw tag, or fall back to raw value (backward compat).
    const allKnownTags = Object.keys(tagCounts);
    const resolvedTag = tag ? (slugToRawTag(tag, allKnownTags) ?? tag) : null;

    const { insights: serializedInsights, pagination } = await getCachedInsightsPage(resolvedTag);

    const siteUrl = 'https://andrewaltair.ge';
    const collectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${siteUrl}/insights#collection`,
        url: `${siteUrl}/insights`,
        name: 'Insights | Andrew Altair',
        description: 'მოკლე ანალიტიკა და კომენტარები ხელოვნური ინტელექტისა და ტექნოლოგიების სამყაროდან.',
        inLanguage: 'ka',
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#person` },
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: serializedInsights.length,
            itemListElement: serializedInsights.slice(0, 20).map((insight: any, i: number) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `${siteUrl}/insights/${insight.slug}`,
                name: insight.title,
            })),
        },
    };

    return (
        <main className="min-h-screen bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />
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
