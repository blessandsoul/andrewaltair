import dbConnect from '@/lib/db';
import Seo from '@/models/Seo';

export interface SeoQueryOptions {
    type?: string | null;
    key?: string | null;
}

export class SeoService {
    /**
     * Get SEO settings based on query
     */
    static async getSeoSettings(options: SeoQueryOptions) {
        await dbConnect();

        const query: Record<string, string> = {};
        if (options.type) query.type = options.type;
        if (options.key) query.key = options.key;

        const settings = await Seo.find(query).lean();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return settings.map((s: any) => ({
            ...s,
            id: s._id.toString(),
            _id: undefined,
        }));
    }

    /**
     * Create or update SEO setting
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async updateSeoSetting(data: any) {
        await dbConnect();

        const setting = await Seo.findOneAndUpdate(
            { key: data.key },
            { ...data },
            { new: true, upsert: true }
        ).lean();

        if (!setting) return null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const s: any = setting;
        return { ...s, id: s._id.toString() };
    }
}
