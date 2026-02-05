export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { MediaService } from '@/services/media.service'

export async function POST(request: NextRequest) {
    try {
        // 🛡️ Require authentication (Admin only)
        const { verifyAdmin, unauthorizedResponse } = await import('@/lib/admin-auth');

        console.log('[Upload API] Request received');
        const authHeader = request.headers.get('authorization');
        console.log('[Upload API] Auth Header:', authHeader ? 'Present' : 'Missing');

        if (!verifyAdmin(request)) {
            console.error('[Upload API] Admin verification failed');
            return unauthorizedResponse('Admin access required');
        }

        const formData = await request.formData()
        const file = formData.get('file') as File
        const title = formData.get('title') as string || 'untitled'
        const type = formData.get('type') as string || 'horizontal'

        if (!file) {
            console.error('[Upload API] No file found in FormData');
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'No file uploaded', 400)
        }

        console.log(`[Upload API] Processing file: ${file.name}, Size: ${file.size}, Type: ${file.type}`);

        const result = await MediaService.uploadFile(file, title, type);
        console.log('[Upload API] Upload success:', result.url);

        return apiSuccess(result, 'File uploaded successfully')

    } catch (error: unknown) {
        console.error('[Upload API] Critical error:', error)
        const message = error instanceof Error ? error.message : 'Upload failed';
        return apiError(ERROR_CODES.MEDIA_UPLOAD_FAILED, message, 400)
    }
}
