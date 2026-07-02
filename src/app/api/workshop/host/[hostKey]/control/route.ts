import { NextRequest } from 'next/server'
import { z } from 'zod'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { WorkshopService } from '@/services/workshop.service'

export const dynamic = 'force-dynamic'

const controlSchema = z.object({
    action: z.enum([
        'openRound',
        'advancePhase',
        'reveal',
        'nextRound',
        'prevRound',
        'reopenRound',
        'endRoom',
        'seedFake',
        'pinResponse',
        'unpin',
        'kickParticipant',
        'spinWheel',
        'showWinners',
        'showTopAnswers',
        'pickQuestion',
        'closeQuestion',
        'startTimer',
        'setMessageStatus',
        'muteParticipant',
        'setBroadcast',
        'grantSpeak',
        'revokeSpeak',
        'startRecording',
        'stopRecording',
        'celebrate',
    ]),
    responseId: z.string().max(32).optional(),
    targetClientId: z.string().max(64).optional(),
    count: z.number().int().min(1).max(50).optional(), // spinWheel: draw count · pick/closeQuestion: question number
    messageId: z.string().max(32).optional(), // setMessageStatus: which message
    status: z.enum(['new', 'live', 'done', 'hidden']).optional(), // setMessageStatus: target state
    answer: z.string().max(280).optional(), // setMessageStatus: host on-screen answer to a question
    enabled: z.boolean().optional(), // setBroadcast: host camera/mic live on or off
})

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ hostKey: string }> }
) {
    try {
        const { hostKey } = await params
        const room = await WorkshopService.getRoomByHostKey(hostKey)
        if (!room) {
            return apiError(ERROR_CODES.WORKSHOP_FORBIDDEN, 'Invalid host key', 403)
        }
        const body = await request.json()
        const parsed = controlSchema.safeParse(body)
        if (!parsed.success) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Invalid action', 400)
        }
        // chat/question moderation goes straight to the message store, not hostAdvance
        if (parsed.data.action === 'setMessageStatus') {
            if (!parsed.data.messageId || !parsed.data.status) {
                return apiError(ERROR_CODES.VALIDATION_FAILED, 'Invalid action', 400)
            }
            const r = await WorkshopService.setMessageStatus(
                room._id,
                parsed.data.messageId,
                parsed.data.status,
                parsed.data.answer,
            )
            if (!r.ok) {
                return apiError(ERROR_CODES.WORKSHOP_UPDATE_FAILED, 'Message not found', 404)
            }
            return apiSuccess({ done: true })
        }
        if (parsed.data.action === 'muteParticipant') {
            if (!parsed.data.targetClientId) {
                return apiError(ERROR_CODES.VALIDATION_FAILED, 'Invalid action', 400)
            }
            await WorkshopService.muteParticipant(room._id, parsed.data.targetClientId)
            return apiSuccess({ done: true })
        }
        // host camera/mic broadcast: flips the room setting viewers gate on
        if (parsed.data.action === 'setBroadcast') {
            if (typeof parsed.data.enabled !== 'boolean') {
                return apiError(ERROR_CODES.VALIDATION_FAILED, 'Invalid action', 400)
            }
            await WorkshopService.setBroadcast(room._id, parsed.data.enabled)
            return apiSuccess({ done: true })
        }
        // talkback: host grants or revokes a student's mic
        if (parsed.data.action === 'grantSpeak' || parsed.data.action === 'revokeSpeak') {
            if (!parsed.data.targetClientId) {
                return apiError(ERROR_CODES.VALIDATION_FAILED, 'Invalid action', 400)
            }
            if (parsed.data.action === 'grantSpeak') {
                await WorkshopService.grantSpeak(room._id, parsed.data.targetClientId)
            } else {
                await WorkshopService.revokeSpeak(room._id, parsed.data.targetClientId)
            }
            return apiSuccess({ done: true })
        }
        // recording: start or stop the room Egress capture (needs the egress container + Redis)
        if (parsed.data.action === 'startRecording' || parsed.data.action === 'stopRecording') {
            try {
                if (parsed.data.action === 'startRecording') await WorkshopService.startRecording(room)
                else await WorkshopService.stopRecording(room)
            } catch {
                return apiError(ERROR_CODES.WORKSHOP_UPDATE_FAILED, 'Recording unavailable', 503)
            }
            return apiSuccess({ done: true })
        }
        // host-triggered projector celebration (confetti + cheer on the big screen)
        if (parsed.data.action === 'celebrate') {
            WorkshopService.celebrate(room._id)
            return apiSuccess({ done: true })
        }
        const result = await WorkshopService.hostAdvance(
            room,
            parsed.data.action,
            parsed.data.responseId,
            parsed.data.targetClientId,
            parsed.data.count
        )
        if (!result.ok) {
            return apiError(ERROR_CODES.WORKSHOP_UPDATE_FAILED, result.message ?? 'Action failed', 409)
        }
        return apiSuccess({ done: true })
    } catch {
        return apiError(ERROR_CODES.WORKSHOP_UPDATE_FAILED, 'Failed to apply action', 500)
    }
}
