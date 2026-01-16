export const dynamic = 'force-dynamic'
"use server"

import { NextResponse } from "next/server"
import productsData from "@/data/products.json"

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

        return NextResponse.json({ products })
    } catch (error) {
        console.error("Get products error:", error)
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }
}

