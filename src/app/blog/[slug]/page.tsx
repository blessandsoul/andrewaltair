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
