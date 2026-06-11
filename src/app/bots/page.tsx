import { unstable_cache } from 'next/cache'
import { BotService } from '@/services/bot.service'
import BotsPageClient from './BotsPageClient'

// Server wrapper for the bots marketplace. The marketplace UI is a large
// client component, but it used to fetch-on-mount — the entire catalog was
// invisible to crawlers (empty initial HTML, ItemList numberOfItems:0).
// Here the catalog is fetched server-side, emitted as JSON-LD + seeded into
// the client as initial state, so the full grid is in the SSR HTML.

const getCachedBots = unstable_cache(
    async () => {
        const { bots } = await BotService.getAllBots({ limit: 100 })
        return JSON.parse(JSON.stringify(bots))
    },
    ['bots-listing'],
    { revalidate: 600, tags: ['bots'] }
)

export default async function BotsPage() {
    let bots: any[] = []
    try {
        bots = await getCachedBots()
    } catch (error) {
        console.error('[BotsPage] failed to fetch bots server-side:', error)
    }

    const siteUrl = 'https://andrewaltair.ge'
    const itemListLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        '@id': `${siteUrl}/bots#catalog`,
        name: 'AI Bots Marketplace',
        numberOfItems: bots.length,
        itemListElement: bots.slice(0, 30).map((bot: any, i: number) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'SoftwareApplication',
                name: bot.name,
                url: `${siteUrl}/bots/${bot.slug || bot.codename || bot.id}`,
                applicationCategory: 'UtilitiesApplication',
                description: bot.shortDescription || bot.description,
                offers: {
                    '@type': 'Offer',
                    price: bot.tier === 'free' ? 0 : (bot.salePrice ?? bot.price ?? 0),
                    priceCurrency: 'GEL',
                },
                aggregateRating: bot.rating
                    ? { '@type': 'AggregateRating', ratingValue: bot.rating, reviewCount: bot.reviewCount || bot.totalReviews || 1 }
                    : undefined,
            },
        })),
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
            />
            <BotsPageClient initialBots={bots} />
        </>
    )
}
