import { NextRequest } from 'next/server'
import { z } from 'zod'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { WorkshopService } from '@/services/workshop.service'

export const dynamic = 'force-dynamic'

// Ephemeral emoji reaction — fire-and-forget into an in-memory buffer (no DB write).
const reactSchema = z.object({
    clientId: z.string().min(8).max(64),
    emoji: z.string().min(1).max(8),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
    try {
        const { code } = await params
        const room = await WorkshopService.getRoomByCode(code)
        if (!room) return apiError(ERROR_CODES.WORKSHOP_NOT_FOUND, 'Room not found', 404)
        if (room.status === 'ended') return apiError(ERROR_CODES.WORKSHOP_ENDED, 'Workshop has ended', 410)
        if (!(room.settings?.gamification ?? true)) return apiSuccess({ ok: true }) // silently ignore when off
        const body = await request.json()
        const parsed = reactSchema.safeParse(body)
        if (!parsed.success) return apiError(ERROR_CODES.VALIDATION_FAILED, 'Invalid reaction', 400)
        WorkshopService.pushReaction(room._id, parsed.data.emoji)
        return apiSuccess({ ok: true })
    } catch {
        return apiError(ERROR_CODES.WORKSHOP_SUBMIT_FAILED, 'Failed to react', 500)
    }
}
