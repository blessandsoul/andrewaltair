export const dynamic = 'force-dynamic'
import { NextRequest } from "next/server"
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
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
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Session ID required', 400)
        }

        await dbConnect()

        const query: Record<string, unknown> = { sessionId }
        if (toolType) query.toolType = toolType

        const history = await MysticHistory.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean()

        return apiSuccess({
            history: history.map(item => ({
                id: item._id.toString(),
                toolType: item.toolType,
                input: item.input,
                result: item.result,
                createdAt: item.createdAt,
            }))
        }, 'History fetched successfully')
    } catch (error) {
        console.error("History GET error:", error)
        return apiError(ERROR_CODES.MYSTIC_HISTORY_FAILED, 'Failed to fetch history', 500)
    }
}

// POST - Save a new prediction
export async function POST(request: NextRequest) {
    try {
        const { sessionId, toolType, input, result } = await request.json()

        if (!sessionId || !toolType || !result) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Missing required fields', 400)
        }

        await dbConnect()

        const historyItem = await MysticHistory.create({
            sessionId,
            toolType,
            input: input || {},
            result,
        })

        return apiSuccess({
            id: historyItem._id.toString()
        }, 'History saved successfully', 201)
    } catch (error) {
        console.error("History POST error:", error)
        return apiError(ERROR_CODES.MYSTIC_HISTORY_FAILED, 'Failed to save history', 500)
    }
}

// DELETE - Remove a history item
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'ID required', 400)
        }

        await dbConnect()

        await MysticHistory.findByIdAndDelete(id)

        return apiSuccess(null, 'History deleted successfully')
    } catch (error) {
        console.error("History DELETE error:", error)
        return apiError(ERROR_CODES.MYSTIC_HISTORY_FAILED, 'Failed to delete history', 500)
    }
}

