import { NextRequest, NextResponse } from 'next/server'

interface ContactFormData {
    name: string
    email: string
    phone?: string
    service: string
    budget?: string
    message: string
    urgency?: string
    social?: string
}

export async function POST(request: NextRequest) {
    try {
        const data: ContactFormData = await request.json()

        // Validate required fields
        if (!data.name || !data.email || !data.message) {
            return NextResponse.json(
                { error: 'სახელი, ელ-ფოსტა და შეტყობინება აუცილებელია' },
                { status: 400 }
            )
        }

        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.error('Telegram credentials not configured')
            return NextResponse.json(
                { error: 'სერვისი დროებით მიუწვდომელია' },
                { status: 500 }
            )
        }

        // Format message for Telegram
        const urgencyEmoji = {
            'low': '🟢',
            'medium': '🟡',
            'high': '🔴',
            'urgent': '🚨'
        }[data.urgency || 'medium'] || '🟡'

        const telegramMessage = `
🔔 *ახალი მოთხოვნა საიტიდან!*

${urgencyEmoji} *პრიორიტეტი:* ${data.urgency === 'urgent' ? 'სასწრაფო!' : data.urgency === 'high' ? 'მაღალი' : data.urgency === 'low' ? 'დაბალი' : 'საშუალო'}

👤 *სახელი:* ${escapeMarkdown(data.name)}
📧 *ელ-ფოსტა:* ${escapeMarkdown(data.email)}
${data.phone ? `📱 *ტელეფონი:* ${escapeMarkdown(data.phone)}` : ''}
${data.social ? `🔗 *სოც. ქსელი:* ${escapeMarkdown(data.social)}` : ''}

🎯 *სერვისი:* ${escapeMarkdown(data.service || 'არ არის მითითებული')}
${data.budget ? `💰 *ბიუჯეტი:* ${escapeMarkdown(data.budget)}` : ''}

💬 *შეტყობინება:*
${escapeMarkdown(data.message)}

⏰ *დრო:* ${new Date().toLocaleString('ka-GE', { timeZone: 'Asia/Tbilisi' })}
🌐 *წყარო:* andrewaltair.ge
        `.trim()

        // Send to Telegram
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

        const telegramResponse = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: telegramMessage,
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            })
        })

        if (!telegramResponse.ok) {
            const error = await telegramResponse.text()
            console.error('Telegram API error:', error)
            return NextResponse.json(
                { error: 'შეტყობინების გაგზავნა ვერ მოხერხდა' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'შეტყობინება წარმატებით გაიგზავნა! დაგიკავშირდებით მალე.'
        })

    } catch (error) {
        console.error('Contact form error:', error)
        return NextResponse.json(
            { error: 'დაფიქსირდა შეცდომა' },
            { status: 500 }
        )
    }
}

// Escape special Markdown characters
function escapeMarkdown(text: string): string {
    return text
        .replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&')
}
