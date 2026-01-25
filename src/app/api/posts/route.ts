export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';
import { PostService } from '@/services/post.service';

// GET - List all posts with filtering and pagination
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const featured = searchParams.get('featured') === 'true';
        const trending = searchParams.get('trending') === 'true';
        const afterSlug = searchParams.get('afterSlug');
        const typeRaw = searchParams.get('type');
        const type = (typeRaw === 'repository' || typeRaw === 'article') ? typeRaw : null;

        const result = await PostService.getAllPosts({
            page,
            limit,
            status,
            category,
            search,
            featured,
            trending,
            afterSlug,
            type
        });

        return NextResponse.json(result);
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
        const data = await request.json();

        // Use Service Layer
        const post = await PostService.createPost(data);

        // 🔄 Revalidate caches so the new post appears immediately
        revalidatePath('/blog');
        revalidatePath('/');
        revalidatePath('/sitemap.xml');

        return NextResponse.json({
            success: true,
            post,
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
