"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { TbArrowLeft, TbClock, TbEye, TbCalendar, TbSparkles, TbSend, TbUser, TbMessage, TbShare, TbHeart, TbHash, TbCopy, TbBrain, TbCheck, TbHelp } from "react-icons/tb"
import { useEffect, useState, useCallback, useMemo } from "react"
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
import { AuroraReactionBar } from "@/components/interactive/AuroraReactionBar"
import { ImageLightbox, useImageLightbox } from "@/components/interactive/ImageLightbox"
import { PostNavigation } from "@/components/blog/PostNavigation"
import { InfiniteScrollPosts } from "@/components/blog/InfiniteScrollPosts"
import { RichPostContent } from "@/components/blog/RichPostContent"
import { ResponsiveCover } from "@/components/blog/ResponsiveCover"
import { PostGallery } from "@/components/blog/PostGallery"
import { Breadcrumbs } from "@/components/blog/Breadcrumbs"
import { FontSizeControl } from "@/components/blog/FontSizeControl"
import { FloatingShareBar } from "@/components/blog/FloatingShareBar"
import { InlineRelatedPosts } from "@/components/blog/InlineRelatedPosts"
import { FloatingTagCloud } from "@/components/blog/FloatingTagCloud"
import { TypoReporter, TypoHint } from "@/components/blog/TypoReporter"
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
    // AI & SEO Fields
    keyPoints?: string[]
    faq?: { question: string; answer: string }[]
    entities?: string[]
    author: {
        name: string
        avatar?: string
        role?: string
    }
    publishedAt: string
    updatedAt?: string
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
    const categoryInfo = brand.categories.find(c => c.id === categoryStr) ||
        brand.categories.flatMap(c => c.subcategories || []).find(c => c.id === categoryStr)
    const { isOpen, images, currentIndex, openLightbox, closeLightbox } = useImageLightbox()
    const [articleImages, setArticleImages] = useState<{ src: string; alt: string }[]>([])
    const [formattedDate, setFormattedDate] = useState<string>('')

    // Format date on client only to prevent hydration mismatch
    useEffect(() => {
        const date = new Date(post.publishedAt)
        const months = [
            'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
            'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'
        ]
        setFormattedDate(`${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`)
    }, [post.publishedAt])

    // Extract images from content for lightbox (EXCLUDING gallery/thumbnails/background)
    useEffect(() => {
        const timer = setTimeout(() => {
            const article = document.getElementById(`post-article-${post.slug}`) || document.querySelector("article")
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

            {/* Floating Share Bar */}
            <FloatingShareBar
                url={`https://andrewaltair.ge/blog/${post.slug}`}
                title={post.title}
            />

            {/* TbPhoto Lightbox */}
            <ImageLightbox
                src={images[currentIndex]?.src || ""}
                alt={images[currentIndex]?.alt || ""}
                isOpen={isOpen}
                onClose={closeLightbox}
                images={images}
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
                            {/* Breadcrumbs */}
                            <Breadcrumbs
                                category={categoryStr}
                                categoryName={categoryInfo?.name || categoryStr}
                                title={post.title}
                            />

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
                                    <FontSizeControl />
                                    <button
                                        onClick={() => navigator.clipboard.writeText(post.numericId || post.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/50 hover:bg-secondary rounded-full text-xs font-medium transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
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
                                        {formattedDate || post.publishedAt}
                                    </span>
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <TbClock className="w-4 h-4" />
                                        {post.readingTime} წთ კითხვა
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

                                {/* Featured Photo - Responsive Cover (Full Width) */}
                                {(post.coverImages?.horizontal || post.coverImages?.vertical || post.coverImage) && (
                                    <div className="relative mt-6 -mx-4 sm:-mx-6 lg:-mx-0 overflow-hidden rounded-2xl shadow-2xl">
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

                                {/* Excerpt - Styled Block */}
                                <div className="mt-8 p-6 lg:p-8 bg-gradient-to-br from-secondary/40 to-secondary/20 backdrop-blur-sm rounded-2xl border border-secondary/50 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary via-accent to-primary/50" />
                                    <p className="text-lg md:text-xl text-foreground/80 leading-relaxed pl-4 mb-6">
                                        {post.excerpt}
                                    </p>
                                </div>

                                {/* Key Takeaways (AI Summary) */}
                                {post.keyPoints && post.keyPoints.length > 0 && (
                                    <Card className="mt-8 border-l-4 border-l-primary bg-primary/5 border-y-0 border-r-0 rounded-r-xl">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <TbBrain className="w-5 h-5 text-primary" />
                                                მთავარი იდეები
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="grid gap-3">
                                                {post.keyPoints.map((point, index) => (
                                                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                                                        <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <TbCheck className="w-3 h-3 text-primary" />
                                                        </div>
                                                        <span className="leading-relaxed">{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                )}


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

                                    {/* Inline Related Posts */}
                                    <InlineRelatedPosts posts={relatedPosts} />

                                    {/* FAQ Section */}
                                    {post.faq && post.faq.length > 0 && (
                                        <div className="mt-12 pt-8 border-t border-border">
                                            <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                                                <TbHelp className="w-6 h-6 text-primary" />
                                                ხშირად დასმული კითხვები
                                            </h4>
                                            <Accordion type="single" collapsible className="w-full">
                                                {post.faq.map((item, index) => (
                                                    <AccordionItem key={index} value={`item-${index}`}>
                                                        <AccordionTrigger className="text-left font-medium">
                                                            {item.question}
                                                        </AccordionTrigger>
                                                        <AccordionContent className="text-muted-foreground leading-relaxed">
                                                            {item.answer}
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        </div>
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

                                    {/* Tags Section - Animated Cloud */}
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="mt-12 pt-8 border-t border-border">
                                            <h4 className="text-sm font-medium text-muted-foreground mb-4">თეგები</h4>
                                            <FloatingTagCloud tags={post.tags} />
                                        </div>
                                    )}

                                    {/* Reactions & Share */}
                                    <div className="mt-12 pt-8 border-t border-border space-y-8">
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-4">რეაქციები</h4>
                                            <AuroraReactionBar
                                                reactions={post.reactions as any}
                                                postId={post.id}
                                                postTitle={post.title}
                                            />
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
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline" className="flex-1" asChild>
                                                        <Link href="/about">
                                                            <TbUser className="w-4 h-4 mr-1" />
                                                            შესახებ
                                                        </Link>
                                                    </Button>
                                                    <Button size="sm" className="flex-1" asChild>
                                                        <a href="https://t.me/andr3waltairchannel" target="_blank" rel="noopener noreferrer">
                                                            <TbSend className="w-4 h-4 mr-1" />
                                                            გამოწერა
                                                        </a>
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Related Posts - Enhanced with Images */}
                                        {relatedPosts.length > 0 && (
                                            <Card className="border-0 shadow-lg">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <TbSparkles className="w-4 h-4 text-primary" />
                                                        <span className="text-sm font-semibold">შეიძლება დაგაინტერესოთ</span>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {relatedPosts.slice(0, 3).map((relatedPost) => {
                                                            const coverImage = (relatedPost as any).coverImages?.horizontal || (relatedPost as any).coverImage;
                                                            const totalReactions = (Object.values(relatedPost.reactions) as number[]).reduce((a, b) => a + b, 0);

                                                            return (
                                                                <Link
                                                                    key={relatedPost.id}
                                                                    href={`/blog/${relatedPost.slug}`}
                                                                    className="block group"
                                                                >
                                                                    <div className="rounded-lg overflow-hidden hover:shadow-md transition-all duration-300">
                                                                        {/* Image with Stats Overlay */}
                                                                        <div className="relative aspect-[16/9] overflow-hidden">
                                                                            {coverImage ? (
                                                                                <Image
                                                                                    src={coverImage}
                                                                                    alt={relatedPost.title}
                                                                                    fill
                                                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                                                />
                                                                            ) : (
                                                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                                                                                    <TbSparkles className="w-8 h-8 text-muted-foreground/30" />
                                                                                </div>
                                                                            )}

                                                                            {/* Gradient Overlay */}
                                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                                                            {/* Stats Badge Overlay */}
                                                                            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center z-10">
                                                                                <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-[9px] font-medium shadow-lg">
                                                                                    <div className="flex items-center gap-0.5" title="ნახვები">
                                                                                        <TbEye className="w-3 h-3 text-blue-400" />
                                                                                        <span>{relatedPost.views >= 1000 ? `${(relatedPost.views / 1000).toFixed(1)}K` : relatedPost.views}</span>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-0.5" title="მოწონებები">
                                                                                        <TbHeart className="w-3 h-3 text-red-400" />
                                                                                        <span>{totalReactions >= 1000 ? `${(totalReactions / 1000).toFixed(1)}K` : totalReactions}</span>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-0.5" title="კომენტარები">
                                                                                        <TbMessage className="w-3 h-3 text-green-400" />
                                                                                        <span>{relatedPost.comments >= 1000 ? `${(relatedPost.comments / 1000).toFixed(1)}K` : relatedPost.comments}</span>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-0.5" title="გაზიარება">
                                                                                        <TbShare className="w-3 h-3 text-orange-400" />
                                                                                        <span>{relatedPost.shares >= 1000 ? `${(relatedPost.shares / 1000).toFixed(1)}K` : relatedPost.shares}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Title */}
                                                                        <div className="p-2 bg-card">
                                                                            <p className="text-xs font-medium line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                                                                                {relatedPost.title}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            );
                                                        })}
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
                </div >
            </InfiniteScrollPosts>
            {/* Typo Reporter */}
            <TypoReporter />
            <TypoHint />
        </>
    )
}
