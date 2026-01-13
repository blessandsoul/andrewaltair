import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import path from 'path'

// MIME types for images
const MIME_TYPES: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path: pathParts } = await params

        // Reconstruct the file path
        const relativePath = pathParts.join('/')

        // Security: prevent path traversal attacks
        if (relativePath.includes('..') || relativePath.includes('\\')) {
            return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
        }

        const filePath = path.join(process.cwd(), 'public', 'uploads', relativePath)

        // Check if file exists
        try {
            await stat(filePath)
        } catch {
            // Return a transparent 1x1 PNG instead of JSON to avoid Next.js image optimization errors
            const transparentPng = Buffer.from(
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
                'base64'
            )
            return new NextResponse(transparentPng, {
                status: 404,
                headers: {
                    'Content-Type': 'image/png',
                    'Cache-Control': 'no-store',
                },
            })
        }

        // Read file
        const buffer = await readFile(filePath)

        // Get extension and MIME type
        const ext = path.extname(filePath).slice(1).toLowerCase()
        const contentType = MIME_TYPES[ext] || 'application/octet-stream'

        // Return file with proper headers
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Content-Length': buffer.length.toString(),
            },
        })

    } catch (error) {
        console.error('File serve error:', error)
        return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 })
    }
}
