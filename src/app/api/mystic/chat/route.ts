import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"
import { AI_CONFIG, CHAT_RULES } from "@/lib/mystic-rules"

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
        const client = getClient()
        const { message, history = [], userName, zodiacSign } = await request.json()

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 })
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
