export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Tool from "@/models/Tool"
import toolsData from "@/data/tools.json"

// POST - Seed tools from JSON file to MongoDB (one-time operation)
export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        // Check authorization (only allow in development or with special header)
        const isDev = process.env.NODE_ENV === "development"
        const authHeader = request.headers.get("x-seed-key")

        if (!isDev && authHeader !== process.env.SEED_SECRET_KEY) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Check if tools already exist
        const existingCount = await Tool.countDocuments()
        if (existingCount > 0) {
            return NextResponse.json({
                message: "Tools already seeded",
                count: existingCount,
            })
        }

        // Transform and insert tools
        const toolsToInsert = toolsData.map(tool => ({
            name: tool.name,
            description: tool.description,
            url: tool.url,
            logo: tool.logo,
            category: tool.category,
            pricing: tool.pricing || "freemium",
            rating: tool.rating || 4,
            featured: tool.featured || false,
            views: 0,
        }))

        const result = await Tool.insertMany(toolsToInsert)

        return NextResponse.json({
            message: "Tools seeded successfully",
            count: result.length,
        })
    } catch (error) {
        console.error("Seed tools error:", error)
        return NextResponse.json({ error: "Failed to seed tools" }, { status: 500 })
    }
}

// GET - Get seed status
export async function GET() {
    try {
        await dbConnect()
        const count = await Tool.countDocuments()

        return NextResponse.json({
            seeded: count > 0,
            count,
            totalInJson: toolsData.length,
        })
    } catch (error) {
        console.error("Get seed status error:", error)
        return NextResponse.json({ error: "Failed to get seed status" }, { status: 500 })
    }
}

