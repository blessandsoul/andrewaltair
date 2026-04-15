import { NextRequest } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'
import { apiSuccess, apiError } from '@/lib/api-response'
import { LinkService } from '@/services/link.service'

export const dynamic = 'force-dynamic'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!verifyAdmin(request)) {
        return apiError('UNAUTHORIZED', 'Unauthorized', 401)
    }

    try {
        const { id } = await params
        const period = (request.nextUrl.searchParams.get('period') || '30d') as '7d' | '30d' | '90d' | 'all'
        const stats = await LinkService.getLinkStats(id, period)
        return apiSuccess(stats, 'Stats fetched')
    } catch {
        return apiError('LINK_STATS_FAILED', 'Failed to fetch stats', 500)
    }
}
