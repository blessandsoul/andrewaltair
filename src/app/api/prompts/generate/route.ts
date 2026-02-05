export const dynamic = 'force-dynamic'
import OpenAI from "openai"
import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { verifyAdmin } from "@/lib/admin-auth"

// Initialize OpenAI client for Groq
const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
})

export async function POST(request: NextRequest) {
    try {
        // Auth check - use admin auth for admin panel
        const isAdmin = verifyAdmin(request);
        if (!isAdmin) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Unauthorized', 401);
        }

        const { title, description, promptTemplate } = await request.json()

        if (!title && !description && !promptTemplate) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'At least one field (title, description, or prompt) is required', 400)
        }

        const systemPrompt = `You are an expert SEO and Metadata specialist for an AI Image Prompt Marketplace.
Your task is to generate metadata based on the user's input (Title, Description, Prompt Template).

Return ONLY valid JSON with this structure:
{
  "slug": "seo-friendly-kebab-case-slug-from-title",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "metaTitle": "SEO Title (max 60 chars)",
  "metaDescription": "SEO Description (max 160 chars)",
  "altText": "Descriptive alt text for images based on the visual description",
  "excerpt": "Short catchy excerpt (max 150 chars)"
}

Rules:
1. Slug: English, lowercase, kebab-case (ALWAYS English).
2. Tags: 5-8 relevant tags. Use the language of the input (Georgian if input is Georgian).
3. Meta Title: Attractive, includes key terms. MUST BE IN GEORGIAN (if input is Georgian). DO NOT ADD "ანდრევ ალტაირი" or any brand name - only the title itself.
4. Meta Description: clickable, summarizes value. MUST BE IN GEORGIAN (if input is Georgian).
5. Alt Text: Describe the visual result of the prompt concisely.
6. Excerpt: A teaser for the card view. MUST BE IN GEORGIAN.
`

        const userContent = `
Title: ${title || "N/A"}
Description: ${description || "N/A"}
Prompt Template: ${promptTemplate || "N/A"}
`

        const completion = await client.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userContent }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        })

        const content = completion.choices[0]?.message?.content
        if (!content) {
            throw new Error("No content received from AI")
        }

        const result = JSON.parse(content)

        return apiSuccess(result, 'Metadata generated successfully')

    } catch (error) {
        console.error("Analysis error:", error)
        return apiError(ERROR_CODES.PROMPT_GENERATE_FAILED, 'Failed to generate metadata', 500)
    }
}

