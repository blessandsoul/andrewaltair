"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
    TbEye, TbFlame, TbHeart, TbMessage, TbShare, TbClock, TbBookmark, TbSparkles, TbArrowRight,
    TbBrandFacebook, TbBrandTwitter, TbBrandLinkedin, TbCopy, TbCheck, TbX
} from "react-icons/tb"
import { brand } from "@/lib/brand"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface Post {
    id: string
    slug: string
    title: string
    excerpt: string
    content?: string
    rawContent?: string
    gallery?: any[]
    videos?: any[]
    relatedPosts?: string[]
    categories: string[]
    coverImage?: string
    coverImages?: {
        horizontal?: string
        vertical?: string
    }
    tags: string[]
    author: {
        name: string
        avatar: string
        role: string
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

interface PostCardProps {
    post: Post
    variant?: "default" | "featured" | "compact"
    showExcerpt?: boolean
    showTags?: boolean
    showAuthor?: boolean
    className?: string
}

// Format numbers (15420 -> 15.4K)
function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
}

// Get total reactions
function getTotalReactions(reactions: Record<string, number>): number {
    return Object.values(reactions).reduce((a, b) => a + b, 0)
}

// Format date to relative time (5 დღის წინ)
function formatRelativeDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "დღეს"
    if (diffDays === 1) return "გუშინ"
    if (diffDays < 7) return `${diffDays} დღის წინ`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} კვირის წინ`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} თვის წინ`
    return `${Math.floor(diffDays / 365)} წლის წინ`
}

// Get category info with color
function getCategoryInfo(categoryId: string) {
    const normalizedId = categoryId?.trim().toLowerCase()
    return brand.categories.find(c => c.id.toLowerCase() === normalizedId) || {
        id: categoryId,
        name: categoryId,
        color: "#6366f1"
    }
}

// Strip HTML and get preview
// Strip HTML and get preview
function getContentPreview(post: Post, length: number = 100): string {
    // Priority: content -> rawContent -> excerpt
    let text = post.content || post.rawContent || post.excerpt || "";

    // Remove system artifacts and markers BEFORE HTML stripping
    text = text.replace(/={3,}\s*\[.*?\]\s*={3,}/g, ''); // Remove === [PART 1...] ===
    text = text.replace(/-{3,}\s*\[.*?\]\s*-{3,}/g, ''); // Remove --- [START OF OUTPUT] ---
    text = text.replace(/\[START OF OUTPUT\]/gi, '');
    text = text.replace(/\[PART \d+:.*?\]/gi, '');
    text = text.replace(/\b(CN|AI)\b/gi, ''); // Remove standalone CN/AI case insensitive
    text = text.replace(/^CN\s+/i, ''); // Remove leading CN 
    text = text.replace(/CN\s/gi, ''); // Remove CN followed by space anywhere

    // Remove HTML tags
    text = text.replace(/<[^>]*>/g, ' ');

    // Decode entities like &nbsp;
    text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');

    // Remove markdown symbols (bold, italic)
    text = text.replace(/\*\*/g, '').replace(/__/g, '');

    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();

    // Remove title from the beginning if present (common in AI generated content)
    // We check for title, then a possible colon or dash
    const cleanTitle = post.title.trim();
    if (text.toLowerCase().startsWith(cleanTitle.toLowerCase())) {
        text = text.substring(cleanTitle.length).trim();
        // Remove leading colon/dash if still present
        text = text.replace(/^[:\-]\s*/, '');
    }

    // Secondary aggressive cleaning for leading punctuation 
    text = text.replace(/^[:\-]\s*/, '');

    if (text.length <= length) return text;
    return text.substring(0, length).trim() + "...";
}


export function PostCard({
    post,
    variant = "default",
    showExcerpt = true,
    showTags = true,
    showAuthor = true,
    className
}: PostCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [avatarError, setAvatarError] = useState(false)
    const [copied, setCopied] = useState(false)
    const [isZoomed, setIsZoomed] = useState(false)

    const categoryStr = post.categories && post.categories.length > 0 ? post.categories[0] : ((post as any).category || 'ai')
    const categoryInfo = getCategoryInfo(categoryStr)
    const postUrl = typeof window !== 'undefined' ? `${window.location.origin}/blog/${post.slug}` : `https://andrewaltair.ge/blog/${post.slug}`

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        navigator.clipboard.writeText(postUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleShare = (e: React.MouseEvent, platform: string) => {
        e.preventDefault()
        e.stopPropagation()
        let url = ''
        switch (platform) {
            case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`; break;
            case 'twitter': url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`; break;
            case 'linkedin': url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`; break;
        }
        if (url) window.open(url, '_blank', 'width=600,height=400')
    }

    const [likes, setLikes] = useState(getTotalReactions(post.reactions))
    const [isLiked, setIsLiked] = useState(false) // In a real app, check user state
    const [isBookmarked, setIsBookmarked] = useState(false)

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (isLiked) return // Prevent multiple likes for demo

        setIsLiked(true)
        setLikes(prev => prev + 1)

        try {
            await fetch(`/api/posts/${post.id}/react`, {
                method: 'POST',
                body: JSON.stringify({ type: 'like' })
            })
        } catch (error) {
            console.error('Failed to like post', error)
        }
    }

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsBookmarked(!isBookmarked)
        // Ideally save to localStorage or user profile
    }

    const handleShareClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    // Resolve cover image
    const coverImage = post.coverImages?.horizontal || post.coverImage

    return (
        <div className="block h-full group">
            <Card
                className={cn(
                    "h-full border-0 bg-card/50 dark:bg-card/40 overflow-hidden transition-all duration-500",
                    "group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group-hover:-translate-y-2 group-hover:bg-card dark:group-hover:bg-card",
                    "dark:group-hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.05)]",
                    className
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <CardContent className="p-0 h-full flex flex-col">
                    {/* Image Container */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden">
                        {/* Background Gradient Placeholder */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />

                        {/* Image with Zoom */}
                        <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
                            <DialogTrigger asChild>
                                <div className="relative w-full h-full cursor-zoom-in">
                                    {coverImage && !imageError ? (
                                        <Image
                                            src={coverImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
                                            onError={() => setImageError(true)}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/30 text-muted-foreground">
                                            <TbSparkles className="w-10 h-10 mb-2 opacity-50" />
                                            <span className="text-xs font-medium">No Image</span>
                                        </div>
                                    )}
                                </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-transparent overflow-hidden sm:rounded-none">
                                <div className="relative w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                                    {coverImage && (
                                        <div className="relative w-full h-full max-w-7xl max-h-[85vh] aspect-video">
                                            <Image
                                                src={coverImage}
                                                alt={post.title}
                                                fill
                                                className="object-contain"
                                                priority
                                            />
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* Gradient Overlay - fades in on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                            {/* Category Badge */}
                            <Badge
                                className="backdrop-blur-md border-0 text-[10px] font-bold px-2.5 py-1 tracking-wider uppercase shadow-lg"
                                style={{
                                    backgroundColor: isHovered ? categoryInfo.color : `${categoryInfo.color}E6`,
                                    color: '#fff'
                                }}
                            >
                                {categoryInfo.name}
                            </Badge>

                            {/* Trending Badge */}
                            {post.trending && (
                                <Badge className="bg-red-500/90 backdrop-blur-sm text-white border-0 text-[10px] px-2 py-0.5 animate-pulse">
                                    <TbFlame className="w-3 h-3 mr-1" />
                                    HOT
                                </Badge>
                            )}
                        </div>

                        {/* Bottom Stats Overlay (on image) - NEW */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                            <div className="flex items-center gap-1.5 mx-auto">
                                {/* Stats Badge */}
                                <div className="flex items-center gap-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-[10px] font-medium shadow-lg transition-transform duration-300 group-hover:scale-105">
                                    <div className="flex items-center gap-1.5" title="ნახვები">
                                        <TbEye className="w-3.5 h-3.5 text-blue-400" />
                                        <span>{formatNumber(post.views)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5" title="მოწონებები">
                                        <TbHeart className="w-3.5 h-3.5 text-red-400" />
                                        <span>{formatNumber(getTotalReactions(post.reactions))}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5" title="კომენტარები">
                                        <TbMessage className="w-3.5 h-3.5 text-green-400" />
                                        <span>{formatNumber(post.comments)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5" title="გაზიარება">
                                        <TbShare className="w-3.5 h-3.5 text-orange-400" />
                                        <span>{formatNumber(post.shares)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-5 flex flex-col border-t border-border/20">
                        {/* Tags */}
                        {showTags && post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                {post.tags.slice(0, 2).map(tag => (
                                    <span key={tag} className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <Link href={`/blog/${post.slug}`} className="block">
                            <h3 className="text-lg font-bold leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                {post.title}
                            </h3>
                        </Link>

                        {/* Excerpt */}
                        {showExcerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-5 leading-relaxed">
                                {getContentPreview(post, 160)}
                            </p>
                        )}

                        <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between gap-4">
                            {/* Author */}
                            {/* Left Actions: Share, Like, Bookmark */}
                            <div className="flex items-center gap-1">
                                {/* Share Popover */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 rounded-full text-muted-foreground hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        >
                                            <TbShare className="w-4 h-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-2" align="start">
                                        <div className="flex items-center gap-1">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={(e) => handleShare(e, 'facebook')}>
                                                <TbBrandFacebook className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-sky-500 hover:bg-sky-50" onClick={(e) => handleShare(e, 'twitter')}>
                                                <TbBrandTwitter className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-700 hover:bg-blue-50" onClick={(e) => handleShare(e, 'linkedin')}>
                                                <TbBrandLinkedin className="w-4 h-4" />
                                            </Button>
                                            <div className="w-px h-4 bg-border mx-1" />
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:bg-muted" onClick={handleCopy}>
                                                {copied ? <TbCheck className="w-4 h-4 text-green-500" /> : <TbCopy className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                {/* Like Button */}
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className={cn(
                                        "h-8 px-2 w-auto min-w-[32px] rounded-full transition-colors",
                                        isLiked ? "text-red-500 bg-red-50 dark:bg-red-900/20" : "text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    )}
                                    onClick={handleLike}
                                >
                                    <TbHeart className={cn("w-4 h-4", isLiked && "fill-current")} />
                                    {likes > 0 && <span className="ml-1 text-[10px] font-bold">{formatNumber(likes)}</span>}
                                </Button>

                                {/* Bookmark Button */}
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className={cn(
                                        "h-8 w-8 rounded-full transition-colors",
                                        isBookmarked ? "text-amber-500 bg-amber-50 dark:bg-amber-900/20" : "text-muted-foreground hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                                    )}
                                    onClick={handleBookmark}
                                >
                                    <TbBookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
                                </Button>
                            </div>

                            {/* Read More Button */}
                            <div className="flex justify-end">
                                <Link href={`/blog/${post.slug}`}>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-8 text-[10px] font-bold tracking-wide group-hover:bg-primary group-hover:text-white transition-colors"
                                    >
                                        სრულად
                                        <TbArrowRight className="w-3 h-3 ml-1.5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>


                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function formatDateShort(dateString: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ka-GE', { month: 'short', day: 'numeric' });
}

// Skeleton component for loading state
export function PostCardSkeleton() {
    return (
        <Card className="h-full border-0 bg-card rounded-xl overflow-hidden shadow-sm">
            <CardContent className="p-0 h-full flex flex-col">
                {/* Image Skeleton */}
                <div className="aspect-[16/10] bg-muted animate-pulse" />

                {/* Content Skeleton */}
                <div className="p-5 flex-1 flex flex-col space-y-4">
                    <div className="flex gap-2">
                        <div className="h-4 w-16 bg-muted rounded-md" />
                        <div className="h-4 w-12 bg-muted rounded-md" />
                    </div>

                    <div className="space-y-2">
                        <div className="h-5 bg-muted rounded-md w-full" />
                        <div className="h-5 bg-muted rounded-md w-2/3" />
                    </div>

                    <div className="h-12 w-full bg-muted/50 rounded-md" />

                    <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-muted" />
                            <div className="space-y-1">
                                <div className="h-3 w-20 bg-muted rounded" />
                                <div className="h-2 w-12 bg-muted rounded" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="h-4 w-8 bg-muted rounded" />
                            <div className="h-4 w-8 bg-muted rounded" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
