import { NextRequest } from 'next/server'
import { z } from 'zod'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { WorkshopService } from '@/services/workshop.service'

export const dynamic = 'force-dynamic'

const controlSchema = z.object({
    action: z.enum([
        'openRound',
        'advancePhase',
        'reveal',
        'nextRound',
        'endRoom',
        'seedFake',
        'pinResponse',
        'unpin',
        'kickParticipant',
    ]),
    responseId: z.string().max(32).optional(),
    targetClientId: z.string().max(64).optional(),
})

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ hostKey: string }> }
) {
    try {
        const { hostKey } = await params
        const room = await WorkshopService.getRoomByHostKey(hostKey)
        if (!room) {
            return apiError(ERROR_CODES.WORKSHOP_FORBIDDEN, 'Invalid host key', 403)
        }
        const body = await request.json()
        const parsed = controlSchema.safeParse(body)
        if (!parsed.success) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Invalid action', 400)
        }
        const result = await WorkshopService.hostAdvance(
            room,
            parsed.data.action,
            parsed.data.responseId,
            parsed.data.targetClientId
        )
        if (!result.ok) {
            return apiError(ERROR_CODES.WORKSHOP_UPDATE_FAILED, result.message ?? 'Action failed', 409)
        }
        return apiSuccess({ done: true })
    } catch {
        return apiError(ERROR_CODES.WORKSHOP_UPDATE_FAILED, 'Failed to apply action', 500)
    }
}
