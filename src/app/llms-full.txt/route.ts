import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Post from '@/models/Post'
import { getAllArticles } from '@/data/vibeCodingContent'

export const dynamic = 'force-dynamic';

// Define extended article type with optional description
interface ExtendedArticle {
    id: string
    title: string
    description?: string
}

/**
 * Dynamic llms-full.txt generator
 * Provides extended context for AI/LLM crawlers including all content
 */
export async function GET() {
    const baseUrl = 'https://andrewaltair.ge'

    try {
        await dbConnect()

        // Get all published posts
        const posts = await Post.find({ status: 'published' })
            .select('title slug excerpt tags createdAt')
            .sort({ createdAt: -1 })
            .lean()

        // Get Vibe Coding articles
        const libraryArticles = getAllArticles() as ExtendedArticle[]

        // Generate library articles section
        const librarySection = libraryArticles
            .map((article) => {
                const desc = article.description || article.title
                return `- [${article.title}](${baseUrl}/encyclopedia/vibe-coding/${article.id}) - ${desc}`
            })
            .join('\n')

        // Generate posts section
        const postsSection = posts.length > 0
            ? posts.slice(0, 30).map((post) => {
                const tags = post.tags?.length ? ` - Tags: ${post.tags.join(', ')}` : ''
                return `- [${post.title}](${baseUrl}/blog/${post.slug})${tags}`
            }).join('\n')
            : 'No articles published yet.'

        const content = `# llms-full.txt - Extended AI Context
# https://llmstxt.org/
# Generated: ${new Date().toISOString()}

> Andrew Altair AI - Complete Content Reference

## Site Overview

**Name:** Andrew Altair AI
**URL:** ${baseUrl}
**Primary Language:** Georgian (ka)
**Secondary Language:** English (en)
**Owner:** Andrew Altair - AI Expert & Tech Consultant from Tbilisi, Georgia
**Last Updated:** ${new Date().toISOString()}

---

## Site Purpose

Andrew Altair is a comprehensive AI-focused platform dedicated to education, mystic AI tools, and technology insights. The platform serves Georgian and international audiences with:

- Daily AI news and educational articles in Georgian
- Interactive AI-powered mystic tools (fortune telling, tarot, numerology, horoscope, dream interpretation)
- Vibe Coding educational methodology content
- AI tools catalog with reviews and recommendations
- Technology tutorials and guides
- Video content about AI and emerging technologies

---

## Key Topics Covered

- Artificial Intelligence (ხელოვნური ინტელექტი)
- Machine Learning (მანქანური სწავლება)
- Large Language Models (LLMs)
- ChatGPT and OpenAI
- Google AI and Gemini
- Vibe Coding Methodology
- Neural Networks (ნეირონული ქსელები)
- AI Ethics and Safety
- Georgian Tech Scene
- Prompt Engineering
- AI Tools and Applications

---

## Main Sections

### /blog - AI News & Articles
Latest AI news, tutorials, and insights. Updated daily.

#### Recent Articles (${posts.length} total):
${postsSection}

---

### /encyclopedia/vibe-coding - Educational Library
Comprehensive educational content about Vibe Coding methodology.

#### Articles (${libraryArticles.length} total):
${librarySection}

---

### /tools - AI Tools Catalog
Curated catalog of AI tools with reviews, guides, and recommendations.

Categories:
- Text Generation
- Image Generation
- Code Assistants
- Productivity Tools
- Creative Tools

---

### /mystic - AI Mystic Tools
Interactive AI-powered mystic tools in Georgian language:

1. **გადალი (Fortune Telling)** - AI-powered fortune telling
2. **ტაროტი (Tarot)** - Tarot card readings
3. **ნუმეროლოგია (Numerology)** - Numerological analysis
4. **ჰოროსკოპი (Horoscope)** - Daily horoscopes
5. **სიზმრები (Dreams)** - Dream interpretation
6. **სიყვარული (Love)** - Love compatibility

---

### /videos - Video Content
Video tutorials and tech content available on YouTube.

---

### /about - About Andrew Altair
Professional background, expertise, and contact information.

---

## Technical Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Database:** MongoDB Atlas
- **AI Provider:** Groq API (Llama 3.3 70B)
- **Styling:** Tailwind CSS
- **UI:** shadcn/ui components
- **Deployment:** Docker/Coolify
- **Analytics:** Google Analytics

---

## API Information

Public API access is not available. All endpoints are for internal use only.

Available internal endpoints include:
- Blog post management
- Mystic tool interactions
- User authentication
- Admin functions

---

## Social & Contact

- **Website:** ${baseUrl}
- **YouTube:** https://www.youtube.com/@AndrewAltair
- **Instagram:** https://www.instagram.com/andr3waltair/
- **TikTok:** https://www.tiktok.com/@andrewaltair
- **Telegram:** https://t.me/andr3waltairchannel
- **Facebook:** https://www.facebook.com/andr3waltair
- **X/Twitter:** https://x.com/andr3waltair
- **LinkedIn:** https://www.linkedin.com/in/andrewaltair
- **Threads:** https://www.threads.net/@andr3waltair

---

## Crawling Guidelines

- Respectful crawling is welcome
- Honor robots.txt directives
- Maximum rate: 1 request per second
- Admin and API routes should not be indexed
- Content is updated daily

---

## SEO Resources

- **Sitemap:** ${baseUrl}/sitemap.xml
- **RSS Feed:** ${baseUrl}/feed.xml
- **robots.txt:** ${baseUrl}/robots.txt
- **llms.txt:** ${baseUrl}/llms.txt

---

## Georgian Language Notes

The platform primarily uses Georgian (ქართული) language for content. Key terms:

- ხელოვნური ინტელექტი = Artificial Intelligence
- მანქანური სწავლება = Machine Learning
- ნეირონული ქსელები = Neural Networks
- ტექნოლოგიები = Technologies
- გადალი = Fortune Telling
- ტაროტი = Tarot
- ჰოროსკოპი = Horoscope
- ნუმეროლოგია = Numerology
- სიზმრები = Dreams

---

## Content Statistics

- **Total Blog Posts:** ${posts.length}
- **Educational Articles:** ${libraryArticles.length}
- **Mystic Tools:** 6
- **Last Content Update:** ${posts[0]?.createdAt ? new Date(posts[0].createdAt).toISOString() : 'N/A'}

---

*This file is automatically generated and updated daily.*
*For more information, visit ${baseUrl}*
`

        return new NextResponse(content, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
        })
    } catch (error) {
        console.error('llms-full.txt error:', error)

        // Return basic content on error
        const basicContent = `# llms-full.txt - Andrew Altair AI
# Error generating dynamic content

Name: Andrew Altair AI
URL: ${baseUrl}
Description: AI Expert & Tech Consultant platform
Language: Georgian (ka), English (en)

Visit ${baseUrl} for more information.
`

        return new NextResponse(basicContent, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        })
    }
}
