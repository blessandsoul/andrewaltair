import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import PromptTest from '@/models/PromptTest'
import Prompt from '@/models/Prompt'

// GET - List all A/B tests
export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') || 'active'

        const tests = await PromptTest.find({ status })
            .populate('promptIds', 'content formData qualityScore uses')
            .sort({ createdAt: -1 })
            .lean()

        return NextResponse.json({ tests })

    } catch (error) {
        console.error('Get tests error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch tests' },
            { status: 500 }
        )
    }
}

// POST - Create new A/B test
export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const { name, description, promptIds } = await request.json()

        if (!name || !promptIds || promptIds.length < 2) {
            return NextResponse.json(
                { error: 'Name and at least 2 prompts are required' },
                { status: 400 }
            )
        }

        // Verify all prompts exist
        const prompts = await Prompt.find({ _id: { $in: promptIds } })
        if (prompts.length !== promptIds.length) {
            return NextResponse.json(
                { error: 'Some prompts not found' },
                { status: 404 }
            )
        }

        // Initialize results for each prompt
        const results = promptIds.map((id: string) => ({
            promptId: id,
            uses: 0,
            avgRating: 0,
            conversions: 0
        }))

        const test = await PromptTest.create({
            name,
            description,
            promptIds,
            results,
            status: 'active',
            startedAt: new Date()
        })

        return NextResponse.json({
            id: test._id.toString(),
            message: 'A/B test created successfully'
        })

    } catch (error) {
        console.error('Create test error:', error)
        return NextResponse.json(
            { error: 'Failed to create test' },
            { status: 500 }
        )
    }
}

