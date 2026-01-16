/**
 * IndexNow Helper - Auto-submit URLs to search engines
 * This helper is called automatically when content is created or updated
 */

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'indexnow-key-andrewaltair'
const BASE_URL = 'https://andrewaltair.ge'

export interface IndexNowResult {
    success: boolean
    submitted: number
    endpoints: number
    errors?: string[]
}

/**
 * Submit URLs to IndexNow for instant indexing
 * @param urls - Array of URLs or paths to submit
 * @returns Result object with submission status
 */
export async function submitToIndexNow(urls: string[]): Promise<IndexNowResult> {
    if (!urls || urls.length === 0) {
        return { success: true, submitted: 0, endpoints: 0 }
    }

    // Normalize URLs - ensure they're absolute
    const normalizedUrls = urls.map(url =>
        url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`
    )

    const endpoints = [
        'https://api.indexnow.org/indexnow',
        'https://www.bing.com/indexnow',
        'https://yandex.com/indexnow',
    ]

    const errors: string[] = []
    let successCount = 0

    const results = await Promise.allSettled(
        endpoints.map(async (endpoint) => {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        host: 'andrewaltair.ge',
                        key: INDEXNOW_KEY,
                        keyLocation: `${BASE_URL}/api/indexnow`,
                        urlList: normalizedUrls,
                    }),
                })

                if (response.ok || response.status === 200 || response.status === 202) {
                    successCount++
                    return { endpoint, success: true }
                } else {
                    errors.push(`${endpoint}: ${response.status}`)
                    return { endpoint, success: false }
                }
            } catch (error) {
                errors.push(`${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`)
                return { endpoint, success: false }
            }
        })
    )

    console.log(`[IndexNow] Submitted ${normalizedUrls.length} URL(s) to ${successCount}/${endpoints.length} endpoints`)

    return {
        success: successCount > 0,
        submitted: normalizedUrls.length,
        endpoints: successCount,
        errors: errors.length > 0 ? errors : undefined
    }
}

/**
 * Submit a single blog post URL
 */
export async function indexBlogPost(slug: string): Promise<IndexNowResult> {
    return submitToIndexNow([`/blog/${slug}`])
}

/**
 * Submit a single prompt URL
 */
export async function indexPrompt(slug: string): Promise<IndexNowResult> {
    return submitToIndexNow([`/prompts/${slug}`])
}

/**
 * Submit a single video URL
 */
export async function indexVideo(id: string): Promise<IndexNowResult> {
    return submitToIndexNow([`/videos/${id}`])
}

/**
 * Submit homepage and main pages (call after major site updates)
 */
export async function indexMainPages(): Promise<IndexNowResult> {
    return submitToIndexNow([
        '/',
        '/blog',
        '/prompts',
        '/services',
        '/videos',
        '/encyclopedia/vibe-coding',
        '/mystic',
        '/bots',
    ])
}
