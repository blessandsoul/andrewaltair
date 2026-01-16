"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    TbArrowLeft, TbEye, TbCalendar, TbShare, TbHeart,
    TbBrandGithub, TbStar, TbGitFork, TbExternalLink
} from "react-icons/tb"
import { useEffect, useState } from "react"
import {
    ReactionBar,
    ShareButtons,
    Comments,
    ReadingProgress,
    TableOfContents,
    BookmarkButton,
    EnhancedContent
} from "@/components/interactive"
import { ImageLightbox, useImageLightbox } from "@/components/interactive/ImageLightbox"
import { PostNavigation } from "@/components/blog/PostNavigation"
import { RichPostContent } from "@/components/blog/RichPostContent"
import { ResponsiveCover } from "@/components/blog/ResponsiveCover"
import { PostGallery } from "@/components/blog/PostGallery"
import { brand } from "@/lib/brand"
import { getLanguageColor } from "@/lib/language-colors"

// Reusing interfaces from BlogPostClient (or redefining if necessary)
// For simplicity, reusing a similar structure but typing specifically for Repo
interface Section {
    emoji?: string;
    title?: string;
    content: string;
    type: 'intro' | 'section' | 'sarcasm' | 'warning' | 'tip' | 'fact' | 'opinion' | 'cta' | 'hashtags';
}

interface CoverImages {
    horizontal?: string;
    vertical?: string;
}

interface GalleryImage {
    src: string;
    alt?: string;
    caption?: string;
}

interface VideoEmbed {
    url: string
    platform: 'youtube' | 'vimeo'
    videoId?: string
    thumbnailUrl?: string
}

interface RepoData {
    type: 'github' | 'gitlab' | 'other'
    url: string
    name: string
    description: string
    stars: number
    forks: number
    language: string
    topics: string[]
}

interface Post {
    id: string
    numericId?: string
    slug: string
    title: string
    excerpt: string
    content?: string
    rawContent?: string
    categories: string[]
    coverImage?: string
    coverImages?: CoverImages
    gallery?: GalleryImage[]
    sections?: Section[]
    videos?: VideoEmbed[]
    relatedPosts?: string[]
    tags: string[]
    author: {
        name: string
        avatar?: string
        role?: string
    }
    publishedAt: string
    readingTime: number
    views: number
    comments: number
    shares: number
    reactions: Record<string, number>
    featured?: boolean
    trending?: boolean
    repository?: RepoData
}

interface RepoPostClientProps {
    post: Post
    prevPost: { slug: string; title: string } | null
    nextPost: { slug: string; title: string } | null
    relatedPosts: any[]
}

export default function RepoPostClient({ post, prevPost, nextPost, relatedPosts }: RepoPostClientProps) {
    const { isOpen, images, currentIndex, openLightbox, closeLightbox } = useImageLightbox()
    const [articleImages, setArticleImages] = useState<{ src: string; alt: string }[]>([])
    const { repository } = post

    // Extract images from content for lightbox (EXCLUDING gallery/thumbnails/background)
    useEffect(() => {
        const timer = setTimeout(() => {
            const article = document.querySelector("article")
            if (!article) return

            const imgs = article.querySelectorAll("img")
            const imageData: { src: string; alt: string }[] = []

            imgs.forEach((img, index) => {
                // Skip images that are part of gallery, thumbnails, or backgrounds
                const parent = img.closest('.post-gallery, .blur-3xl, .blur-2xl, [class*="blur-"], [class*="thumbnail"], [class*="thumb"]')
                if (parent) return

                // Skip images with blur classes
                if (img.classList.contains('blur-3xl') || img.classList.contains('blur-2xl') || img.classList.contains('scale-125')) return

                // Skip very small images (likely thumbnails or icons)
                const width = img.getBoundingClientRect().width
                if (width < 100) return

                const src = img.getAttribute("src") || ""
                const alt = img.getAttribute("alt") || ""

                // Skip empty src or "Background blur" type images
                if (!src || alt.toLowerCase().includes('blur') || alt.toLowerCase().includes('background')) return

                imageData.push({ src, alt })

                // Add click handler to each valid image
                img.style.cursor = "zoom-in"
                img.onclick = (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    openLightbox(src, alt, imageData, imageData.findIndex(i => i.src === src))
                }
            })

            setArticleImages(imageData)
        }, 200)

        return () => clearTimeout(timer)
    }, [openLightbox])

    const langColor = repository ? getLanguageColor(repository.language) : "#858585"

    return (
        <>
            <ReadingProgress showPercentage />
            <ImageLightbox
                src={articleImages[0]?.src || ""}
                alt={articleImages[0]?.alt || ""}
                isOpen={isOpen}
                onClose={closeLightbox}
                images={articleImages}
                initialIndex={currentIndex}
            />

            <div className="min-h-screen">
                {/* Hero */}
                <section className="relative pt-4 pb-8 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
                        <div className="absolute inset-0 noise-overlay"></div>
                    </div>

                    <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        {/* Back Button */}
                        <div className="flex items-center justify-between mb-4">
                            <Link
                                href="/repositories"
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <TbArrowLeft className="w-4 h-4" />
                                პროექტებზე დაბრუნება
                            </Link>

                            <div className="flex items-center gap-2">
                                <BookmarkButton
                                    postId={post.id}
                                    slug={post.slug}
                                    title={post.title}
                                    showLabel
                                />
                            </div>
                        </div>

                        {/* Repo Header */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 flex-wrap">
                                {repository && (
                                    <>
                                        <Badge variant="outline" className="gap-1.5 pl-1.5">
                                            <span
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ backgroundColor: langColor }}
                                            />
                                            {repository.language}
                                        </Badge>

                                        <div className="flex items-center gap-1.5 text-sm font-medium">
                                            <TbStar className="w-4 h-4 text-yellow-500" />
                                            {repository.stars}
                                        </div>

                                        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                                            <TbGitFork className="w-4 h-4" />
                                            {repository.forks}
                                        </div>
                                    </>
                                )}

                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <TbEye className="w-4 h-4" />
                                    {post.views.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="space-y-4">
                                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                                        {post.title}
                                    </h1>
                                    <p className="text-lg text-muted-foreground max-w-3xl">
                                        {post.excerpt}
                                    </p>
                                </div>

                                {repository && (
                                    <Button size="lg" className="flex-shrink-0 gap-2" asChild>
                                        <Link href={repository.url} target="_blank" rel="noopener noreferrer">
                                            <TbBrandGithub className="w-5 h-5" />
                                            GitHub-ზე ნახვა
                                            <TbExternalLink className="w-4 h-4 opacity-50" />
                                        </Link>
                                    </Button>
                                )}
                            </div>

                            {/* Featured Photo */}
                            {(post.coverImages?.horizontal || post.coverImages?.vertical || post.coverImage) && (
                                <div className="relative mt-8 -mx-4 sm:-mx-6 lg:-mx-0 max-h-[500px] overflow-hidden rounded-xl border border-border/50 shadow-lg">
                                    <ResponsiveCover
                                        coverImages={post.coverImages}
                                        coverImage={post.coverImage}
                                        title={post.title}
                                        onClick={() => {
                                            const src = post.coverImages?.horizontal || post.coverImage;
                                            if (src) openLightbox(src, post.title, [{ src, alt: post.title }], 0);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="py-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="flex-1 min-w-0">
                                <article id={`post-article-${post.slug}`}>
                                    {post.sections && post.sections.length > 0 ? (
                                        <RichPostContent sections={post.sections} />
                                    ) : (
                                        <EnhancedContent
                                            html={post.content || ''}
                                            className="prose prose-lg dark:prose-invert max-w-none"
                                        />
                                    )}
                                </article>

                                {/* Gallery */}
                                {post.gallery && post.gallery.length > 0 && (
                                    <div className="mt-12">
                                        <PostGallery images={post.gallery} />
                                    </div>
                                )}

                                {/* Reactions & Share */}
                                <div className="mt-12 pt-8 border-t border-border space-y-8">
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-4">რეაქციები</h4>
                                        <ReactionBar reactions={post.reactions as any} size="lg" />
                                    </div>

                                    <ShareButtons
                                        url={`https://andrewaltair.ge/repositories/${post.slug}`}
                                        title={post.title}
                                        description={post.excerpt}
                                    />

                                    <Comments postId={post.id} className="pt-8 border-t border-border" />
                                </div>
                            </div>

                            {/* Sidebar - TOC mainly */}
                            <aside className="lg:w-80 flex-shrink-0 hidden lg:block">
                                <div className="sticky top-20 space-y-6">
                                    <TableOfContents
                                        contentSelector={`#post-article-${post.slug}`}
                                        title="დოკუმენტაცია"
                                    />
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
