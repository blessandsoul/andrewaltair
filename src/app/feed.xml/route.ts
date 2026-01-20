import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Post from '@/models/Post'
import { getAllArticles } from '@/data/vibeCodingContent'

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = 'https://andrewaltair.ge'

  try {
    await dbConnect()

    // Get all published posts
    const posts = await Post.find({ status: 'published' })
      .select('title slug excerpt content createdAt updatedAt author')
      .sort({ createdAt: -1 })
      .lean()

    // Get Vibe Coding articles
    const libraryArticles = getAllArticles()

    const feedItems = posts.map((post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <author>Andrew Altair</author>
      <category>AI News</category>
    </item>`).join('')

    const libraryItems = libraryArticles.slice(0, 20).map((article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/encyclopedia/vibe-coding/${article.id}</link>
      <guid isPermaLink="true">${baseUrl}/encyclopedia/vibe-coding/${article.id}</guid>
      <description><![CDATA[${(article as unknown as { description?: string }).description || article.title}]]></description>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <author>Andrew Altair</author>
      <category>Vibe Coding</category>
    </item>`).join('')

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Andrew Altair AI</title>
    <link>${baseUrl}</link>
    <description>AI ინოვატორი და კონტენტ კრეატორი - ხელოვნური ინტელექტის ექსპერტი</description>
    <language>ka</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>Andrew Altair AI</title>
      <link>${baseUrl}</link>
    </image>
    <webMaster>contact@andrewaltair.ge (Andrew Altair)</webMaster>
    <copyright>© ${new Date().getFullYear()} Andrew Altair. All rights reserved.</copyright>
    <category>Technology</category>
    <category>Artificial Intelligence</category>
    <ttl>60</ttl>
    ${feedItems}
    ${libraryItems}
  </channel>
</rss>`

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('RSS Feed error:', error)

    // Return basic feed on error
    const basicRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Andrew Altair AI</title>
    <link>${baseUrl}</link>
    <description>AI ინოვატორი და კონტენტ კრეატორი</description>
    <language>ka</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`

    return new NextResponse(basicRss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    })
  }
}
