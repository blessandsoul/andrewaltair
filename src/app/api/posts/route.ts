export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { generateUniqueId } from '@/lib/id-system';
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
        let uniqueSlug = baseSlug;
        let counter = 2; // Start from 2 (e.g. my-post-2)

        while (await Post.findOne({ slug: uniqueSlug })) {
            uniqueSlug = `${baseSlug}-${counter}`;
            counter++;
            // Safety limit increased slightly, though in practice huge overlaps are rare
            if (counter > 100) break;
        }
        data.slug = uniqueSlug;



        // ... existing imports ...

        // In POST function:
        // Generate numericId
        let numericId = await generateUniqueId();

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


