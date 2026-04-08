import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import Insight from '@/models/Insight';

import type { IPost } from '@/models/Post';
import type { IInsight } from '@/models/Insight';

interface RelatedContent {
    relatedInsights: string[];
    relatedPosts: string[];
}

/**
 * Compute related content for an insight based on tag overlap,
 * category overlap, and keyword similarity. Stores results in DB.
 */
export async function computeRelatedContent(insight: IInsight): Promise<RelatedContent> {
    await dbConnect();

    const insightTags = new Set(insight.tags);
    const insightCategories = new Set(insight.categories);
    const insightKeywords = new Set(insight.autoTags);

    // --- Find candidate Posts ---
    const candidatePosts = await Post.find({
        status: 'published',
        $or: [
            { tags: { $in: insight.tags } },
            { categories: { $in: insight.categories } },
        ],
    })
        .select('slug tags categories entities')
        .lean() as (IPost & { _id: any })[];

    const postScores = candidatePosts.map((post) => {
        let score = 0;

        // Tag overlap (weight: 3)
        const sharedTags = (post.tags || []).filter((t: string) => insightTags.has(t)).length;
        score += sharedTags * 3;

        // Category overlap (weight: 2)
        const sharedCats = (post.categories || []).filter((c: string) => insightCategories.has(c)).length;
        score += sharedCats * 2;

        // Entity/keyword overlap (weight: 1)
        const sharedKeywords = (post.entities || []).filter((e: string) => insightKeywords.has(e.toLowerCase())).length;
        score += sharedKeywords;

        return { slug: post.slug, score };
    });

    const relatedPosts = postScores
        .filter((p) => p.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((p) => p.slug);

    // --- Find candidate Insights ---
    const candidateInsights = await Insight.find({
        status: 'published',
        slug: { $ne: insight.slug },
        $or: [
            { tags: { $in: insight.tags } },
            { categories: { $in: insight.categories } },
        ],
    })
        .select('slug tags categories autoTags')
        .lean() as (IInsight & { _id: any })[];

    const insightScores = candidateInsights.map((other) => {
        let score = 0;

        const sharedTags = (other.tags || []).filter((t: string) => insightTags.has(t)).length;
        score += sharedTags * 3;

        const sharedCats = (other.categories || []).filter((c: string) => insightCategories.has(c)).length;
        score += sharedCats * 2;

        const sharedKeywords = (other.autoTags || []).filter((k: string) => insightKeywords.has(k)).length;
        score += sharedKeywords;

        return { slug: other.slug, score };
    });

    const relatedInsights = insightScores
        .filter((i) => i.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((i) => i.slug);

    // --- Bidirectional update: add this insight to related insights' relatedInsights ---
    if (relatedInsights.length > 0) {
        await Insight.updateMany(
            { slug: { $in: relatedInsights } },
            { $addToSet: { relatedInsights: insight.slug } }
        );
    }

    return { relatedInsights, relatedPosts };
}
