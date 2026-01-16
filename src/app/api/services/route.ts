export const dynamic = 'force-dynamic'


import { NextResponse } from "next/server"
import servicesData from "@/data/services.json"

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

        return NextResponse.json({ services })
    } catch (error) {
        console.error("Get services error:", error)
        return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
    }
}

