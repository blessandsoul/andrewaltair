import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { WorkshopService } from '@/services/workshop.service'

export const dynamic = 'force-dynamic'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params
        let room = await WorkshopService.getRoomByCode(code)
        if (!room) {
            return apiError(ERROR_CODES.WORKSHOP_NOT_FOUND, 'Room not found', 404)
        }
        room = await WorkshopService.maybeAutoAdvance(room)
        const clientId = request.nextUrl.searchParams.get('clientId')
        if (clientId) {
            // presence heartbeat — powers the host roster "online" dots
            await WorkshopService.touchParticipant(room._id, clientId)
        }
        const state = await WorkshopService.getStudentState(room, clientId)
        return apiSuccess(state)
    } catch {
        return apiError(ERROR_CODES.WORKSHOP_FETCH_FAILED, 'Failed to fetch room', 500)
    }
}
