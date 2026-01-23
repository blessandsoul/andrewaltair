export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { mkdir, rmdir, readdir } from 'fs/promises'
import path from 'path'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads')

// POST - Create new folder
export async function POST(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return unauthorizedResponse('Admin access required')
        }

        const { name, parent } = await request.json()

        if (!name || typeof name !== 'string') {
            return NextResponse.json({ error: 'Folder name is required' }, { status: 400 })
        }

        // Sanitize folder name
        const safeName = name.replace(/[^a-zA-Z0-9-_\u10D0-\u10FF]/g, '-').slice(0, 50)

        const parentPath = parent ? path.join(UPLOADS_DIR, parent) : UPLOADS_DIR
        const folderPath = path.join(parentPath, safeName)

        // Security check
        if (!path.normalize(folderPath).startsWith(UPLOADS_DIR)) {
            return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
        }

        await mkdir(folderPath, { recursive: true })

        const relativePath = path.relative(UPLOADS_DIR, folderPath).replace(/\\/g, '/')

        return NextResponse.json({
            success: true,
            folder: {
                name: safeName,
                path: relativePath
            }
        })
    } catch (error) {
        console.error('Create folder error:', error)
        return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 })
    }
}

// DELETE - Delete empty folder
export async function DELETE(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return unauthorizedResponse('Admin access required')
        }

        const { searchParams } = new URL(request.url)
        const folderPath = searchParams.get('path')

        if (!folderPath) {
            return NextResponse.json({ error: 'Folder path is required' }, { status: 400 })
        }

        const fullPath = path.join(UPLOADS_DIR, folderPath)

        // Security check
        if (!path.normalize(fullPath).startsWith(UPLOADS_DIR) || fullPath === UPLOADS_DIR) {
            return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
        }

        // Check if folder is empty
        const contents = await readdir(fullPath)
        if (contents.length > 0) {
            return NextResponse.json({ error: 'Folder is not empty' }, { status: 400 })
        }

        await rmdir(fullPath)

        return NextResponse.json({
            success: true,
            message: 'Folder deleted'
        })
    } catch (error) {
        console.error('Delete folder error:', error)
        return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 })
    }
}
