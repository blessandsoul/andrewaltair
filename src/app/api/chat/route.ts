export const dynamic = 'force-dynamic'
import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/server-auth"

import { rateLimit } from "@/lib/rate-limit";

// 🛡️ Rate limiting
const limiter = rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500, // Max users per interval
});

async function checkRateLimit(userId: string) {
    try {
        await limiter.check(null, 10, userId); // 10 requests per minute
        return { allowed: true };
    } catch {
        return { allowed: false };
    }
}

// Lazy initialization to avoid build-time errors
function getClient() {
    return new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
    })
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
        const { allowed } = await checkRateLimit(user._id.toString());
        if (!allowed) {
            return NextResponse.json(
                { error: "ძალიან ბევრი მოთხოვნა. გთხოვთ დაელოდოთ 1 წუთს." },
                { status: 429 }
            );
        }

        const client = getClient()
        const { message, history, botId, masterPrompt } = await request.json()

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 })
        }

        // 🛡️ Validate and sanitize masterPrompt
        let systemPrompt = "შენ ხარ AI ასისტენტი. პასუხობ ქართულად და ეხმარები მომხმარებელს.";

        if (masterPrompt) {
            // Limit prompt length to prevent abuse
            if (masterPrompt.length > 2000) {
                return NextResponse.json(
                    { error: "Master prompt ძალიან გრძელია" },
                    { status: 400 }
                );
            }
            systemPrompt = masterPrompt;
        }

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

