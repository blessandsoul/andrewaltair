export const dynamic = 'force-dynamic'
import OpenAI from "openai"
import { NextRequest } from "next/server"
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { AI_CONFIG, CHAT_RULES } from "@/lib/mystic-rules"
import { getUserFromRequest } from "@/lib/server-auth"

// 🛡️ Rate limiting for mystic chat
const mysticChatRequests = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_HOUR = 20;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function checkMysticRateLimit(userId: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const userLimit = mysticChatRequests.get(userId);

    if (userLimit) {
        if (now < userLimit.resetAt) {
            if (userLimit.count >= MAX_REQUESTS_PER_HOUR) {
                return { allowed: false, remaining: 0 };
            }
            userLimit.count++;
            return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - userLimit.count };
        }
        mysticChatRequests.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
        return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - 1 };
    }

    mysticChatRequests.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - 1 };
}

// Lazy initialization to avoid build-time errors
function getClient() {
    return new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: AI_CONFIG.baseURL,
    })
}

// Функция для получения трейта зодиака из централизованных правил
function getZodiacTrait(sign: string): string | undefined {
    const traits = CHAT_RULES.zodiacTraits as Record<string, string>
    return traits[sign]
}

export async function POST(request: NextRequest) {
    try {
        // 🛡️ CSRF PROTECTION
        const { requireCSRF } = await import('@/lib/csrf');
        const csrfError = requireCSRF(request);
        if (csrfError) return csrfError;

        // 🛡️ AUTHENTICATION REQUIRED
        const user = await getUserFromRequest(request);
        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'ავტორიზაცია აუცილებელია', 401);
        }

        // 🛡️ RATE LIMITING
        const rateLimit = checkMysticRateLimit(user._id.toString());
        if (!rateLimit.allowed) {
            return apiError(ERROR_CODES.RATE_LIMITED, 'Too many requests', 429);
        }

        const client = getClient()
        const { message, history = [], userName, zodiacSign } = await request.json()

        // 🛡️ API VALIDATION & SANITIZATION
        const { validateAIInput, sanitizeAIInput, sanitizeAIResponse } = await import('@/lib/prompt-sanitizer');

        const messageValidation = validateAIInput(message, 'შეტყობინება', 1, 1000);
        if (!messageValidation.valid) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Message is required', 400);
        }

        const safeMessage = sanitizeAIInput(message, { maxLength: 1000 });
        const safeUserName = userName ? sanitizeAIInput(userName, { maxLength: 50, allowSpecialChars: false }) : '';

        const zodiacTrait = zodiacSign ? getZodiacTrait(zodiacSign) : undefined
        const zodiacContext = zodiacTrait
            ? `მომხმარებელი ${zodiacSign} ნიშნის ქვეშ არის დაბადებული - ${zodiacTrait}.`
            : ""

        const userContext = safeUserName ? `მომხმარებლის სახელია ${safeUserName}.` : ""

        // Добавляем динамический контекст к централизованному системному промпту
        const fullSystemPrompt = `${CHAT_RULES.systemPrompt}

${userContext}
${zodiacContext}`

        // Sanitize history to prevent injection via history
        const safeHistory = history.map((m: { role: string; content: string }) => ({
            role: m.role as 'user' | 'assistant',
            content: sanitizeAIInput(m.content, { maxLength: 1000 })
        }));

        const messages = [
            { role: "system" as const, content: fullSystemPrompt },
            ...safeHistory.slice(-8),
            { role: "user" as const, content: safeMessage }
        ]

        const response = await client.chat.completions.create({
            model: AI_CONFIG.model,
            messages,
            temperature: AI_CONFIG.temperature,
            max_tokens: 500,
        })

        const content = response.choices[0]?.message?.content || "ვარსკვლავები დროებით დადუმდნენ... გთხოვ სცადო ხელახლა."

        // 🛡️ Sanitize Response
        const safeContent = sanitizeAIResponse(content);

        return apiSuccess({ response: safeContent })

    } catch (error) {
        console.error("Mystic Chat API error:", error)
        return apiError(ERROR_CODES.MYSTIC_FETCH_FAILED, 'Chat failed', 500)
    }
}

