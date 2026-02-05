export const dynamic = 'force-dynamic'

import productsData from "@/data/products.json"
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get("category")
        const search = searchParams.get("search")

        let products = [...productsData]

        if (category) {
            products = products.filter(p => p.category === category)
        }
        if (search) {
            const q = search.toLowerCase()
            products = products.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q)
            )
        }

        return apiSuccess({ products }, 'Products fetched successfully')
    } catch (error) {
        console.error("Get products error:", error)
        return apiError(ERROR_CODES.PRODUCT_FETCH_FAILED, 'Failed to fetch products', 500)
    }
}

