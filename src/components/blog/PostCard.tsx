"use client"

import Link from "next/link"
import TbPhoto from "next/image"
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
    category: string
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
    showAuthor = true
}: PostCardProps) {
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const categoryInfo = getCategoryInfo(post.category)

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
                <CardContent className="p-0">
                    {/* TbPhoto Container */}
                    <div className="aspect-video relative overflow-hidden">
                        {/* Background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />

                        {/* TbPhoto */}
                        {(post.coverImage || post.coverImages?.horizontal) ? (
                            <TbPhoto
                                src={post.coverImages?.horizontal || post.coverImage || ''}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <TbSparkles className="w-10 h-10 text-primary/30 group-hover:scale-110 transition-transform" />
                            </div>
                        )}

                        {/* Gradient Overlay - для читаемости текста */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Category Badge with color */}
                        <Badge
                            className="absolute top-3 left-3 text-xs z-10 border-0 backdrop-blur-sm"
                            style={{
                                backgroundColor: `${categoryInfo.color}20`,
                                color: categoryInfo.color,
                                borderColor: categoryInfo.color
                            }}
                        >
                            {categoryInfo.name}
                        </Badge>

                        {/* Trending Badge */}
                        {post.trending && (
                            <Badge className="absolute top-3 right-12 bg-red-500 text-white border-0 text-xs z-10 animate-pulse">
                                <TbFlame className="w-3 h-3 mr-1" />
                                ცხელი
                            </Badge>
                        )}

                        {/* Bookmark Button */}
                        <button
                            onClick={handleBookmark}
                            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${isBookmarked
                                ? "bg-primary text-white"
                                : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:bg-background hover:text-primary"
                                } ${isHovered || isBookmarked ? "opacity-100" : "opacity-0"}`}
                        >
                            <TbBookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                        </button>

                        {/* Hover Preview Overlay */}
                        <div className={`absolute inset-x-0 bottom-0 p-4 transition-all duration-300 ${isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                            }`}>
                            <p className="text-white text-sm line-clamp-2 drop-shadow-lg">
                                {post.excerpt}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3 flex flex-col h-full">
                        {/* Tags Row - Premium Badges */}
                        {showTags && post.tags && post.tags.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                {post.tags.slice(0, 2).map(tag => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="text-[10px] font-medium bg-secondary/50 text-secondary-foreground hover:bg-secondary px-2 py-0.5 rounded-full transition-colors"
                                    >
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Title */}
                        <h3 className="text-lg font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                        </h3>

                        {/* Excerpt - Ensuring visibility */}
                        {showExcerpt && variant !== "compact" && (
                            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                {post.excerpt}
                            </p>
                        )}

                        <div className="flex-1" /> {/* Spacer */}

                        {/* Author & Date Row */}
                        {showAuthor && (
                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                                <div className="flex items-center gap-2 group/author">
                                    {/* Author Avatar with Ring */}
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold ring-2 ring-background shadow-sm group-hover/author:scale-110 transition-transform">
                                        {post.author.name.charAt(0)}
                                    </div>
                                    <span className="font-medium group-hover/author:text-foreground transition-colors">{post.author.name}</span>
                                </div>
                                <div className="flex items-center gap-1 bg-secondary/30 px-2 py-1 rounded-full">
                                    <TbClock className="w-3 h-3" />
                                    <span>{formatRelativeDate(post.publishedAt)}</span>
                                </div>
                            </div>
                        )}

                        {/* Stats & Read More Row */}
                        <div className="flex items-center justify-between pt-4 mt-2 border-t border-border/50">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                    <TbEye className="w-4 h-4" />
                                    {formatNumber(post.views)}
                                </span>
                                <span className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                                    <TbMessage className="w-4 h-4" />
                                    {formatNumber(post.comments)}
                                </span>
                                <span className="flex items-center gap-1.5 text-red-500/80 hover:text-red-600 transition-colors">
                                    <TbHeart className="w-4 h-4" />
                                    {formatNumber(getTotalReactions(post.reactions))}
                                </span>
                            </div>

                            {/* Read More Text CTA */}
                            <div className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                წაიკითხე
                                <TbArrowRight className="w-3.5 h-3.5" />
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
