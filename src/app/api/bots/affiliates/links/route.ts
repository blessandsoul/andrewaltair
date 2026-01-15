import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AffiliateLink from "@/models/AffiliateLink";
import Bot from "@/models/Bot";
import { getUserFromRequest } from "@/lib/server-auth";
import { customAlphabet } from 'nanoid';

// Create short unique codes
const nanoid = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz', 8);

// GET - List user's affiliate links
export async function GET(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Fetch links and populate bot details
        const links = await AffiliateLink.find({ userId: user._id })
            .populate('botId', 'name icon color tier price')
            .sort({ createdAt: -1 });

        return NextResponse.json({ links });
    } catch (error) {
        console.error("Affiliate list error:", error);
        return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
    }
}

// POST - Create a new affiliate link
export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { botId, campaign } = body;

        await dbConnect();

        // Validate bot if provided
        if (botId) {
            const bot = await Bot.findById(botId);
            if (!bot) {
                return NextResponse.json({ error: "Bot not found" }, { status: 404 });
            }
        }

        // Generate unique code
        let code = body.customCode || nanoid();

        // Ensure uniqueness
        let existing = await AffiliateLink.findOne({ code });
        if (existing) {
            if (body.customCode) {
                return NextResponse.json({ error: "Code already taken" }, { status: 400 });
            }
            // Retry once for auto-generated
            code = nanoid();
        }

        const link = await AffiliateLink.create({
            userId: user._id,
            botId: botId || undefined,
            code,
            campaign,
            clicks: 0,
            conversions: 0,
            totalRevenue: 0
        });

        return NextResponse.json({ link }, { status: 201 });

    } catch (error) {
        console.error("Create affiliate link error:", error);
        return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
    }
}
