import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TbArrowLeft } from "react-icons/tb"
import BlogPostClient from "./BlogPostClient"
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostService } from "@/services/post.service"

// 1. DYNAMIC METADATA (Crucial for Google & Facebook)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await PostService.getPostBySlug(slug)

  if (!post) return { title: 'სტატია არ მოიძებნა | Andrew Altair' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge'
  // Use the new coverImages structure if available, fallback to coverImage, then default
  let imageUrl = post.coverImages?.horizontal || post.coverImage

  // Ensure absolute URL
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
    imageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(post.title)}&type=post&date=${date}`;
    if (post.categories?.length) {
      imageUrl += `&tags=${encodeURIComponent(post.categories.join(','))}`;
    }
  }

  // Use telegramContent as SEO description fallback (shorter, optimized for social)
  const seoDescription = post.seo?.metaDescription || post.excerpt || post.telegramContent?.slice(0, 160) || post.title

  return {
    title: `${post.title} | Andrew Altair`,
    description: seoDescription,
    openGraph: {
      title: post.title,
      description: seoDescription,
      url: `${siteUrl}/blog/${slug}`,
      images: [{ url: imageUrl }],
      type: 'article',
      siteName: 'Andrew Altair',
      authors: [post.author?.name || 'Andrew Altair'],
      publishedTime: post.publishedAt as string,
      modifiedTime: post.updatedAt as string,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: seoDescription,
      images: [imageUrl],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Fetch post
  const rawPost = await PostService.getPostBySlug(slug)

  if (!rawPost) {
    return notFound()
  }

  // Increment views
  await PostService.incrementViews(rawPost._id)

  // Get adjacent posts
  const { prevPost, nextPost } = await PostService.getAdjacentPosts(rawPost)

  // Transform post for display (similar to what was done inside getPost, but less heavy)
  // Actually PostService.getPostBySlug returns lean object. 
  // We just need to make sure dates are strings if Client Component needs them.
  // The service returns lean() object so dates are likely Date objects unless we transform them.
  // BlogPostClient might expect strings.

  const post = {
    ...rawPost,
    views: (rawPost.views || 0) + 1,
    createdAt: rawPost.createdAt instanceof Date ? rawPost.createdAt.toISOString() : rawPost.createdAt,
    updatedAt: rawPost.updatedAt instanceof Date ? rawPost.updatedAt.toISOString() : rawPost.updatedAt,
    publishedAt: rawPost.publishedAt instanceof Date ? rawPost.publishedAt.toISOString() : rawPost.publishedAt,
  }

  const relatedPosts = await PostService.getRelatedPosts(slug, post.categories) // Pass categories for better recommendations
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge'
  let imageUrl = post.coverImages?.horizontal || post.coverImage
  if (imageUrl && imageUrl.includes('/api/files/')) {
    imageUrl = imageUrl.replace('/api/files/', '/uploads/')
  }
  imageUrl = imageUrl || `${siteUrl}/api/og?title=${encodeURIComponent(post.title)}&type=post`
  if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = `${siteUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle', // Google loves this for news
    headline: post.title,
    image: [imageUrl],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Andrew Altair',
      url: siteUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'Andrew Altair',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`
      }
    },
    description: post.excerpt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${slug}`
    }
  }

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
    // AI Knowledge Graph optimization
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
    // Speakable for future voice search
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.post-excerpt', '.key-takeaways']
    }
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
      />
    </article>
  )
}
