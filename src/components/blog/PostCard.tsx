"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TbEye, TbFlame, TbHeart, TbMessage, TbShare, TbClock, TbBookmark, TbSparkles, TbArrowRight } from "react-icons/tb"
import { brand } from "@/lib/brand"
import { useState } from "react"

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
    showAuthor = false
}: PostCardProps) {
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const categoryStr = post.categories && post.categories.length > 0 ? post.categories[0] : ((post as any).category || 'ai')
    const categoryInfo = getCategoryInfo(categoryStr)

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsBookmarked(!isBookmarked)
    }

    return (
        <Link href={`/blog/${post.slug}`}>
            <Card
                className="group h-full border-0 shadow-lg bg-card transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <CardContent className="p-0 h-full">
                    {/* Horizontal Layout - Compact Design */}
                    <div className="flex h-full">
                        {/* Thumbnail - Left Side (compact) - stretches to full height */}
                        <div className="relative w-32 min-h-[140px] flex-shrink-0 overflow-hidden rounded-l-xl self-stretch">
                            {/* Background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />

                            {/* Image */}
                            {(post.coverImage || post.coverImages?.horizontal) ? (
                                <Image
                                    src={post.coverImages?.horizontal || post.coverImage || ''}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <TbSparkles className="w-8 h-8 text-primary/40 group-hover:scale-110 transition-transform" />
                                </div>
                            )}

                            {/* Category Badge overlay */}
                            <Badge
                                className="absolute bottom-2 left-2 text-[10px] z-10 border-0 shadow-md font-semibold"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    color: categoryInfo.color
                                }}
                            >
                                {categoryInfo.name}
                            </Badge>

                            {/* Trending Badge */}
                            {post.trending && (
                                <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0 text-[10px] z-10 px-1.5 py-0.5">
                                    <TbFlame className="w-3 h-3" />
                                </Badge>
                            )}
                        </div>

                        {/* Content - Right Side */}
                        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                            {/* Tags */}
                            {showTags && post.tags && post.tags.length > 0 && (
                                <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                                    {post.tags.slice(0, 2).map(tag => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="text-[9px] font-medium bg-secondary/50 text-secondary-foreground px-1.5 py-0 rounded-full"
                                        >
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Title */}
                            <h3 className="text-sm font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors mb-1.5">
                                {post.title}
                            </h3>

                            {/* Excerpt */}
                            {showExcerpt && variant !== "compact" && (
                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">
                                    {post.excerpt}
                                </p>
                            )}

                            {/* Bottom Row - Author & Stats */}
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-auto pt-2 border-t border-border/30">
                                {/* Author */}
                                {showAuthor && (
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-[9px] font-bold">
                                            {post.author.name.charAt(0)}
                                        </div>
                                        <span className="font-medium truncate max-w-[60px]">{post.author.name}</span>
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center gap-0.5">
                                        <TbEye className="w-3 h-3" />
                                        {formatNumber(post.views)}
                                    </span>
                                    <span className="flex items-center gap-0.5 text-red-500/80">
                                        <TbHeart className="w-3 h-3" />
                                        {formatNumber(getTotalReactions(post.reactions))}
                                    </span>
                                    <TbArrowRight className="w-3 h-3 text-primary group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

// Skeleton component for loading state
export function PostCardSkeleton() {
    return (
        <Card className="h-full border-0 shadow-lg bg-card animate-pulse">
            <CardContent className="p-0">
                {/* TbPhoto skeleton */}
                <div className="aspect-video bg-muted" />

                {/* Content skeleton */}
                <div className="p-4 space-y-3">
                    {/* Tags skeleton */}
                    <div className="flex gap-2">
                        <div className="h-4 w-16 bg-muted rounded" />
                        <div className="h-4 w-12 bg-muted rounded" />
                    </div>

                    {/* Title skeleton */}
                    <div className="space-y-2">
                        <div className="h-5 bg-muted rounded w-full" />
                        <div className="h-5 bg-muted rounded w-3/4" />
                    </div>

                    {/* Author skeleton */}
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-muted" />
                        <div className="h-4 w-24 bg-muted rounded" />
                    </div>

                    {/* Stats skeleton */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div className="flex gap-3">
                            <div className="h-4 w-12 bg-muted rounded" />
                            <div className="h-4 w-12 bg-muted rounded" />
                        </div>
                        <div className="flex gap-3">
                            <div className="h-4 w-12 bg-muted rounded" />
                            <div className="h-4 w-12 bg-muted rounded" />
                        </div>
                    </div>


                </div>
            </CardContent>
        </Card>
    )
}
