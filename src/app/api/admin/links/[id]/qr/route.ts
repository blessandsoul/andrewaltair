import { NextRequest } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'
import { apiSuccess, apiError } from '@/lib/api-response'
import { LinkService } from '@/services/link.service'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge'

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

        const shortUrl = `${BASE_URL}/link/${link.slug}`
        const qrDataUrl = await LinkService.generateQR(shortUrl)
        return apiSuccess({ qrDataUrl, shortUrl }, 'QR generated')
    } catch {
        return apiError('LINK_QR_FAILED', 'Failed to generate QR code', 500)
    }
}
