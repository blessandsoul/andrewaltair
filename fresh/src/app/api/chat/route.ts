import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"

// Lazy initialization to avoid build-time errors
function getClient() {
    return new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
    })
}

export async function POST(request: NextRequest) {
    try {
        const client = getClient()
        const { message, history, botId, masterPrompt } = await request.json()

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 })
        }

        // Use bot's masterPrompt if provided, otherwise use default
        const systemPrompt = masterPrompt || "შენ ხარ AI ასისტენტი. პასუხობ ქართულად და ეხმარები მომხმარებელს."

        // Build conversation history for context
        const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
            {
                role: "system",
                content: systemPrompt
            }
        ]

        // Add conversation history if provided
        if (history && Array.isArray(history)) {
            for (const msg of history.slice(-10)) {
                if (msg.role === "user" || msg.role === "assistant") {
                    messages.push({
                        role: msg.role,
                        content: msg.content
                    })
                }
            }
        }

        // Add current message
        messages.push({
            role: "user",
            content: message
        })

        const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages,
            temperature: 0.7,
            max_tokens: 500,
        })

        const content = response.choices[0]?.message?.content || "ბოდიში, დროებით ვერ ვპასუხობ. სცადეთ თავიდან! 🙏"

        return NextResponse.json({ response: content })

    } catch (error) {
        console.error("Chat API error:", error)
        return NextResponse.json(
            { error: "Failed to generate response" },
            { status: 500 }
        )
    }
}
