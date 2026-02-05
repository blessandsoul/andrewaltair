export const dynamic = 'force-dynamic'
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from '@/lib/db';
import Testimonial from '@/models/Testimonial';

// GET: List active testimonials
export async function GET() {
    try {
        await dbConnect();

        const testimonials = await Testimonial.find({ isActive: true })
            .sort({ order: 1, createdAt: -1 })
            .limit(10);

        return apiSuccess({ testimonials }, 'Testimonials fetched successfully');
    } catch (error) {
        console.error('Testimonials Error:', error);
        return apiError(ERROR_CODES.CONVERSION_FETCH_FAILED, 'Failed to get testimonials', 500);
    }
}

