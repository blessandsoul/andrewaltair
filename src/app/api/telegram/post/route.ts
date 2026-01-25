export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { CommunicationService } from '@/services/communication.service'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const result = await CommunicationService.sendTelegram(body)

        if (!result.success) {
            return NextResponse.json({
                error: result.error,
                details: result.details // telegram lib returns details sometimes
            }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            messageId: result.messageId
        })
    } catch (error: any) {
        console.error('Telegram post error:', error)
        return NextResponse.json({ error: 'Failed to post to Telegram' }, { status: 500 })
    }
}
