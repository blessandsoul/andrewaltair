import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { WorkshopService } from '@/services/workshop.service'
import { createPublisherToken, liveKitUrl } from '@/lib/livekit'

export const dynamic = 'force-dynamic'

// Publisher token for the host's PHONE camera, reached via the QR shown on the pult.
// Distinct identity 'phone-cam' so it never collides with (and evicts) the desktop 'host'.
// Possessing the hostKey (same secret already in the pult URL) authorizes the phone to publish.
export async function POST(
    _request: NextRequest,
    { params }: { params: Promise<{ hostKey: string }> }
) {
    try {
        const { hostKey } = await params
        const room = await WorkshopService.getRoomByHostKey(hostKey)
        if (!room) return apiError(ERROR_CODES.WORKSHOP_FORBIDDEN, 'Invalid host key', 403)
        if (room.status === 'ended') return apiError(ERROR_CODES.WORKSHOP_ENDED, 'Workshop has ended', 410)
        const token = await createPublisherToken(room.code, 'phone-cam')
        return apiSuccess({ url: liveKitUrl(), token })
    } catch {
        return apiError(ERROR_CODES.WORKSHOP_FETCH_FAILED, 'Failed to issue phone token', 500)
    }
}
