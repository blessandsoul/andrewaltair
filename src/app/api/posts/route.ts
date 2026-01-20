export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { generateUniqueId } from '@/lib/id-system';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';
import { indexBlogPost } from '@/lib/indexnow';
import { sendTelegramPost, TelegramPostData } from '@/lib/telegram';

// GET - List all posts with filtering and pagination
export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const featured = searchParams.get('featured');
        const afterSlug = searchParams.get('afterSlug');
        const trending = searchParams.get('trending');
        const type = searchParams.get('type');

        // Build query
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        if (status) {
            query.status = status;
        }

        if (category) {
            query.categories = category;
        }

        if (featured === 'true') {
            query.featured = true;
        }

        if (trending === 'true') {
            query.trending = true;
        }

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

        const skip = (page - 1) * limit;

        const posts = await Post.find(query)
            .sort({ publishedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Post.countDocuments(query);

        return NextResponse.json({
            posts: posts.map((post: any) => ({
                ...post,
                id: post._id.toString(),
            })),
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit
            }
        });
    } catch (error) {
        console.error('Fetch posts error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

// POST - Create a new post (PROTECTED - Admin only)
export async function POST(request: Request) {
    // 🛡️ SECURITY: Verify admin authentication
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('ადმინისტრატორის წვდომა საჭიროა');
    }

    try {
        await dbConnect();

        const data = await request.json();

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
            // Safety limit increased slightly, though in practice huge overlaps are rare
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
        let providedId = data.numericId || (meta && meta.id);

        if (providedId) {
            // Check if this ID is already taken to avoid crash
            const existingId = await Post.findOne({ numericId: providedId });
            if (existingId) {
                // If taken, fallback to generated one or append suffix? 
                // Let's assume for now we prioritize the generated one if conflict, or just fail.
                // But safer to just use the provided one if available and hope for unique.
                // Or better: try to use it, if valid.
                numericId = providedId;
            } else {
                numericId = providedId;
            }
        }

        // Prepare Post Data
        let postData: any = {};

        if (meta) {
            // NEW JSON STRUCTURE HANDLING
            postData = {
                slug: uniqueSlug,
                title: meta.title,
                numericId: numericId,
                excerpt: data.seo?.excerpt || meta.title,
                content: '', // Will populate from sections parsing if needed, but 'content' field is often legacy text.
                // The new format has 'content' as an array of sections. 
                // We should map data.content array to sections.
                sections: data.content,
                categories: [meta.category || 'Technology'],
                tags: meta.tags || [],
                author: {
                    name: meta.author?.name || 'Andrew Altair',
                    role: meta.author?.role || 'AI Innovator',
                    avatar: '/avatar.jpg' // Default
                },
                status: 'published', // Default to published for this workflow
                readingTime: 5,

                // SEO & Extra Fields
                keyPoints: data.seo?.key_points || [],
                faq: data.seo?.faq || [],
                entities: data.seo?.entities || [],

                // Telegram specific data storage (optional, for record)
                telegramContent: data.telegram?.text || ''
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
            };
        }

        const post = new Post(postData);
        await post.save();

        // 🔄 Revalidate caches so the new post appears immediately
        revalidatePath('/blog');
        revalidatePath('/');
        revalidatePath('/sitemap.xml');

        // 🔍 Auto-submit to IndexNow for instant search engine indexing
        if (post.status === 'published') {
            indexBlogPost(post.slug).catch(err => console.error('[IndexNow] Failed:', err));

            // 📢 Auto-post to Telegram if data is provided
            if (data.telegram && data.telegram.text) {
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://andrewaltair.ge';
                const postUrl = `${appUrl}/blog/${post.slug}`;

                const telegramPayload: TelegramPostData = {
                    title: post.title,
                    telegramContent: data.telegram.text,
                    postUrl: postUrl,
                    buttonText: data.telegram.button_text,
                    parse_mode: data.telegram.parse_mode, // Pass the requested parse mode
                    coverImage: post.coverImage || undefined
                };

                // Await the result to ensure it runs and to report status
                try {
                    const telegramResult = await sendTelegramPost(telegramPayload);
                    console.log('[Telegram Status]', telegramResult);

                    return NextResponse.json({
                        success: true,
                        post: {
                            ...post.toObject(),
                            id: post._id.toString(),
                        },
                        telegram: telegramResult
                    });
                } catch (err) {
                    console.error('[Telegram Error]', err);
                    // Don't fail the whole request, but report error
                    return NextResponse.json({
                        success: true,
                        post: {
                            ...post.toObject(),
                            id: post._id.toString(),
                        },
                        telegram: { success: false, error: 'Internal Error', details: err }
                    });
                }
            }
        }

        return NextResponse.json({
            success: true,
            post: {
                ...post.toObject(),
                id: post._id.toString(),
            },
        });
    } catch (error: any) {
        console.error('Create post error:', error);

        // Detailed error message
        let errorMessage = 'Failed to create post';
        let details = error instanceof Error ? error.message : 'Unknown error';

        // Handle Mongoose validation errors specifically
        if (error.name === 'ValidationError') {
            errorMessage = 'Validation Failed';
            details = Object.values(error.errors).map((err: any) => err.message).join(', ');
        }

        return NextResponse.json(
            {
                error: errorMessage,
                details: details,
                // Include full error object in dev for easier debugging
                debug: process.env.NODE_ENV === 'development' ? error : undefined
            },
            { status: 500 }
        );
    }
}


