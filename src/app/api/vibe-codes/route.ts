export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { VibeCodeService } from '@/services/vibecode.service';

// POST /api/vibe-codes - Admin generate
export async function POST(request: NextRequest) {
    const { verifyAdmin, unauthorizedResponse } = await import('@/lib/admin-auth');
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const data = await request.json();
        const result = VibeCodeService.createCode(data);
        return apiSuccess(result, 'Vibe code created successfully');
    } catch (error) {
        return apiError(ERROR_CODES.VIBE_CODE_CREATE_FAILED, 'Failed to generate code', 500);
    }
}

// GET /api/vibe-codes?code=XXX - Validate
export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get('code');

    if (!code) {
        return apiError(ERROR_CODES.VALIDATION_FAILED, 'Code is required', 400);
    }

    try {
        const result = VibeCodeService.validateCode(code);
        return apiSuccess(result, 'Vibe code validated successfully');
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to validate code';
        return apiError(ERROR_CODES.VIBE_CODE_FETCH_FAILED, message, 400);
    }
}

// DELETE /api/vibe-codes?code=XXX - Admin delete
export async function DELETE(request: NextRequest) {
    const { verifyAdmin, unauthorizedResponse } = await import('@/lib/admin-auth');
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    const code = request.nextUrl.searchParams.get('code');
    if (!code) {
        return apiError(ERROR_CODES.VALIDATION_FAILED, 'Code is required', 400);
    }

    const deleted = VibeCodeService.deleteCode(code);
    if (!deleted) {
        return apiError(ERROR_CODES.VIBE_CODE_NOT_FOUND, 'Code not found', 404);
    }
    return apiSuccess(null, 'Code deleted');
}

// PATCH - List all
export async function PATCH(request: NextRequest) {
    const { verifyAdmin, unauthorizedResponse } = await import('@/lib/admin-auth');
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    const codes = VibeCodeService.getAllCodes();
    return apiSuccess({ totalCodes: codes.length, codes }, 'All vibe codes fetched');
}
