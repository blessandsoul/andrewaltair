export const dynamic = 'force-dynamic'
import { NextRequest } from "next/server"
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { getUserFromRequest } from "@/lib/server-auth"
import { rateLimit } from "@/lib/rate-limit";
import { BotService } from "@/services/bot.service";

// 🛡️ Rate limiting
const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
});

async function checkRateLimit(userId: string) {
    try {
        await limiter.check(null, 10, userId); // 10 requests per minute
        return { allowed: true };
    } catch {
        return { allowed: false };
    }
}

export async function POST(request: NextRequest) {
    try {
        // Use user ID for rate limiting if authenticated, fallback to IP
        const user = await getUserFromRequest(request);
        const rateLimitKey = user ? user._id.toString() : (request.headers.get('x-forwarded-for') || 'anonymous');

        // 🛡️ RATE LIMITING
        const { allowed } = await checkRateLimit(rateLimitKey);
        if (!allowed) {
            return apiError(ERROR_CODES.RATE_LIMITED, 'ძალიან ბევრი მოთხოვნა. გთხოვთ დაელოდოთ 1 წუთს.', 429);
        }

        const { message, history, masterPrompt } = await request.json();

        if (!message) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Message is required', 400);
        }

        const responseContent = await BotService.chat(message, history, masterPrompt);

        return apiSuccess({ response: responseContent }, 'Chat response generated');

    } catch (error: unknown) {
        console.error("Chat API error:", error);
        const message = error instanceof Error ? error.message : 'Failed to generate response';
        return apiError(ERROR_CODES.CHAT_FAILED, message, 500)
    }
}
