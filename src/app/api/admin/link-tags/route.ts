import { NextRequest } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'
import { apiSuccess, apiError } from '@/lib/api-response'
import { LinkService } from '@/services/link.service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    if (!verifyAdmin(request)) {
        return apiError('UNAUTHORIZED', 'Unauthorized', 401)
    }
    try {
        const tags = await LinkService.getAllTags()
        return apiSuccess(tags, 'Tags fetched')
    } catch {
        return apiError('TAGS_FETCH_FAILED', 'Failed to fetch tags', 500)
    }
}
