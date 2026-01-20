export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { sendTelegramPost, TelegramPostData } from '@/lib/telegram'

export async function POST(request: NextRequest) {
    // Force rebuild
    try {
        const body: TelegramPostData = await request.json()

        // Validation handled in lib function mostly, but good to check basics here if needed or let lib handle it.
        // The lib function returns structured error.

        const result = await sendTelegramPost(body)

        if (!result.success) {
            return NextResponse.json({
                error: result.error,
                details: result.details
            }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            messageId: result.messageId
        })
    } catch (error) {
        console.error('Telegram post error:', error)
        return NextResponse.json({ error: 'Failed to post to Telegram' }, { status: 500 })
    }
}

// Note: telegramContent is already properly formatted by the parser
// No need to escape markdown characters

