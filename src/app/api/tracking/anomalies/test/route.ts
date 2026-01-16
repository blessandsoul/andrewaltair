export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
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
            return NextResponse.json({
                success: false,
                error: 'Telegram not configured. Please set Bot Token and Chat ID in settings.'
            }, { status: 400 })
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
            return NextResponse.json({
                success: false,
                error: result.description || 'Telegram API error'
            }, { status: 400 })
        }

        return NextResponse.json({ success: true, message: 'Test message sent successfully' })
    } catch (error) {
        console.error('Telegram test error:', error)
        return NextResponse.json({ error: 'Failed to send test message' }, { status: 500 })
    }
}

