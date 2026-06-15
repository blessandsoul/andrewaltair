import { NextRequest } from 'next/server'
import { z } from 'zod'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { WorkshopService } from '@/services/workshop.service'

export const dynamic = 'force-dynamic'

// Ephemeral reaction — fire-and-forget into an in-memory buffer (no DB write).
// kind = icon key (validated in pushReaction); name = sender label (client-supplied, blanked when anonymous).
const reactSchema = z.object({
    clientId: z.string().min(8).max(64),
    kind: z.string().min(1).max(12),
    name: z.string().max(40).optional(),
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
        const anon = room.settings?.anonymousNames ?? false
        WorkshopService.pushReaction(room._id, parsed.data.kind, anon ? '' : (parsed.data.name ?? ''))
        return apiSuccess({ ok: true })
    } catch {
        return apiError(ERROR_CODES.WORKSHOP_SUBMIT_FAILED, 'Failed to react', 500)
    }
}
