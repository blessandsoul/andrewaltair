export const dynamic = 'force-dynamic'
import { NextRequest } from "next/server"
import { callGemini } from "@/lib/gemini"
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'

export async function POST(request: NextRequest) {
    try {
        const { action, text, prompt } = await request.json()

        if (!text || !prompt) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, "ტექსტი და მოქმედება აუცილებელია", 400)
        }

        const result = await callGemini({
            systemPrompt: "You are a helpful writing assistant. Follow the user's instructions precisely and return only the improved text without any additional commentary or explanation.",
            userMessage: `${prompt}\n\nText:\n${text}`,
            temperature: 0.7,
            maxOutputTokens: 2000,
        })

        return apiSuccess({ result: result || text, action }, 'AI text processed')
    } catch (error) {
        console.error("AI text processing error:", error)
        return apiError(ERROR_CODES.AI_SERVICE_ERROR, "AI დამუშავება ვერ მოხერხდა", 500)
    }
}
