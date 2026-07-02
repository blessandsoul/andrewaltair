export const dynamic = 'force-dynamic'
import { NextRequest } from "next/server"
import { callGemini } from "@/lib/gemini"
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { rateLimit } from '@/lib/rate-limit'

// Per-IP rate limit to stop unauthenticated LLM cost-abuse (see audit V008).
const limiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 500 })
const MAX_REQUESTS_PER_MINUTE = 15
const MAX_TEXT_LENGTH = 8000
const MAX_PROMPT_LENGTH = 500

export async function POST(request: NextRequest) {
    try {
        const ip = (request.headers.get('x-forwarded-for') || 'anonymous').split(',')[0].trim()
        try {
            await limiter.check(request, MAX_REQUESTS_PER_MINUTE, `ai-text:${ip}`)
        } catch {
            return apiError(ERROR_CODES.RATE_LIMITED, "ძალიან ბევრი მოთხოვნა, სცადეთ მოგვიანებით", 429)
        }

        const { action, text, prompt } = await request.json()

        if (!text || !prompt) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, "ტექსტი და მოქმედება აუცილებელია", 400)
        }
        if (
            typeof text !== 'string' ||
            typeof prompt !== 'string' ||
            text.length > MAX_TEXT_LENGTH ||
            prompt.length > MAX_PROMPT_LENGTH
        ) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, "ტექსტი ან ბრძანება ზედმეტად გრძელია", 400)
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
