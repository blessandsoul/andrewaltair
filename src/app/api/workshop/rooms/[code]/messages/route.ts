import { NextRequest } from 'next/server'
import { z } from 'zod'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { WorkshopService } from '@/services/workshop.service'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

// ~1 message / 4s per clientId: the 2nd post inside the window is rejected.
const limiter = rateLimit({ interval: 4000, uniqueTokenPerInterval: 1000 })

const messageSchema = z.object({
    clientId: z.string().min(8).max(64),
    kind: z.enum(['chat', 'question']),
    text: z.string().trim().min(1).max(280),
    anon: z.boolean().optional(),
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
        const parsed = messageSchema.safeParse(body)
        if (!parsed.success) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Invalid message', 400)
        }
        try {
            await limiter.check(null, 2, `wsmsg:${parsed.data.clientId}`)
        } catch {
            return apiError(ERROR_CODES.RATE_LIMITED, 'Too many messages, slow down', 429)
        }
        const result = await WorkshopService.postMessage({ room, ...parsed.data })
        if (!result.ok) {
            if (result.reason === 'disabled') return apiError(ERROR_CODES.FORBIDDEN, 'Chat is off', 403)
            if (result.reason === 'muted') return apiSuccess({ posted: true }) // silently ignore a muted sender
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Could not post message', 400)
        }
        return apiSuccess({ posted: true })
    } catch {
        return apiError(ERROR_CODES.WORKSHOP_SUBMIT_FAILED, 'Failed to post message', 500)
    }
}
