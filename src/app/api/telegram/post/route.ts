export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { CommunicationService } from '@/services/communication.service'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const result = await CommunicationService.sendTelegram(body)

        if (!result.success) {
            return apiError(ERROR_CODES.TELEGRAM_POST_FAILED, result.error || 'Failed to send Telegram message', 500)
        }

        return apiSuccess({ messageId: result.messageId }, 'Telegram message sent successfully')
    } catch (error: unknown) {
        console.error('Telegram post error:', error)
        return apiError(ERROR_CODES.TELEGRAM_POST_FAILED, 'Failed to post to Telegram', 500)
    }
}
