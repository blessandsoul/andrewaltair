import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { WorkshopService } from '@/services/workshop.service'

export const dynamic = 'force-dynamic'

// Host-only: full per-round results + per-participant answer grid. Powers the
// pult "answer history" drawer (recall any past round by name) + the end-stats screen.
export async function GET(request: NextRequest, { params }: { params: Promise<{ hostKey: string }> }) {
    try {
        const { hostKey } = await params
        const room = await WorkshopService.getRoomByHostKey(hostKey)
        if (!room) {
            return apiError(ERROR_CODES.WORKSHOP_FORBIDDEN, 'Invalid host key', 403)
        }
        const history = await WorkshopService.getRoomHistory(room)
        return apiSuccess(history)
    } catch {
        return apiError(ERROR_CODES.WORKSHOP_FETCH_FAILED, 'Failed to load history', 500)
    }
}
