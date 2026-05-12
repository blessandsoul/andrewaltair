import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Video from '@/models/Video';
import { toDurationSeconds, xmlEscape, youtubeThumbnail } from '@/lib/video';

export const dynamic = 'force-dynamic';

/**
 * Google Video Sitemap — emits one `<url>` per video with full `<video:video>`
 * payload (thumbnail, title, description, content_loc, player_loc, duration,
 * publication_date). Crawls separately from the general sitemap so video pages
 * show up in Google's "Video" search vertical.
 *
 * Schema: https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps
 */
export async function GET() {
    const baseUrl = 'https://andrewaltair.ge';

    try {
        await dbConnect();
        const videos = await Video.find({}).sort({ publishedAt: -1 }).lean();

        const urls = videos.map((v: any) => {
            const id = String(v._id);
            const pageUrl = `${baseUrl}/videos/${id}`;
            const thumb = v.thumbnail || youtubeThumbnail(v.youtubeId);
            const title = xmlEscape((v.title || 'Andrew Altair video').slice(0, 100));
            const rawDesc = (v.description || v.title || 'Andrew Altair video').slice(0, 2048);
            const description = xmlEscape(rawDesc);
            const playerUrl = `https://www.youtube.com/embed/${v.youtubeId}`;
            const watchUrl = `https://www.youtube.com/watch?v=${v.youtubeId}`;
            const pubDate = v.publishedAt
                ? new Date(v.publishedAt).toISOString()
                : new Date(v.createdAt || Date.now()).toISOString();
            const durationSeconds = toDurationSeconds(v.duration);
            const durationTag = durationSeconds > 0 ? `\n      <video:duration>${durationSeconds}</video:duration>` : '';

            return `  <url>
    <loc>${pageUrl}</loc>
    <video:video>
      <video:thumbnail_loc>${xmlEscape(thumb)}</video:thumbnail_loc>
      <video:title>${title}</video:title>
      <video:description>${description}</video:description>
      <video:content_loc>${xmlEscape(watchUrl)}</video:content_loc>
      <video:player_loc allow_embed="yes">${xmlEscape(playerUrl)}</video:player_loc>${durationTag}
      <video:publication_date>${pubDate}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:requires_subscription>no</video:requires_subscription>
      <video:live>no</video:live>
    </video:video>
  </url>`;
        });

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.join('\n')}
</urlset>`;

        return new NextResponse(xml, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
        });
    } catch (error) {
        console.error('Video sitemap error:', error);
        const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
</urlset>`;
        return new NextResponse(emptyXml, {
            status: 200,
            headers: { 'Content-Type': 'application/xml; charset=utf-8' },
        });
    }
}
