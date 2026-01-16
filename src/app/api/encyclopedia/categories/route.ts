export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EncyclopediaCategory from '@/models/EncyclopediaCategory';

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

        return NextResponse.json({ categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
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

        return NextResponse.json({ category }, { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}

