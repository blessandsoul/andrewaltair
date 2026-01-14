import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import dbConnect from '@/lib/db'
import Post from '@/models/Post'
import RepoPostClient from './RepoPostClient'

// Fetch post directly
async function getPost(slug: string) {
    try {
        await dbConnect()

        const post = await Post.findOne({ slug, 'repository.url': { $exists: true } }).lean()

        if (!post) return { post: null, prevPost: null, nextPost: null }

        await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } })

        return {
            post: {
                ...post,
                id: post._id.toString(),
                _id: post._id.toString(),
                views: (post.views || 0) + 1,
                createdAt: post.createdAt?.toISOString(),
                updatedAt: post.updatedAt?.toISOString(),
                publishedAt: post.publishedAt instanceof Date ? post.publishedAt.toISOString() : post.publishedAt,
            },
            prevPost: null, // Basic navigation for now
            nextPost: null
        }
    } catch (error) {
        console.error('Error fetching repo post:', error)
        return { post: null, prevPost: null, nextPost: null }
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const { post } = await getPost(slug)

    if (!post) return { title: 'პროექტი არ მოიძებნა | Andrew Altair' }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge'
    let imageUrl = post.coverImages?.horizontal || post.coverImage

    if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `${siteUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
    } else if (!imageUrl) {
        imageUrl = `${siteUrl}/default-og.jpg`
    }

    const seoDescription = post.seo?.metaDescription || post.excerpt

    return {
        title: `${post.title} | GitHub Repository`,
        description: seoDescription,
        openGraph: {
            title: post.title,
            description: seoDescription,
            url: `${siteUrl}/repositories/${slug}`,
            images: [{ url: imageUrl }],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: seoDescription,
            images: [imageUrl],
        }
    }
}

export default async function RepoPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const { post, prevPost, nextPost } = await getPost(slug)

    if (!post) {
        return notFound()
    }

    return (
        <article>
            <RepoPostClient
                post={post}
                prevPost={prevPost}
                nextPost={nextPost}
                relatedPosts={[]}
            />
        </article>
    )
}
