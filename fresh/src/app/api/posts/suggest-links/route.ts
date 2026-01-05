import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Post from '@/models/Post'

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const { title, tags, category, excludeSlug } = await request.json()

        if (!title && !tags?.length && !category) {
            return NextResponse.json(
                { error: 'title, tags, or category required' },
                { status: 400 }
            )
        }

        // Build query to find related posts
        const query: Record<string, unknown> = {
            status: 'published'
        }

        // Exclude current post
        if (excludeSlug) {
            query.slug = { $ne: excludeSlug }
        }

        // Find posts matching category or tags
        let relatedPosts: Array<{ slug: string; title: string; excerpt?: string; coverImages?: { horizontal?: string; vertical?: string }; tags?: string[]; category?: string }> = []

        // First try: same category
        if (category) {
            relatedPosts = await Post.find({
                ...query,
                category
            })
                .select('slug title excerpt coverImages tags category')
                .sort({ publishedAt: -1 })
                .limit(5)
                .lean()
        }

        // If not enough, try matching tags
        if (relatedPosts.length < 5 && tags?.length) {
            const tagPosts = await Post.find({
                ...query,
                tags: { $in: tags },
                slug: { $nin: relatedPosts.map((p: { slug: string }) => p.slug) }
            })
                .select('slug title excerpt coverImages tags category')
                .sort({ publishedAt: -1 })
                .limit(5 - relatedPosts.length)
                .lean()

            relatedPosts = [...relatedPosts, ...tagPosts]
        }

        // If still not enough, get recent posts
        if (relatedPosts.length < 3) {
            const recentPosts = await Post.find({
                ...query,
                slug: { $nin: relatedPosts.map((p: { slug: string }) => p.slug) }
            })
                .select('slug title excerpt coverImages tags category')
                .sort({ publishedAt: -1 })
                .limit(3 - relatedPosts.length)
                .lean()

            relatedPosts = [...relatedPosts, ...recentPosts]
        }

        // Calculate relevance score for each post
        interface RelatedPost {
            slug: string;
            title: string;
            excerpt?: string;
            coverImages?: { horizontal?: string; vertical?: string };
            tags?: string[];
            category?: string;
        }

        const scoredPosts = relatedPosts.map((post: RelatedPost) => {
            let score = 0

            // Same category = +10
            if (post.category === category) score += 10

            // Matching tags = +2 each
            if (tags?.length && post.tags?.length) {
                const matchingTags = post.tags.filter((t: string) => tags.includes(t))
                score += matchingTags.length * 2
            }

            // Title similarity (simple word match)
            if (title && post.title) {
                const titleWords = title.toLowerCase().split(/\s+/)
                const postWords = post.title.toLowerCase().split(/\s+/)
                const matching = titleWords.filter((w: string) => postWords.includes(w))
                score += matching.length
            }

            return {
                slug: post.slug,
                title: post.title,
                excerpt: post.excerpt?.slice(0, 100),
                coverImage: post.coverImages?.horizontal || post.coverImages?.vertical,
                category: post.category,
                relevanceScore: score
            }
        })

        // Sort by relevance score
        scoredPosts.sort((a: { relevanceScore: number }, b: { relevanceScore: number }) => b.relevanceScore - a.relevanceScore)

        return NextResponse.json({
            success: true,
            relatedPosts: scoredPosts.slice(0, 5)
        })

    } catch (error) {
        console.error('Suggest links error:', error)
        return NextResponse.json(
            { error: 'Failed to suggest links', relatedPosts: [] },
            { status: 500 }
        )
    }
}
