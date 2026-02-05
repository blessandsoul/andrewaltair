export const dynamic = 'force-dynamic'
import { NextRequest } from "next/server"
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { ToolService } from "@/services/tool.service"

interface RouteParams {
    params: Promise<{ id: string }>
}

// GET - Get single tool
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        const tool = await ToolService.getToolById(id)

        if (!tool) {
            return apiError(ERROR_CODES.TOOL_NOT_FOUND, 'Tool not found', 404)
        }

        return apiSuccess(tool, 'Tool fetched successfully')
    } catch (error: any) {
        console.error("Get tool error:", error)
        return apiError(ERROR_CODES.TOOL_FETCH_FAILED, error.message || 'Failed to fetch tool', 500)
    }
}

// PUT - Update tool
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        const body = await request.json()

        const tool = await ToolService.updateTool(id, body)

        if (!tool) {
            return apiError(ERROR_CODES.TOOL_NOT_FOUND, 'Tool not found', 404)
        }

        return apiSuccess(tool, 'Tool updated successfully')
    } catch (error: any) {
        console.error("Update tool error:", error)
        return apiError(ERROR_CODES.TOOL_UPDATE_FAILED, error.message || 'Failed to update tool', 500)
    }
}

// DELETE - Delete tool
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        const result = await ToolService.deleteTool(id)

        if (!result) {
            return apiError(ERROR_CODES.TOOL_NOT_FOUND, 'Tool not found', 404)
        }

        return apiSuccess(null, 'Tool deleted successfully')
    } catch (error: any) {
        console.error("Delete tool error:", error)
        return apiError(ERROR_CODES.TOOL_DELETE_FAILED, error.message || 'Failed to delete tool', 500)
    }
}
