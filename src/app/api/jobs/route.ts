import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import ScheduledJob from '@/models/ScheduledJob'

// GET - List all jobs with filtering
export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const type = searchParams.get('type')
        const limit = parseInt(searchParams.get('limit') || '50')

        const filter: Record<string, string> = {}
        if (status) filter.status = status
        if (type) filter.type = type

        const jobs = await ScheduledJob.find(filter)
            .sort({ updatedAt: -1 })
            .limit(limit)
            .lean()

        const stats = {
            total: await ScheduledJob.countDocuments(),
            pending: await ScheduledJob.countDocuments({ status: 'pending' }),
            running: await ScheduledJob.countDocuments({ status: 'running' }),
            completed: await ScheduledJob.countDocuments({ status: 'completed' }),
            failed: await ScheduledJob.countDocuments({ status: 'failed' }),
        }

        return NextResponse.json({
            jobs: jobs.map(j => ({
                id: j._id.toString(),
                name: j.name,
                type: j.type,
                status: j.status,
                schedule: j.schedule,
                lastRun: j.lastRun,
                nextRun: j.nextRun,
                result: j.result,
                retryCount: j.retryCount,
                createdAt: j.createdAt,
                updatedAt: j.updatedAt,
            })),
            stats,
        })
    } catch (error) {
        console.error('Get jobs error:', error)
        return NextResponse.json({ error: 'Failed to get jobs' }, { status: 500 })
    }
}

// POST - Create a new scheduled job
export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const data = await request.json()

        if (!data.name) {
            return NextResponse.json({ error: 'Job name is required' }, { status: 400 })
        }

        const job = await ScheduledJob.create({
            name: data.name,
            type: data.type || 'other',
            status: 'pending',
            schedule: data.schedule,
            nextRun: data.nextRun,
            maxRetries: data.maxRetries || 3,
        })

        return NextResponse.json({
            success: true,
            job: {
                id: job._id.toString(),
                name: job.name,
                status: job.status,
            },
        })
    } catch (error) {
        console.error('Create job error:', error)
        return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
    }
}

// PUT - Update job status (for job runners)
export async function PUT(request: NextRequest) {
    try {
        await dbConnect()

        const { id, status, result } = await request.json()

        if (!id) {
            return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
        }

        const updateData: Record<string, unknown> = {}
        if (status) {
            updateData.status = status
            if (status === 'running') {
                updateData.lastRun = new Date()
            }
        }
        if (result) {
            updateData.result = result
        }

        const job = await ScheduledJob.findByIdAndUpdate(id, updateData, { new: true })

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            job: {
                id: job._id.toString(),
                status: job.status,
            },
        })
    } catch (error) {
        console.error('Update job error:', error)
        return NextResponse.json({ error: 'Failed to update job' }, { status: 500 })
    }
}

// DELETE - Cancel/remove a job
export async function DELETE(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
        }

        const job = await ScheduledJob.findByIdAndDelete(id)

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: 'Job deleted',
        })
    } catch (error) {
        console.error('Delete job error:', error)
        return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 })
    }
}
