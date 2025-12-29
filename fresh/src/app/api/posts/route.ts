import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';

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
        const trending = searchParams.get('trending');

        // Build query
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        if (status) {
            query.status = status;
        }

        if (category) {
            query.category = category;
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

        // Get total count
        const total = await Post.countDocuments(query);

        // Get posts
        const posts = await Post.find(query)
            .sort({ order: 1, createdAt: -1 })
            .skip((page - 1) * limit)
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
                page,
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

// POST - Create a new post
export async function POST(request: Request) {
    try {
        await dbConnect();

        const data = await request.json();

        // Generate slug if not provided
        if (!data.slug) {
            data.slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9\u10A0-\u10FF]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        const post = new Post(data);
        await post.save();

        return NextResponse.json({
            success: true,
            post: {
                ...post.toObject(),
                id: post._id.toString(),
            },
        });
    } catch (error) {
        console.error('Create post error:', error);
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}
