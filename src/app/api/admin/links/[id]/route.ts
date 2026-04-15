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
        const link = await LinkService.getLinkById(id)
        if (!link) return apiError('LINK_NOT_FOUND', 'Link not found', 404)
        return apiSuccess(link, 'Link fetched')
    } catch {
        return apiError('LINK_FETCH_FAILED', 'Failed to fetch link', 500)
    }
}

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
        const link = await LinkService.updateLink(id, body)
        if (!link) return apiError('LINK_NOT_FOUND', 'Link not found', 404)
        return apiSuccess(link, 'Link updated')
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update link'
        const code = message.includes('Slug already taken') ? 'LINK_SLUG_TAKEN' : 'LINK_UPDATE_FAILED'
        return apiError(code, message, 400)
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
        const deleted = await LinkService.deleteLink(id)
        if (!deleted) return apiError('LINK_NOT_FOUND', 'Link not found', 404)
        return apiSuccess(null, 'Link deleted')
    } catch {
        return apiError('LINK_DELETE_FAILED', 'Failed to delete link', 500)
    }
}
