import { NextRequest } from 'next/server'
import { z } from 'zod'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { WorkshopService } from '@/services/workshop.service'

export const dynamic = 'force-dynamic'

const respondSchema = z.object({
    clientId: z.string().min(8).max(64),
    roundKey: z.string().min(1).max(16),
    optionId: z.string().max(16).optional(),
    textValue: z.string().max(2000).optional(),
    numberValue: z.number().optional(),
})

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params
        const room = await WorkshopService.getRoomByCode(code)
        if (!room) {
            return apiError(ERROR_CODES.WORKSHOP_NOT_FOUND, 'Room not found', 404)
        }
        if (room.status === 'ended') {
            return apiError(ERROR_CODES.WORKSHOP_ENDED, 'Workshop has ended', 410)
        }
        const body = await request.json()
        const parsed = respondSchema.safeParse(body)
        if (!parsed.success) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Invalid input', 400)
        }
        const result = await WorkshopService.submitResponse({ room, ...parsed.data })
        if (!result.ok) {
            if (result.reason === 'closed') {
                return apiError(ERROR_CODES.WORKSHOP_ROUND_CLOSED, 'Round is closed', 409)
            }
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Invalid answer', 400)
        }
        return apiSuccess({ submitted: true })
    } catch {
        return apiError(ERROR_CODES.WORKSHOP_SUBMIT_FAILED, 'Failed to submit', 500)
    }
}
