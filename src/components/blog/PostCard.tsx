"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TbEye, TbFlame, TbHeart, TbMessage, TbShare, TbClock, TbBookmark, TbSparkles, TbArrowRight } from "react-icons/tb"
import { brand } from "@/lib/brand"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface Post {
    id: string
    slug: string
    title: string
    excerpt: string
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

    const categoryStr = post.categories && post.categories.length > 0 ? post.categories[0] : ((post as any).category || 'ai')
    const categoryInfo = getCategoryInfo(categoryStr)

    // Resolve cover image
    const coverImage = post.coverImages?.horizontal || post.coverImage

    return (
        <Link href={`/blog/${post.slug}`} className="block h-full">
            <Card
                className={cn(
                    "group h-full border-0 bg-card/50 dark:bg-card/40 overflow-hidden transition-all duration-500",
                    "hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 hover:bg-card dark:hover:bg-card",
                    "dark:hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.05)]",
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

                        {/* Image */}
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

                        {/* Gradient Overlay - fades in on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

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

                        {/* Bottom Stats Overlay (on image) */}
                        <div className="absolute bottom-3 right-3 flex items-center gap-2 text-white/90 text-[10px] font-medium z-10">
                            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
                                <TbClock className="w-3 h-3" />
                                {post.readingTime} წთ
                            </span>
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

                        {/* Title */}
                        <h3 className="text-lg font-bold leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                        </h3>

                        {/* Excerpt */}
                        {showExcerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-5 leading-relaxed">
                                {post.excerpt}
                            </p>
                        )}

                        <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
                            {/* Author */}
                            {showAuthor && post.author && (
                                <div className="flex items-center gap-2">
                                    {post.author.avatar && !avatarError ? (
                                        <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-background shadow-sm">
                                            <Image
                                                src={post.author.avatar}
                                                alt={post.author.name}
                                                fill
                                                className="object-cover"
                                                onError={() => setAvatarError(true)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
                                            {post.author.name ? post.author.name.charAt(0) : '?'}
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                                            {post.author.name}
                                        </span>
                                        <time dateTime={post.publishedAt} className="text-[10px] text-muted-foreground">
                                            {formatDateShort(post.publishedAt)}
                                        </time>
                                    </div>
                                </div>
                            )}

                            {/* Interactions */}
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1 group/stat hover:text-primary transition-colors">
                                    <TbEye className="w-4 h-4" />
                                    <span className="font-medium">{formatNumber(post.views)}</span>
                                </div>
                                <div className="flex items-center gap-1 group/stat hover:text-red-500 transition-colors">
                                    <TbHeart className="w-4 h-4" />
                                    <span className="font-medium">{formatNumber(getTotalReactions(post.reactions))}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
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
