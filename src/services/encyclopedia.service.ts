import dbConnect from '@/lib/db';
import EncyclopediaArticle from '@/models/EncyclopediaArticle';
import EncyclopediaSection from '@/models/EncyclopediaSection';
import EncyclopediaCategory from '@/models/EncyclopediaCategory';
import EncyclopediaVersion from '@/models/EncyclopediaVersion';

export interface EncycloQueryOptions {
    sectionId?: string | null;
    categoryId?: string | null;
    published?: boolean;
    limit?: number;
    search?: string | null;
}

export class EncyclopediaService {
    /**
     * Get All Articles (filtered)
     */
    static async getAllArticles(options: EncycloQueryOptions) {
        await dbConnect();
        const { sectionId, categoryId, published, limit = 100 } = options;

        const query: Record<string, unknown> = {};
        if (sectionId) query.sectionId = sectionId;
        if (categoryId) query.categoryId = categoryId;
        if (published) query.isPublished = true;

        const articles = await EncyclopediaArticle.find(query)
            .sort({ order: 1 })
            .limit(limit)
            .populate('sectionId', 'title slug')
            .populate('categoryId', 'title slug icon')
            .lean();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return articles.map((a: any) => ({
            ...a,
            id: a._id.toString(),
            _id: undefined
        }));
    }

    /**
     * Search Articles
     */
    static async searchArticles(queryText: string, limit = 20) {
        await dbConnect();

        if (!queryText || queryText.length < 2) return [];

        try {
            // Text Search
            const articles = await EncyclopediaArticle.find(
                {
                    $text: { $search: queryText },
                    isPublished: true,
                },
                { score: { $meta: 'textScore' } }
            )
                .sort({ score: { $meta: 'textScore' } })
                .limit(limit)
                .populate('sectionId', 'title slug gradientFrom gradientTo')
                .populate('categoryId', 'title slug icon')
                .select('slug title excerpt sectionId categoryId difficulty estimatedMinutes isFree')
                .lean();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return articles.map((a: any) => ({ ...a, id: a._id.toString() }));

        } catch {
            // Fallback Regex
            const articles = await EncyclopediaArticle.find({
                isPublished: true,
                $or: [
                    { title: { $regex: queryText, $options: 'i' } },
                    { content: { $regex: queryText, $options: 'i' } },
                    { excerpt: { $regex: queryText, $options: 'i' } },
                ],
            })
                .limit(limit)
                .populate('sectionId', 'title slug gradientFrom gradientTo')
                .populate('categoryId', 'title slug icon')
                .select('slug title excerpt sectionId categoryId difficulty estimatedMinutes isFree')
                .lean();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return articles.map((a: any) => ({ ...a, id: a._id.toString() }));
        }
    }

    /**
     * Create Article
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async createArticle(data: any) {
        await dbConnect();

        // Logic extraction
        const excerpt = data.excerpt || data.content?.substring(0, 200).replace(/[#*`]/g, '') + '...';
        const wordCount = (data.content || '').split(/\s+/).length;
        const estimatedMinutes = Math.ceil(wordCount / 200);

        let videoId = data.videoId;
        if (data.videoUrl && !videoId) {
            const match = data.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
            videoId = match ? match[1] : undefined;
        }

        const article = await EncyclopediaArticle.create({
            slug: data.slug,
            title: data.title,
            content: data.content,
            excerpt,
            sectionId: data.sectionId,
            categoryId: data.categoryId,
            author: data.author || { name: 'Andrew Altair', avatar: '/images/andrew-avatar.jpg', role: 'AI Expert' },
            isFree: data.isFree ?? false,
            isPublished: data.isPublished ?? false,
            order: data.order || 0,
            difficulty: data.difficulty || 'beginner',
            estimatedMinutes,
            videoUrl: data.videoUrl,
            videoId,
            tags: data.tags || [],
            publishedAt: data.isPublished ? new Date() : undefined,
        });

        // Versioning
        await EncyclopediaVersion.create({
            articleId: article._id,
            version: 1,
            title: article.title,
            content: article.content,
            changedBy: 'Admin',
            changeNote: 'Initial version',
        });

        return { ...article.toObject(), id: article._id.toString() };
    }

    /**
     * Sections
     */
    static async getAllSections() {
        await dbConnect();
        const sections = await EncyclopediaSection.find({ isActive: true }).sort({ order: 1 }).lean();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return sections.map((s: any) => ({ ...s, id: s._id.toString() }));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async createSection(data: any) {
        await dbConnect();
        const section = await EncyclopediaSection.create({
            slug: data.slug,
            title: data.title,
            description: data.description || '',
            gradientFrom: data.gradientFrom || 'purple-500',
            gradientTo: data.gradientTo || 'pink-500',
            icon: data.icon || 'TbBook',
            order: data.order || 0,
            isActive: data.isActive ?? true,
        });
        return { ...section.toObject(), id: section._id.toString() };
    }

    /**
    * Categories (Encyclopedia specific)
    */
    static async getAllCategories() {
        await dbConnect();
        // Assuming EncyclopediaCategory follows simplified pattern
        const categories = await EncyclopediaCategory.find().sort({ title: 1 }).lean();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return categories.map((c: any) => ({ ...c, id: c._id.toString() }));
    }
}
