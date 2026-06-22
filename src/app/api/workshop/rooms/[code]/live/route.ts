import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { WorkshopService } from '@/services/workshop.service'

export const dynamic = 'force-dynamic'

// Light public poll for the live chat wall + the pinned question, so the projector
// reflects host moderation fast (~1s) without riding the heavy host-state object.
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params
        const room = await WorkshopService.getRoomByCode(code)
        if (!room) return apiError(ERROR_CODES.WORKSHOP_NOT_FOUND, 'Room not found', 404)
        const live = await WorkshopService.getLiveMessages(room._id)
        return apiSuccess(live)
    } catch {
        return apiError(ERROR_CODES.WORKSHOP_FETCH_FAILED, 'Failed to fetch live', 500)
    }
}
