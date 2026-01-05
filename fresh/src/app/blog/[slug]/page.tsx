import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TbArrowLeft } from "react-icons/tb"
import BlogPostClient from "./BlogPostClient"
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Fetch post from MongoDB API
async function getPost(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/posts/${slug}`, {
      next: { revalidate: 60 } // ✅ Updates content every 60 seconds max (ISR)
    })
    if (res.ok) {
      const data = await res.json()
      return {
        post: data.post,
        prevPost: data.prevPost || null,
        nextPost: data.nextPost || null
      }
    }
  } catch (error) {
    console.error('Error fetching post:', error)
  }
  return { post: null, prevPost: null, nextPost: null }
}

// Get related posts from MongoDB
async function getRelatedPosts(currentSlug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/posts?limit=3&status=published`, {
      next: { revalidate: 60 } // ✅ Cache related posts too
    })
    if (res.ok) {
      const data = await res.json()
      return (data.posts || []).filter((p: { slug: string }) => p.slug !== currentSlug).slice(0, 2)
    }
  } catch (error) {
    console.error('Error fetching related posts:', error)
  }
  return []
}

// 1. DYNAMIC METADATA (Crucial for Google & Facebook)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { post } = await getPost(slug)

  if (!post) return { title: 'სტატია არ მოიძებნა | Andrew Altair' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge'
  // Use the new coverImages structure if available, fallback to coverImage, then default
  const imageUrl = post.coverImages?.horizontal || post.coverImage || `${siteUrl}/default-og.jpg`

  return {
    title: `${post.title} | Andrew Altair`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${slug}`,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: 'article',
      siteName: 'Andrew Altair',
      authors: [post.author?.name || 'Andrew Altair'],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { post, prevPost, nextPost } = await getPost(slug)

  if (!post) {
    return notFound()
  }

  const relatedPosts = await getRelatedPosts(slug)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge'
  const imageUrl = post.coverImages?.horizontal || post.coverImage || `${siteUrl}/default-og.jpg`

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
        url: `${siteUrl}/logo.png` // Ensure this exists or use a valid path
      }
    },
    description: post.excerpt
  }

  return (
    <article>
      {/* Inject Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BlogPostClient
        post={post}
        prevPost={prevPost}
        nextPost={nextPost}
        relatedPosts={relatedPosts}
      />
    </article>
  )
}
