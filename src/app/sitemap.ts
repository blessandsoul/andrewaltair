import { MetadataRoute } from 'next'
import { getAllArticles } from '@/data/vibeCodingContent'
import dbConnect from '@/lib/db'
import Post from '@/models/Post'
import Insight from '@/models/Insight'
import Tutorial from '@/models/Tutorial'
import MarketplacePrompt from '@/models/MarketplacePrompt'
import Bot from '@/models/Bot'
import { BLOG_SLUG_REDIRECTS } from '@/data/blogSlugRedirects'
import { INSIGHT_SLUG_REDIRECTS } from '@/data/insightSlugRedirects'

// Cached for an hour — force-dynamic ran 7 Mongo collection scans on EVERY
// /sitemap.xml hit (and crawlers hit it constantly). Publish flow busts it
// via revalidatePath('/sitemap.xml').
export const revalidate = 3600;

// lastModified for pages that only change on deploys — a hardcoded ancient
// date ('2025-01-01') told Googlebot "nothing here changed in 18 months".
const DEPLOY_DATE = new Date('2026-06-12')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://andrewaltair.ge'

    // Home + listing pages reflect the freshest piece of content underneath them,
    // not a hardcoded date. Stale lastmod (was: 2025-06-01) signals "not updated"
    // to Googlebot and demotes crawl frequency on the root URL — bad for a site
    // publishing 30-50 insights/day.
    const now = new Date()

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/insights`,
            lastModified: now,
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/en/insights`,
            lastModified: now,
            changeFrequency: 'hourly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/encyclopedia/vibe-coding`,
            lastModified: DEPLOY_DATE,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/bots/pricing`,
            lastModified: DEPLOY_DATE,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/videos`,
            lastModified: DEPLOY_DATE,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/tools`,
            lastModified: DEPLOY_DATE,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/prompts`,
            lastModified: DEPLOY_DATE,
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/bots`,
            lastModified: DEPLOY_DATE,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/encyclopedia/ai-2026`,
            lastModified: DEPLOY_DATE,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: DEPLOY_DATE,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/tutorials`,
            lastModified: DEPLOY_DATE,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: DEPLOY_DATE,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        // /quiz, /bots/affiliate, /mystic intentionally excluded from sitemap (noindex pages — SEO cleanup 2026-05-27).
        {
            url: `${baseUrl}/about`,
            lastModified: DEPLOY_DATE,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: DEPLOY_DATE,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: DEPLOY_DATE,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ]

    // Vibe Coding Library articles (static data)
    const libraryArticles = getAllArticles()
    const libraryUrls: MetadataRoute.Sitemap = libraryArticles.map((article) => ({
        url: `${baseUrl}/encyclopedia/vibe-coding/${article.id}`,
        lastModified: DEPLOY_DATE,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    // Blog posts from MongoDB
    let blogUrls: MetadataRoute.Sitemap = []
    try {
        await dbConnect()
        const posts = await Post.find({ status: 'published' })
            .select('slug updatedAt createdAt')
            .lean()

        blogUrls = posts
            // dead/duplicate slugs 301 away via middleware — never list them
            .filter((post) => !(post.slug in BLOG_SLUG_REDIRECTS))
            .map((post) => ({
                url: `${baseUrl}/blog/${post.slug}`,
                lastModified: post.updatedAt || post.createdAt || new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }))
    } catch (error) {
        console.error('Sitemap: Error fetching blog posts:', error)
    }

    // Tutorials from MongoDB
    let tutorialUrls: MetadataRoute.Sitemap = []
    try {
        const tutorials = await Tutorial.find({ status: 'published' })
            .select('slug updatedAt createdAt')
            .lean()

        tutorialUrls = tutorials.map((tutorial) => ({
            url: `${baseUrl}/tutorials/${tutorial.slug}`,
            lastModified: tutorial.updatedAt || tutorial.createdAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))
    } catch (error) {
        console.error('Sitemap: Error fetching tutorials:', error)
    }

    // NOTE: /repositories/{slug} intentionally excluded from sitemap.
    // Repo posts are also served at /blog/{slug} (canonical) — listing both
    // created duplicate URLs in Google Search Console. /repositories/{slug}
    // now canonicals to /blog/{slug}.

    // Marketplace Prompts from MongoDB
    let promptUrls: MetadataRoute.Sitemap = []
    try {
        const prompts = await MarketplacePrompt.find({ status: 'published' })
            .select('slug updatedAt createdAt')
            .lean()

        promptUrls = prompts.map((prompt) => ({
            url: `${baseUrl}/prompts/${prompt.slug}`,
            lastModified: prompt.updatedAt || prompt.createdAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))
    } catch (error) {
        console.error('Sitemap: Error fetching marketplace prompts:', error)
    }

    // Bots (New Marketplace) — human-readable slug/codename URLs; raw ObjectId
    // URLs 301 to these via the bot detail server page
    let botEntries: MetadataRoute.Sitemap = []
    try {
        const bots = await Bot.find({ tier: { $ne: 'private' }, isActive: true })
            .select('_id slug codename updatedAt createdAt')
            .lean()

        botEntries = bots.map((bot) => ({
            url: `${baseUrl}/bots/${(bot as { slug?: string }).slug || bot.codename || bot._id}`,
            lastModified: bot.updatedAt || bot.createdAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }))
    } catch (error) {
        console.error('Sitemap: Error fetching bots:', error)
    }

    // NOTE: /videos/{id} pages intentionally excluded — they were ~471 of 974
    // URLs (half the sitemap, ObjectId URLs) and are already covered with real
    // video metadata in /sitemap-videos.xml. Listing both wasted crawl budget.

    // Insights
    let insightUrls: MetadataRoute.Sitemap = []
    try {
        const insights = await Insight.find({ status: 'published' })
            .select('slug language updatedAt createdAt')
            .lean()

        insightUrls = insights
            // dead/duplicate slugs 301 away via middleware — never list them
            .filter((insight) => !(insight.slug in INSIGHT_SLUG_REDIRECTS))
            .map((insight) => ({
                // EN insights live under /en/insights — list the canonical URL,
                // never the KA path that would 301.
                url: `${baseUrl}${insight.language === 'en' ? '/en/insights' : '/insights'}/${insight.slug}`,
                lastModified: insight.updatedAt || insight.createdAt || new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }))
    } catch (error) {
        console.error('Sitemap: Error fetching insights:', error)
    }

    return [...staticPages, ...libraryUrls, ...blogUrls, ...insightUrls, ...tutorialUrls, ...promptUrls, ...botEntries]
}
