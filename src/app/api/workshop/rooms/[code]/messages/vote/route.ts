import { NextRequest } from 'next/server'
import { z } from 'zod'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { WorkshopService } from '@/services/workshop.service'

export const dynamic = 'force-dynamic'

// Fire-and-forget upvote (question) / like (chat), deduped per clientId server-side.
const voteSchema = z.object({
    clientId: z.string().min(8).max(64),
    messageId: z.string().min(8).max(32),
})

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params
        const room = await WorkshopService.getRoomByCode(code)
        if (!room) return apiError(ERROR_CODES.WORKSHOP_NOT_FOUND, 'Room not found', 404)
        if (room.status === 'ended') return apiError(ERROR_CODES.WORKSHOP_ENDED, 'Workshop has ended', 410)
        const body = await request.json()
        const parsed = voteSchema.safeParse(body)
        if (!parsed.success) return apiError(ERROR_CODES.VALIDATION_FAILED, 'Invalid vote', 400)
        await WorkshopService.voteMessage(room._id, parsed.data.messageId, parsed.data.clientId)
        return apiSuccess({ ok: true })
    } catch {
        return apiError(ERROR_CODES.WORKSHOP_SUBMIT_FAILED, 'Failed to vote', 500)
    }
}
