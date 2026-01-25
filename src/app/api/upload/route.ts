export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { MediaService } from '@/services/media.service'

export async function POST(request: NextRequest) {
    try {
        // 🛡️ Require authentication (Admin only)
        const { verifyAdmin, unauthorizedResponse } = await import('@/lib/admin-auth');
        if (!verifyAdmin(request)) {
            return unauthorizedResponse('Admin access required');
        }

        const formData = await request.formData()
        const file = formData.get('file') as File
        const title = formData.get('title') as string || 'untitled'
        const type = formData.get('type') as string || 'horizontal'

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        const result = await MediaService.uploadFile(file, title, type);

        return NextResponse.json({
            success: true,
            ...result
        })

    } catch (error: any) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: error.message || 'Upload failed' },
            { status: 400 } // Service throws validation errors
        )
    }
}
