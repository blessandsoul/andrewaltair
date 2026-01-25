import dbConnect from '@/lib/db';
import Tool from '@/models/Tool';
import mongoose from 'mongoose';

export class ToolService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async getAllTools(params: any) {
        await dbConnect();
        const {
            page = 1,
            limit = 50,
            category,
            pricing,
            search,
            featured
        } = params;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};
        if (category) query.category = category;
        if (pricing) query.pricing = pricing;
        if (featured === "true") query.featured = true;
        if (search) query.$text = { $search: search };

        const total = await Tool.countDocuments(query);
        const tools = await Tool.find(query)
            .sort({ featured: -1, rating: -1, name: 1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedTools = tools.map((tool: any) => ({
            ...tool,
            id: tool._id.toString(),
            _id: undefined
        }));

        const categories = await Tool.distinct("category");

        return {
            tools: transformedTools,
            categories,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    static async getToolById(id: string) {
        await dbConnect();
        if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid tool ID');

        const tool = await Tool.findById(id).lean();
        if (!tool) return null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { ...tool, id: tool._id.toString(), _id: undefined };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async createTool(data: any) {
        await dbConnect();
        const tool = await Tool.create(data) as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { ...tool.toObject(), id: tool._id.toString() };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async updateTool(id: string, data: any) {
        await dbConnect();
        if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid tool ID');

        const tool = await Tool.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!tool) return null;
        return { ...tool.toObject(), id: tool._id.toString() };
    }

    static async deleteTool(id: string) {
        await dbConnect();
        if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid tool ID');
        return await Tool.findByIdAndDelete(id);
    }
}
