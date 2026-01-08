import { NextRequest, NextResponse } from 'next/server'

const TELEGRAM_API_URL = 'https://api.telegram.org/bot'

interface TelegramPostRequest {
    title: string
    telegramContent: string
    postUrl: string
    coverImage?: string
}

export async function POST(request: NextRequest) {
    try {
        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
        const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '@andr3waltairchannel'

        if (!TELEGRAM_BOT_TOKEN) {
            return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN not configured' }, { status: 500 })
        }

        const body: TelegramPostRequest = await request.json()
        const { title, telegramContent, postUrl, coverImage } = body

        if (!title || !telegramContent) {
            return NextResponse.json({ error: 'title and telegramContent are required' }, { status: 400 })
        }

        // Format message for Telegram
        const message = `📰 *${escapeMarkdown(title)}*

${escapeMarkdown(telegramContent)}

🔗 [სრულად წაიკითხე](${postUrl})

#AndrewAltair #AI #ტექნოლოგიები`

        // Send message to channel
        let result

        if (coverImage && coverImage.startsWith('http')) {
            // Send with photo
            const photoResponse = await fetch(`${TELEGRAM_API_URL}${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHANNEL_ID,
                    photo: coverImage,
                    caption: message,
                    parse_mode: 'Markdown'
                })
            })
            result = await photoResponse.json()
        } else {
            // Send text only
            const textResponse = await fetch(`${TELEGRAM_API_URL}${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHANNEL_ID,
                    text: message,
                    parse_mode: 'Markdown',
                    disable_web_page_preview: false
                })
            })
            result = await textResponse.json()
        }

        if (!result.ok) {
            console.error('Telegram API error:', result)
            return NextResponse.json({
                error: 'Failed to post to Telegram',
                details: result.description
            }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            messageId: result.result?.message_id
        })

    } catch (error) {
        console.error('Telegram post error:', error)
        return NextResponse.json({ error: 'Failed to post to Telegram' }, { status: 500 })
    }
}

// Escape special Markdown characters for Telegram
function escapeMarkdown(text: string): string {
    return text
        .replace(/\*/g, '\\*')
        .replace(/_/g, '\\_')
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/~/g, '\\~')
        .replace(/`/g, '\\`')
        .replace(/>/g, '\\>')
        .replace(/#/g, '\\#')
        .replace(/\+/g, '\\+')
        .replace(/-/g, '\\-')
        .replace(/=/g, '\\=')
        .replace(/\|/g, '\\|')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\./g, '\\.')
        .replace(/!/g, '\\!')
}
