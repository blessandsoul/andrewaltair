export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { EncyclopediaService } from '@/services/encyclopedia.service';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

// GET all sections
export async function GET() {
    try {
        const sections = await EncyclopediaService.getAllSections();
        return apiSuccess(sections, 'Sections fetched successfully');
    } catch (error) {
        console.error('Error fetching sections:', error);
        return apiError(ERROR_CODES.ENCYCLOPEDIA_FETCH_FAILED, 'Failed to fetch sections', 500);
    }
}

// POST create new section
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const section = await EncyclopediaService.createSection(body);
        return apiSuccess(section, 'Section created successfully', 201);
    } catch (error) {
        console.error('Error creating section:', error);
        return apiError(ERROR_CODES.ENCYCLOPEDIA_CREATE_FAILED, 'Failed to create section', 500);
    }
}
