import { NextRequest } from 'next/server'
import { z } from 'zod'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { WorkshopService } from '@/services/workshop.service'

export const dynamic = 'force-dynamic'

// The host's browser speech-recognition posts caption lines here. Interim lines update the
// live subtitle; final lines also append to the transcript for the end recap.
const schema = z.object({
    text: z.string().max(300),
    final: z.boolean().optional(),
})

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params
        const room = await WorkshopService.getRoomByCode(code)
        if (!room) return apiError(ERROR_CODES.WORKSHOP_NOT_FOUND, 'Room not found', 404)
        const body = await request.json()
        const parsed = schema.safeParse(body)
        if (!parsed.success) return apiError(ERROR_CODES.VALIDATION_FAILED, 'Invalid caption', 400)
        WorkshopService.pushCaption(room._id, parsed.data.text)
        if (parsed.data.final) await WorkshopService.appendTranscript(room._id, parsed.data.text)
        return apiSuccess({ ok: true })
    } catch {
        return apiError(ERROR_CODES.WORKSHOP_SUBMIT_FAILED, 'Failed to post caption', 500)
    }
}
