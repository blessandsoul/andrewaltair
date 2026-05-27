import mongoose from 'mongoose';

import dbConnect from '@/lib/db';
import Insight from '@/models/Insight';
import { generateUniqueId } from '@/lib/id-system';
import { indexInsight } from '@/lib/indexnow';
import { extractTags } from '@/lib/tag-extractor';
import { parseSourceUrl } from '@/lib/og-parser';
import { computeRelatedContent } from '@/lib/interlinking';
import { titleToSlug, decodeHtmlEntities } from '@/lib/slug';

import type { IInsight } from '@/models/Insight';

export interface InsightCreateData {
    content: string;
    sourceUrl: string;
    categories?: string[];
    tags?: string[];
    status?: IInsight['status'];
    author?: { name: string; avatar?: string; role?: string };
}

export interface InsightUpdateData {
    content?: string;
    sourceUrl?: string;
    categories?: string[];
    tags?: string[];
    status?: IInsight['status'];
}

export interface InsightQueryOptions {
    page?: number;
    limit?: number;
    status?: string | null;
    tag?: string | null;
    search?: string | null;
    afterSlug?: string | null;
}

export class InsightService {
    /**
     * Get all insights with pagination and filtering
     */
    static async getAllInsights(options: InsightQueryOptions) {
        await dbConnect();

        const {
            page = 1,
            limit = 10,
            status,
            tag,
            search,
            afterSlug,
        } = options;

        const query: Record<string, unknown> = {};

        if (status && status !== 'all') query.status = status;
        if (tag) query.tags = tag;

        if (search) {
            if (/^\d{6}$/.test(search)) {
                query.numericId = search;
            } else {
                query.$text = { $search: search };
            }
        }

        // Cursor-based pagination for infinite scroll
        if (afterSlug) {
            const ref = await Insight.findOne({ slug: afterSlug }).select('publishedAt').lean();
            if (ref) {
                query.publishedAt = { $lt: ref.publishedAt };
                query.slug = { $ne: afterSlug };
            }
        }

        const skip = afterSlug ? 0 : (page - 1) * limit;

        const [insights, total] = await Promise.all([
            Insight.find(query)
                .sort({ publishedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Insight.countDocuments(query),
        ]);

        return {
            insights: insights.map((insight) => ({
                ...insight,
                id: (insight._id as mongoose.Types.ObjectId).toString(),
            })),
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit,
            },
        };
    }

    /**
     * Get a single insight by slug
     */
    static async getInsightBySlug(slug: string) {
        await dbConnect();
        const insight = await Insight.findOne({ slug }).lean();
        if (!insight) return null;
        return {
            ...insight,
            id: insight._id.toString(),
            _id: insight._id.toString(),
        };
    }

    /**
     * Create a new insight. Orchestrates:
     * 1. Parse source URL (OG data + image)
     * 2. Extract tags from content
     * 3. Generate slug, numericId
     * 4. Save to DB
     * 5. Compute cross-links
     * 6. Submit to IndexNow
     */
    static async createInsight(data: InsightCreateData) {
        await dbConnect();

        // 1. Parse source URL
        const ogData = await parseSourceUrl(data.sourceUrl);

        // 2. Extract tags
        const { tags: extractedTags, autoTags } = await extractTags(data.content);
        const finalTags = data.tags && data.tags.length > 0
            ? [...new Set([...data.tags, ...extractedTags])]
            : extractedTags;

        // 3. Generate slug from source title or content.
        // titleToSlug decodes HTML entities before slugifying so "Sam Altman&#039;s"
        // becomes "sam-altmans" instead of "sam-altman-039-s".
        const slugBase = ogData.title
            ? titleToSlug(ogData.title, 60)
            : `insight-${Date.now()}`;

        let slug = slugBase || `insight-${Date.now()}`;
        let counter = 2;
        while (await Insight.findOne({ slug })) {
            slug = `${slugBase}-${counter}`;
            counter++;
            if (counter > 100) break;
        }

        // 4. Generate numericId
        const numericId = await generateUniqueId();

        // 5. Build excerpt
        const excerpt = data.content
            .replace(/[⚠️🛠👁🔬⚡️]/g, '')
            .trim()
            .slice(0, 160);

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge';

        // Decode HTML entities in user-visible title once at save time
        // so &#039; / &quot; never leak into rendered UI, OG tags, or JSON-LD.
        const cleanTitle = ogData.title ? decodeHtmlEntities(ogData.title).trim() : '';

        const insightData = {
            slug,
            content: data.content,
            excerpt,
            sourceUrl: data.sourceUrl,
            sourceTitle: cleanTitle,
            sourceDomain: ogData.domain,
            sourceImage: ogData.image,
            tags: finalTags,
            autoTags,
            categories: data.categories || ['ai', 'tech-insights'],
            author: data.author || {
                name: 'Andrew Altair',
                avatar: '/avatar.jpg',
                role: 'AI Innovator',
            },
            status: data.status || 'published',
            numericId,
            seo: {
                metaTitle: cleanTitle
                    ? `${cleanTitle.slice(0, 50)} — ინსაითი`
                    : excerpt.slice(0, 60),
                metaDescription: excerpt,
                ogImage: ogData.image || '',
                canonicalUrl: `${siteUrl}/insights/${slug}`,
            },
        };

        const insight = new Insight(insightData);
        await insight.save();

        // 6. Compute cross-links
        try {
            const related = await computeRelatedContent(insight);
            insight.relatedInsights = related.relatedInsights;
            insight.relatedPosts = related.relatedPosts;
            await insight.save();
        } catch (error) {
            console.error('[InsightService] Cross-linking failed:', error);
        }

        // 7. IndexNow
        if (insight.status === 'published') {
            indexInsight(insight.slug).catch((err) =>
                console.error('[IndexNow] Insight submit failed:', err)
            );
        }

        return {
            ...insight.toObject(),
            id: insight._id.toString(),
        };
    }

    /**
     * Update an existing insight
     */
    static async updateInsight(id: string, data: InsightUpdateData) {
        await dbConnect();

        const insight = await Insight.findById(id);
        if (!insight) return null;

        // If content changed, re-extract tags
        if (data.content && data.content !== insight.content) {
            const { tags: extractedTags, autoTags } = await extractTags(data.content);
            insight.tags = data.tags && data.tags.length > 0
                ? [...new Set([...data.tags, ...extractedTags])]
                : extractedTags;
            insight.autoTags = autoTags;
            insight.content = data.content;
            insight.excerpt = data.content.replace(/[⚠️🛠👁🔬⚡️]/g, '').trim().slice(0, 160);
        }

        // If source URL changed, re-parse
        if (data.sourceUrl && data.sourceUrl !== insight.sourceUrl) {
            const ogData = await parseSourceUrl(data.sourceUrl);
            insight.sourceUrl = data.sourceUrl;
            insight.sourceTitle = ogData.title;
            insight.sourceDomain = ogData.domain;
            insight.sourceImage = ogData.image;
        }

        if (data.categories) insight.categories = data.categories;
        if (data.status) insight.status = data.status;
        if (data.tags) insight.tags = [...new Set([...insight.tags, ...data.tags])];

        await insight.save();

        // Recompute cross-links
        try {
            const related = await computeRelatedContent(insight);
            insight.relatedInsights = related.relatedInsights;
            insight.relatedPosts = related.relatedPosts;
            await insight.save();
        } catch (error) {
            console.error('[InsightService] Cross-linking update failed:', error);
        }

        return {
            ...insight.toObject(),
            id: insight._id.toString(),
        };
    }

    /**
     * Delete an insight and clean up bidirectional links
     */
    static async deleteInsight(id: string) {
        await dbConnect();

        const insight = await Insight.findById(id);
        if (!insight) return null;

        // Remove this insight from others' relatedInsights
        await Insight.updateMany(
            { relatedInsights: insight.slug },
            { $pull: { relatedInsights: insight.slug } }
        );

        await insight.deleteOne();
        return { deleted: true };
    }

    /**
     * Increment views
     */
    static async incrementViews(id: string) {
        await dbConnect();
        await Insight.findByIdAndUpdate(id, { $inc: { views: 1 } });
    }

    /**
     * Get related posts for display on insight page
     */
    static async getRelatedPosts(slugs: string[]) {
        if (!slugs || slugs.length === 0) return [];
        await dbConnect();

        const Post = (await import('@/models/Post')).default;
        const posts = await Post.find({
            slug: { $in: slugs },
            status: 'published',
        })
            .select('slug title excerpt coverImage coverImages categories')
            .lean();

        return posts.map((p: any) => ({
            ...p,
            id: p._id.toString(),
        }));
    }

    /**
     * Get related insights for display
     */
    static async getRelatedInsights(slugs: string[]) {
        if (!slugs || slugs.length === 0) return [];
        await dbConnect();

        const insights = await Insight.find({
            slug: { $in: slugs },
            status: 'published',
        })
            .select('slug content excerpt sourceUrl sourceDomain sourceImage tags publishedAt views reactions')
            .lean();

        return insights.map((i: any) => ({
            ...i,
            id: i._id.toString(),
        }));
    }
}
