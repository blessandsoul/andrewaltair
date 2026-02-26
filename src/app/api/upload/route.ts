export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { MediaService } from '@/services/media.service'

export async function POST(request: NextRequest) {
    try {
        // 🛡️ Require authentication (Admin only)
        const { verifyAdmin, unauthorizedResponse } = await import('@/lib/admin-auth');

        if (!verifyAdmin(request)) {
            return unauthorizedResponse('Admin access required');
        }

        const formData = await request.formData()
        const file = formData.get('file') as File
        const title = formData.get('title') as string || 'untitled'
        const type = formData.get('type') as string || 'horizontal'

        if (!file) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'No file uploaded', 400)
        }

        const result = await MediaService.uploadFile(file, title, type);

        return apiSuccess(result, 'File uploaded successfully')

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Upload failed';
        return apiError(ERROR_CODES.MEDIA_UPLOAD_FAILED, message, 400)
    }
}
