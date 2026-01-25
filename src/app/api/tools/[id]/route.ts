export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server"
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
            return NextResponse.json({ error: "Tool not found" }, { status: 404 })
        }

        return NextResponse.json(tool)
    } catch (error: any) {
        console.error("Get tool error:", error)
        return NextResponse.json({ error: error.message || "Failed to fetch tool" }, { status: 500 })
    }
}

// PUT - Update tool
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        const body = await request.json()

        const tool = await ToolService.updateTool(id, body)

        if (!tool) {
            return NextResponse.json({ error: "Tool not found" }, { status: 404 })
        }

        return NextResponse.json(tool)
    } catch (error: any) {
        console.error("Update tool error:", error)
        return NextResponse.json({ error: error.message || "Failed to update tool" }, { status: 500 })
    }
}

// DELETE - Delete tool
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        const result = await ToolService.deleteTool(id)

        if (!result) {
            return NextResponse.json({ error: "Tool not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Tool deleted successfully" })
    } catch (error: any) {
        console.error("Delete tool error:", error)
        return NextResponse.json({ error: error.message || "Failed to delete tool" }, { status: 500 })
    }
}
