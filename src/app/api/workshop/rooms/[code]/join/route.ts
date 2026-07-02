import { NextRequest } from 'next/server'
import { z } from 'zod'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { WorkshopService } from '@/services/workshop.service'

export const dynamic = 'force-dynamic'

const joinSchema = z.object({
    name: z.string().trim().min(1).max(24),
    clientId: z.string().min(8).max(64),
    avatarEmoji: z.string().max(8).optional(),
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
        const parsed = joinSchema.safeParse(body)
        if (!parsed.success) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Invalid name', 400)
        }
        const result = await WorkshopService.joinRoom(room._id, parsed.data.name, parsed.data.clientId, parsed.data.avatarEmoji)
        if (!result.ok) {
            return result.reason === 'full'
                ? apiError(ERROR_CODES.WORKSHOP_JOIN_FAILED, 'Room is full', 409)
                : apiError(ERROR_CODES.VALIDATION_FAILED, 'Name not allowed', 400)
        }
        return apiSuccess({ joined: true, title: room.title })
    } catch {
        return apiError(ERROR_CODES.WORKSHOP_JOIN_FAILED, 'Failed to join', 500)
    }
}
