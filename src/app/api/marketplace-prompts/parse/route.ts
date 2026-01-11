import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/server-auth"

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
})

const SYSTEM_PROMPT = `You are an expert Content Parser.
Your task is to extract structured data from a raw "Prompt Product" text.

The input will contain a Title, Description, Categories, Tags, and a Code Block containing the actual AI Prompt.
The text might use emojis, Georgian labels ("სათაური", "აღწერა"), Russian labels ("заголовок"), or English labels.
It contains a Code Block (formatted as markdown) which contains the content.

Strictly Extract and Clean:
1. Title: Remove emojis, remove labels like "(სათაური)", "(Title)". Keep just the text.
2. Description: Remove emojis, remove labels.
3. Categories: Extract keywords matching standard categories.
4. Tags: Extract list of tags.
5. PromptTemplate: Extract the CONTENT inside the code block (\`\`\`). Remove the \`\`\` wrappers.
6. NegativePrompt: If the code block contains "--negative_prompt:", extract it separately.

Supported Category Keys (Output these EXACT keys if found equivalent in text):
illustration, photography, art, design, marketing, writing, coding, business, 3d-assets, fashion, architecture, gaming, logo, ui-ux, other

Output JSON format:
{
  "title": "Cleaned Title",
  "description": "Cleaned Description",
  "category": ["key1", "key2"],
  "tags": ["tag1", "tag2"],
  "promptTemplate": "The main prompt text...",
  "negativePrompt": "The negative prompt text..."
}
`

export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { text } = await request.json()
        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 })
        }

        const completion = await client.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: text }
            ],
            temperature: 0.1, // Low temp for extraction precision
            response_format: { type: "json_object" }
        })

        const content = completion.choices[0]?.message?.content
        if (!content) throw new Error("No content from AI")

        const result = JSON.parse(content)
        return NextResponse.json(result)

    } catch (error) {
        console.error("Parse API Error:", error)
        return NextResponse.json({ error: "Parse failed" }, { status: 500 })
    }
}
