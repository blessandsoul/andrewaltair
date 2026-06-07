export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { UserService } from '@/services/user.service'
import { MediaService } from '@/services/media.service'
import { verifyToken } from '@/lib/jwt-config'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'

// Verify JWT token and get userId (same pattern as /api/profile)
function getAuth(request: NextRequest): { userId: string } | null {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) return null
    try {
        const token = authHeader.split(' ')[1]
        return verifyToken(token) as { userId: string }
    } catch {
        return null
    }
}

// POST - Upload avatar or cover image as a FILE (not base64) and store its URL on the user
export async function POST(request: NextRequest) {
    try {
        const decoded = getAuth(request)
        if (!decoded) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Authentication required', 401)
        }

        const formData = await request.formData()
        const file = formData.get('file') as File | null
        const fieldRaw = (formData.get('field') as string) || 'avatar'
        const field: 'avatar' | 'cover' = fieldRaw === 'cover' ? 'cover' : 'avatar'

        if (!file) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'No file uploaded', 400)
        }

        // MediaService enforces image-only + 5MB cap and returns a short /api/files/... URL
        const { url } = await MediaService.uploadFile(file, `${field}-${decoded.userId}`, field)

        const updated = await UserService.updateProfile(
            decoded.userId,
            field === 'cover' ? { coverImage: url } : { avatar: url }
        )
        if (!updated) {
            return apiError(ERROR_CODES.USER_NOT_FOUND, 'User not found', 404)
        }

        return apiSuccess({ url }, 'Uploaded successfully')
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Upload failed'
        return apiError(ERROR_CODES.MEDIA_UPLOAD_FAILED, message, 400)
    }
}
