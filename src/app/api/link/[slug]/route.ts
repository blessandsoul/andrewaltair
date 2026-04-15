import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { LinkService } from '@/services/link.service'

export const dynamic = 'force-dynamic'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params
        const link = await LinkService.getLinkBySlug(slug)

        if (!link) {
            return apiError('LINK_NOT_FOUND', 'Link not found', 404)
        }

        const validation = LinkService.validateLink(link)
        if (!validation.valid) {
            return apiError('LINK_INVALID', `Link is ${validation.reason}`, 410)
        }

        // Password check
        if (link.password) {
            const pwd = request.nextUrl.searchParams.get('pwd')
            if (!pwd) {
                return apiError('LINK_PASSWORD_REQUIRED', 'Password required', 401)
            }
            const valid = await LinkService.verifyPassword(link, pwd)
            if (!valid) {
                return apiError('LINK_PASSWORD_WRONG', 'Wrong password', 403)
            }
        }

        // Track click
        LinkService.trackClick(link, request).catch(() => {})

        // Return data for client-side handling
        return apiSuccess({
            originalUrl: link.originalUrl,
            showRedirectPage: link.showRedirectPage,
            delay: link.redirectPageDelay,
            message: link.redirectPageMessage,
            title: link.title,
            fallbackUrl: link.fallbackUrl,
        })
    } catch {
        return apiError('LINK_ERROR', 'Something went wrong', 500)
    }
}
