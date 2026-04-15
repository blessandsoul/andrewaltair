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
        const limit = parseInt(request.nextUrl.searchParams.get('limit') || '5', 10)
        const links = await LinkService.getTopLinks(limit)
        return apiSuccess(links, 'Top links fetched')
    } catch {
        return apiError('LINK_FETCH_FAILED', 'Failed to fetch top links', 500)
    }
}
