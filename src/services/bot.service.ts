import dbConnect from '@/lib/db';
import Bot from '@/models/Bot';
import OpenAI from "openai";
import mongoose from 'mongoose';

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async getAllBots(params: any) {
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pipeline: any[] = [{ $match: { isActive: true } }];

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let sortStage: any = { isFeatured: -1, isRecentlyAdded: -1 };
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedBots = bots.map((bot: any) => ({
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
        if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid bot ID");

        const bot = await Bot.findById(id).lean();
        if (!bot) return null;

        // Hide prompt for private bots if not admin
        // Note: Route logic was "if tier === private then null".
        // It didn't explicitly check admin in the GET logic, but maybe it should?
        // Original logic: `const masterPrompt = bot.tier === 'private' ? null : bot.masterPrompt;`
        // It does NOT check admin. So private bots hide prompts from EVERYONE in GET /api/bots/[id].
        const masterPrompt = bot.tier === 'private' ? null : bot.masterPrompt;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { ...bot, id: bot._id.toString(), _id: undefined, masterPrompt: isAdmin ? bot.masterPrompt : masterPrompt };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async createBot(data: any) {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async updateBot(id: string, data: any) {
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
    static async chat(message: string, history: any[], masterPrompt?: string) {
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
