import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Bot from "@/models/Bot";
import mongoose from "mongoose";
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Get single bot with full details
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid bot ID" }, { status: 400 });
        }

        const bot = await Bot.findById(id).lean();

        if (!bot) {
            return NextResponse.json({ error: "Bot not found" }, { status: 404 });
        }

        // Increment views/downloads
        await Bot.findByIdAndUpdate(id, { $inc: { downloads: 1 } });

        // For private bots, hide the prompt
        const masterPrompt = bot.tier === 'private' ? null : bot.masterPrompt;

        return NextResponse.json({
            id: bot._id.toString(),
            name: bot.name,
            codename: bot.codename,
            version: bot.version,
            description: bot.description,
            shortDescription: bot.shortDescription,
            category: bot.category,
            tier: bot.tier,
            price: bot.price,
            icon: bot.icon,
            color: bot.color,
            features: bot.features,
            masterPrompt,
            rating: bot.rating,
            downloads: bot.downloads,
            likes: bot.likes,
            isRecentlyAdded: bot.isRecentlyAdded,
            isFeatured: bot.isFeatured,
        });
    } catch (error) {
        console.error("Get bot error:", error);
        return NextResponse.json({ error: "Failed to fetch bot" }, { status: 500 });
    }
}

// PUT - Update bot
export async function PUT(request: NextRequest, { params }: RouteParams) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid bot ID" }, { status: 400 });
        }

        const bot = await Bot.findByIdAndUpdate(
            id,
            {
                name: body.name,
                codename: body.codename,
                version: body.version,
                description: body.description,
                shortDescription: body.shortDescription,
                category: body.category,
                tier: body.tier,
                price: body.price,
                icon: body.icon,
                color: body.color,
                features: body.features,
                masterPrompt: body.masterPrompt,
                isRecentlyAdded: body.isRecentlyAdded,
                isFeatured: body.isFeatured,
                isActive: body.isActive,
            },
            { new: true, runValidators: true }
        );

        if (!bot) {
            return NextResponse.json({ error: "Bot not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: bot._id.toString(),
            name: bot.name,
            message: "Bot updated successfully"
        });
    } catch (error) {
        console.error("Update bot error:", error);
        return NextResponse.json({ error: "Failed to update bot" }, { status: 500 });
    }
}

// DELETE - Delete bot
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        await dbConnect();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid bot ID" }, { status: 400 });
        }

        const bot = await Bot.findByIdAndDelete(id);

        if (!bot) {
            return NextResponse.json({ error: "Bot not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Bot deleted successfully",
            id: bot._id.toString()
        });
    } catch (error) {
        console.error("Delete bot error:", error);
        return NextResponse.json({ error: "Failed to delete bot" }, { status: 500 });
    }
}

// POST - Like a bot
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid bot ID" }, { status: 400 });
        }

        const bot = await Bot.findByIdAndUpdate(
            id,
            { $inc: { likes: 1 } },
            { new: true }
        );

        if (!bot) {
            return NextResponse.json({ error: "Bot not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: bot._id.toString(),
            likes: bot.likes
        });
    } catch (error) {
        console.error("Like bot error:", error);
        return NextResponse.json({ error: "Failed to like bot" }, { status: 500 });
    }
}
