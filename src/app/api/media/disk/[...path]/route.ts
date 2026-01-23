export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { unlink, rename, stat, mkdir } from 'fs/promises'
import path from 'path'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads')

// Security: validate path is within uploads directory
function validatePath(filePath: string): string | null {
    const fullPath = path.join(UPLOADS_DIR, filePath)
    const normalizedPath = path.normalize(fullPath)

    if (!normalizedPath.startsWith(UPLOADS_DIR)) {
        return null // Path traversal attempt
    }

    return normalizedPath
}

// DELETE - Delete a file
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        if (!verifyAdmin(request)) {
            return unauthorizedResponse('Admin access required')
        }

        const { path: pathParts } = await params
        const relativePath = pathParts.join('/')
        const fullPath = validatePath(relativePath)

        if (!fullPath) {
            return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
        }

        // Check file exists
        try {
            await stat(fullPath)
        } catch {
            return NextResponse.json({ error: 'File not found' }, { status: 404 })
        }

        // Delete file
        await unlink(fullPath)

        return NextResponse.json({
            success: true,
            message: 'File deleted',
            path: relativePath
        })
    } catch (error) {
        console.error('Delete error:', error)
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }
}

// PATCH - Rename or move a file
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        if (!verifyAdmin(request)) {
            return unauthorizedResponse('Admin access required')
        }

        const { path: pathParts } = await params
        const relativePath = pathParts.join('/')
        const fullPath = validatePath(relativePath)

        if (!fullPath) {
            return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
        }

        const body = await request.json()
        const { newName, newFolder } = body

        // Check source file exists
        try {
            await stat(fullPath)
        } catch {
            return NextResponse.json({ error: 'File not found' }, { status: 404 })
        }

        let newPath: string
        const currentDir = path.dirname(fullPath)
        const currentName = path.basename(fullPath)

        if (newFolder !== undefined) {
            // Moving to different folder
            const targetDir = newFolder ? path.join(UPLOADS_DIR, newFolder) : UPLOADS_DIR

            // Validate target directory is within uploads
            if (!path.normalize(targetDir).startsWith(UPLOADS_DIR)) {
                return NextResponse.json({ error: 'Invalid target folder' }, { status: 400 })
            }

            // Create target directory if needed
            await mkdir(targetDir, { recursive: true })

            newPath = path.join(targetDir, newName || currentName)
        } else if (newName) {
            // Just renaming in same folder
            newPath = path.join(currentDir, newName)
        } else {
            return NextResponse.json({ error: 'No changes specified' }, { status: 400 })
        }

        // Validate new path
        if (!path.normalize(newPath).startsWith(UPLOADS_DIR)) {
            return NextResponse.json({ error: 'Invalid target path' }, { status: 400 })
        }

        // Perform rename/move
        await rename(fullPath, newPath)

        const newRelativePath = path.relative(UPLOADS_DIR, newPath).replace(/\\/g, '/')

        return NextResponse.json({
            success: true,
            message: newFolder !== undefined ? 'File moved' : 'File renamed',
            oldPath: relativePath,
            newPath: newRelativePath,
            url: `/api/files/${newRelativePath}`
        })
    } catch (error) {
        console.error('Rename/move error:', error)
        return NextResponse.json({ error: 'Operation failed' }, { status: 500 })
    }
}
