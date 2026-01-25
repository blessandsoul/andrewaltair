export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server"
import { ToolService } from "@/services/tool.service"

// GET - Get all tools with filtering and pagination
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        const params = {
            page: parseInt(searchParams.get("page") || "1"),
            limit: parseInt(searchParams.get("limit") || "50"),
            category: searchParams.get("category"),
            pricing: searchParams.get("pricing"),
            search: searchParams.get("search"),
            featured: searchParams.get("featured"),
        }

        const result = await ToolService.getAllTools(params)
        return NextResponse.json(result)
    } catch (error) {
        console.error("Get tools error:", error)
        return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 })
    }
}

// POST - Create a new tool
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const tool = await ToolService.createTool(body)
        return NextResponse.json(tool, { status: 201 })
    } catch (error) {
        console.error("Create tool error:", error)
        return NextResponse.json({ error: "Failed to create tool" }, { status: 500 })
    }
}
