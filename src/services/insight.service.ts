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
    /** Content language. Defaults to 'ka'. EN insights surface only at /en/insights. */
    language?: 'ka' | 'en';
    /** Explicit slug override. When omitted the slug is derived from the source OG title. */
    slug?: string;
    /** Explicit H1 / metaTitle override. When omitted the OG title is used.
     *  Needed because /short sources are perplexity aggregators whose OG title is
     *  English — a KA insight must carry its own Georgian headline (meta.headline_alt). */
    headline?: string;
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
    /** 'en' → English insights only. Anything else (incl. omitted) → KA + legacy
     *  (filtered as { $ne: 'en' }) so existing fieldless docs never drop out and
     *  English never leaks into the Georgian surface. */
    language?: 'ka' | 'en' | null;
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
            language,
        } = options;

        const query: Record<string, unknown> = {};

        if (status && status !== 'all') query.status = status;
        if (tag) query.tags = tag;

        // Language gate. 'en' → English only; everything else → KA + legacy
        // (legacy docs have no `language` field, so { $ne: 'en' } keeps them in).
        query.language = language === 'en' ? 'en' : { $ne: 'en' };

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

        const language: 'ka' | 'en' = data.language === 'en' ? 'en' : 'ka';
        // KA + legacy docs match { $ne: 'en' }; EN matches 'en'. Scoping the guard
        // by language lets the SAME story exist once in KA and once in EN (they
        // share the perplexity sourceUrl) without one blocking the other.
        const langMatch = language === 'en' ? 'en' : { $ne: 'en' };

        // Idempotency guard: the same source URL must never mint a second
        // insight in the same language — retried ingests shipped live "-2" slug
        // duplicates into the sitemap/index (SEO audit 2026-06-12). A retry
        // returns the existing doc.
        if (data.sourceUrl) {
            const existing = await Insight.findOne({ sourceUrl: data.sourceUrl, language: langMatch });
            if (existing) {
                const plain = JSON.parse(JSON.stringify(existing));
                return { ...plain, id: plain._id?.toString?.() ?? String(plain._id) };
            }
        }

        // 1. Parse source URL
        const ogData = await parseSourceUrl(data.sourceUrl);

        // 2. Extract tags
        const { tags: extractedTags, autoTags } = await extractTags(data.content);
        const finalTags = data.tags && data.tags.length > 0
            ? [...new Set([...data.tags, ...extractedTags])]
            : extractedTags;

        // 3. Generate slug. Prefer an explicit slug (the /short pipeline supplies a
        // clean English slug from meta.md, and EN insights pass a "-en"-suffixed one
        // to avoid colliding with their KA twin); otherwise derive from the OG title.
        // titleToSlug decodes HTML entities before slugifying so "Sam Altman&#039;s"
        // becomes "sam-altmans" instead of "sam-altman-039-s".
        const slugBase = data.slug
            ? titleToSlug(data.slug, 80)
            : (ogData.title ? titleToSlug(ogData.title, 60) : `insight-${Date.now()}`);

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
        // H1/metaTitle: an explicit headline override wins (KA Georgian headline
        // from meta.headline_alt, or the EN reddit headline) because the perplexity
        // source OG title is English and wrong for a KA article. Else fall back to OG.
        const headlineOverride = data.headline ? decodeHtmlEntities(data.headline).trim() : '';
        const ogTitleClean = ogData.title ? decodeHtmlEntities(ogData.title).trim() : '';
        const cleanTitle = ogTitleClean || headlineOverride;
        const basePath = language === 'en' ? '/en/insights' : '/insights';

        const insightData = {
            slug,
            content: data.content,
            excerpt,
            sourceUrl: data.sourceUrl,
            sourceTitle: ogTitleClean || headlineOverride,
            sourceDomain: ogData.domain,
            sourceImage: ogData.image,
            tags: finalTags,
            autoTags,
            categories: data.categories || ['ai', 'tech-insights'],
            language,
            author: data.author || {
                name: 'Andrew Altair',
                avatar: '/images/avatar.jpg',
                role: 'AI Innovator',
            },
            status: data.status || 'published',
            numericId,
            seo: {
                // Override headline used verbatim (capped). The " — ინსაითი" suffix
                // is KA-only and applies just to the OG-derived fallback path.
                metaTitle: headlineOverride
                    ? headlineOverride.slice(0, 70)
                    : (cleanTitle ? `${cleanTitle.slice(0, 50)} — ინსაითი` : excerpt.slice(0, 60)),
                metaDescription: excerpt,
                ogImage: ogData.image || '',
                canonicalUrl: `${siteUrl}${basePath}/${slug}`,
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
