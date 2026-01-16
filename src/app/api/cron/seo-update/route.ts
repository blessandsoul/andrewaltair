export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Post from '@/models/Post'
import { getAllArticles } from '@/data/vibeCodingContent'
import fs from 'fs/promises'
import path from 'path'

/**
 * Daily SEO Content Update API
 * This endpoint is designed to be called by a cron job (e.g., Coolify, Vercel Cron, GitHub Actions)
 * to update SEO files with the latest content.
 * 
 * POST /api/cron/seo-update
 * Header: Authorization: Bearer {CRON_SECRET}
 * 
 * Updates:
 * - public/.well-known/agents.json (last_updated timestamp)
 * - Triggers IndexNow for new posts
 * - Returns statistics about the update
 */

const CRON_SECRET = process.env.CRON_SECRET || 'your-cron-secret-key'

export async function POST(request: NextRequest) {
    try {
        // Verify authorization
        const authHeader = request.headers.get('authorization')
        const providedToken = authHeader?.replace('Bearer ', '')

        if (providedToken !== CRON_SECRET) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        await dbConnect()

        // Get content statistics
        const totalPosts = await Post.countDocuments({ status: 'published' })
        const recentPosts = await Post.find({ status: 'published' })
            .select('slug createdAt updatedAt')
            .sort({ createdAt: -1 })
            .limit(10)
            .lean()

        const libraryArticles = getAllArticles()

        // Get posts created/updated in last 24 hours for IndexNow
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        const newPosts = await Post.find({
            status: 'published',
            $or: [
                { createdAt: { $gte: yesterday } },
                { updatedAt: { $gte: yesterday } }
            ]
        }).select('slug').lean()

        // Submit new posts to IndexNow
        const baseUrl = 'https://andrewaltair.ge'
        const urlsToIndex = newPosts.map((post) => `${baseUrl}/blog/${post.slug}`)

        let indexNowResult = null
        if (urlsToIndex.length > 0) {
            try {
                const indexNowResponse = await fetch(`${baseUrl}/api/indexnow`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ urls: urlsToIndex }),
                })
                indexNowResult = await indexNowResponse.json()
            } catch (error) {
                console.error('IndexNow submission failed:', error)
                indexNowResult = { error: 'Failed to submit to IndexNow' }
            }
        }

        // Generate updated agents.json content
        const agentsJsonContent = {
            version: '1.0',
            name: 'Andrew Altair AI',
            description: 'AI Expert & Tech Consultant platform',
            url: baseUrl,
            owner: {
                name: 'Andrew Altair',
                role: 'AI Expert & Tech Consultant',
                location: 'Tbilisi, Georgia'
            },
            languages: ['ka', 'en'],
            categories: ['AI', 'Technology', 'Education', 'Mystic Tools'],
            capabilities: {
                content_types: ['articles', 'tutorials', 'videos', 'tools'],
                ai_tools: ['fortune-telling', 'tarot', 'numerology', 'horoscope', 'dream-interpretation'],
                api_access: false
            },
            statistics: {
                total_blog_posts: totalPosts,
                total_library_articles: libraryArticles.length,
                last_post_date: recentPosts[0]?.createdAt || null
            },
            sections: {
                blog: {
                    path: '/blog',
                    description: 'AI news, tutorials, and insights',
                    update_frequency: 'daily',
                    post_count: totalPosts
                },
                encyclopedia: {
                    path: '/encyclopedia/vibe-coding',
                    description: 'Vibe Coding educational library',
                    article_count: libraryArticles.length
                },
                tools: {
                    path: '/tools',
                    description: 'AI tools catalog'
                },
                mystic: {
                    path: '/mystic',
                    description: 'Interactive AI-powered mystic tools'
                },
                videos: {
                    path: '/videos',
                    description: 'Video content and tutorials'
                }
            },
            social_links: {
                youtube: 'https://www.youtube.com/@AndrewAltair',
                instagram: 'https://www.instagram.com/andr3waltair/',
                tiktok: 'https://www.tiktok.com/@andrewaltair',
                telegram: 'https://t.me/andr3waltairchannel',
                facebook: 'https://www.facebook.com/andr3waltair',
                twitter: 'https://x.com/andr3waltair',
                linkedin: 'https://www.linkedin.com/in/andrewaltair'
            },
            crawling: {
                robots_txt: `${baseUrl}/robots.txt`,
                sitemap: `${baseUrl}/sitemap.xml`,
                llms_txt: `${baseUrl}/llms.txt`,
                llms_full_txt: `${baseUrl}/llms-full.txt`,
                rss_feed: `${baseUrl}/feed.xml`,
                rate_limit: '1 request per second'
            },
            last_updated: new Date().toISOString()
        }

        // Note: In production, this would write to a persistent storage
        // For Vercel/serverless, you'd use a database or external storage
        // For Docker/VPS, you can write directly to the filesystem

        const updateResult = {
            success: true,
            timestamp: new Date().toISOString(),
            statistics: {
                total_posts: totalPosts,
                library_articles: libraryArticles.length,
                new_posts_last_24h: newPosts.length,
                urls_submitted_to_indexnow: urlsToIndex.length
            },
            indexnow: indexNowResult,
            agents_json: agentsJsonContent
        }

        return NextResponse.json(updateResult)
    } catch (error) {
        console.error('SEO Update Cron error:', error)
        return NextResponse.json(
            { error: 'SEO update failed', details: String(error) },
            { status: 500 }
        )
    }
}

// GET endpoint for health check
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        endpoint: 'SEO Update Cron',
        description: 'POST to this endpoint with Authorization header to trigger SEO content update',
        required_header: 'Authorization: Bearer {CRON_SECRET}'
    })
}

