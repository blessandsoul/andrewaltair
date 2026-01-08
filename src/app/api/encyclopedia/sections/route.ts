import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EncyclopediaSection from '@/models/EncyclopediaSection';

// GET all sections
export async function GET() {
    try {
        await dbConnect();
        const sections = await EncyclopediaSection.find({ isActive: true })
            .sort({ order: 1 })
            .lean();

        return NextResponse.json({ sections });
    } catch (error) {
        console.error('Error fetching sections:', error);
        return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
    }
}

// POST create new section
export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();

        const section = await EncyclopediaSection.create({
            slug: body.slug,
            title: body.title,
            description: body.description || '',
            gradientFrom: body.gradientFrom || 'purple-500',
            gradientTo: body.gradientTo || 'pink-500',
            icon: body.icon || 'TbBook',
            order: body.order || 0,
            isActive: body.isActive ?? true,
        });

        return NextResponse.json({ section }, { status: 201 });
    } catch (error) {
        console.error('Error creating section:', error);
        return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
    }
}
