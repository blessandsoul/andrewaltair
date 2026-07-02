import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TbArrowLeft } from "react-icons/tb"
import BlogPostClient from "./BlogPostClient"
import { AiNowPromo } from "@/components/ainow/AiNowPromo"
import { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { lookupRedirect, legacySlugById } from '@/lib/seo-redirects'
import { PostService } from "@/services/post.service"
import { getInitialComments, commentJsonLd } from "@/lib/server-comments"
import { stripBrand } from "@/lib/seo-title"
import ViewBeacon from "@/components/analytics/ViewBeacon"
import { safeJsonLd } from "@/lib/json-ld"

// ISR: render on demand, serve cached for 5 min. No generateStaticParams on
// purpose — pre-rendering ~200 posts at build OOMs the 1-CPU box. View counting
// moved to the /api/views beacon so this page stays cacheable (no DB write here).
export const revalidate = 300
export const dynamicParams = true

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

  // DB errors must surface as 500 (crawler retries later), only a truly
  // missing post may 404. notFound() here — before any streaming starts —
  // is what guarantees a real 404 status instead of a soft-404 200 shell.
  let post
  try {
    post = await PostService.getPostBySlug(slug)
  } catch (error) {
    console.error(`[generateMetadata] Error for /blog/${slug}:`, error)
    throw error
  }

  if (!post) {
    // migration-generated rename? (Redirect collection: timestamp/hyphen reslugs)
    const target = await lookupRedirect(`/blog/${slug}`)
    if (target) permanentRedirect(target)
    // legacy ObjectId URL still in Google's index → 301 to the canonical slug
    const legacySlug = await legacySlugById('post', slug)
    if (legacySlug) permanentRedirect(`/blog/${legacySlug}`)
    notFound()
  }

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
      // bare title — the root layout template appends "| Andrew Altair" once;
      // stripBrand collapses legacy DB metaTitles that already baked the brand in
      title: stripBrand(post.seo?.metaTitle || post.title),
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
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Existence check OUTSIDE any try/catch: notFound() throws NEXT_NOT_FOUND,
  // and a wrapping catch used to swallow/re-trigger it after streaming had
  // already flushed a 200 — producing soft-404s for every dead slug.
  // DB errors rethrow as 500 so crawlers retry instead of deindexing.
  let rawPost
  try {
    rawPost = await PostService.getPostBySlug(slug)
  } catch (error) {
    console.error(`[BlogPostPage] DB error for /blog/${slug}:`, error)
    throw error
  }

  if (!rawPost) {
    notFound()
  }

  // Enrichment is non-critical — each falls back to empty rather than failing the page
  const { prevPost, nextPost } = await PostService.getAdjacentPosts(rawPost)
    .catch(() => ({ prevPost: null, nextPost: null }))

  const rawRelatedPosts = await PostService.getRelatedPosts(slug, rawPost.categories || [])
    .catch(() => [])

    // ===== BULLETPROOF SERIALIZATION =====
    // JSON.parse(JSON.stringify()) guarantees all Date objects, ObjectIds, 
    // and any other non-serializable Mongoose artifacts are converted to plain JSON.
    // This prevents "Server Components render" errors in production.
    const post = JSON.parse(JSON.stringify({
      ...rawPost,
      views: rawPost.views || 0,
    }))

    const relatedPosts = JSON.parse(JSON.stringify(rawRelatedPosts))

    // SSR-seed AI-persona comments (SEO: text in HTML + JSON-LD)
    const initialComments = await getInitialComments(rawPost._id.toString()).catch(() => [])

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
          dangerouslySetInnerHTML={{ __html: safeJsonLd(newsArticleLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }}
        />
        {faqLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLd) }}
          />
        )}

        <ViewBeacon type="post" id={post._id || post.id} />
        <BlogPostClient
          post={post}
          prevPost={prevPost}
          nextPost={nextPost}
          relatedPosts={relatedPosts}
          initialComments={initialComments}
        />
        {/* aiNOW sister-brand promo at the end of every article (do-follow) */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <AiNowPromo variant="inline" context="blog" />
        </div>
      </article>
    )
}
