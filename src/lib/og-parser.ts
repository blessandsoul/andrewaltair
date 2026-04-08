import fs from 'fs';
import path from 'path';

interface OGParseResult {
    title: string;
    image: string;
    domain: string;
    description: string;
}

/**
 * Fetch a URL and extract Open Graph metadata.
 * Downloads og:image locally to public/uploads/insights/.
 */
export async function parseSourceUrl(url: string): Promise<OGParseResult> {
    const domain = extractDomain(url);
    let title = '';
    let image = '';
    let description = '';

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; AndrewAltairBot/1.0)',
                'Accept': 'text/html',
            },
            signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
            return { title: '', image: '', domain, description: '' };
        }

        const html = await response.text();

        title = extractMeta(html, 'og:title') || extractHtmlTitle(html) || '';
        image = extractMeta(html, 'og:image') || '';
        description = extractMeta(html, 'og:description') || '';

        // Download og:image locally
        if (image) {
            const localPath = await downloadImage(image, domain);
            if (localPath) {
                image = localPath;
            }
        }
    } catch (error) {
        console.error('[og-parser] Failed to parse:', url, error);
    }

    return { title, image, domain, description };
}

/**
 * Extract meta content by property name from raw HTML.
 */
function extractMeta(html: string, property: string): string {
    // Match both property="og:..." and name="og:..."
    const patterns = [
        new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i'),
        new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`, 'i'),
    ];

    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match?.[1]) return match[1];
    }
    return '';
}

/**
 * Extract <title> tag content as fallback.
 */
function extractHtmlTitle(html: string): string {
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return match?.[1]?.trim() || '';
}

/**
 * Extract domain from URL.
 */
function extractDomain(url: string): string {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return '';
    }
}

/**
 * Download image to public/uploads/insights/YYYY-MM/ and return local path.
 */
async function downloadImage(imageUrl: string, domain: string): Promise<string | null> {
    try {
        // Resolve relative URLs
        let fullUrl = imageUrl;
        if (imageUrl.startsWith('//')) {
            fullUrl = `https:${imageUrl}`;
        } else if (imageUrl.startsWith('/')) {
            fullUrl = `https://${domain}${imageUrl}`;
        }

        const response = await fetch(fullUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AndrewAltairBot/1.0)' },
            signal: AbortSignal.timeout(15000),
        });

        if (!response.ok) return null;

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.startsWith('image/')) return null;

        const buffer = Buffer.from(await response.arrayBuffer());

        // Determine extension
        const ext = contentType.includes('png') ? '.png'
            : contentType.includes('webp') ? '.webp'
            : contentType.includes('gif') ? '.gif'
            : '.jpg';

        // Create directory: public/uploads/insights/YYYY-MM/
        const now = new Date();
        const yearMonth = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
        const dirPath = path.join(process.cwd(), 'public', 'uploads', 'insights', yearMonth);
        fs.mkdirSync(dirPath, { recursive: true });

        // Generate filename from domain + timestamp
        const safeDomain = domain.replace(/[^a-z0-9]/g, '-');
        const filename = `${safeDomain}-${Date.now()}${ext}`;
        const filePath = path.join(dirPath, filename);

        fs.writeFileSync(filePath, buffer);

        // Return path relative to public (for serving via /api/files/ or /uploads/)
        return `/uploads/insights/${yearMonth}/${filename}`;
    } catch (error) {
        console.error('[og-parser] Image download failed:', error);
        return null;
    }
}
