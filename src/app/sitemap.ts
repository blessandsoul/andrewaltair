import { MetadataRoute } from 'next'
import { getAllArticles } from '@/data/vibeCodingContent'
import dbConnect from '@/lib/db'
import Post from '@/models/Post'
import Insight from '@/models/Insight'
import Tutorial from '@/models/Tutorial'
import MarketplacePrompt from '@/models/MarketplacePrompt'
import Bot from '@/models/Bot'
import Video from '@/models/Video'

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://andrewaltair.ge'

    // Static pages with fixed dates
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date('2025-06-01'),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date('2025-06-01'),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/insights`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/encyclopedia/vibe-coding`,
            lastModified: new Date('2025-01-01'),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/bots/pricing`,
            lastModified: new Date('2025-01-01'),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/videos`,
            lastModified: new Date('2025-01-01'),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/tools`,
            lastModified: new Date('2025-01-01'),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/prompts`,
            lastModified: new Date('2025-01-01'),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/bots`,
            lastModified: new Date('2025-01-01'),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/encyclopedia/ai-2026`,
            lastModified: new Date('2025-01-01'),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date('2025-01-01'),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/tutorials`,
            lastModified: new Date('2025-01-01'),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date('2025-01-01'),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/quiz`,
            lastModified: new Date('2025-01-01'),
            changeFrequency: 'yearly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/bots/affiliate`,
            lastModified: new Date('2025-01-01'),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date('2025-01-01'),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/mystic`,
            lastModified: new Date('2025-01-01'),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date('2025-01-01'),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date('2025-01-01'),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ]

    // Vibe Coding Library articles (static data)
    const libraryArticles = getAllArticles()
    const libraryUrls: MetadataRoute.Sitemap = libraryArticles.map((article) => ({
        url: `${baseUrl}/encyclopedia/vibe-coding/${article.id}`,
        lastModified: new Date('2025-01-01'),
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

        blogUrls = posts.map((post) => ({
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

    // Bots (New Marketplace)
    let botEntries: MetadataRoute.Sitemap = []
    try {
        const bots = await Bot.find({ tier: { $ne: 'private' }, isActive: true })
            .select('_id updatedAt createdAt')
            .lean()

        botEntries = bots.map((bot) => ({
            url: `${baseUrl}/bots/${bot._id}`,
            lastModified: bot.updatedAt || bot.createdAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }))
    } catch (error) {
        console.error('Sitemap: Error fetching bots:', error)
    }

    // Videos
    let videoUrls: MetadataRoute.Sitemap = []
    try {
        const videos = await Video.find({})
            .select('_id updatedAt createdAt')
            .lean()

        videoUrls = videos.map((video) => ({
            url: `${baseUrl}/videos/${video._id}`,
            lastModified: video.updatedAt || video.createdAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))
    } catch (error) {
        console.error('Sitemap: Error fetching videos:', error)
    }

    // Insights
    let insightUrls: MetadataRoute.Sitemap = []
    try {
        const insights = await Insight.find({ status: 'published' })
            .select('slug updatedAt createdAt')
            .lean()

        insightUrls = insights.map((insight) => ({
            url: `${baseUrl}/insights/${insight.slug}`,
            lastModified: insight.updatedAt || insight.createdAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))
    } catch (error) {
        console.error('Sitemap: Error fetching insights:', error)
    }

    return [...staticPages, ...libraryUrls, ...blogUrls, ...insightUrls, ...tutorialUrls, ...promptUrls, ...botEntries, ...videoUrls]
}
