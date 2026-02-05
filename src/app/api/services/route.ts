export const dynamic = 'force-dynamic'

import servicesData from "@/data/services.json"
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get("search")

        let services = [...servicesData]

        if (search) {
            const q = search.toLowerCase()
            services = services.filter(s =>
                s.title.toLowerCase().includes(q) ||
                s.description.toLowerCase().includes(q)
            )
        }

        return apiSuccess({ services }, 'Services fetched successfully')
    } catch (error) {
        console.error("Get services error:", error)
        return apiError(ERROR_CODES.SERVICE_FETCH_FAILED, 'Failed to fetch services', 500)
    }
}

