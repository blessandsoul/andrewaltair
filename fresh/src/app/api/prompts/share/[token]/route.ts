import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Prompt from '@/models/Prompt'

interface RouteParams {
    params: Promise<{ token: string }>
}

// GET - Get shared prompt by token
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        await dbConnect()
        const { token } = await params

        const prompt = await Prompt.findOne({ shareToken: token }).lean()

        if (!prompt) {
            return NextResponse.json(
                { error: 'Shared prompt not found' },
                { status: 404 }
            )
        }

        // Increment views
        await Prompt.findByIdAndUpdate(prompt._id, { $inc: { views: 1 } })

        // Return only public-safe data
        return NextResponse.json({
            id: prompt._id.toString(),
            content: prompt.content,
            formData: prompt.formData,
            title: prompt.title,
            description: prompt.description,
            category: prompt.category,
            tags: prompt.tags,
            qualityScore: prompt.qualityScore,
            tokenCount: prompt.tokenCount,
            views: prompt.views + 1,
            uses: prompt.uses,
            likes: prompt.likes,
            createdAt: prompt.createdAt,
        })

    } catch (error) {
        console.error('Get shared prompt error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch shared prompt' },
            { status: 500 }
        )
    }
}
