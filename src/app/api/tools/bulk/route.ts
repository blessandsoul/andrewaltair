import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Tool from '@/models/Tool'

// POST - Bulk import tools from JSON
export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const { tools, options = {} } = await request.json()

        if (!Array.isArray(tools) || tools.length === 0) {
            return NextResponse.json({ error: 'Tools array is required' }, { status: 400 })
        }

        const { skipDuplicates = true, updateExisting = false } = options

        const results = {
            imported: 0,
            skipped: 0,
            updated: 0,
            errors: [] as { name: string; error: string }[],
        }

        for (const toolData of tools) {
            try {
                if (!toolData.name) {
                    results.errors.push({ name: 'unknown', error: 'Name is required' })
                    continue
                }

                // Check for existing tool
                const existing = await Tool.findOne({ name: toolData.name })

                if (existing) {
                    if (updateExisting) {
                        await Tool.findByIdAndUpdate(existing._id, {
                            ...toolData,
                            updatedAt: new Date(),
                        })
                        results.updated++
                    } else if (skipDuplicates) {
                        results.skipped++
                    } else {
                        results.errors.push({ name: toolData.name, error: 'Already exists' })
                    }
                } else {
                    await Tool.create({
                        name: toolData.name,
                        description: toolData.description || '',
                        url: toolData.url || '',
                        logo: toolData.logo || '',
                        category: toolData.category || 'Other',
                        pricing: toolData.pricing || 'Free',
                        rating: toolData.rating || 0,
                        features: toolData.features || [],
                        pros: toolData.pros || [],
                        cons: toolData.cons || [],
                    })
                    results.imported++
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error'
                results.errors.push({ name: toolData.name || 'unknown', error: errorMessage })
            }
        }

        return NextResponse.json({
            success: true,
            ...results,
            total: tools.length,
        })
    } catch (error) {
        console.error('Bulk import error:', error)
        return NextResponse.json({ error: 'Failed to import tools' }, { status: 500 })
    }
}

// GET - Export all tools as JSON for backup/migration
export async function GET() {
    try {
        await dbConnect()

        const tools = await Tool.find({}).lean()

        return NextResponse.json({
            tools: tools.map(t => ({
                name: t.name,
                description: t.description,
                url: t.url,
                logo: t.logo,
                category: t.category,
                pricing: t.pricing,
                rating: t.rating,
                features: t.features,
                pros: t.pros,
                cons: t.cons,
            })),
            exportedAt: new Date().toISOString(),
            count: tools.length,
        })
    } catch (error) {
        console.error('Export tools error:', error)
        return NextResponse.json({ error: 'Failed to export tools' }, { status: 500 })
    }
}
