import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"
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
        // 🛡️ AUTHENTICATION REQUIRED
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: "ავტორიზაცია აუცილებელია" },
                { status: 401 }
            );
        }

        // 🛡️ RATE LIMITING
        const rateLimit = checkMysticRateLimit(user._id.toString());
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: "ძალიან ბევრი მოთხოვნა. გთხოვთ დაელოდოთ 1 საათს." },
                { status: 429 }
            );
        }

        const client = getClient()
        const { message, history = [], userName, zodiacSign } = await request.json()

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 })
        }

        // 🛡️ Validate message length
        if (message.length > 1000) {
            return NextResponse.json(
                { error: "შეტყობინება ძალიან გრძელია (მაქს. 1000 სიმბოლო)" },
                { status: 400 }
            );
        }

        const zodiacTrait = zodiacSign ? getZodiacTrait(zodiacSign) : undefined
        const zodiacContext = zodiacTrait
            ? `მომხმარებელი ${zodiacSign} ნიშნის ქვეშ არის დაბადებული - ${zodiacTrait}.`
            : ""

        const userContext = userName ? `მომხმარებლის სახელია ${userName}.` : ""

        // Добавляем динамический контекст к централизованному системному промпту
        const fullSystemPrompt = `${CHAT_RULES.systemPrompt}

${userContext}
${zodiacContext}`

        const messages = [
            { role: "system" as const, content: fullSystemPrompt },
            ...history.slice(-8).map((m: { role: string; content: string }) => ({
                role: m.role as 'user' | 'assistant',
                content: m.content
            })),
            { role: "user" as const, content: message }
        ]

        const response = await client.chat.completions.create({
            model: AI_CONFIG.model,
            messages,
            temperature: AI_CONFIG.temperature,
            max_tokens: 500,
        })

        const content = response.choices[0]?.message?.content || "ვარსკვლავები დროებით დადუმდნენ... გთხოვ სცადო ხელახლა."

        return NextResponse.json({ response: content })

    } catch (error) {
        console.error("Mystic Chat API error:", error)
        return NextResponse.json(
            { error: "Failed to get mystic response" },
            { status: 500 }
        )
    }
}
