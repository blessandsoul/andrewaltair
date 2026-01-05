import { getPostBySlug } from '@/lib/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = getPostBySlug(slug)

    if (!post) {
        return {
            title: 'Post Not Found',
        }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge';
    const ogImage = post.frontmatter.image
        ? (post.frontmatter.image.startsWith('http') ? post.frontmatter.image : `${siteUrl}${post.frontmatter.image}`)
        : `${siteUrl}/images/default-og.jpg`;

    return {
        title: `${post.frontmatter.title} | Andrew Altair`,
        description: post.frontmatter.description || 'AI Prompt & Tech News',
        openGraph: {
            title: post.frontmatter.title,
            description: post.frontmatter.description,
            url: `${siteUrl}/library/${slug}`,
            siteName: 'Andrew Altair AI',
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: post.frontmatter.title,
                },
            ],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: post.frontmatter.title,
            description: post.frontmatter.description,
            images: [ogImage],
        },
    }
}

export default async function LibraryPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = getPostBySlug(slug)

    if (!post) {
        notFound()
    }

    return (
        <div className="min-h-screen py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    უკან დაბრუნება
                </Link>

                <div className="mb-8 space-y-4">
                    {post.frontmatter.tags && (
                        <div className="flex gap-2 flex-wrap">
                            {post.frontmatter.tags.map((tag: string) => (
                                <Badge key={tag} variant="secondary">#{tag}</Badge>
                            ))}
                        </div>
                    )}

                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                        {post.frontmatter.title}
                    </h1>

                    <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {post.frontmatter.date}
                        </span>
                        <span>•</span>
                        <span>{post.frontmatter.author}</span>
                    </div>
                </div>

                {post.frontmatter.image && (
                    <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/10">
                        <Image
                            src={post.frontmatter.image}
                            alt={post.frontmatter.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-pre:bg-secondary prose-pre:border prose-pre:border-white/10">
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                '@context': 'https://schema.org',
                                '@type': 'TechArticle',
                                headline: post.frontmatter.title,
                                description: post.frontmatter.description,
                                image: post.frontmatter.image ? [`${(process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge')}${post.frontmatter.image}`] : [],
                                datePublished: post.frontmatter.date,
                                author: {
                                    '@type': 'Person',
                                    name: 'Andrew Altair',
                                    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge',
                                },
                                identifier: post.frontmatter.id,
                            })
                        }}
                    />
                    <MDXRemote source={post.content} />
                </article>
            </div>
        </div>
    )
}
