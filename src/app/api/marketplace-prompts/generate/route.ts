import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/server-auth"

// Initialize OpenAI client for Groq
const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
})

export async function POST(request: NextRequest) {
    try {
        // Auth check
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, description, promptTemplate } = await request.json()

        if (!title && !description && !promptTemplate) {
            return NextResponse.json(
                { error: "At least one field (title, description, or prompt) is required" },
                { status: 400 }
            )
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
1. Slug: English, lowercase, kebab-case.
2. Tags: 5-8 relevant tags, English or Georgian (mix is okay, but English preferred for global discoverability).
3. Meta Title: Attractive, includes key terms.
4. Meta Description: clickable, summarizes value.
5. Alt Text: Describe the visual result of the prompt concisely.
6. Excerpt: A teaser for the card view.
`

        const userContent = `
Title: ${title || "N/A"}
Description: ${description || "N/A"}
Prompt Template: ${promptTemplate || "N/A"}
`

        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
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

        return NextResponse.json(result)

    } catch (error) {
        console.error("Analysis error:", error)
        return NextResponse.json(
            { error: "Failed to generate metadata" },
            { status: 500 }
        )
    }
}
