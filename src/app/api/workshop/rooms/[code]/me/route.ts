import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { WorkshopService } from '@/services/workshop.service'

export const dynamic = 'force-dynamic'

// Student-safe: a participant's own diploma data (name, dream, points, rank, badges, photo).
export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
    try {
        const { code } = await params
        const clientId = request.nextUrl.searchParams.get('clientId')
        if (!clientId) return apiError(ERROR_CODES.VALIDATION_FAILED, 'clientId required', 400)
        const room = await WorkshopService.getRoomByCode(code)
        if (!room) return apiError(ERROR_CODES.WORKSHOP_NOT_FOUND, 'Room not found', 404)
        const data = await WorkshopService.getDiplomaData(room, clientId)
        if (!data) return apiError(ERROR_CODES.WORKSHOP_NOT_FOUND, 'No participation found', 404)
        return apiSuccess(data)
    } catch {
        return apiError(ERROR_CODES.WORKSHOP_FETCH_FAILED, 'Failed to load diploma', 500)
    }
}
