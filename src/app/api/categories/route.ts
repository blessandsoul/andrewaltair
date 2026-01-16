export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';

// GET - List all categories (public - needed for navigation)
export async function GET() {
    try {
        await dbConnect();

        const categories = await Category.find()
            .sort({ name: 1 })
            .lean();

        const transformedCategories = categories.map(cat => ({
            ...cat,
            id: cat._id.toString(),
            parentId: cat.parentId?.toString() || null,
            _id: undefined,
        }));

        return NextResponse.json({ categories: transformedCategories });
    } catch (error) {
        console.error('Get categories error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

// POST - Create a new category
export async function POST(request: Request) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        await dbConnect();

        const data = await request.json();

        // Generate slug if not provided
        if (!data.slug) {
            data.slug = data.name
                .toLowerCase()
                .replace(/[^a-z0-9\u10A0-\u10FF]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        const category = new Category(data);
        await category.save();

        return NextResponse.json({
            success: true,
            category: {
                ...category.toObject(),
                id: category._id.toString(),
            },
        });
    } catch (error) {
        console.error('Create category error:', error);
        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        );
    }
}

