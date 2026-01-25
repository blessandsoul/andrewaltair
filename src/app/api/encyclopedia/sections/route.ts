export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { EncyclopediaService } from '@/services/encyclopedia.service';

// GET all sections
export async function GET() {
    try {
        const sections = await EncyclopediaService.getAllSections();
        return NextResponse.json({ sections });
    } catch (error) {
        console.error('Error fetching sections:', error);
        return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
    }
}

// POST create new section
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const section = await EncyclopediaService.createSection(body);
        return NextResponse.json({ section }, { status: 201 });
    } catch (error) {
        console.error('Error creating section:', error);
        return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
    }
}
