export const dynamic = 'force-dynamic'
import dbConnect from '@/lib/db';
import Redirect from '@/models/Redirect';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

// GET - List all redirects
export async function GET() {
    try {
        await dbConnect();

        const redirects = await Redirect.find({})
            .sort({ hits: -1 })
            .lean();

        const transformedRedirects = redirects.map(r => ({
            ...r,
            id: r._id.toString(),
            _id: undefined,
        }));

        return apiSuccess({ redirects: transformedRedirects }, 'Redirects fetched successfully');
    } catch (error) {
        console.error('Get redirects error:', error);
        return apiError(ERROR_CODES.REDIRECT_FETCH_FAILED, 'Failed to fetch redirects', 500);
    }
}

// POST - Create new redirect
export async function POST(request: Request) {
    try {
        await dbConnect();

        const data = await request.json();

        const redirect = new Redirect(data);
        await redirect.save();

        return apiSuccess({
            redirect: {
                ...redirect.toObject(),
                id: redirect._id.toString(),
            },
        }, 'Redirect created successfully');
    } catch (error) {
        console.error('Create redirect error:', error);
        return apiError(ERROR_CODES.REDIRECT_CREATE_FAILED, 'Failed to create redirect', 500);
    }
}

