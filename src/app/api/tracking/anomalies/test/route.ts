export const dynamic = 'force-dynamic'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import dbConnect from '@/lib/db'
import Setting from '@/models/Setting'

// POST - Send a test Telegram message
export async function POST() {
    try {
        await dbConnect()

        // Get Telegram settings
        const tokenSetting = await Setting.findOne({ key: 'telegram_bot_token' })
        const chatIdSetting = await Setting.findOne({ key: 'telegram_chat_id' })

        const token = tokenSetting?.value
        const chatId = chatIdSetting?.value

        if (!token || !chatId) {
            return apiError(ERROR_CODES.TRACKING_FETCH_FAILED, 'Telegram not configured. Please set Bot Token and Chat ID in settings.', 400)
        }

        // Send test message
        const message = `🧪 *Test Alert from Fresh Analytics*

This is a test message to confirm your Telegram integration is working correctly.

✅ Bot Token: Configured
✅ Chat ID: ${chatId}
📅 Time: ${new Date().toLocaleString()}

If you received this message, alerts are properly configured!`

        const response = await fetch(
            `https://api.telegram.org/bot${token}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'Markdown'
                })
            }
        )

        const result = await response.json()

        if (!result.ok) {
            return apiError(ERROR_CODES.TELEGRAM_POST_FAILED, result.description || 'Telegram API error', 400)
        }

        return apiSuccess(null, 'Test message sent successfully')
    } catch (error) {
        console.error('Telegram test error:', error)
        return apiError(ERROR_CODES.TRACKING_FETCH_FAILED, 'Failed to send test message', 500)
    }
}

