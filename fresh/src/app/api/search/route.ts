import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Post from "@/models/Post"
import Video from "@/models/Video"
import Tool from "@/models/Tool"

// GET - Global search across posts, videos, and tools
export async function GET(request: NextRequest) {
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

        // Build regex for partial matching
        const regex = new RegExp(query, "i")

        // Search Posts
        if (!type || type === "posts") {
            const posts = await Post.find({
                status: "published",
                $or: [
                    { title: regex },
                    { excerpt: regex },
                    { content: regex },
                    { tags: regex }
                ]
            })
                .limit(limit)
                .select("title slug excerpt coverImage category")
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
    }
}
