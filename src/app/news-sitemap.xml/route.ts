/**
 * Google News sitemap (sitemap-news/0.9 schema).
 *
 * Eligibility window: posts from the last 48h only — per Google spec
 * (https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap).
 * Older posts stay in the regular sitemap.xml.
 *
 * Why a separate route: NewsArticle JSON-LD alone is not enough to surface in
 * Google News carousels — Google News sources also expect a news-specific
 * sitemap with publication metadata.
 */
import dbConnect from '@/lib/db';
import Insight from '@/models/Insight';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SITE_URL = 'https://andrewaltair.ge';
const PUBLICATION_NAME = 'Andrew Altair';
const PUBLICATION_LANGUAGE = 'ka';
const WINDOW_MS = 48 * 60 * 60 * 1000; // 48h

function escapeXml(s: string): string {
    return (s ?? '').replace(/[<>&"']/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '"': return '&quot;';
            case "'": return '&apos;';
            default: return c;
        }
    });
}

interface InsightLean {
    slug: string;
    publishedAt: Date;
    sourceTitle?: string;
    seo?: { metaTitle?: string };
    tags?: string[];
    language?: 'ka' | 'en';
}

export async function GET() {
    try {
        await dbConnect();

        const cutoff = new Date(Date.now() - WINDOW_MS);

        const insights = (await Insight.find({
            status: 'published',
            publishedAt: { $gte: cutoff },
        })
            .select('slug publishedAt sourceTitle seo tags language')
            .sort({ publishedAt: -1 })
            .limit(1000) // News sitemap hard cap = 1000
            .lean()) as unknown as InsightLean[];

        const urlBlocks = insights
            .map((i) => {
                const title = escapeXml(i.seo?.metaTitle || i.sourceTitle || '');
                const publishedIso = new Date(i.publishedAt).toISOString();
                const lang = i.language === 'en' ? 'en' : PUBLICATION_LANGUAGE;
                const basePath = i.language === 'en' ? '/en/insights' : '/insights';
                const keywords = Array.isArray(i.tags) && i.tags.length > 0
                    ? `\n      <news:keywords>${escapeXml(i.tags.slice(0, 10).join(', '))}</news:keywords>`
                    : '';
                return `  <url>
    <loc>${SITE_URL}${basePath}/${escapeXml(i.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(PUBLICATION_NAME)}</news:name>
        <news:language>${lang}</news:language>
      </news:publication>
      <news:publication_date>${publishedIso}</news:publication_date>
      <news:title>${title}</news:title>${keywords}
    </news:news>
  </url>`;
            })
            .join('\n');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlBlocks}
</urlset>`;

        return new Response(xml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 's-maxage=600, stale-while-revalidate=300',
            },
        });
    } catch (error) {
        console.error('[news-sitemap] generation failed:', error);
        return new Response(
            `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
</urlset>`,
            {
                status: 200,
                headers: { 'Content-Type': 'application/xml; charset=utf-8' },
            }
        );
    }
}
