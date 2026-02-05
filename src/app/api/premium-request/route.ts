import { TELEGRAM_API_URL } from '@/lib/telegram';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, social, source, sourcePage, timestamp } = body;

        // Validation
        if (!name || !email || !phone) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'სახელი, ელფოსტა და ტელეფონი სავალდებულოა', 400);
        }

        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID; // Your personal chat ID

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.error('Telegram credentials not configured');
            return apiError(ERROR_CODES.PREMIUM_REQUEST_FAILED, 'სერვერის კონფიგურაციის შეცდომა', 500);
        }

        // Get section emoji and name
        const getSectionInfo = (src: string) => {
            switch (src) {
                case 'vibe-coding':
                    return { emoji: '💜', name: 'Vibe Coding' };
                case 'ai-2026':
                    return { emoji: '🚀', name: 'AI 2026' };
                default:
                    return { emoji: '📚', name: 'ენციკლოპედია' };
            }
        };

        const sectionInfo = getSectionInfo(source);

        // Format Georgian time
        const georgianTime = new Date().toLocaleString('ka-GE', {
            timeZone: 'Asia/Tbilisi',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Format message for Telegram
        const socialLine = social ? `\n📱 *სოც. ქსელი:* ${social}` : '';
        const message = `
🔔 *ახალი პრემიუმ მოთხოვნა!*

${sectionInfo.emoji} *სექცია:* ${sectionInfo.name}
📄 *გვერდი:* ${sourcePage || 'Unknown'}

👤 *სახელი:* ${name}
📧 *ელფოსტა:* ${email}
📞 *ტელეფონი:* ${phone}${socialLine}

🕐 *დრო:* ${georgianTime}
`.trim();

        // Send to Telegram
        const telegramResponse = await fetch(
            `${TELEGRAM_API_URL}${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                })
            }
        );

        const telegramResult = await telegramResponse.json();

        if (!telegramResult.ok) {
            console.error('Telegram API error:', telegramResult);
            return apiError(ERROR_CODES.PREMIUM_REQUEST_FAILED, 'შეტყობინების გაგზავნა ვერ მოხერხდა', 500);
        }

        // console.log('[Premium Request] Sent to Telegram:', {
        //     name,
        //     email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
        //     source,
        //     messageId: telegramResult.result?.message_id
        // });

        return apiSuccess(null, 'მოთხოვნა წარმატებით გაიგზავნა');

    } catch (error) {
        console.error('Premium request error:', error);
        return apiError(ERROR_CODES.PREMIUM_REQUEST_FAILED, 'სერვერის შეცდომა', 500);
    }
}
