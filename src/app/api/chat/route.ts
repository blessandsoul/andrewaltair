export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/server-auth"
import { rateLimit } from "@/lib/rate-limit";
import { BotService } from "@/services/bot.service";

// 🛡️ Rate limiting
const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
});

async function checkRateLimit(userId: string) {
    try {
        await limiter.check(null, 10, userId); // 10 requests per minute
        return { allowed: true };
    } catch {
        return { allowed: false };
    }
}

export async function POST(request: NextRequest) {
    try {
        // 🛡️ AUTHENTICATION REQUIRED
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: "ავტორიზაცია აუცილებელია" }, { status: 401 });
        }

        // 🛡️ RATE LIMITING
        const { allowed } = await checkRateLimit(user._id.toString());
        if (!allowed) {
            return NextResponse.json({ error: "ძალიან ბევრი მოთხოვნა. გთხოვთ დაელოდოთ 1 წუთს." }, { status: 429 });
        }

        const { message, history, masterPrompt } = await request.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const responseContent = await BotService.chat(message, history, masterPrompt);

        return NextResponse.json({ response: responseContent });

    } catch (error: any) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate response" },
            { status: 500 }
        )
    }
}
