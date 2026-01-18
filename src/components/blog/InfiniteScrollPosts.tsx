"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { TbInfinity, TbLoader2, TbChevronUp, TbArrowLeft, TbClock, TbEye, TbCalendar, TbSparkles, TbSend, TbUser, TbMessage, TbShare, TbHeart } from "react-icons/tb"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ReactionBar,
    ShareButtons,
    Comments,
    TableOfContents,
    BookmarkButton,
    EditSuggestion,
    EnhancedContent
} from "@/components/interactive"
import { ImageLightbox, useImageLightbox } from "@/components/interactive/ImageLightbox"
import { PostNavigation } from "@/components/blog/PostNavigation"
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

// Video embed interface
interface VideoEmbed {
    url: string
    platform: 'youtube' | 'vimeo'
    videoId?: string
    thumbnailUrl?: string
}

interface Post {
    id: string
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

interface InfiniteScrollPostsProps {
    initialPost: Post
    children: React.ReactNode
    className?: string
}

// Helper to determine author avatar
function getAuthorAvatar(author: { name: string, avatar?: string, role?: string }) {
    if (!author) return '/logo.png'
    const name = author.name.toLowerCase()
    const role = author.role

    // Specific mapping for known authors
    if (name.includes('andrew') || role === 'god') return '/andrewaltair.png'
    if (name.includes('deep') || name.includes('დიპ')) return '/images/avatars/deep.png'
    if (name.includes('alpha') || name.includes('ალფა')) return '/images/avatars/alpha.jpg'

    // Block invalid/broken paths
    if (author.avatar === '/images/avatar.jpg') return '/logo.png'

    // Database value or generic fallback
    return author.avatar || '/logo.png'
}

// Full article component matching BlogPostClient layout
function FullArticle({ post, index }: { post: Post; index: number }) {
    const categoryStr = post.categories && post.categories.length > 0 ? post.categories[0] : ((post as any).category || 'ai')
    const normalizedCat = categoryStr?.trim().toLowerCase()
    // Helper to flatten categories for lookup
    const allCategories = brand.categories.flatMap(c => [c, ...(c.subcategories || [])])
    const categoryInfo = allCategories.find(c => c.id.toLowerCase() === normalizedCat) || {
        id: normalizedCat || 'ai',
        name: normalizedCat || 'AI',
        color: '#6366f1',
        icon: 'Bot'
    }

    const { isOpen, images, currentIndex, openLightbox, closeLightbox } = useImageLightbox()
    const [articleImages, setArticleImages] = useState<{ src: string; alt: string }[]>([])

    // Extract images from content for lightbox (EXCLUDING gallery/thumbnails/background)
    useEffect(() => {
        const timer = setTimeout(() => {
            const article = document.getElementById(`post-article-${post.slug}`)
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
    }, [openLightbox, post.slug])

    // Generate default content if not available
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
        
        <h3>დასკვნა</h3>
        <p>იმედი მაქვს ეს სტატია სასარგებლო იყო. გამოიწერე ჩემი არხი მეტი კონტენტისთვის!</p>
    `

    return (
        <div className="min-h-screen">
            {/* TbPhoto Lightbox */}
            <ImageLightbox
                src={articleImages[0]?.src || ""}
                alt={articleImages[0]?.alt || ""}
                isOpen={isOpen}
                onClose={closeLightbox}
                images={articleImages}
                initialIndex={currentIndex}
            />

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
                                    backgroundColor: `${categoryInfo.color}20`,
                                    color: categoryInfo.color,
                                    borderColor: `${categoryInfo.color}40`
                                }}
                            >
                                {categoryInfo.name}
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

                        <p className="text-xl text-muted-foreground">
                            {post.excerpt}
                        </p>

                        {/* Featured TbPhoto - Responsive Cover */}
                        {(post.coverImages?.horizontal || post.coverImages?.vertical || post.coverImage) && (
                            <div className="relative mt-4 -mx-4 sm:-mx-6 lg:-mx-0 group">
                                <ResponsiveCover
                                    coverImages={post.coverImages}
                                    coverImage={post.coverImage}
                                    title={post.title}
                                    onClick={() => {
                                        const src = post.coverImages?.horizontal || post.coverImage;
                                        if (src) openLightbox(src, post.title, [{ src, alt: post.title }], 0);
                                    }}
                                />

                                {/* Author Indicator Overlay */}
                                {post.author && (
                                    <div className="absolute top-4 right-4 z-30 pointer-events-none">
                                        <div className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-lg">
                                            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/20">
                                                <Image
                                                    src={getAuthorAvatar(post.author)}
                                                    alt={post.author.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-white/90">
                                                {post.author.name}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Content with Sidebar */}
            <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            {/* Rich content sections */}
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
    )
}

export function InfiniteScrollPosts({
    initialPost,
    children,
    className = ""
}: InfiniteScrollPostsProps) {
    const [isEnabled, setIsEnabled] = useState(false)
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [currentSlug, setCurrentSlug] = useState(initialPost.slug)
    const [showBackToTop, setShowBackToTop] = useState(false)

    const observerRef = useRef<IntersectionObserver | null>(null)
    const loadMoreRef = useRef<HTMLDivElement>(null)
    const postRefs = useRef<Map<string, HTMLDivElement>>(new Map())

    // Load next posts when enabled
    const loadMorePosts = useCallback(async () => {
        if (isLoading || !hasMore) return

        setIsLoading(true)
        try {
            const lastSlug = posts.length > 0 ? posts[posts.length - 1].slug : initialPost.slug
            const response = await fetch(`/api/posts?afterSlug=${lastSlug}&limit=1&status=published`)

            if (response.ok) {
                const data = await response.json()
                if (data.posts && data.posts.length > 0) {
                    // Filter out existing posts to prevent duplicates
                    const newPosts = data.posts.filter((newPost: Post) =>
                        !posts.some(p => p.id === newPost.id) && newPost.id !== initialPost.id
                    )

                    if (newPosts.length > 0) {
                        setPosts(prev => [...prev, ...newPosts])
                    } else {
                        // If we got posts but they were duplicates, try fetching more
                        if (data.posts.length > 0) {
                            // This is a simple retry mechanism - in production might need offset based pagination
                            // But for now, if we get duplicates, we just assume end of stream to prevent loops
                            // console.log("Duplicate posts found, stopping")
                        }
                    }
                } else {
                    setHasMore(false)
                }
            }
        } catch (error) {
            console.error("Failed to load more posts:", error)
        } finally {
            setIsLoading(false)
        }
    }, [isLoading, hasMore, posts, initialPost.id, initialPost.slug]) // Added initialPost.id dependency

    // Observe for loading more
    useEffect(() => {
        if (!isEnabled || !loadMoreRef.current) return

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading && hasMore) {
                    loadMorePosts()
                }
            },
            { rootMargin: "200px" }
        )

        observerRef.current.observe(loadMoreRef.current)

        return () => observerRef.current?.disconnect()
    }, [isEnabled, isLoading, hasMore, loadMorePosts])

    // Track visible post and update URL
    useEffect(() => {
        if (!isEnabled) return

        const updateVisiblePost = () => {
            const viewportCenter = window.innerHeight / 2

            // Check initial post
            const initialEl = document.getElementById(`post-${initialPost.slug}`)
            if (initialEl) {
                const rect = initialEl.getBoundingClientRect()
                if (rect.top < viewportCenter && rect.bottom > viewportCenter) {
                    if (currentSlug !== initialPost.slug) {
                        setCurrentSlug(initialPost.slug)
                        updateUrl(initialPost.slug, initialPost.title)
                    }
                    return
                }
            }

            // Check loaded posts
            for (const post of posts) {
                const el = postRefs.current.get(post.slug)
                if (el) {
                    const rect = el.getBoundingClientRect()
                    if (rect.top < viewportCenter && rect.bottom > viewportCenter) {
                        if (currentSlug !== post.slug) {
                            setCurrentSlug(post.slug)
                            updateUrl(post.slug, post.title)
                        }
                        return
                    }
                }
            }
        }

        const updateUrl = (slug: string, title: string) => {
            const newUrl = `/blog/${slug}`
            window.history.replaceState({ slug }, title, newUrl)
            document.title = `${title} | Blog`
        }

        window.addEventListener("scroll", updateVisiblePost, { passive: true })
        return () => window.removeEventListener("scroll", updateVisiblePost)
    }, [isEnabled, posts, currentSlug, initialPost])

    // Show back to top button
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 500)
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const registerRef = useCallback((slug: string, el: HTMLDivElement | null) => {
        if (el) {
            postRefs.current.set(slug, el)
        } else {
            postRefs.current.delete(slug)
        }
    }, [])

    return (
        <div className={className}>
            {/* Toggle control */}
            <div className="fixed bottom-20 right-4 z-40">
                <label className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 shadow-lg cursor-pointer hover:border-primary/50 transition-colors">
                    <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) => setIsEnabled(e.target.checked)}
                        className="sr-only"
                    />
                    <div className={cn(
                        "w-10 h-5 rounded-full relative transition-colors",
                        isEnabled ? "bg-primary" : "bg-muted"
                    )}>
                        <div className={cn(
                            "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                            isEnabled ? "translate-x-5" : "translate-x-0.5"
                        )} />
                    </div>
                    <TbInfinity className={cn(
                        "w-4 h-4 transition-colors",
                        isEnabled ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className="text-sm font-medium">
                        {isEnabled ? "∞ ჩართულია" : "∞ სქროლი"}
                    </span>
                </label>
            </div>

            {/* Back to top button */}
            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-32 right-4 z-40 w-10 h-10 bg-card border border-border rounded-full shadow-lg flex items-center justify-center hover:border-primary/50 hover:text-primary transition-all"
                >
                    <TbChevronUp className="w-5 h-5" />
                </button>
            )}

            {/* Initial post content */}
            <div id={`post-${initialPost.slug}`}>
                {children}
            </div>

            {/* Loaded posts - now render full article */}
            {isEnabled && posts.map((post, index) => (
                <div
                    key={post.id}
                    ref={(el) => registerRef(post.slug, el)}
                    id={`post-${post.slug}`}
                    className=""
                >


                    {/* Full article content */}
                    <article id={`post-article-${post.slug}`}>
                        <FullArticle post={post} index={index} />
                    </article>
                </div>
            ))}

            {/* Load more trigger */}
            {isEnabled && hasMore && (
                <div ref={loadMoreRef} className="py-16 flex justify-center">
                    {isLoading && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <TbLoader2 className="w-5 h-5 animate-spin" />
                            <span>იტვირთება...</span>
                        </div>
                    )}
                </div>
            )}

            {/* End message */}
            {isEnabled && !hasMore && posts.length > 0 && (
                <div className="py-16 text-center">
                    <p className="text-muted-foreground">
                        🎉 ყველა სტატია წაკითხულია!
                    </p>
                </div>
            )}
        </div>
    )
}

