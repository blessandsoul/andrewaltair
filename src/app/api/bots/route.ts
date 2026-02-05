export const dynamic = 'force-dynamic'
import { NextRequest } from "next/server";
import { BotService } from "@/services/bot.service";
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

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
        return apiSuccess(result, 'Bots fetched successfully');
    } catch (error) {
        console.error("Smart Search error:", error);
        return apiError(ERROR_CODES.BOT_FETCH_FAILED, 'Search failed', 500);
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
        return apiSuccess(bot, 'Bot created successfully', 201);
    } catch (error) {
        console.error("Create bot error:", error);
        return apiError(ERROR_CODES.BOT_CREATE_FAILED, 'Failed to create bot', 500);
    }
}
