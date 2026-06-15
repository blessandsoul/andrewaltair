import { NextRequest } from 'next/server'
import { z } from 'zod'
import { verifyAdmin } from '@/lib/admin-auth'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { WorkshopService } from '@/services/workshop.service'
import { WORKSHOP_TEMPLATES } from '@/data/workshop-templates'
import { tr } from '@/data/workshop-i18n'

export const dynamic = 'force-dynamic'

// Per-room settings — bounded (this is the real guardrail; client validation is UX only).
const settingsSchema = z
    .object({
        audience: z.enum(['inperson', 'online']),
        studentSound: z.boolean(),
        hostAnswerSound: z.boolean(),
        hostVolume: z.number().int().min(0).max(100),
        studentVolume: z.number().int().min(0).max(100),
        autoReveal: z.boolean(),
        graceSec: z.number().int().min(0).max(60),
        gateRatio: z.number().min(0).max(1),
        roundTimerSec: z.number().int().min(0).max(600),
        revealCorrect: z.boolean(),
        anonymousNames: z.boolean(),
        shuffleOptions: z.boolean(),
        textWallLimit: z.number().int().min(10).max(500),
        maxParticipants: z.number().int().min(0).max(500),
        nameFilter: z.boolean(),
        allowKick: z.boolean(),
        codeLength: z.number().int().min(4).max(6),
        onlineWindowSec: z.number().int().min(5).max(60),
        studentPollMs: z.number().int().min(1000).max(10000),
        language: z.enum(['ka', 'ru']),
        confetti: z.boolean(),
        gamification: z.boolean(),
        teamMode: z.boolean(),
        teamCount: z.number().int().min(2).max(6),
    })
    .partial()

const createSchema = z.object({
    templateId: z.string().min(1),
    demo: z.boolean().optional(),
    settings: settingsSchema.optional(),
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
        const settings = parsed.data.settings
        const room = parsed.data.demo
            ? await WorkshopService.createDemoRoom(parsed.data.templateId, { settings })
            : await WorkshopService.createRoomFromTemplate(parsed.data.templateId, { settings })
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
                title: tr(t.title),
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
