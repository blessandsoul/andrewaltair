"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TbArrowLeft, TbClock, TbEye, TbCalendar, TbSparkles, TbSend, TbUser, TbMessage, TbShare, TbHeart, TbHash, TbCopy } from "react-icons/tb"
import { useEffect, useState, useCallback } from "react"
import {
    ReactionBar,
    ShareButtons,
    Comments,
    ReadingProgress,
    TableOfContents,
    BookmarkButton,
    EditSuggestion,
    EnhancedContent
} from "@/components/interactive"
import { ImageLightbox, useImageLightbox } from "@/components/interactive/ImageLightbox"
import { PostNavigation } from "@/components/blog/PostNavigation"
import { InfiniteScrollPosts } from "@/components/blog/InfiniteScrollPosts"
import { RichPostContent } from "@/components/blog/RichPostContent"
import { ResponsiveCover } from "@/components/blog/ResponsiveCover"
import { PostGallery } from "@/components/blog/PostGallery"
import { brand } from "@/lib/brand"

// Rich content section type
interface Section {
    emoji?: string;
    title?: string;
    content: string;
    type: 'intro' | 'section' | 'sarcasm' | 'warning' | 'tip' | 'fact' | 'opinion' | 'cta' | 'hashtags';
}

// Cover images for responsive display
interface CoverImages {
    horizontal?: string;
    vertical?: string;
}

// Gallery image
interface GalleryImage {
    src: string;
    alt?: string;
    caption?: string;
}

// TbVideo embed interface
interface VideoEmbed {
    url: string
    platform: 'youtube' | 'vimeo'
    videoId?: string
    thumbnailUrl?: string
}

interface Post {
    id: string
    numericId?: string // Added ID
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
}

interface RelatedPost {
    id: string
    slug: string
    title: string
    excerpt: string
    category: string
    views: number
    comments: number
    reactions: Record<string, number>
    shares: number
}

interface BlogPostClientProps {
    post: Post
    prevPost: { slug: string; title: string } | null
    nextPost: { slug: string; title: string } | null
    relatedPosts: RelatedPost[]
}

export default function BlogPostClient({ post, prevPost, nextPost, relatedPosts }: BlogPostClientProps) {
    const categoryStr = post.categories && post.categories.length > 0 ? post.categories[0] : ((post as any).category || 'ai')
    const categoryInfo = brand.categories.find(c => c.id === categoryStr)
    const { isOpen, images, currentIndex, openLightbox, closeLightbox } = useImageLightbox()
    const [articleImages, setArticleImages] = useState<{ src: string; alt: string }[]>([])

    // Extract images from content for lightbox
    useEffect(() => {
        const timer = setTimeout(() => {
            const article = document.querySelector("article")
            if (!article) return

            const imgs = article.querySelectorAll("img")
            const imageData: { src: string; alt: string }[] = []

            imgs.forEach((img, index) => {
                const src = img.getAttribute("src") || ""
                const alt = img.getAttribute("alt") || `TbPhoto ${index + 1}`
                imageData.push({ src, alt })

                // Add click handler to each image
                img.style.cursor = "zoom-in"
                img.onclick = (e) => {
                    e.preventDefault()
                    openLightbox(src, alt, imageData, index)
                }
            })

            setArticleImages(imageData)
        }, 200)

        return () => clearTimeout(timer)
    }, [openLightbox])

    // Use actual content or generate sample
    const postContent = post.content || `
        <h2>რა არის ${post.title.replace(/[🦆💻🔥🎨⚔️🤖📚🆓]/g, '').trim()}?</h2>
        <p>${post.excerpt}</p>
        
        <h3>რატომ არის ეს მნიშვნელოვანი?</h3>
        <p>ხელოვნური ინტელექტის სამყაროში ყოველდღიური ცვლილებები ხდება. ამ სტატიაში განვიხილავთ ყველაზე მნიშვნელოვან ასპექტებს და პრაქტიკულ რჩევებს.</p>
        
        <h3>ძირითადი პუნქტები</h3>
        <ul>
            <li>პირველი მნიშვნელოვანი პუნქტი</li>
            <li>მეორე საინტერესო აღმოჩენა</li>
            <li>მესამე პრაქტიკული რჩევა</li>
            <li>მეოთხე დასკვნა</li>
        </ul>
        
        <h3>კოდის მაგალითი</h3>
        <pre><code class="language-javascript">
// AI ინტეგრაციის მაგალითი
const response = await fetch('/api/ai', {
    method: 'POST',
    body: JSON.stringify({ prompt: 'Hello AI!' })
});
const data = await response.json();
console.log(data.result);
        </code></pre>
        
        <h3>დასკვნა</h3>
        <p>იმედი მაქვს ეს სტატია სასარგებლო იყო. გამოიწერე ჩემი არხი მეტი კონტენტისთვის!</p>
    `

    return (
        <>
            {/* Reading Progress Bar */}
            <ReadingProgress showPercentage />

            {/* TbPhoto Lightbox */}
            <ImageLightbox
                src={articleImages[0]?.src || ""}
                alt={articleImages[0]?.alt || ""}
                isOpen={isOpen}
                onClose={closeLightbox}
                images={articleImages}
                initialIndex={currentIndex}
            />

            <InfiniteScrollPosts initialPost={post}>
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
                                    href="/blog"
                                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <TbArrowLeft className="w-4 h-4" />
                                    ბლოგზე დაბრუნება
                                </Link>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => navigator.clipboard.writeText(post.numericId || post.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/50 hover:bg-secondary rounded-full text-xs font-medium transition-colors cursor-pointer text-muted-foreground hover:text-foreground mr-2"
                                        title={`Copy ID: ${post.numericId || post.id}`}
                                    >
                                        <TbHash className="w-3.5 h-3.5" />
                                        <span className="font-mono hidden sm:inline">{post.numericId || post.id.slice(-6)}</span>
                                    </button>
                                    <BookmarkButton
                                        postId={post.id}
                                        slug={post.slug}
                                        title={post.title}
                                        showLabel
                                    />
                                    <EditSuggestion
                                        postSlug={post.slug}
                                        postTitle={post.title}
                                    />
                                </div>
                            </div>

                            {/* Post Header */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <Badge
                                        style={{
                                            backgroundColor: `${categoryInfo?.color}20`,
                                            color: categoryInfo?.color,
                                            borderColor: `${categoryInfo?.color}40`
                                        }}
                                    >
                                        {categoryInfo?.name || categoryStr}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <TbCalendar className="w-4 h-4" />
                                        {post.publishedAt}
                                    </span>
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <TbClock className="w-4 h-4" />
                                        {post.readingTime} წთ
                                    </span>
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <TbEye className="w-4 h-4" />
                                        {post.views.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <TbMessage className="w-4 h-4" />
                                        {post.comments}
                                    </span>
                                    <span className="text-sm text-red-500 flex items-center gap-1">
                                        <TbHeart className="w-4 h-4" />
                                        {(Object.values(post.reactions) as number[]).reduce((a, b) => a + b, 0)}
                                    </span>
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <TbShare className="w-4 h-4" />
                                        {post.shares}
                                    </span>
                                </div>

                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                                    {post.title}
                                </h1>

                                {/* Featured Photo - Responsive Cover (smaller) */}
                                {(post.coverImages?.horizontal || post.coverImages?.vertical || post.coverImage) && (
                                    <div className="relative mt-4 -mx-4 sm:-mx-6 lg:-mx-0 max-h-[400px] overflow-hidden rounded-xl">
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

                                {/* Excerpt - below photo */}
                                <p className="text-lg text-muted-foreground mt-4">
                                    {post.excerpt}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Content with Sidebar */}
                    <section className="py-12">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Main Content - Rich sections or legacy HTML */}
                                <div className="flex-1 min-w-0">
                                    {/* Rich content sections */}
                                    <article id={`post-article-${post.slug}`}>
                                        {post.sections && post.sections.length > 0 ? (
                                            <RichPostContent sections={post.sections} />
                                        ) : (
                                            /* Legacy HTML content */
                                            <EnhancedContent
                                                html={postContent}
                                                className="prose prose-lg dark:prose-invert max-w-none
                                                prose-headings:font-bold prose-headings:tracking-tight
                                                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                                                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                                                prose-p:text-muted-foreground prose-p:leading-relaxed
                                                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                                prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                                                prose-pre:bg-card prose-pre:border prose-pre:border-border
                                                prose-ul:list-disc prose-li:text-muted-foreground
                                                prose-img:rounded-xl prose-img:shadow-lg"
                                            />
                                        )}
                                    </article>

                                    {/* Gallery */}
                                    {post.gallery && post.gallery.length > 0 && (
                                        <div className="mt-12">
                                            <PostGallery images={post.gallery} />
                                        </div>
                                    )}

                                    {/* TbVideo Section */}
                                    {post.videos && post.videos.length > 0 && (
                                        <div className="mt-12 pt-8 border-t border-border">
                                            <h4 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                                                    <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[5px] border-l-white border-b-[3px] border-b-transparent ml-0.5" />
                                                </div>
                                                ვიდეო
                                            </h4>
                                            <div className="space-y-4">
                                                {post.videos.map((video, idx) => (
                                                    <div key={idx} className="aspect-video rounded-lg overflow-hidden">
                                                        <iframe
                                                            src={video.platform === 'youtube'
                                                                ? `https://www.youtube.com/embed/${video.videoId}`
                                                                : `https://player.vimeo.com/video/${video.videoId}`}
                                                            className="w-full h-full"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Tags Section - SEO Internal Links */}
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="mt-12 pt-8 border-t border-border">
                                            <h4 className="text-sm font-medium text-muted-foreground mb-4">თეგები</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {post.tags.slice(0, 20).map((tag: string) => (
                                                    <Link
                                                        key={tag}
                                                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                                                        className="inline-flex"
                                                    >
                                                        <Badge
                                                            variant="secondary"
                                                            className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                                                        >
                                                            #{tag}
                                                        </Badge>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Reactions & Share */}
                                    <div className="mt-12 pt-8 border-t border-border space-y-8">
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-4">რეაქციები</h4>
                                            <ReactionBar reactions={post.reactions as any} size="lg" />
                                        </div>

                                        <ShareButtons
                                            url={`https://andrewaltair.ge/blog/${post.slug}`}
                                            title={post.title}
                                            description={post.excerpt}
                                        />

                                        {/* Post Navigation */}
                                        <PostNavigation
                                            prevPost={prevPost}
                                            nextPost={nextPost}
                                            className="pt-8 border-t border-border"
                                        />

                                        {/* Comments */}
                                        <Comments postId={post.id} className="pt-8 border-t border-border" />
                                    </div>
                                </div>

                                {/* Sidebar */}
                                <aside className="lg:w-80 flex-shrink-0">
                                    <div className="sticky top-20 space-y-6">
                                        {/* Table of Contents */}
                                        <TableOfContents
                                            contentSelector={`#post-article-${post.slug}`}
                                            title="შინაარსი"
                                        />

                                        {/* Author Card */}
                                        <Card className="border-0 shadow-lg">
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                                                        <TbSparkles className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">Andrew Altair</div>
                                                        <div className="text-sm text-muted-foreground">AI ინოვატორი</div>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    {brand.stats.yearsExperience} წელზე მეტი გამოცდილება AI-ში.
                                                </p>
                                                <Button size="sm" className="w-full" asChild>
                                                    <Link href="/about">
                                                        <TbUser className="w-4 h-4 mr-2" />
                                                        ჩემს შესახებ
                                                    </Link>
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        {/* Related Posts - Miniature */}
                                        {relatedPosts.length > 0 && (
                                            <Card className="border-0 shadow-lg">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <TbSparkles className="w-4 h-4 text-primary" />
                                                        <span className="text-sm font-semibold">მსგავსი სტატიები</span>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {relatedPosts.slice(0, 3).map((relatedPost) => (
                                                            <Link
                                                                key={relatedPost.id}
                                                                href={`/blog/${relatedPost.slug}`}
                                                                className="block group"
                                                            >
                                                                <div className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                                                    <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                                                                        {relatedPost.title}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                                                                        <span className="flex items-center gap-0.5">
                                                                            <TbEye className="w-3 h-3" />
                                                                            {relatedPost.views.toLocaleString()}
                                                                        </span>
                                                                        <span className="flex items-center gap-0.5 text-red-500">
                                                                            <TbHeart className="w-3 h-3" />
                                                                            {(Object.values(relatedPost.reactions) as number[]).reduce((a, b) => a + b, 0)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                                </aside>
                            </div>
                        </div>
                    </section>



                    {/* Newsletter CTA */}
                    <section className="py-16 relative overflow-hidden">
                        <div className="absolute inset-0 animated-gradient opacity-90"></div>
                        <div className="absolute inset-0 noise-overlay"></div>

                        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center text-white">
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold">მოგეწონა სტატია?</h2>
                                <p className="text-white/80">
                                    გამოიწერე და მიიღე ახალი AI სტატიები პირველმა
                                </p>
                                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                                    <TbSend className="w-4 h-4 mr-2" />
                                    გამოწერა
                                </Button>
                            </div>
                        </div>
                    </section>
                </div>
            </InfiniteScrollPosts>
        </>
    )
}
