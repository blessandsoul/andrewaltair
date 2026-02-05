import { NextRequest } from "next/server";
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';
import { BotService } from "@/services/bot.service";
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Get single bot
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const bot = await BotService.getBotById(id);

        if (!bot) {
            return apiError(ERROR_CODES.BOT_NOT_FOUND, 'Bot not found', 404);
        }

        return apiSuccess(bot, 'Bot fetched successfully');
    } catch (error) {
        console.error("Get bot error:", error);
        return apiError(ERROR_CODES.BOT_FETCH_FAILED, 'Failed to fetch bot', 500);
    }
}

// PUT - Update bot
export async function PUT(request: NextRequest, { params }: RouteParams) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const { id } = await params;
        const body = await request.json();

        const bot = await BotService.updateBot(id, body);
        if (!bot) {
            return apiError(ERROR_CODES.BOT_NOT_FOUND, 'Bot not found', 404);
        }

        return apiSuccess({
            id: bot.id,
            name: bot.name,
        }, 'Bot updated successfully');
    } catch (error) {
        console.error("Update bot error:", error);
        return apiError(ERROR_CODES.BOT_UPDATE_FAILED, 'Failed to update bot', 500);
    }
}

// DELETE - Delete bot
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const { id } = await params;
        const deleted = await BotService.deleteBot(id);

        if (!deleted) {
            return apiError(ERROR_CODES.BOT_NOT_FOUND, 'Bot not found', 404);
        }

        return apiSuccess({
            id: deleted._id.toString()
        }, 'Bot deleted successfully');
    } catch (error) {
        console.error("Delete bot error:", error);
        return apiError(ERROR_CODES.BOT_DELETE_FAILED, 'Failed to delete bot', 500);
    }
}

// POST - Like a bot (Usually action=like, or just POST on ID as per old API)
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { getUserFromRequest } = await import('@/lib/server-auth');
        const user = await getUserFromRequest(request);

        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'ავტორიზაცია აუცილებელია', 401);
        }

        const { id } = await params;
        const bot = await BotService.likeBot(id);

        if (!bot) {
            return apiError(ERROR_CODES.BOT_NOT_FOUND, 'Bot not found', 404);
        }

        return apiSuccess({
            id: bot.id,
            likes: bot.likes,
        }, 'ლაიქი დაემატა');
    } catch (error) {
        console.error("Like bot error:", error);
        return apiError(ERROR_CODES.BOT_LIKE_FAILED, 'ლაიქის დამატება ვერ მოხერხდა', 500);
    }
}
