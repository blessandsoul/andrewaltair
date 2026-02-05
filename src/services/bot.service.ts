import dbConnect from '@/lib/db';
import Bot from '@/models/Bot';
import OpenAI from "openai";
import mongoose from 'mongoose';

import type { IBot, BotCategory, BotTier } from '@/models/Bot';

interface GetAllBotsParams {
    page?: number;
    limit?: number;
    category?: BotCategory | 'all';
    tier?: BotTier | 'all';
    search?: string;
    featured?: string;
    sort?: string;
    min_price?: number;
    max_price?: number;
    rating?: number;
}

interface CreateBotData {
    name: string;
    codename: string;
    version?: string;
    description: string;
    shortDescription: string;
    category: BotCategory;
    tier?: BotTier;
    price?: number;
    icon?: string;
    color?: string;
    features?: string[];
    masterPrompt: string;
    rating?: number;
    isRecentlyAdded?: boolean;
    isFeatured?: boolean;
}

interface ChatHistoryMessage {
    role: 'user' | 'assistant';
    content: string;
}

// Lazy init client
function getAIClient() {
    return new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
    });
}

export class BotService {
    /**
     * Smart Search for Bots
     */
    static async getAllBots(params: GetAllBotsParams) {
        await dbConnect();
        const {
            page = 1,
            limit = 50,
            category,
            tier,
            search,
            featured,
            sort = "popular",
            min_price = 0,
            max_price = 1000,
            rating = 0
        } = params;

        const pipeline: mongoose.PipelineStage[] = [{ $match: { isActive: true } }];

        // 1. Search
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } },
                        { codename: { $regex: search, $options: 'i' } },
                        { 'features': { $regex: search, $options: 'i' } }
                    ]
                }
            });
        }

        // 2. Filters
        if (category && category !== 'all') pipeline.push({ $match: { category } });
        if (tier && tier !== 'all') pipeline.push({ $match: { tier } });
        if (featured === "true") pipeline.push({ $match: { isFeatured: true } });

        // Price
        if (min_price > 0 || max_price < 1000) {
            pipeline.push({
                $match: {
                    $or: [
                        { price: { $gte: min_price, $lte: max_price } },
                        { salePrice: { $exists: true, $gte: min_price, $lte: max_price } }
                    ]
                }
            });
        }

        // Rating
        if (rating > 0) pipeline.push({ $match: { rating: { $gte: rating } } });

        // 3. Sort
        let sortStage: Record<string, 1 | -1> = { isFeatured: -1, isRecentlyAdded: -1 };
        switch (sort) {
            case 'newest': sortStage = { createdAt: -1 }; break;
            case 'lowest_price': sortStage = { price: 1 }; break;
            case 'highest_price': sortStage = { price: -1 }; break;
            case 'rating': sortStage = { rating: -1, totalReviews: -1 }; break;
            case 'popular':
            default: sortStage = { 'stats.totalSales': -1, downloads: -1, rating: -1 }; break;
        }
        pipeline.push({ $sort: sortStage });

        // 4. Pagination
        const skip = (page - 1) * limit;
        pipeline.push({
            $facet: {
                metadata: [{ $count: "total" }],
                bots: [
                    { $skip: skip },
                    { $limit: limit },
                    { $project: { masterPrompt: 0 } }
                ]
            }
        });

        const results = await Bot.aggregate(pipeline);
        const metadata = results[0].metadata[0] || { total: 0 };
        const bots = results[0].bots || [];

        const transformedBots = bots.map((bot: Record<string, unknown> & { _id: mongoose.Types.ObjectId }) => ({
            ...bot,
            id: bot._id.toString(),
            _id: undefined
        }));

        const categories = await Bot.distinct("category");

        return {
            bots: transformedBots,
            categories,
            pagination: {
                total: metadata.total,
                page,
                limit,
                totalPages: Math.ceil(metadata.total / limit)
            }
        };
    }

    /**
     * CRUD
     */
    static async getBotById(id: string, isAdmin = false) {
        await dbConnect();

        // Support both MongoDB ObjectId and codename lookups
        let bot;
        if (mongoose.Types.ObjectId.isValid(id)) {
            bot = await Bot.findById(id).lean();
        } else {
            // Try lookup by codename
            bot = await Bot.findOne({ codename: id, isActive: true }).lean();
        }

        if (!bot) return null;

        // Hide prompt for private bots if not admin
        // Note: Route logic was "if tier === private then null".
        // It didn't explicitly check admin in the GET logic, but maybe it should?
        // Original logic: `const masterPrompt = bot.tier === 'private' ? null : bot.masterPrompt;`
        // It does NOT check admin. So private bots hide prompts from EVERYONE in GET /api/bots/[id].
        const masterPrompt = bot.tier === 'private' ? null : bot.masterPrompt;

        return { ...bot, id: bot._id.toString(), _id: undefined, masterPrompt: isAdmin ? bot.masterPrompt : masterPrompt };
    }

    static async createBot(data: CreateBotData) {
        await dbConnect();
        const bot = await Bot.create({
            name: data.name,
            codename: data.codename,
            version: data.version || 'V1.0',
            description: data.description,
            shortDescription: data.shortDescription,
            category: data.category,
            tier: data.tier || 'free',
            price: data.price,
            icon: data.icon || 'Bot',
            color: data.color || 'from-violet-500 to-purple-600',
            features: data.features || [],
            masterPrompt: data.masterPrompt,
            rating: data.rating || 4.5,
            isRecentlyAdded: data.isRecentlyAdded ?? true,
            isFeatured: data.isFeatured || false,
        });
        return { ...bot.toObject(), id: bot._id.toString() };
    }

    static async updateBot(id: string, data: mongoose.UpdateQuery<IBot>) {
        await dbConnect();
        if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid bot ID");

        const bot = await Bot.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!bot) return null;
        return { ...bot.toObject(), id: bot._id.toString() };
    }

    static async deleteBot(id: string) {
        await dbConnect();
        if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid bot ID");
        return await Bot.findByIdAndDelete(id);
    }

    static async likeBot(id: string) {
        await dbConnect();
        if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid bot ID");
        // Simple increment
        const bot = await Bot.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
        if (!bot) return null;
        return { ...bot.toObject(), id: bot._id.toString() };
    }

    /**
     * CHAT Logic
     */
    static async chat(message: string, history: ChatHistoryMessage[], masterPrompt?: string) {
        const client = getAIClient();

        let systemPrompt = "შენ ხარ AI ასისტენტი. პასუხობ ქართულად და ეხმარები მომხმარებელს.";
        if (masterPrompt) {
            if (masterPrompt.length > 2000) throw new Error("Master prompt ძალიან გრძელია");
            systemPrompt = masterPrompt;
        }

        const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
            { role: "system", content: systemPrompt }
        ];

        if (history && Array.isArray(history)) {
            for (const msg of history.slice(-10)) {
                if (msg.role === "user" || msg.role === "assistant") {
                    messages.push({ role: msg.role, content: msg.content });
                }
            }
        }

        messages.push({ role: "user", content: message });

        const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages,
            temperature: 0.7,
            max_tokens: 500,
        });

        return response.choices[0]?.message?.content || "ბოდიში, დროებით ვერ ვპასუხობ. სცადეთ თავიდან! 🙏";
    }
}
