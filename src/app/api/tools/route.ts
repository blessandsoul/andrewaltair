export const dynamic = 'force-dynamic'
import { NextRequest } from "next/server"
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { ToolService } from "@/services/tool.service"

// GET - Get all tools with filtering and pagination
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        const params = {
            page: parseInt(searchParams.get("page") || "1"),
            limit: parseInt(searchParams.get("limit") || "50"),
            category: searchParams.get("category") ?? undefined,
            pricing: searchParams.get("pricing") ?? undefined,
            search: searchParams.get("search") ?? undefined,
            featured: searchParams.get("featured") ?? undefined,
        }

        const result = await ToolService.getAllTools(params as Parameters<typeof ToolService.getAllTools>[0])
        return apiSuccess(result, 'Tools fetched successfully')
    } catch (error) {
        console.error("Get tools error:", error)
        return apiError(ERROR_CODES.TOOL_FETCH_FAILED, 'Failed to fetch tools', 500)
    }
}

// POST - Create a new tool
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const tool = await ToolService.createTool(body)
        return apiSuccess(tool, 'Tool created successfully', 201)
    } catch (error) {
        console.error("Create tool error:", error)
        return apiError(ERROR_CODES.TOOL_CREATE_FAILED, 'Failed to create tool', 500)
    }
}
