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
        const groups = await LinkService.getGroups()
        return apiSuccess(groups, 'Groups fetched')
    } catch {
        return apiError('GROUP_FETCH_FAILED', 'Failed to fetch groups', 500)
    }
}

export async function POST(request: NextRequest) {
    if (!verifyAdmin(request)) {
        return apiError('UNAUTHORIZED', 'Unauthorized', 401)
    }
    try {
        const body = await request.json()
        if (!body.name) return apiError('GROUP_NAME_REQUIRED', 'Name is required', 400)
        const group = await LinkService.createGroup(body)
        return apiSuccess(group, 'Group created', 201)
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to create group'
        return apiError('GROUP_CREATE_FAILED', msg, 400)
    }
}
