import { NextRequest } from 'next/server'
import { z } from 'zod'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { rateLimit } from '@/lib/rate-limit'
import { WorkshopService } from '@/services/workshop.service'
import { createViewerToken, createPublisherToken, liveKitUrl } from '@/lib/livekit'

export const dynamic = 'force-dynamic'

const limiter = rateLimit({ interval: 10000, uniqueTokenPerInterval: 2000 })

// Subscribe-only token for a viewer: a student (their clientId) or the projector ('projector').
// canPublish is false in the grant, so a viewer can never push a camera, the one-way lock.
const watchSchema = z.object({
    clientId: z.string().min(8).max(64),
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
        const parsed = watchSchema.safeParse(body)
        if (!parsed.success) return apiError(ERROR_CODES.VALIDATION_FAILED, 'Invalid request', 400)

        try {
            await limiter.check(null, 6, `wstoken:${parsed.data.clientId}`)
        } catch {
            return apiError(ERROR_CODES.RATE_LIMITED, 'Too many token requests', 429)
        }

        // an approved speaker gets a publisher token (talkback mic); everyone else subscribe-only
        const speaker = await WorkshopService.isSpeaker(room.code, parsed.data.clientId)
        const token = speaker
            ? await createPublisherToken(room.code, parsed.data.clientId)
            : await createViewerToken(room.code, parsed.data.clientId)
        return apiSuccess({ url: liveKitUrl(), token, speaker })
    } catch {
        return apiError(ERROR_CODES.WORKSHOP_FETCH_FAILED, 'Failed to issue watch token', 500)
    }
}
