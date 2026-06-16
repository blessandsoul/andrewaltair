import { NextRequest } from 'next/server'
import { z } from 'zod'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { WorkshopService } from '@/services/workshop.service'

export const dynamic = 'force-dynamic'

// Round 28 (t_close): a spun-up student taps a question on their phone → pop it on the projector.
const pickSchema = z.object({
    clientId: z.string().min(8).max(64),
    n: z.number().int().min(1).max(50),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
    try {
        const { code } = await params
        const room = await WorkshopService.getRoomByCode(code)
        if (!room) {
            return apiError(ERROR_CODES.WORKSHOP_NOT_FOUND, 'Room not found', 404)
        }
        if (room.status === 'ended') {
            return apiError(ERROR_CODES.WORKSHOP_ENDED, 'Workshop has ended', 410)
        }
        const parsed = pickSchema.safeParse(await request.json())
        if (!parsed.success) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Invalid input', 400)
        }
        const result = await WorkshopService.pickQuestionByStudent(room, parsed.data.clientId, parsed.data.n)
        if (!result.ok) {
            return apiError(ERROR_CODES.WORKSHOP_UPDATE_FAILED, result.message ?? 'Cannot pick', 409)
        }
        return apiSuccess({ picked: true })
    } catch {
        return apiError(ERROR_CODES.WORKSHOP_UPDATE_FAILED, 'Failed to pick question', 500)
    }
}
