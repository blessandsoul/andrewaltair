import { NextRequest } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'
import { apiSuccess, apiError } from '@/lib/api-response'
import { LinkService } from '@/services/link.service'

export const dynamic = 'force-dynamic'

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!verifyAdmin(request)) {
        return apiError('UNAUTHORIZED', 'Unauthorized', 401)
    }
    try {
        const { id } = await params
        const body = await request.json()
        const group = await LinkService.updateGroup(id, body)
        if (!group) return apiError('GROUP_NOT_FOUND', 'Group not found', 404)
        return apiSuccess(group, 'Group updated')
    } catch {
        return apiError('GROUP_UPDATE_FAILED', 'Failed to update group', 500)
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!verifyAdmin(request)) {
        return apiError('UNAUTHORIZED', 'Unauthorized', 401)
    }
    try {
        const { id } = await params
        const deleted = await LinkService.deleteGroup(id)
        if (!deleted) return apiError('GROUP_NOT_FOUND', 'Group not found', 404)
        return apiSuccess(null, 'Group deleted')
    } catch {
        return apiError('GROUP_DELETE_FAILED', 'Failed to delete group', 500)
    }
}
