import { NextRequest } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'
import { apiSuccess, apiError, apiPaginated } from '@/lib/api-response'
import { LinkService } from '@/services/link.service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    if (!verifyAdmin(request)) {
        return apiError('UNAUTHORIZED', 'Unauthorized', 401)
    }

    try {
        const searchParams = request.nextUrl.searchParams
        const page = parseInt(searchParams.get('page') || '1', 10)
        const limit = parseInt(searchParams.get('limit') || '20', 10)
        const search = searchParams.get('search') || undefined
        const isActiveParam = searchParams.get('isActive')
        const isActive = isActiveParam === null ? null : isActiveParam === 'true'

        const groupId = searchParams.get('groupId') || null
        const tag = searchParams.get('tag') || null

        const { items, total } = await LinkService.getLinks({ page, limit, search, isActive, groupId, tag })
        return apiPaginated(items, { page, limit, total }, 'Links fetched')
    } catch {
        return apiError('LINK_FETCH_FAILED', 'Failed to fetch links', 500)
    }
}

export async function POST(request: NextRequest) {
    if (!verifyAdmin(request)) {
        return apiError('UNAUTHORIZED', 'Unauthorized', 401)
    }

    try {
        const body = await request.json()

        if (!body.originalUrl) {
            return apiError('LINK_CREATE_FAILED', 'originalUrl is required', 400)
        }

        const link = await LinkService.createLink(body)

        return apiSuccess(link, 'Link created', 201)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create link'
        const code = message.includes('Slug already taken') ? 'LINK_SLUG_TAKEN' : 'LINK_CREATE_FAILED'
        return apiError(code, message, 400)
    }
}
