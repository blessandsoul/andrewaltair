import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Bot from "@/models/Bot";
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';

// GET - List all bots with filtering
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "50");
        const category = searchParams.get("category");
        const tier = searchParams.get("tier");
        const search = searchParams.get("search");
        const featured = searchParams.get("featured");

        // Build query
        const query: Record<string, unknown> = { isActive: true };

        if (category && category !== 'all') {
            query.category = category;
        }
        if (tier && tier !== 'all') {
            query.tier = tier;
        }
        if (featured === "true") {
            query.isFeatured = true;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { codename: { $regex: search, $options: 'i' } },
            ];
        }

        // Get total count
        const total = await Bot.countDocuments(query);

        // Get paginated results (exclude masterPrompt from list)
        const bots = await Bot.find(query)
            .select('-masterPrompt')
            .sort({ isFeatured: -1, isNew: -1, rating: -1, name: 1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        // Transform _id to id
        const transformedBots = bots.map(bot => ({
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
            rating: bot.rating,
            downloads: bot.downloads,
            likes: bot.likes,
            isRecentlyAdded: bot.isRecentlyAdded,
            isFeatured: bot.isFeatured,
        }));

        // Get distinct categories
        const categories = await Bot.distinct("category");

        return NextResponse.json({
            bots: transformedBots,
            categories,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Get bots error:", error);
        return NextResponse.json({ error: "Failed to fetch bots" }, { status: 500 });
    }
}

// POST - Create a new bot
export async function POST(request: NextRequest) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        await dbConnect();

        const body = await request.json();

        const bot = await Bot.create({
            name: body.name,
            codename: body.codename,
            version: body.version || 'V1.0',
            description: body.description,
            shortDescription: body.shortDescription,
            category: body.category,
            tier: body.tier || 'free',
            price: body.price,
            icon: body.icon || 'Bot',
            color: body.color || 'from-violet-500 to-purple-600',
            features: body.features || [],
            masterPrompt: body.masterPrompt,
            rating: body.rating || 4.5,
            isRecentlyAdded: body.isRecentlyAdded ?? true,
            isFeatured: body.isFeatured || false,
        });

        return NextResponse.json({
            id: bot._id.toString(),
            name: bot.name,
            codename: bot.codename,
            version: bot.version,
            category: bot.category,
            tier: bot.tier,
        }, { status: 201 });
    } catch (error) {
        console.error("Create bot error:", error);
        return NextResponse.json({ error: "Failed to create bot" }, { status: 500 });
    }
}

