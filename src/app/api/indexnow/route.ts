import { NextRequest, NextResponse } from 'next/server'

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'indexnow-key-andrewaltair'

/**
 * IndexNow API route for instant search engine indexing
 * POST /api/indexnow - Submit URLs for indexing
 * GET /api/indexnow - Returns the IndexNow key for verification
 */

export async function GET() {
    return new NextResponse(INDEXNOW_KEY, {
        headers: { 'Content-Type': 'text/plain' },
    })
}

export async function POST(request: NextRequest) {
    try {
        const { urls } = await request.json()

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json(
                { error: 'URLs array is required' },
                { status: 400 }
            )
        }

        const baseUrl = 'https://andrewaltair.ge'

        // Submit to multiple IndexNow endpoints
        const endpoints = [
            'https://api.indexnow.org/indexnow',
            'https://www.bing.com/indexnow',
            'https://yandex.com/indexnow',
        ]

        const results = await Promise.allSettled(
            endpoints.map(async (endpoint) => {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        host: 'andrewaltair.ge',
                        key: INDEXNOW_KEY,
                        keyLocation: `${baseUrl}/api/indexnow`,
                        urlList: urls.map((url: string) =>
                            url.startsWith('http') ? url : `${baseUrl}${url}`
                        ),
                    }),
                })

                return {
                    endpoint,
                    status: response.status,
                    ok: response.ok,
                }
            })
        )

        const successCount = results.filter(
            (r) => r.status === 'fulfilled' && r.value.ok
        ).length

        return NextResponse.json({
            success: true,
            message: `Submitted to ${successCount}/${endpoints.length} endpoints`,
            results: results.map((r) =>
                r.status === 'fulfilled' ? r.value : { error: r.reason }
            ),
        })
    } catch (error) {
        console.error('IndexNow error:', error)
        return NextResponse.json(
            { error: 'Failed to submit to IndexNow' },
            { status: 500 }
        )
    }
}
