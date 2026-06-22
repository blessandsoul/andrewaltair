import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { WorkshopService } from '@/services/workshop.service'
import { receiveWebhook } from '@/lib/livekit'

export const dynamic = 'force-dynamic'

/**
 * LiveKit auto-stop webhook. The self-hosted server posts signed events here
 * (configured in deploy/livekit/livekit.yaml `webhook.urls`). When the host leaves
 * the room ungracefully, or the room finishes, we flip broadcastEnabled off so viewers
 * stop waiting on a dead tile. Signature is verified against the api key/secret, so an
 * unsigned POST is rejected. The raw body is required for verification.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.text()
        const auth = request.headers.get('Authorization') || ''
        const event = await receiveWebhook(body, auth)
        const code = event.room?.name
        if (!code) return apiSuccess({ ignored: true })

        const hostLeft = event.event === 'participant_left' && event.participant?.identity === 'host'
        const roomDone = event.event === 'room_finished'
        if (hostLeft || roomDone) {
            await WorkshopService.setBroadcastByCode(code, false)
        }
        return apiSuccess({ ok: true })
    } catch {
        // bad signature or malformed event
        return apiError(ERROR_CODES.WORKSHOP_FORBIDDEN, 'Invalid webhook', 401)
    }
}
