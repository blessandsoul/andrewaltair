import { MetadataRoute } from 'next'
import { getAllArticles } from '@/data/vibeCodingContent'
import dbConnect from '@/lib/db'
import Post from '@/models/Post'
import MarketplacePrompt from '@/models/MarketplacePrompt'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://andrewaltair.ge'

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/encyclopedia/vibe-coding`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/tools`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/videos`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/mystic`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ]

    // Vibe Coding Library articles (static data)
    const libraryArticles = getAllArticles()
    const libraryUrls: MetadataRoute.Sitemap = libraryArticles.map((article) => ({
        url: `${baseUrl}/encyclopedia/vibe-coding/${article.id}`,
        lastModified: new Date(),
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

    // Marketplace Prompts from MongoDB
    let promptUrls: MetadataRoute.Sitemap = []
    try {
        await dbConnect()
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

    return [...staticPages, ...libraryUrls, ...blogUrls, ...promptUrls]
}
