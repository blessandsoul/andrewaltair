import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import MysticHistory from "@/models/MysticHistory"

// GET - Fetch history for a session
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const sessionId = searchParams.get("sessionId")
        const toolType = searchParams.get("toolType")
        const limit = parseInt(searchParams.get("limit") || "50")

        if (!sessionId) {
            return NextResponse.json({ error: "Session ID required" }, { status: 400 })
        }

        await dbConnect()

        const query: Record<string, unknown> = { sessionId }
        if (toolType) query.toolType = toolType

        const history = await MysticHistory.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean()

        return NextResponse.json({
            history: history.map(item => ({
                id: item._id.toString(),
                toolType: item.toolType,
                input: item.input,
                result: item.result,
                createdAt: item.createdAt,
            }))
        })
    } catch (error) {
        console.error("History GET error:", error)
        return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
    }
}

// POST - Save a new prediction
export async function POST(request: NextRequest) {
    try {
        const { sessionId, toolType, input, result } = await request.json()

        if (!sessionId || !toolType || !result) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        await dbConnect()

        const historyItem = await MysticHistory.create({
            sessionId,
            toolType,
            input: input || {},
            result,
        })

        return NextResponse.json({
            success: true,
            id: historyItem._id.toString()
        })
    } catch (error) {
        console.error("History POST error:", error)
        return NextResponse.json({ error: "Failed to save history" }, { status: 500 })
    }
}

// DELETE - Remove a history item
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 })
        }

        await dbConnect()

        await MysticHistory.findByIdAndDelete(id)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("History DELETE error:", error)
        return NextResponse.json({ error: "Failed to delete history" }, { status: 500 })
    }
}
