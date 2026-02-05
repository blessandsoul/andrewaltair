import dbConnect from '@/lib/db';
import Tool from '@/models/Tool';
import mongoose from 'mongoose';

import type { ITool } from '@/models/Tool';

interface GetAllToolsParams {
    page?: number;
    limit?: number;
    category?: string;
    pricing?: ITool['pricing'];
    search?: string;
    featured?: string;
}

export class ToolService {
    static async getAllTools(params: GetAllToolsParams) {
        await dbConnect();
        const {
            page = 1,
            limit = 50,
            category,
            pricing,
            search,
            featured
        } = params;

        const query: Record<string, unknown> = {};
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

        const transformedTools = tools.map((tool) => ({
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

        return { ...tool, id: tool._id.toString(), _id: undefined };
    }

    static async createTool(data: mongoose.UpdateQuery<ITool>) {
        await dbConnect();
        const tool = await Tool.create(data);
        return { ...tool.toObject(), id: tool._id.toString() };
    }

    static async updateTool(id: string, data: mongoose.UpdateQuery<ITool>) {
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
