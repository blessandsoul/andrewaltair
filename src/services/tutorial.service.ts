import dbConnect from '@/lib/db';
import Tutorial from '@/models/Tutorial';
import Lesson from '@/models/Lesson';

export class TutorialService {
    static async getAllTutorials(options: { status?: string, limit?: number } = {}) {
        await dbConnect();
        const { status, limit = 10 } = options;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};
        if (status) query.status = status;
        // If no status specified, maybe return all? Or default to published?
        // Original code returned all if status not specified.
        // But original code hardcoded `isPublished` in my first draft.
        // Let's stick to returning based on query.

        const tutorials = await Tutorial.find(query)
            .sort({ order: 1, createdAt: -1 }) // Sort by order then date
            .limit(limit)
            .lean();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return tutorials.map((t: any) => ({
            ...t,
            id: t._id.toString(),
            _id: undefined
        }));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async createTutorial(data: any) {
        await dbConnect();

        if (!data.slug) {
            data.slug = data.title.toLowerCase().replace(/[^a-z0-9\u10A0-\u10FF]+/g, '-').replace(/(^-|-$)/g, '');
        }

        const tutorial = new Tutorial(data);
        await tutorial.save();
        return { ...tutorial.toObject(), id: tutorial._id.toString() };
    }
}
