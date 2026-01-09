import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';

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
            query.$text = { $search: search };
        }

        // Handle keyset pagination via afterSlug
        if (afterSlug) {
            const lastPost = await Post.findOne({ slug: afterSlug });
            if (lastPost) {
                query.$or = [
                    { order: { $gt: lastPost.order || 0 } },
                    {
                        order: lastPost.order || 0,
                        createdAt: { $lt: lastPost.createdAt }
                    }
                ];
            }
        }

        // Get total count (approximation if afterSlug is used, but query filters it)
        const total = await Post.countDocuments(query);

        // Get posts
        const posts = await Post.find(query)
            .sort({ order: 1, createdAt: -1 })
            .limit(limit)
            .lean();

        // Transform _id to id
        const transformedPosts = posts.map(post => ({
            ...post,
            id: post._id.toString(),
            _id: undefined,
        }));

        return NextResponse.json({
            posts: transformedPosts,
            pagination: {
                page: 1, // Page isn't meaningful with cursor pagination
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get posts error:', error);
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
        let uniqueSlug = baseSlug;
        let counter = 2; // Start from 2 (e.g. my-post-2)

        while (await Post.findOne({ slug: uniqueSlug })) {
            uniqueSlug = `${baseSlug}-${counter}`;
            counter++;
            // Safety limit increased slightly, though in practice huge overlaps are rare
            if (counter > 100) break;
        }
        data.slug = uniqueSlug;

        // Generate numericId
        // Try to generate a unique 6-digit ID
        let numericId: string | undefined;
        let attempts = 0;
        while (!numericId && attempts < 5) {
            const potentialId = Math.floor(100000 + Math.random() * 900000).toString();
            // Check if exists
            const existing = await Post.findOne({ numericId: potentialId });
            if (!existing) {
                numericId = potentialId;
            }
            attempts++;
        }

        // If explicitly provided in data (e.g. migration or manual override), use that
        if (data.numericId) {
            numericId = data.numericId;
        }

        // Ensure required defaults
        const postData = {
            ...data,
            numericId: numericId, // Add the generated ID
            excerpt: data.excerpt || data.title || 'პოსტი',
            categories: data.categories || ['ai', 'articles'], // Default categories
            author: data.author || { name: 'Andrew Altair', avatar: '/avatar.jpg', role: 'AI ინოვატორი' },
            status: data.status || 'published',
            readingTime: data.readingTime || 5,
        };

        const post = new Post(postData);
        await post.save();

        // 🔄 Revalidate caches so the new post appears immediately
        revalidatePath('/blog');
        revalidatePath('/');
        revalidatePath('/sitemap.xml');

        return NextResponse.json({
            success: true,
            post: {
                ...post.toObject(),
                id: post._id.toString(),
            },
        });
    } catch (error) {
        console.error('Create post error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to create post', details: errorMessage },
            { status: 500 }
        );
    }
}

