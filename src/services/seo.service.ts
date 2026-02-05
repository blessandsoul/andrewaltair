import dbConnect from '@/lib/db';
import Seo from '@/models/Seo';
import type { ISeo } from '@/models/Seo';

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

        return settings.map((s: ISeo) => ({
            ...s,
            id: s._id.toString(),
            _id: undefined,
        }));
    }

    /**
     * Create or update SEO setting
     */
    static async updateSeoSetting(data: Partial<Pick<ISeo, 'key' | 'value' | 'type'>>) {
        await dbConnect();

        const setting = await Seo.findOneAndUpdate(
            { key: data.key },
            { ...data },
            { new: true, upsert: true }
        ).lean();

        if (!setting) return null;

        return { ...setting, id: setting._id.toString() };
    }
}
