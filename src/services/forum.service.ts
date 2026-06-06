import mongoose from 'mongoose';

import dbConnect from '@/lib/db';
import ForumTopic from '@/models/ForumTopic';
import ForumPost from '@/models/ForumPost';
import { parseSourceUrl } from '@/lib/og-parser';
import { makeTopicKa } from '@/lib/georgian-forum-generator';
import { titleToSlug } from '@/lib/slug';
import { generateUniqueId } from '@/lib/id-system';

export interface ForumListOptions {
    page?: number;
    limit?: number;
    status?: 'queued' | 'published' | 'all';
    sort?: 'new' | 'hot';
}

function withId<T extends { _id: unknown }>(doc: T) {
    return { ...doc, id: String(doc._id) };
}

export class ForumService {
    /** List topics. Public passes status:'published'; admin passes 'all'. */
    static async getAllTopics(options: ForumListOptions = {}) {
        await dbConnect();
        const { page = 1, limit = 20, status = 'published', sort = 'new' } = options;

        const query: Record<string, unknown> = {};
        if (status !== 'all') query.status = status;

        // Published list = newest (or 🔥 hot) first; admin/all = newest created first.
        let sortSpec: Record<string, 1 | -1>;
        if (status === 'published') {
            sortSpec = sort === 'hot' ? { hotScore: -1, publishedAt: -1 } : { publishedAt: -1 };
        } else {
            sortSpec = { createdAt: -1 };
        }

        const skip = (page - 1) * limit;
        const [topics, total] = await Promise.all([
            ForumTopic.find(query).sort(sortSpec).skip(skip).limit(limit).lean(),
            ForumTopic.countDocuments(query),
        ]);

        return {
            topics: topics.map(withId),
            pagination: { total, pages: Math.ceil(total / limit), page, limit },
        };
    }

    /** Latest published topics (home teaser / cross-links). */
    static async getLatestPublished(limit = 1) {
        await dbConnect();
        const topics = await ForumTopic.find({ status: 'published' })
            .sort({ publishedAt: -1 })
            .limit(limit)
            .lean();
        return topics.map(withId);
    }

    /** A topic + all its posts (flat, oldest first — the UI builds the reply tree). */
    static async getTopicBySlug(slug: string) {
        await dbConnect();
        const topic = await ForumTopic.findOne({ slug }).lean<{ _id: unknown } | null>();
        if (!topic) return null;

        const posts = await ForumPost.find({ topicId: (topic as { _id: unknown })._id })
            .sort({ createdAt: 1 })
            .lean();

        return {
            topic: withId(topic),
            posts: posts.map((p) => ({
                ...p,
                id: String(p._id),
                parentId: p.parentId ? String(p.parentId) : null,
            })),
        };
    }

    /**
     * Create a topic from a source URL: scrape OG → Georgian title+summary → save 'queued'.
     * Opinions are generated later by the cron or the admin "generate now" button.
     */
    static async createTopic(sourceUrl: string) {
        await dbConnect();

        const scraped = await parseSourceUrl(sourceUrl);
        const seed = await makeTopicKa({
            title: scraped.title,
            description: scraped.description,
            domain: scraped.domain,
        });

        // Slug from the (latin) source title; Georgian title is for display only.
        const slugBase = titleToSlug(scraped.title, 60) || `forum-${Date.now()}`;
        let slug = slugBase;
        let counter = 2;
        while (await ForumTopic.findOne({ slug }).select('_id').lean()) {
            slug = `${slugBase}-${counter}`;
            counter++;
            if (counter > 100) break;
        }

        const numericId = await generateUniqueId();

        const topic = await ForumTopic.create({
            slug,
            titleKa: seed.titleKa,
            summaryKa: seed.summaryKa,
            sourceUrl,
            sourceImage: scraped.image,
            sourceDomain: scraped.domain,
            status: 'queued',
            numericId,
        });

        return withId(topic.toObject());
    }

    /** Edit a topic's Georgian title/summary (used by the admin preview before publish). */
    static async updateTopic(id: string, data: { titleKa?: string; summaryKa?: string }) {
        await dbConnect();
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        const update: Record<string, unknown> = {};
        if (typeof data.titleKa === 'string') update.titleKa = data.titleKa.trim();
        if (typeof data.summaryKa === 'string') update.summaryKa = data.summaryKa.trim();
        const topic = await ForumTopic.findByIdAndUpdate(id, { $set: update }, { new: true }).lean<{ _id: unknown } | null>();
        if (!topic) return null;
        return withId(topic);
    }

    /** Delete a topic and all its posts. */
    static async deleteTopic(id: string) {
        await dbConnect();
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        const topic = await ForumTopic.findById(id);
        if (!topic) return null;
        await ForumPost.deleteMany({ topicId: topic._id });
        await topic.deleteOne();
        return { deleted: true };
    }

    static async incrementViews(id: string) {
        await dbConnect();
        if (!mongoose.Types.ObjectId.isValid(id)) return;
        await ForumTopic.findByIdAndUpdate(id, { $inc: { views: 1, hotScore: 1 } });
    }

    /** Attach {topicSlug, topicTitleKa} to a set of posts (one topic query). */
    private static async attachTopics(
        posts: Array<{ _id: unknown; topicId: unknown; content: string; agrees?: number; disagrees?: number; createdAt?: Date }>,
    ) {
        const topicIds = [...new Set(posts.map((p) => String(p.topicId)))];
        const topics = await ForumTopic.find({ _id: { $in: topicIds } })
            .select('slug titleKa')
            .lean<Array<{ _id: unknown; slug: string; titleKa: string }>>();
        const tmap = new Map(topics.map((t) => [String(t._id), t]));
        return posts.map((p) => {
            const t = tmap.get(String(p.topicId));
            return {
                id: String(p._id),
                content: p.content,
                agrees: p.agrees || 0,
                disagrees: p.disagrees || 0,
                topicSlug: t?.slug || '',
                topicTitleKa: t?.titleKa || '',
            };
        });
    }

    /** #13 Persona profile: that persona's opinions across topics + stats. */
    static async getPersonaActivity(personaId: string) {
        await dbConnect();
        const posts = await ForumPost.find({ personaId, isUser: { $ne: true } })
            .sort({ createdAt: -1 })
            .limit(60)
            .lean<Array<{ _id: unknown; topicId: unknown; content: string; agrees?: number; disagrees?: number }>>();
        const entries = await this.attachTopics(posts);
        const totalAgrees = posts.reduce((s, p) => s + (p.agrees || 0), 0);
        const topicCount = new Set(posts.map((p) => String(p.topicId))).size;
        return { entries, stats: { posts: posts.length, topics: topicCount, totalAgrees } };
    }

    /** #14 Leaderboard: personas ranked by total agrees (+ thinker of the month). */
    static async getLeaderboard() {
        await dbConnect();
        const allTime = await ForumPost.aggregate([
            { $match: { isUser: { $ne: true } } },
            {
                $group: {
                    _id: '$personaId',
                    agrees: { $sum: '$agrees' },
                    disagrees: { $sum: '$disagrees' },
                    posts: { $sum: 1 },
                    topics: { $addToSet: '$topicId' },
                },
            },
            { $project: { agrees: 1, disagrees: 1, posts: 1, topics: { $size: '$topics' } } },
            { $sort: { agrees: -1, posts: -1 } },
        ]);

        const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const monthAgg = await ForumPost.aggregate([
            { $match: { isUser: { $ne: true }, createdAt: { $gte: since } } },
            { $group: { _id: '$personaId', agrees: { $sum: '$agrees' } } },
            { $sort: { agrees: -1 } },
            { $limit: 1 },
        ]);

        return {
            allTime: allTime.map((r: { _id: string; agrees: number; disagrees: number; posts: number; topics: number }) => ({
                personaId: r._id,
                agrees: r.agrees,
                disagrees: r.disagrees,
                posts: r.posts,
                topics: r.topics,
            })),
            monthTop: monthAgg[0] ? { personaId: monthAgg[0]._id as string, agrees: monthAgg[0].agrees as number } : null,
        };
    }

    /** #15 Search opinions by text (+ optional persona filter). */
    static async searchPosts(q: string, personaId?: string) {
        await dbConnect();
        const query: Record<string, unknown> = { isUser: { $ne: true } };
        if (personaId) query.personaId = personaId;
        const hasQ = !!(q && q.trim());
        if (hasQ) query.$text = { $search: q.trim() };

        const posts = hasQ
            ? await ForumPost.find(query, { score: { $meta: 'textScore' } })
                  .sort({ score: { $meta: 'textScore' } })
                  .limit(40)
                  .lean<Array<{ _id: unknown; topicId: unknown; content: string; agrees?: number; disagrees?: number; personaId: string }>>()
            : await ForumPost.find(query)
                  .sort({ createdAt: -1 })
                  .limit(40)
                  .lean<Array<{ _id: unknown; topicId: unknown; content: string; agrees?: number; disagrees?: number; personaId: string }>>();

        const withTopics = await this.attachTopics(posts);
        // re-attach personaId (attachTopics drops it)
        return withTopics.map((e, i) => ({ ...e, personaId: posts[i].personaId }));
    }
}
