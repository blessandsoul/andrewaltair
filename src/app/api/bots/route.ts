import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Bot from "@/models/Bot";
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';

// GET - List all bots with filtering
// GET - List all bots with advanced filtering (Smart Search)
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

        // New Filters
        const sort = searchParams.get("sort") || "popular"; // popular, newest, lowest_price, highest_price, rating
        const minPrice = searchParams.get("min_price") ? parseFloat(searchParams.get("min_price")!) : 0;
        const maxPrice = searchParams.get("max_price") ? parseFloat(searchParams.get("max_price")!) : 1000;
        const minRating = searchParams.get("rating") ? parseFloat(searchParams.get("rating")!) : 0;

        const pipeline: any[] = [
            { $match: { isActive: true } }
        ];

        // 1. Text Search or Regex Fallback
        if (search) {
            // Prioritize Full Text Search if index exists, else use regex
            pipeline.push({
                $match: {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } },
                        { codename: { $regex: search, $options: 'i' } },
                        { 'features': { $regex: search, $options: 'i' } } // Also search features
                    ]
                }
            });
        }

        // 2. Filters
        if (category && category !== 'all') {
            pipeline.push({ $match: { category } });
        }
        if (tier && tier !== 'all') {
            pipeline.push({ $match: { tier } });
        }
        if (featured === "true") {
            pipeline.push({ $match: { isFeatured: true } });
        }

        // Price Range
        if (minPrice > 0 || maxPrice < 1000) {
            pipeline.push({
                $match: {
                    $or: [
                        { price: { $gte: minPrice, $lte: maxPrice } },
                        // If salePrice is active, check against salePrice instead
                        {
                            salePrice: { $exists: true, $gte: minPrice, $lte: maxPrice }
                        }
                    ]
                }
            });
        }

        // Min Rating
        if (minRating > 0) {
            pipeline.push({ $match: { rating: { $gte: minRating } } });
        }

        // 3. Sorting
        // Determine sort object
        let sortStage: any = { isFeatured: -1, isRecentlyAdded: -1 };

        switch (sort) {
            case 'newest':
                sortStage = { createdAt: -1 };
                break;
            case 'lowest_price':
                sortStage = { price: 1 }; // Simplification: doesn't account for salePrice mix perfectly in sort
                break;
            case 'highest_price':
                sortStage = { price: -1 };
                break;
            case 'rating':
                sortStage = { rating: -1, totalReviews: -1 };
                break;
            case 'popular':
            default:
                sortStage = { 'stats.totalSales': -1, downloads: -1, rating: -1 };
                break;
        }

        pipeline.push({ $sort: sortStage });

        // 4. Pagination (Facet for count and docs)
        const skip = (page - 1) * limit;

        pipeline.push({
            $facet: {
                metadata: [{ $count: "total" }],
                bots: [
                    { $skip: skip },
                    { $limit: limit },
                    { $project: { masterPrompt: 0 } } // Exclude masterPrompt
                ]
            }
        });

        const results = await Bot.aggregate(pipeline);

        const metadata = results[0].metadata[0] || { total: 0 };
        const bots = results[0].bots || [];

        // Transform _id to id
        const transformedBots = bots.map((bot: any) => ({
            ...bot,
            id: bot._id.toString(),
            _id: undefined
        }));

        // Get distinct categories (separate query for sidebar)
        const categories = await Bot.distinct("category");

        return NextResponse.json({
            bots: transformedBots,
            categories,
            pagination: {
                total: metadata.total,
                page,
                limit,
                totalPages: Math.ceil(metadata.total / limit)
            }
        });

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

