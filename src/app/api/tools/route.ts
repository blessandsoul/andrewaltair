export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Tool from "@/models/Tool"

// GET - Get all tools with filtering and pagination
export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "50")
        const category = searchParams.get("category")
        const pricing = searchParams.get("pricing")
        const search = searchParams.get("search")
        const featured = searchParams.get("featured")

        // Build query
        const query: Record<string, unknown> = {}

        if (category) {
            query.category = category
        }
        if (pricing) {
            query.pricing = pricing
        }
        if (featured === "true") {
            query.featured = true
        }
        if (search) {
            query.$text = { $search: search }
        }

        // Get total count
        const total = await Tool.countDocuments(query)

        // Get paginated results
        const tools = await Tool.find(query)
            .sort({ featured: -1, rating: -1, name: 1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        // Transform _id to id
        const transformedTools = tools.map(tool => ({
            id: tool._id.toString(),
            name: tool.name,
            description: tool.description,
            url: tool.url,
            logo: tool.logo,
            category: tool.category,
            pricing: tool.pricing,
            rating: tool.rating,
            featured: tool.featured,
            views: tool.views,
        }))

        // Get all unique categories for filtering
        const categories = await Tool.distinct("category")

        return NextResponse.json({
            tools: transformedTools,
            categories,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error("Get tools error:", error)
        return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 })
    }
}

// POST - Create a new tool
export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const body = await request.json()

        const tool = await Tool.create({
            name: body.name,
            description: body.description,
            url: body.url,
            logo: body.logo,
            category: body.category,
            pricing: body.pricing || "freemium",
            rating: body.rating || 4,
            featured: body.featured || false,
        })

        return NextResponse.json({
            id: tool._id.toString(),
            name: tool.name,
            description: tool.description,
            url: tool.url,
            logo: tool.logo,
            category: tool.category,
            pricing: tool.pricing,
            rating: tool.rating,
            featured: tool.featured,
        }, { status: 201 })
    } catch (error) {
        console.error("Create tool error:", error)
        return NextResponse.json({ error: "Failed to create tool" }, { status: 500 })
    }
}

