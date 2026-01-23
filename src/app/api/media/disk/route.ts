export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { readdir, stat, mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads')

// MIME types
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'avi']

interface FileInfo {
    name: string
    path: string
    url: string
    size: number
    sizeFormatted: string
    type: 'image' | 'video' | 'other'
    extension: string
    modifiedAt: string
    folder: string
}

interface FolderInfo {
    name: string
    path: string
    fileCount: number
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
}

function getFileType(ext: string): 'image' | 'video' | 'other' {
    const lower = ext.toLowerCase()
    if (IMAGE_EXTENSIONS.includes(lower)) return 'image'
    if (VIDEO_EXTENSIONS.includes(lower)) return 'video'
    return 'other'
}

// Recursively scan directory
async function scanDirectory(dir: string, relativeTo: string = UPLOADS_DIR): Promise<{ files: FileInfo[], folders: FolderInfo[] }> {
    const files: FileInfo[] = []
    const folders: FolderInfo[] = []

    try {
        const entries = await readdir(dir, { withFileTypes: true })

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name)
            const relativePath = path.relative(relativeTo, fullPath).replace(/\\/g, '/')

            if (entry.isDirectory()) {
                // Recursively scan subdirectory
                const subScan = await scanDirectory(fullPath, relativeTo)
                files.push(...subScan.files)
                folders.push({
                    name: entry.name,
                    path: relativePath,
                    fileCount: subScan.files.length
                })
                folders.push(...subScan.folders)
            } else {
                const fileStat = await stat(fullPath)
                const ext = path.extname(entry.name).slice(1).toLowerCase()
                const fileType = getFileType(ext)

                // Only include images and videos
                if (fileType !== 'other') {
                    const folderPath = path.dirname(relativePath)
                    files.push({
                        name: entry.name,
                        path: relativePath,
                        url: `/api/files/${relativePath}`,
                        size: fileStat.size,
                        sizeFormatted: formatBytes(fileStat.size),
                        type: fileType,
                        extension: ext,
                        modifiedAt: fileStat.mtime.toISOString(),
                        folder: folderPath === '.' ? '' : folderPath
                    })
                }
            }
        }
    } catch (error) {
        console.error('Error scanning directory:', error)
    }

    return { files, folders }
}

// GET - Scan disk and return all files
export async function GET(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return unauthorizedResponse('Admin access required')
        }

        // Ensure uploads directory exists
        try {
            await stat(UPLOADS_DIR)
        } catch {
            await mkdir(UPLOADS_DIR, { recursive: true })
        }

        const { searchParams } = new URL(request.url)
        const folder = searchParams.get('folder') || ''

        const targetDir = folder ? path.join(UPLOADS_DIR, folder) : UPLOADS_DIR
        const { files, folders } = await scanDirectory(targetDir, UPLOADS_DIR)

        // Sort files by modified date (newest first)
        files.sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime())

        // Get unique top-level folders
        const topLevelFolders = folders.filter(f => !f.path.includes('/'))

        return NextResponse.json({
            files,
            folders: topLevelFolders,
            currentFolder: folder,
            totalFiles: files.length,
            totalSize: formatBytes(files.reduce((sum, f) => sum + f.size, 0))
        })
    } catch (error) {
        console.error('Disk scan error:', error)
        return NextResponse.json({ error: 'Failed to scan disk' }, { status: 500 })
    }
}

// POST - Upload new file
export async function POST(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return unauthorizedResponse('Admin access required')
        }

        const formData = await request.formData()
        const file = formData.get('file') as File
        const folder = (formData.get('folder') as string) || ''

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Validate file type
        const ext = file.name.split('.').pop()?.toLowerCase() || ''
        if (!IMAGE_EXTENSIONS.includes(ext) && !VIDEO_EXTENSIONS.includes(ext)) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
        }

        // Create target directory
        const targetDir = folder ? path.join(UPLOADS_DIR, folder) : UPLOADS_DIR
        await mkdir(targetDir, { recursive: true })

        // Generate unique filename
        const timestamp = Date.now()
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-')
        const filename = `${timestamp}-${safeName}`
        const filePath = path.join(targetDir, filename)

        // Write file
        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(filePath, buffer)

        const relativePath = path.relative(UPLOADS_DIR, filePath).replace(/\\/g, '/')

        return NextResponse.json({
            success: true,
            file: {
                name: filename,
                path: relativePath,
                url: `/api/files/${relativePath}`,
                size: buffer.length,
                sizeFormatted: formatBytes(buffer.length),
                type: getFileType(ext),
                extension: ext
            }
        })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}
