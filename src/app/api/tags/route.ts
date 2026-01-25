export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { TaxonomyService } from '@/services/taxonomy.service';

// GET - List all tags
export async function GET() {
    try {
        const tags = await TaxonomyService.getAllTags();
        return NextResponse.json({ tags });
    } catch (error) {
        console.error('Get tags error:', error);
        return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
    }
}

// POST - Create a new tag
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const tag = await TaxonomyService.createTag(data);
        return NextResponse.json({ success: true, tag });
    } catch (error) {
        console.error('Create tag error:', error);
        return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
    }
}
