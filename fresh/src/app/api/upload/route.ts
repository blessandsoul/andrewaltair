import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// Generate slug from text (Georgian transliteration)
function generateSlug(text: string): string {
    const geo: Record<string, string> = {
        'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v', 'ზ': 'z',
        'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm', 'ნ': 'n', 'ო': 'o',
        'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's', 'ტ': 't', 'უ': 'u', 'ფ': 'p',
        'ქ': 'q', 'ღ': 'gh', 'ყ': 'y', 'შ': 'sh', 'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz',
        'წ': 'ts', 'ჭ': 'ch', 'ხ': 'kh', 'ჯ': 'j', 'ჰ': 'h'
    }

    let slug = text.toLowerCase()
    for (const [char, lat] of Object.entries(geo)) {
        slug = slug.replace(new RegExp(char, 'g'), lat)
    }

    return slug
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .slice(0, 60)
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const title = formData.get('title') as string || 'untitled'
        const type = formData.get('type') as string || 'horizontal' // 'horizontal' or 'vertical'

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            )
        }

        // Generate SEO-friendly filename
        const slug = generateSlug(title)
        const ext = file.name.split('.').pop() || 'jpg'
        const date = new Date()
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')

        // Final filename: slug-type.ext (e.g., neuralink-maski-horizontal.jpg)
        const filename = `${slug}-${type}.${ext}`

        // Upload path: public/uploads/YYYY/MM/
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', String(year), month)
        const filePath = path.join(uploadDir, filename)

        // Ensure directory exists
        await mkdir(uploadDir, { recursive: true })

        // Write file
        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(filePath, buffer)

        // Return public URL
        const publicUrl = `/uploads/${year}/${month}/${filename}`

        return NextResponse.json({
            success: true,
            url: publicUrl,
            filename,
            type
        })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Upload failed' },
            { status: 500 }
        )
    }
}
