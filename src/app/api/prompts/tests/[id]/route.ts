import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import PromptTest from '@/models/PromptTest'

interface RouteParams {
    params: Promise<{ id: string }>
}

// GET - Get single test with results
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        await dbConnect()
        const { id } = await params

        const test = await PromptTest.findById(id)
            .populate('promptIds', 'content formData qualityScore uses likes tokenCount')
            .populate('winnerId', 'content formData')
            .lean()

        if (!test) {
            return NextResponse.json(
                { error: 'Test not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ test })

    } catch (error) {
        console.error('Get test error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch test' },
            { status: 500 }
        )
    }
}

// PUT - Update test (record usage, complete test)
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        await dbConnect()
        const { id } = await params
        const { action, promptId, rating } = await request.json()

        const test = await PromptTest.findById(id)
        if (!test) {
            return NextResponse.json(
                { error: 'Test not found' },
                { status: 404 }
            )
        }

        if (action === 'record-use') {
            // Record a use of specific prompt in the test
            const resultIndex = test.results.findIndex(
                (r: any) => r.promptId.toString() === promptId
            )

            if (resultIndex !== -1) {
                test.results[resultIndex].uses += 1
                if (rating) {
                    const currentAvg = test.results[resultIndex].avgRating
                    const currentUses = test.results[resultIndex].uses
                    test.results[resultIndex].avgRating =
                        ((currentAvg * (currentUses - 1)) + rating) / currentUses
                }
                await test.save()
            }

        } else if (action === 'record-conversion') {
            // Record a conversion (user liked/copied the result)
            const resultIndex = test.results.findIndex(
                (r: any) => r.promptId.toString() === promptId
            )

            if (resultIndex !== -1) {
                test.results[resultIndex].conversions += 1
                await test.save()
            }

        } else if (action === 'complete') {
            // Complete the test and determine winner
            let winner = null
            let bestScore = -1

            for (const result of test.results) {
                // Score = conversion rate * avg rating
                const conversionRate = result.uses > 0
                    ? result.conversions / result.uses
                    : 0
                const score = conversionRate * result.avgRating

                if (score > bestScore) {
                    bestScore = score
                    winner = result.promptId
                }
            }

            test.status = 'completed'
            test.completedAt = new Date()
            test.winnerId = winner
            await test.save()

        } else if (action === 'pause') {
            test.status = 'paused'
            await test.save()

        } else if (action === 'resume') {
            test.status = 'active'
            await test.save()
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Update test error:', error)
        return NextResponse.json(
            { error: 'Failed to update test' },
            { status: 500 }
        )
    }
}

// DELETE - Delete test
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        await dbConnect()
        const { id } = await params

        await PromptTest.findByIdAndDelete(id)

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Delete test error:', error)
        return NextResponse.json(
            { error: 'Failed to delete test' },
            { status: 500 }
        )
    }
}
