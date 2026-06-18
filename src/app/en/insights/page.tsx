import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { InsightsFeed } from '@/components/insights';
import { InsightService } from '@/services/insight.service';
import { slugToRawTag } from '@/lib/slug';

// English insights surface. Mirrors /insights but filters language:'en' and
// renders English chrome. Separate unstable_cache keys from the KA listing so
// the two feeds never collide. Tag 'insights' is busted on every publish.
const getCachedTagCounts = unstable_cache(
    async (): Promise<Record<string, number>> => {
        const all = await InsightService.getAllInsights({ status: 'published', limit: 100, language: 'en' });
        const tagCounts: Record<string, number> = {};
        for (const insight of all.insights) {
            for (const t of (insight.tags || [])) {
                tagCounts[t] = (tagCounts[t] || 0) + 1;
            }
        }
        return JSON.parse(JSON.stringify(tagCounts));
    },
    ['en-insights-tagmap'],
    { revalidate: 600, tags: ['insights'] }
);

const getCachedInsightsPage = unstable_cache(
    async (tag: string | null) => {
        const { insights, pagination } = await InsightService.getAllInsights({
            status: 'published',
            limit: 10,
            tag,
            language: 'en',
        });
        return JSON.parse(JSON.stringify({ insights, pagination }));
    },
    ['en-insights-listing'],
    { revalidate: 120, tags: ['insights'] }
);

export async function generateMetadata(props: {
    searchParams: Promise<{ tag?: string }>;
}): Promise<Metadata> {
    const { tag } = await props.searchParams;
    return {
        title: 'AI Insights — Daily News',
        description: 'Short analysis and commentary from the world of artificial intelligence and technology.',
        // ?tag= variants flood GSC as duplicates — noindex,follow collapses them
        ...(tag ? { robots: { index: false, follow: true } } : {}),
        alternates: { canonical: '/en/insights' },
        openGraph: {
            title: 'Insights | Andrew Altair',
            description: 'Short analysis and commentary from the world of artificial intelligence and technology.',
            type: 'website',
            url: 'https://andrewaltair.ge/en/insights',
            locale: 'en_US',
        },
    };
}

export default async function EnInsightsPage({
    searchParams,
}: {
    searchParams: Promise<{ tag?: string }>;
}) {
    const { tag } = await searchParams;

    const tagCounts = await getCachedTagCounts();

    const popularTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([t]) => t);

    const allKnownTags = Object.keys(tagCounts);
    const resolvedTag = tag ? (slugToRawTag(tag, allKnownTags) ?? tag) : null;

    const { insights: serializedInsights, pagination } = await getCachedInsightsPage(resolvedTag);

    const siteUrl = 'https://andrewaltair.ge';
    const collectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${siteUrl}/en/insights#collection`,
        url: `${siteUrl}/en/insights`,
        name: 'Insights | Andrew Altair',
        description: 'Short analysis and commentary from the world of AI and technology.',
        inLanguage: 'en',
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#person` },
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: serializedInsights.length,
            itemListElement: serializedInsights.slice(0, 20).map((insight: any, i: number) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `${siteUrl}/en/insights/${insight.slug}`,
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
                        Short analysis and commentary from the AI world
                    </p>
                    <a href="/insights" className="inline-block mt-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                        ქართულად →
                    </a>
                </div>

                <InsightsFeed
                    initialInsights={serializedInsights}
                    initialHasMore={pagination.page < pagination.pages}
                    activeTag={tag}
                    allTags={popularTags}
                    basePath="/en/insights"
                    language="en"
                />
            </div>
        </main>
    );
}
