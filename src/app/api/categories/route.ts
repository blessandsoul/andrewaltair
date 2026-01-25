export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { TaxonomyService } from '@/services/taxonomy.service';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';

// GET - List all categories
export async function GET() {
    try {
        const categories = await TaxonomyService.getAllCategories();
        return NextResponse.json({ categories });
    } catch (error) {
        console.error('Get categories error:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

// POST - Create a new category
export async function POST(request: Request) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const data = await request.json();
        const category = await TaxonomyService.createCategory(data);
        return NextResponse.json({ success: true, category });
    } catch (error) {
        console.error('Create category error:', error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
