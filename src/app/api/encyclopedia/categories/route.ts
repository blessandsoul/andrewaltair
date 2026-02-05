export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import EncyclopediaCategory from '@/models/EncyclopediaCategory';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

// GET all categories (optionally filtered by sectionId)
export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const sectionId = searchParams.get('sectionId');

        const query = sectionId ? { sectionId, isActive: true } : { isActive: true };
        const categories = await EncyclopediaCategory.find(query)
            .sort({ order: 1 })
            .populate('sectionId', 'title slug')
            .lean();

        return apiSuccess(categories, 'Categories fetched successfully');
    } catch (error) {
        console.error('Error fetching categories:', error);
        return apiError(ERROR_CODES.ENCYCLOPEDIA_FETCH_FAILED, 'Failed to fetch categories', 500);
    }
}

// POST create new category
export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();

        const category = await EncyclopediaCategory.create({
            slug: body.slug,
            title: body.title,
            icon: body.icon || '📚',
            sectionId: body.sectionId,
            order: body.order || 0,
            isActive: body.isActive ?? true,
        });

        return apiSuccess(category, 'Category created successfully', 201);
    } catch (error) {
        console.error('Error creating category:', error);
        return apiError(ERROR_CODES.ENCYCLOPEDIA_CREATE_FAILED, 'Failed to create category', 500);
    }
}
