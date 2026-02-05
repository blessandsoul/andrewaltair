import { NextRequest } from "next/server";
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from "@/lib/db";
import BotVersion from "@/models/BotVersion";
import mongoose from "mongoose";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Get version history for a bot
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return apiError(ERROR_CODES.BAD_REQUEST, 'Invalid bot ID', 400);
        }

        const versions = await BotVersion.find({ botId: id })
            .sort({ createdAt: -1 })
            .select('version description changelog createdAt')
            .lean();

        return apiSuccess(versions, 'Bot versions fetched successfully');
    } catch (error) {
        console.error("Get bot versions error:", error);
        return apiError(ERROR_CODES.BOT_FETCH_FAILED, 'Failed to fetch versions', 500);
    }
}
