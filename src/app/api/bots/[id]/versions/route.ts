import { NextRequest, NextResponse } from "next/server";
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
            return NextResponse.json({ error: "Invalid bot ID" }, { status: 400 });
        }

        // Fetch versions sorted by creation date (newest first)
        // We exclude 'masterPromptSnapshot' for security unless the user is the creator (logic pending)
        // For now, public history just shows version, description, changelog
        const versions = await BotVersion.find({ botId: id })
            .sort({ createdAt: -1 })
            .select('version description changelog createdAt')
            .lean();

        return NextResponse.json({
            versions
        });
    } catch (error) {
        console.error("Get bot versions error:", error);
        return NextResponse.json({ error: "Failed to fetch versions" }, { status: 500 });
    }
}
