import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TbArrowLeft } from "react-icons/tb"
import BlogPostClient from "./BlogPostClient"
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostService } from "@/services/post.service"
import { getInitialComments, commentJsonLd } from "@/lib/server-comments"

function safeEncodeURIComponent(str: string): string {
  try {
    return encodeURIComponent(str)
  } catch {
    // Strip lone surrogates that cause URIError, then encode
    return encodeURIComponent(str.replace(/[\uD800-\uDFFF]/g, ''))
  }
}

// 1. DYNAMIC METADATA (Crucial for Google & Facebook)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params

  try {
    const post = await PostService.getPostBySlug(slug)

    if (!post) return { title: 'სტატია არ მოიძებნა | Andrew Altair' }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge'
    // Use the new coverImages structure if available, fallback to coverImage, then default
    let imageUrl = post.coverImages?.horizontal || post.coverImage

    // Ensure absolute URL and bypass API route for images
    if (imageUrl) {
      // If it's an API route image, convert to direct upload path for better performance/SEO
      if (imageUrl.includes('/api/files/')) {
        imageUrl = imageUrl.replace('/api/files/', '/uploads/')
      }

      if (!imageUrl.startsWith('http')) {
        imageUrl = `${siteUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
      }
    } else {
      // Dynamic OG Image Fallback
      const date = post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : '';
      imageUrl = `${siteUrl}/api/og?title=${safeEncodeURIComponent(post.title)}&type=post&date=${date}`;
      if (post.categories?.length) {
        imageUrl += `&tags=${safeEncodeURIComponent(post.categories.join(','))}`;
      }
    }

    // Use telegramContent as SEO description fallback (shorter, optimized for social)
    const seoDescription = post.seo?.metaDescription || post.excerpt || post.telegramContent?.slice(0, 160) || post.title

    const articleSection = post.categories?.[0]
    const keywordList = post.seo?.keywords
      ? post.seo.keywords.split(',').map((k: string) => k.trim()).filter(Boolean)
      : post.tags

    return {
      title: post.seo?.metaTitle || `${post.title} | Andrew Altair`,
      description: seoDescription,
      keywords: keywordList,
      authors: [{ name: post.author?.name || 'Andrew Altair', url: `${siteUrl}/about` }],
      openGraph: {
        title: post.title,
        description: seoDescription,
        url: `${siteUrl}/blog/${slug}`,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
        type: 'article',
        siteName: 'Andrew Altair',
        locale: 'ka_GE',
        authors: [post.author?.name || 'Andrew Altair'],
        publishedTime: post.publishedAt as string,
        modifiedTime: post.updatedAt as string,
        section: articleSection,
        tags: post.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: seoDescription,
        images: [imageUrl],
        site: '@andrewaltair',
        creator: '@andrewaltair',
      },
      alternates: {
        canonical: post.seo?.canonicalUrl || `${siteUrl}/blog/${slug}`,
      },
    }
  } catch (error) {
    console.error(`[generateMetadata] Error for /blog/${slug}:`, error)
    return { title: 'Andrew Altair | ბლოგი' }
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    // Fetch post
    const rawPost = await PostService.getPostBySlug(slug)

    if (!rawPost) {
      return notFound()
    }

    // Increment views (non-blocking, don't let it crash the page)
    PostService.incrementViews(rawPost._id).catch(() => { })

    // Get adjacent posts
    const { prevPost, nextPost } = await PostService.getAdjacentPosts(rawPost)

    // Get related posts
    const rawRelatedPosts = await PostService.getRelatedPosts(slug, rawPost.categories || [])

    // ===== BULLETPROOF SERIALIZATION =====
    // JSON.parse(JSON.stringify()) guarantees all Date objects, ObjectIds, 
    // and any other non-serializable Mongoose artifacts are converted to plain JSON.
    // This prevents "Server Components render" errors in production.
    const post = JSON.parse(JSON.stringify({
      ...rawPost,
      views: (rawPost.views || 0) + 1,
    }))

    const relatedPosts = JSON.parse(JSON.stringify(rawRelatedPosts))

    // SSR-seed AI-persona comments (SEO: text in HTML + JSON-LD)
    const initialComments = await getInitialComments(rawPost._id.toString())

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge'
    let imageUrl = post.coverImages?.horizontal || post.coverImage

    if (imageUrl && imageUrl.includes('/api/files/')) {
      imageUrl = imageUrl.replace('/api/files/', '/uploads/')
    }
    imageUrl = imageUrl || `${siteUrl}/api/og?title=${safeEncodeURIComponent(post.title)}&type=post`
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `${siteUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
    }

    const jsonLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: post.title,
      image: [imageUrl],
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      author: {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: post.author?.name || 'Andrew Altair',
        url: `${siteUrl}/about`
      },
      publisher: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Andrew Altair',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`
        }
      },
      description: post.excerpt,
      inLanguage: 'ka',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${siteUrl}/blog/${slug}`
      }
    }
    if (post.categories?.[0]) jsonLd.articleSection = post.categories[0]
    if (post.wordCount) jsonLd.wordCount = post.wordCount
    if (post.readingTime) jsonLd.timeRequired = `PT${post.readingTime}M`

    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: `${siteUrl}/blog`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: `${siteUrl}/blog/${slug}`
        }
      ]
    }

    // FAQ Schema
    const faqLd = post.faq && post.faq.length > 0 ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faq.map((item: any) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    } : null

    // Enhanced NewsArticle Schema
    const newsArticleLd = {
      ...jsonLd,
      keywords: post.seo?.keywords || post.tags?.join(', '),
      ...(post.entities && post.entities.length > 0 ? {
        about: post.entities.slice(0, 3).map((entity: string) => ({
          '@type': 'Thing',
          name: entity
        })),
        mentions: post.entities.map((entity: string) => ({
          '@type': 'Thing',
          name: entity
        }))
      } : {}),
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', '.post-excerpt', '.key-takeaways']
      },
      ...commentJsonLd(initialComments)
    }

    return (
      <article>
        {/* Inject Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        {faqLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
          />
        )}

        <BlogPostClient
          post={post}
          prevPost={prevPost}
          nextPost={nextPost}
          relatedPosts={relatedPosts}
          initialComments={initialComments}
        />
      </article>
    )
  } catch (error) {
    console.error(`[BlogPostPage] Error rendering /blog/${slug}:`, error)
    return notFound()
  }
}
