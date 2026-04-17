import mongoose from 'mongoose';

import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { generateUniqueId } from '@/lib/id-system';
import { indexBlogPost } from '@/lib/indexnow';
// import { sendTelegramPost, TelegramPostData } from '@/lib/telegram';

import type { IPost } from '@/models/Post';

interface FaqItem {
    question?: string;
    answer?: string;
    q?: string;
    a?: string;
}

interface PostCreateData {
    slug?: string;
    title?: string;
    excerpt?: string;
    content?: string | Record<string, unknown>[];
    sections?: IPost['sections'];
    categories?: string[];
    tags?: string[];
    author?: IPost['author'];
    status?: IPost['status'];
    readingTime?: number;
    numericId?: string;
    coverImage?: string;
    coverImages?: IPost['coverImages'];
    featured?: boolean;
    trending?: boolean;
    faq?: FaqItem[];
    keyPoints?: string[];
    entities?: string[];
    sources?: IPost['sources'];
    telegramContent?: string;
    telegramButtonText?: string;
    seo?: {
        excerpt?: string;
        key_points?: string[];
        faq?: FaqItem[];
        entities?: string[];
    };
    telegram?: {
        text?: string;
        button_text?: string;
    };
    meta?: {
        id?: string;
        title: string;
        slug?: string;
        excerpt?: string;
        category?: string;
        tags?: string[];
        key_points?: string[];
        faq?: FaqItem[];
        entities?: string[];
        author?: {
            name?: string;
            role?: string;
        };
    };
    [key: string]: unknown;
}

export interface PostQueryOptions {
    page?: number;
    limit?: number;
    status?: string | null;
    category?: string | null;
    search?: string | null;
    featured?: boolean;
    trending?: boolean;
    afterSlug?: string | null;
    type?: 'repository' | 'article' | null;
}

export class PostService {
    /**
     * Get all posts with pagination and filtering
     */
    static async getAllPosts(options: PostQueryOptions) {
        await dbConnect();

        const {
            page = 1,
            limit = 10,
            status,
            category,
            search,
            featured,
            trending,
            afterSlug,
            type
        } = options;

        const query: Record<string, unknown> = {};

        if (status) query.status = status;
        if (category) query.categories = category;
        if (featured) query.featured = true;
        if (trending) query.trending = true;

        if (search) {
            // Check if search query is likely a numeric ID (6 digits)
            if (/^\d{6}$/.test(search)) {
                query.numericId = search;
            } else {
                query.$text = { $search: search };
            }
        }

        if (type === 'repository') {
            query.repository = { $exists: true, $ne: null };
        } else if (type === 'article') {
            query.repository = { $exists: false };
        }

        // Handle afterSlug for infinite scroll - cursor-based pagination
        if (afterSlug) {
            const referencePost = await Post.findOne({ slug: afterSlug }).select('publishedAt').lean();
            if (referencePost) {
                query.publishedAt = { $lt: referencePost.publishedAt };
                query.slug = { $ne: afterSlug }; // Exclude the reference post itself
            }
        }

        const skip = afterSlug ? 0 : (page - 1) * limit; // Skip is 0 for cursor pagination

        const [posts, total] = await Promise.all([
            Post.find(query)
                .sort({ publishedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Post.countDocuments(query),
        ]);

        return {
            posts: posts.map((post) => ({
                ...post,
                id: (post._id as mongoose.Types.ObjectId).toString(),
            })),
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit
            }
        };
    }

    /**
     * Get a single post by slug
     */
    static async getPostBySlug(slug: string) {
        await dbConnect();
        const post = await Post.findOne({ slug }).lean();
        if (!post) return null;
        return {
            ...post,
            id: post._id.toString(),
            _id: post._id.toString(),
        };
    }

    /**
     * Get related posts
     */
    static async getRelatedPosts(currentSlug: string, categories: string[] = [], limit = 2) {
        await dbConnect();

        // First try to find posts in same categories
        let posts: (mongoose.FlattenMaps<IPost> & { _id: mongoose.Types.ObjectId })[] = [];

        if (categories.length > 0) {
            posts = await Post.find({
                status: 'published',
                slug: { $ne: currentSlug },
                categories: { $in: categories }
            })
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();
        }

        // If not enough related posts, fill with recent posts
        if (posts.length < limit) {
            const recentPosts = await Post.find({
                status: 'published',
                slug: { $ne: currentSlug, $nin: posts.map((p) => p.slug) }
            })
                .sort({ createdAt: -1 })
                .limit(limit - posts.length)
                .lean();

            posts = [...posts, ...recentPosts];
        }

        return posts.map((post) => ({
            ...post,
            id: post._id.toString(),
            _id: post._id.toString(),
        }));
    }

    /**
     * Increment post views
     */
    static async incrementViews(id: string) {
        await dbConnect();
        await Post.findByIdAndUpdate(id, { $inc: { views: 1 } });
    }

    /**
     * Get adjacent posts (prev/next) for navigation
     */
    static async getAdjacentPosts(post: { order: number; createdAt: Date }) {
        await dbConnect();

        const [prevPost, nextPost] = await Promise.all([
            Post.findOne({
                status: 'published',
                $or: [
                    { order: { $lt: post.order } },
                    { order: post.order, createdAt: { $gt: post.createdAt } }
                ]
            })
                .sort({ order: -1, createdAt: 1 })
                .select('slug title')
                .lean(),
            Post.findOne({
                status: 'published',
                $or: [
                    { order: { $gt: post.order } },
                    { order: post.order, createdAt: { $lt: post.createdAt } }
                ]
            })
                .sort({ order: 1, createdAt: -1 })
                .select('slug title')
                .lean()
        ]);

        return {
            prevPost: prevPost ? { slug: prevPost.slug, title: prevPost.title } : null,
            nextPost: nextPost ? { slug: nextPost.slug, title: nextPost.title } : null
        };
    }

    /**
     * Create a new post
     */
    static async createPost(data: PostCreateData) {
        await dbConnect();

        // Generate slug if not provided (Clean, no random suffix)
        if (!data.slug) {
            data.slug = (data.title || 'post')
                .toLowerCase()
                .replace(/[^a-z0-9\u10A0-\u10FF]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        // Check for duplicate slug and make unique if needed
        let baseSlug = data.slug;

        // Handle nested meta structure from new JSON format
        const meta = data.meta;
        if (meta) {
            baseSlug = meta.slug || meta.title.toLowerCase().replace(/[^a-z0-9\u10A0-\u10FF]+/g, '-').replace(/(^-|-$)/g, '');
        }

        let uniqueSlug = baseSlug;
        let counter = 2; // Start from 2 (e.g. my-post-2)

        while (await Post.findOne({ slug: uniqueSlug })) {
            uniqueSlug = `${baseSlug}-${counter}`;
            counter++;
            if (counter > 100) break;
        }

        // If it was in meta, update it there too if we need to use it later, 
        // but primarily we build postData below.
        if (meta) {
            meta.slug = uniqueSlug;
        } else {
            data.slug = uniqueSlug;
        }

        // Generate numericId
        // The new JSON sends "id": "CASE-260120-01" in meta, which serves as numericId
        let numericId = await generateUniqueId();
        const providedId = data.numericId || (meta && meta.id);

        if (providedId) {
            // Check if this ID is already taken to avoid crash
            const existingId = await Post.findOne({ numericId: providedId });
            if (existingId) {
                // If taken, use providedId (risk duplicate key error, or assume logic handles it)
                // Using providedId per original logic
                numericId = providedId;
            } else {
                numericId = providedId;
            }
        }

        // Prepare Post Data
        let postData: Record<string, unknown> = {};

        if (meta) {
            // NEW JSON STRUCTURE HANDLING
            // Support both raw JSON (seo.key_points) and PostEditor format (keyPoints at root)
            postData = {
                slug: uniqueSlug,
                title: meta.title,
                numericId: numericId,
                // Excerpt priority: top-level > seo object > meta object > title fallback
                excerpt: data.excerpt || data.seo?.excerpt || meta.excerpt || meta.title,
                content: '',
                sections: data.content,
                categories: [meta.category || 'Technology'],
                tags: meta.tags || [],
                author: {
                    name: meta.author?.name || 'Andrew Altair',
                    role: meta.author?.role || 'AI Innovator',
                    avatar: meta.author?.name === 'ალფა' ? '/images/authors/alpha.png' : '/avatar.jpg'
                },
                status: 'published',
                readingTime: Math.max(5, Math.ceil((JSON.stringify(data.content || []).length) / 1000)),

                // SEO & Extra Fields - check both top-level (from PostEditor) and nested seo object (from raw JSON)
                keyPoints: data.keyPoints || data.seo?.key_points || meta.key_points || [],
                faq: (data.faq || data.seo?.faq || meta.faq || []).map((item: FaqItem) => ({
                    question: item.question || item.q || '',
                    answer: item.answer || item.a || '',
                })),
                entities: data.entities || data.seo?.entities || meta.entities || [],
                sources: data.sources || [],

                // Telegram data
                telegramContent: data.telegramContent || data.telegram?.text || '',
                telegramButtonText: data.telegramButtonText || data.telegram?.button_text || ''
            };
        } else {
            // OLD/STANDARD JSON STRUCTURE
            postData = {
                ...data,
                slug: uniqueSlug,
                numericId: numericId, // Add the generated ID
                excerpt: data.excerpt || data.title || 'პოსტი',
                categories: data.categories || ['ai', 'articles'], // Default categories
                author: data.author || { name: 'Andrew Altair', avatar: '/avatar.jpg', role: 'AI ინოვატორი' },
                status: data.status || 'published',
                readingTime: data.readingTime || 5,
                faq: (data.faq || []).map((item: FaqItem) => ({
                    question: item.question || item.q || '',
                    answer: item.answer || item.a || '',
                })),
            };
        }

        if (Array.isArray(postData.sections)) {
            postData.sections = (postData.sections as Array<Record<string, unknown>>)
                .filter((s) => {
                    if (!s) return false;
                    const content = typeof s.content === 'string' ? s.content.trim() : '';
                    const prompt = typeof s.prompt === 'string' ? (s.prompt as string).trim() : '';
                    const title = typeof s.title === 'string' ? (s.title as string).trim() : '';
                    return content.length > 0 || prompt.length > 0 || title.length > 0;
                })
                .map((s) => ({
                    ...s,
                    content: typeof s.content === 'string' ? s.content : '',
                }));
        }

        if (Array.isArray(postData.faq)) {
            postData.faq = (postData.faq as Array<{ question?: string; answer?: string }>).filter(
                (f) => f && (f.question || '').trim().length > 0 && (f.answer || '').trim().length > 0
            );
        }

        const post = new Post(postData);
        await post.save();

        // 🔍 Auto-submit to IndexNow for instant search engine indexing
        if (post.status === 'published') {
            indexBlogPost(post.slug).catch(err => console.error('[IndexNow] Failed:', err));
        }

        return {
            ...post.toObject(),
            id: post._id.toString(),
        };
    }
}
