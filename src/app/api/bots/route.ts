export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server";
import { BotService } from "@/services/bot.service";
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';

// GET - List all bots (Smart Search)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const params = {
            page: parseInt(searchParams.get("page") || "1"),
            limit: parseInt(searchParams.get("limit") || "50"),
            category: searchParams.get("category"),
            tier: searchParams.get("tier"),
            search: searchParams.get("search"),
            featured: searchParams.get("featured"),
            sort: searchParams.get("sort"),
            min_price: searchParams.get("min_price") ? parseFloat(searchParams.get("min_price")!) : 0,
            max_price: searchParams.get("max_price") ? parseFloat(searchParams.get("max_price")!) : 1000,
            rating: searchParams.get("rating") ? parseFloat(searchParams.get("rating")!) : 0,
        };

        const result = await BotService.getAllBots(params);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Smart Search error:", error);
        return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }
}

// POST - Create a new bot
export async function POST(request: NextRequest) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const body = await request.json();
        const bot = await BotService.createBot(body);
        return NextResponse.json(bot, { status: 201 });
    } catch (error) {
        console.error("Create bot error:", error);
        return NextResponse.json({ error: "Failed to create bot" }, { status: 500 });
    }
}
