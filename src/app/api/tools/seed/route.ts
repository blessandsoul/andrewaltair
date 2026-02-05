export const dynamic = 'force-dynamic'
import { NextRequest } from "next/server"
import dbConnect from "@/lib/db"
import Tool from "@/models/Tool"
import toolsData from "@/data/tools.json"
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'

// POST - Seed tools from JSON file to MongoDB (one-time operation)
export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        // Check authorization (only allow in development or with special header)
        const isDev = process.env.NODE_ENV === "development"
        const authHeader = request.headers.get("x-seed-key")

        if (!isDev && authHeader !== process.env.SEED_SECRET_KEY) {
            return apiError(ERROR_CODES.ADMIN_UNAUTHORIZED, 'Unauthorized access to seed endpoint', 401)
        }

        // Check if tools already exist
        const existingCount = await Tool.countDocuments()
        if (existingCount > 0) {
            return apiSuccess({ count: existingCount }, 'Tools already seeded')
        }

        // Transform and insert tools
        const toolsToInsert = toolsData.map(tool => ({
            name: tool.name,
            description: tool.description,
            url: tool.url,
            logo: tool.logo,
            category: tool.category,
            pricing: tool.pricing || "freemium",
            rating: tool.rating || 4,
            featured: tool.featured || false,
            views: 0,
        }))

        const result = await Tool.insertMany(toolsToInsert)

        return apiSuccess({ count: result.length }, 'Tools seeded successfully')
    } catch (error) {
        console.error("Seed tools error:", error)
        return apiError(ERROR_CODES.SEED_FAILED, 'Failed to seed tools', 500)
    }
}

// GET - Get seed status
export async function GET() {
    try {
        await dbConnect()
        const count = await Tool.countDocuments()

        return apiSuccess({
            seeded: count > 0,
            count,
            totalInJson: toolsData.length,
        }, 'Seed status retrieved')
    } catch (error) {
        console.error("Get seed status error:", error)
        return apiError(ERROR_CODES.SEED_FAILED, 'Failed to get seed status', 500)
    }
}

