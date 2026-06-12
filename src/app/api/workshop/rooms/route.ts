import { NextRequest } from 'next/server'
import { z } from 'zod'
import { verifyAdmin } from '@/lib/admin-auth'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { WorkshopService } from '@/services/workshop.service'
import { WORKSHOP_TEMPLATES } from '@/data/workshop-templates'

export const dynamic = 'force-dynamic'

const createSchema = z.object({
    templateId: z.string().min(1),
})

export async function POST(request: NextRequest) {
    if (!verifyAdmin(request)) {
        return apiError(ERROR_CODES.ADMIN_UNAUTHORIZED, 'Unauthorized', 401)
    }
    try {
        const body = await request.json()
        const parsed = createSchema.safeParse(body)
        if (!parsed.success) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Invalid input', 400)
        }
        const room = await WorkshopService.createRoomFromTemplate(parsed.data.templateId)
        return apiSuccess(
            {
                roomId: String(room._id),
                code: room.code,
                hostKey: room.hostKey,
                title: room.title,
                roundsTotal: room.rounds.length,
            },
            'Room created',
            201
        )
    } catch {
        return apiError(ERROR_CODES.WORKSHOP_CREATE_FAILED, 'Failed to create room', 500)
    }
}

export async function GET(request: NextRequest) {
    if (!verifyAdmin(request)) {
        return apiError(ERROR_CODES.ADMIN_UNAUTHORIZED, 'Unauthorized', 401)
    }
    try {
        const rooms = await WorkshopService.listRecentRooms(10)
        return apiSuccess({
            templates: Object.entries(WORKSHOP_TEMPLATES).map(([id, t]) => ({
                id,
                title: t.title,
                roundsTotal: t.rounds.length,
            })),
            rooms: rooms.map((r) => ({
                roomId: String(r._id),
                code: r.code,
                hostKey: r.hostKey,
                title: r.title,
                status: r.status,
                createdAt: r.createdAt,
            })),
        })
    } catch {
        return apiError(ERROR_CODES.WORKSHOP_FETCH_FAILED, 'Failed to list rooms', 500)
    }
}
