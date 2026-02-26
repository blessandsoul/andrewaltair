export const dynamic = 'force-dynamic'
import { apiSuccess } from '@/lib/api-response'

export async function POST() {
    const response = apiSuccess(null, 'წარმატებით გახვედით სისტემიდან')

    response.cookies.set('admin_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
    })

    return response
}
