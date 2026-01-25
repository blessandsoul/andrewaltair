import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';
import { BotService } from "@/services/bot.service";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Get single bot
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const bot = await BotService.getBotById(id);

        if (!bot) {
            return NextResponse.json({ error: "Bot not found" }, { status: 404 });
        }

        return NextResponse.json(bot);
    } catch (error: any) {
        console.error("Get bot error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch bot" }, { status: 500 });
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
            return NextResponse.json({ error: "Bot not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: bot.id,
            name: bot.name,
            message: "Bot updated successfully"
        });
    } catch (error: any) {
        console.error("Update bot error:", error);
        return NextResponse.json({ error: error.message || "Failed to update bot" }, { status: 500 });
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
            return NextResponse.json({ error: "Bot not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Bot deleted successfully",
            id: deleted._id.toString()
        });
    } catch (error: any) {
        console.error("Delete bot error:", error);
        return NextResponse.json({ error: error.message || "Failed to delete bot" }, { status: 500 });
    }
}

// POST - Like a bot (Usually action=like, or just POST on ID as per old API)
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { getUserFromRequest } = await import('@/lib/server-auth');
        const user = await getUserFromRequest(request);

        if (!user) {
            return NextResponse.json({ error: "ავტორიზაცია აუცილებელია" }, { status: 401 });
        }

        const { id } = await params;
        const bot = await BotService.likeBot(id);

        if (!bot) {
            return NextResponse.json({ error: "Bot not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: bot.id,
            likes: bot.likes,
            message: 'ლაიქი დაემატა'
        });
    } catch (error: any) {
        console.error("Like bot error:", error);
        return NextResponse.json({ error: "ლაიქის დამატება ვერ მოხერხდა" }, { status: 500 });
    }
}
