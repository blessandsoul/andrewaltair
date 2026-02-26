export const dynamic = 'force-dynamic'
import { revalidatePath } from 'next/cache';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
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

        return apiSuccess(result, 'Posts fetched successfully');
    } catch (error) {
        console.error('Fetch posts error:', error);
        return apiError(ERROR_CODES.POST_FETCH_FAILED, 'Failed to fetch posts', 500);
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

        return apiSuccess(post, 'Post created successfully', 201);
    } catch (error: unknown) {
        console.error('Create post error:', error);

        // Handle Mongoose validation errors specifically
        if (error instanceof Error && error.name === 'ValidationError' && 'errors' in error) {
            const details = Object.values((error as Record<string, unknown>).errors as Record<string, { message: string }>).map((err) => err.message).join(', ');
            return apiError(ERROR_CODES.VALIDATION_FAILED, details, 400);
        }

        return apiError(ERROR_CODES.POST_CREATE_FAILED, 'Failed to create post', 500);
    }
}
