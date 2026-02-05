export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'

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

// 🛡️ Rate limiting for contact form
const contactAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_HOUR = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function checkContactRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn?: number } {
    const now = Date.now();
    const userLimit = contactAttempts.get(ip);

    if (userLimit) {
        if (now < userLimit.resetAt) {
            if (userLimit.count >= MAX_REQUESTS_PER_HOUR) {
                return { 
                    allowed: false, 
                    remaining: 0,
                    resetIn: Math.ceil((userLimit.resetAt - now) / 1000)
                };
            }
            userLimit.count++;
            return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - userLimit.count };
        }
        // Reset window
        contactAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
        return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - 1 };
    }

    contactAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - 1 };
}

export async function POST(request: NextRequest) {
    try {
        // 🛡️ Get IP for rate limiting
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') || 'unknown';

        // 🛡️ Check rate limit
        const rateLimit = checkContactRateLimit(ip);
        if (!rateLimit.allowed) {
            return apiError(ERROR_CODES.RATE_LIMITED, `ძალიან ბევრი მოთხოვნა. გთხოვთ დაელოდოთ ${Math.ceil((rateLimit.resetIn || 0) / 60)} წუთს.`, 429);
        }

        const data: ContactFormData = await request.json()

        // Validate required fields
        if (!data.name || !data.email || !data.message) {
            return apiError(ERROR_CODES.CONTACT_VALIDATION_FAILED, 'სახელი, ელ-ფოსტა და შეტყობინება აუცილებელია', 400)
        }

        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.error('Telegram credentials not configured')
            return apiError(ERROR_CODES.CONTACT_SEND_FAILED, 'სერვისი დროებით მიუწვდომელია', 500)
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
            return apiError(ERROR_CODES.CONTACT_SEND_FAILED, 'შეტყობინების გაგზავნა ვერ მოხერხდა', 500)
        }

        return apiSuccess(null, 'შეტყობინება წარმატებით გაიგზავნა! დაგიკავშირდებით მალე.')

    } catch (error) {
        console.error('Contact form error:', error)
        return apiError(ERROR_CODES.CONTACT_SEND_FAILED, 'დაფიქსირდა შეცდომა', 500)
    }
}

// Escape special Markdown characters
function escapeMarkdown(text: string): string {
    return text
        .replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&')
}

