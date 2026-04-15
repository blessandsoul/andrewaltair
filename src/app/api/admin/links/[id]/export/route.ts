import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'
import { apiError } from '@/lib/api-response'
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

        const csv = await LinkService.exportCSV(id)
        const filename = `clicks-${link.slug}-${new Date().toISOString().split('T')[0]}.csv`

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        })
    } catch {
        return apiError('LINK_EXPORT_FAILED', 'Failed to export', 500)
    }
}
