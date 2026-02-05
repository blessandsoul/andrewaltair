import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Tutorial from '@/models/Tutorial';
import Lesson from '@/models/Lesson';
import type { ITutorial } from '@/models/Tutorial';

export class TutorialService {
    static async getAllTutorials(options: { status?: string, limit?: number } = {}) {
        await dbConnect();
        const { status, limit = 10 } = options;

        const query: Record<string, unknown> = {};
        if (status) query.status = status;
        // If no status specified, maybe return all? Or default to published?
        // Original code returned all if status not specified.
        // But original code hardcoded `isPublished` in my first draft.
        // Let's stick to returning based on query.

        const tutorials = await Tutorial.find(query)
            .sort({ order: 1, createdAt: -1 }) // Sort by order then date
            .limit(limit)
            .lean();

        return tutorials.map((t: ITutorial) => ({
            ...t,
            id: t._id.toString(),
            _id: undefined
        }));
    }

    static async createTutorial(data: Partial<ITutorial> & { title: string }) {
        await dbConnect();

        if (!data.slug) {
            data.slug = data.title.toLowerCase().replace(/[^a-z0-9\u10A0-\u10FF]+/g, '-').replace(/(^-|-$)/g, '');
        }

        const tutorial = new Tutorial(data);
        await tutorial.save();
        return { ...tutorial.toObject(), id: tutorial._id.toString() };
    }
}
