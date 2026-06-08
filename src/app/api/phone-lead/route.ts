export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { notifyAdminTelegram, escapeTelegramHtml } from '@/lib/telegram'

// Simple in-memory rate limiting (mirrors api/newsletter pattern)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
    const now = Date.now()
    const limit = rateLimitMap.get(ip)

    if (!limit || limit.resetAt < now) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 }) // 1 minute window
        return false
    }

    if (limit.count >= 5) { // Max 5 per minute
        return true
    }

    limit.count++
    return false
}

// POST - capture a phone number and notify admin via Telegram (no DB write)
export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') || 'unknown'

        if (isRateLimited(ip)) {
            return apiError(ERROR_CODES.RATE_LIMITED, 'ძალიან ბევრი მოთხოვნა. სცადეთ მოგვიანებით.', 429)
        }

        const body = await request.json()
        const phone: string = (body?.phone ?? '').toString().trim()
        const page: string = (body?.page ?? '').toString()

        // Presence only — NO format validation, per requirement.
        if (!phone) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'ტელეფონის ნომერი სავალდებულოა', 400)
        }

        const when = new Date().toLocaleString('ka-GE', { timeZone: 'Asia/Tbilisi' })
        const text =
            `📞 <b>ახალი ტელეფონის ნომერი (გამოწერა)</b>\n\n` +
            `<b>ნომერი:</b> ${escapeTelegramHtml(phone)}\n` +
            `<b>გვერდი:</b> ${escapeTelegramHtml(page || 'უცნობი')}\n` +
            `<b>დრო:</b> ${escapeTelegramHtml(when)}`

        const ok = await notifyAdminTelegram(text)
        if (!ok) {
            return apiError(ERROR_CODES.PHONE_LEAD_FAILED, 'გაგზავნა ვერ მოხერხდა', 500)
        }

        return apiSuccess(null, 'გმადლობთ! მალე დაგიკავშირდებით.')
    } catch (error) {
        console.error('Phone lead error:', error)
        return apiError(ERROR_CODES.PHONE_LEAD_FAILED, 'სერვერის შეცდომა', 500)
    }
}
