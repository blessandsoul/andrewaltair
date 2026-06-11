import { notFound, permanentRedirect } from 'next/navigation'
import mongoose from 'mongoose'
import { BotService } from '@/services/bot.service'
import BotDetailClient from './BotDetailClient'

// Server wrapper for the bot detail page. The interactive UI is a client
// component, but it used to fetch-on-mount — bot name/description/JSON-LD were
// absent from the initial HTML while the URL sat in the sitemap (Google crawled
// empty shells). Now the bot is fetched server-side, ObjectId URLs 301 to the
// human-readable codename URL, and SoftwareApplication JSON-LD ships in HTML.

export default async function BotDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    let rawBot
    try {
        rawBot = await BotService.getBotById(id)
    } catch (error) {
        console.error(`[BotDetailPage] DB error for /bots/${id}:`, error)
        throw error
    }

    if (!rawBot) notFound()

    // Canonical URL is slug → codename → id. Old ObjectId URLs are indexed —
    // 301 them to the canonical instead of serving duplicates.
    const canonicalSlug = (rawBot as any).slug || rawBot.codename
    if (canonicalSlug && mongoose.Types.ObjectId.isValid(id) && canonicalSlug !== id) {
        permanentRedirect(`/bots/${canonicalSlug}`)
    }

    const bot = JSON.parse(JSON.stringify(rawBot))
    const siteUrl = 'https://andrewaltair.ge'
    const canonicalUrl = `${siteUrl}/bots/${canonicalSlug || bot.id}`

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: bot.name,
        description: bot.shortDescription || bot.description,
        url: canonicalUrl,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        inLanguage: 'ka',
        offers: {
            '@type': 'Offer',
            price: bot.tier === 'free' ? 0 : (bot.salePrice ?? bot.price ?? 0),
            priceCurrency: 'GEL',
            availability: 'https://schema.org/InStock',
        },
        ...(bot.rating
            ? {
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: bot.rating,
                    reviewCount: bot.reviewCount || bot.totalReviews || 1,
                },
            }
            : {}),
        publisher: {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'Andrew Altair',
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    }

    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'AI Bots', item: `${siteUrl}/bots` },
            { '@type': 'ListItem', position: 3, name: bot.name, item: canonicalUrl },
        ],
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            <BotDetailClient initialBot={bot} />
        </>
    )
}
