export const dynamic = 'force-dynamic'
import { NextRequest } from "next/server"
import OpenAI from "openai"
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'

// Lazy initialization to avoid build errors when API key is not set
let openai: OpenAI | null = null

function getOpenAI(): OpenAI {
    if (!openai) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error("OPENAI_API_KEY is not configured")
        }
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        })
    }
    return openai
}

export async function POST(request: NextRequest) {
    try {
        const { action, text, prompt } = await request.json()

        if (!text || !prompt) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, "ტექსტი და მოქმედება აუცილებელია", 400)
        }

        const client = getOpenAI()
        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful writing assistant. Follow the user's instructions precisely and return only the improved text without any additional commentary or explanation.",
                },
                {
                    role: "user",
                    content: `${prompt}\n\nText:\n${text}`,
                },
            ],
            max_tokens: 2000,
            temperature: 0.7,
        })

        const result = completion.choices[0]?.message?.content || text

        return apiSuccess({ result, action }, 'AI text processed')
    } catch (error) {
        console.error("AI text processing error:", error)
        return apiError(ERROR_CODES.AI_SERVICE_ERROR, "AI დამუშავება ვერ მოხერხდა", 500)
    }
}

