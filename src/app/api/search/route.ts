import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Post from "@/models/Post"
import Video from "@/models/Video"
import Tool from "@/models/Tool"

export const dynamic = 'force-dynamic'

// 🛡️ Escape special regex characters to prevent ReDoS attacks
function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 🛡️ Rate Limiting - Prevent scraping
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS = 30; // Max search requests per minute
const WINDOW_MS = 60 * 1000;

function checkRateLimit(ip: string): { allowed: boolean } {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    // Clean old entries
    if (rateLimitMap.size > 10000) {
        for (const [key, value] of rateLimitMap.entries()) {
            if (now > value.resetTime) rateLimitMap.delete(key);
        }
    }

    if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
        return { allowed: true };
    }

    if (record.count >= MAX_REQUESTS) {
        return { allowed: false };
    }

    record.count++;
    return { allowed: true };
}

// GET - Global search across posts, videos, and tools
export async function GET(request: NextRequest) {
    // 🛡️ Rate limit check
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        'unknown';

    if (!checkRateLimit(ip).allowed) {
        return NextResponse.json(
            { error: "Too many requests. Please slow down.", results: [], total: 0 },
            { status: 429 }
        );
    }

    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const query = searchParams.get("q") || ""
        const type = searchParams.get("type") // "posts", "videos", "tools", or all
        const limit = parseInt(searchParams.get("limit") || "10")

        if (!query || query.length < 2) {
            return NextResponse.json({
                results: [],
                total: 0,
                message: "Query must be at least 2 characters"
            })
        }

        const results: {
            type: string
            id: string
            title: string
            description: string
            url: string
            image?: string
            category?: string
        }[] = []

        // Build regex for partial matching (escaped to prevent ReDoS)
        const regex = new RegExp(escapeRegex(query), "i")

        // Search Posts
        if (!type || type === "posts") {
            const posts = await Post.find({
                status: "published",
                $or: [
                    { title: regex },
                    { excerpt: regex },
                    { content: regex },
                    { tags: regex },
                    { numericId: { $regex: query, $options: 'i' } } // Contains match for ID
                ]
            })
                .limit(limit)
                .select("title slug excerpt coverImage category numericId")
                .lean()

            posts.forEach(post => {
                results.push({
                    type: "post",
                    id: post._id.toString(),
                    title: post.title,
                    description: post.excerpt,
                    url: `/blog/${post.slug}`,
                    image: post.coverImage,
                    category: post.category
                })
            })
        }

        // Search Videos
        if (!type || type === "videos") {
            const videos = await Video.find({
                $or: [
                    { title: regex },
                    { description: regex },
                    { category: regex }
                ]
            })
                .limit(limit)
                .select("title description youtubeId category")
                .lean()

            videos.forEach(video => {
                results.push({
                    type: "video",
                    id: video._id.toString(),
                    title: video.title,
                    description: video.description || "",
                    url: `/videos/${video._id.toString()}`,
                    image: `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`,
                    category: video.category
                })
            })
        }

        // Search Tools
        if (!type || type === "tools") {
            const tools = await Tool.find({
                $or: [
                    { name: regex },
                    { description: regex },
                    { category: regex }
                ]
            })
                .limit(limit)
                .select("name description url logo category")
                .lean()

            tools.forEach(tool => {
                results.push({
                    type: "tool",
                    id: tool._id.toString(),
                    title: tool.name,
                    description: tool.description,
                    url: tool.url,
                    image: tool.logo,
                    category: tool.category
                })
            })
        }

        return NextResponse.json({
            results,
            total: results.length,
            query
        })
    } catch (error) {
        console.error("Search error:", error)
        return NextResponse.json({ error: "Search failed" }, { status: 500 })
    } finally {
        // Log search activity (fire and forget)
        try {
            const { searchParams } = new URL(request.url)
            const query = searchParams.get("q")
            const visitorId = request.headers.get('x-visitor-id') || 'anonymous'

            if (query && query.length >= 2) {
                const Activity = (await import("@/models/Activity")).default
                await Activity.create({
                    type: 'search',
                    visitorId,
                    metadata: { query }
                })
            }
        } catch (e) {
            // Ignore logging errors
        }
    }
}
