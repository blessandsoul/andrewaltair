import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TbArrowLeft } from "react-icons/tb"
import BlogPostClient from "./BlogPostClient"
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import dbConnect from '@/lib/db'
import Post from '@/models/Post'

// Fetch post directly from MongoDB (more reliable for SSR)
async function getPost(slug: string) {
  try {
    await dbConnect()

    const post = await Post.findOne({ slug }).lean()

    if (!post) return { post: null, prevPost: null, nextPost: null }

    // Increment views
    await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } })

    // Get previous and next posts for navigation
    const [prevPost, nextPost] = await Promise.all([
      Post.findOne({
        status: 'published',
        $or: [
          { order: { $lt: post.order } },
          { order: post.order, createdAt: { $gt: post.createdAt } }
        ]
      })
        .sort({ order: -1, createdAt: 1 })
        .select('slug title')
        .lean(),
      Post.findOne({
        status: 'published',
        $or: [
          { order: { $gt: post.order } },
          { order: post.order, createdAt: { $lt: post.createdAt } }
        ]
      })
        .sort({ order: 1, createdAt: -1 })
        .select('slug title')
        .lean()
    ])

    return {
      post: {
        ...post,
        id: post._id.toString(),
        _id: post._id.toString(),
        views: (post.views || 0) + 1,
        createdAt: post.createdAt?.toISOString(),
        updatedAt: post.updatedAt?.toISOString(),
        // publishedAt is usually already a string, but if it's a date in DB, convert it
        publishedAt: post.publishedAt instanceof Date ? post.publishedAt.toISOString() : post.publishedAt,
      },
      prevPost: prevPost ? { slug: prevPost.slug, title: prevPost.title } : null,
      nextPost: nextPost ? { slug: nextPost.slug, title: nextPost.title } : null
    }
  } catch (error) {
    console.error('Error fetching post:', error)
    return { post: null, prevPost: null, nextPost: null }
  }
}

// Get related posts from MongoDB
async function getRelatedPosts(currentSlug: string) {
  try {
    await dbConnect()
    const posts = await Post.find({
      status: 'published',
      slug: { $ne: currentSlug }
    })
      .sort({ createdAt: -1 })
      .limit(2)
      .lean()

    return posts.map((post) => ({
      ...post,
      id: post._id.toString(),
      _id: post._id.toString(),
    }))
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

// 1. DYNAMIC METADATA (Crucial for Google & Facebook)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { post } = await getPost(slug)

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
    imageUrl = `${siteUrl}/og.png`
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
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
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
  const { post, prevPost, nextPost } = await getPost(slug)

  if (!post) {
    return notFound()
  }

  const relatedPosts = await getRelatedPosts(slug)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge'
  let imageUrl = post.coverImages?.horizontal || post.coverImage
  if (imageUrl && imageUrl.includes('/api/files/')) {
    imageUrl = imageUrl.replace('/api/files/', '/uploads/')
  }
  imageUrl = imageUrl || `${siteUrl}/og.png`
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

  return (
    <article>
      {/* Inject Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
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
