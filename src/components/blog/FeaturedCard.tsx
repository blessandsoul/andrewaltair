"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TbEye, TbFlame, TbHeart, TbMessage, TbShare, TbClock, TbBookmark, TbSparkles, TbStar, TbArrowRight } from "react-icons/tb"
import { brand } from "@/lib/brand"
import { useState } from "react"

interface Post {
    id: string
    slug: string
    title: string
    excerpt: string
    category: string
    coverImage?: string
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

interface FeaturedCardProps {
    post: Post
}

// Format numbers
function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
}

// Get total reactions
function getTotalReactions(reactions: Record<string, number>): number {
    return Object.values(reactions).reduce((a, b) => a + b, 0)
}

// Get category info
function getCategoryInfo(categoryId: string) {
    const normalizedId = categoryId?.trim().toLowerCase()
    return brand.categories.find(c => c.id.toLowerCase() === normalizedId) || {
        id: categoryId,
        name: categoryId,
        color: "#6366f1"
    }
}

// Format relative date
function formatRelativeDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "დღეს"
    if (diffDays === 1) return "გუშინ"
    if (diffDays < 7) return `${diffDays} დღის წინ`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} კვირის წინ`
    return `${Math.floor(diffDays / 30)} თვის წინ`
}

export function FeaturedCard({ post }: FeaturedCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const categoryInfo = getCategoryInfo(post.category)

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsBookmarked(!isBookmarked)
    }

    return (
        <Link href={`/blog/${post.slug}`}>
            <Card
                className="group h-full border-0 shadow-xl bg-card transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <CardContent className="p-0">
                    {/* TbPhoto Container - Larger aspect ratio for featured */}
                    <div className="aspect-[2/1] relative overflow-hidden">
                        {/* Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />

                        {/* TbPhoto */}
                        {post.coverImage ? (
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <TbSparkles className="w-16 h-16 text-primary/30" />
                            </div>
                        )}

                        {/* Premium gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                        {/* Featured Badge */}
                        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 px-3 py-1">
                                <TbStar className="w-3 h-3 mr-1 fill-current" />
                                რჩეული
                            </Badge>
                            {post.trending && (
                                <Badge className="bg-red-500/90 text-white border-0 backdrop-blur-sm">
                                    <TbFlame className="w-3 h-3 mr-1" />
                                    ტრენდში
                                </Badge>
                            )}
                        </div>

                        {/* Category Badge */}
                        <Badge
                            className="absolute top-4 right-4 text-xs z-10 border-0 backdrop-blur-md"
                            style={{
                                backgroundColor: `${categoryInfo.color}40`,
                                color: "white"
                            }}
                        >
                            {categoryInfo.name}
                        </Badge>

                        {/* Bookmark */}
                        <button
                            onClick={handleBookmark}
                            className={`absolute top-4 right-24 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${isBookmarked
                                ? "bg-primary text-white"
                                : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                                } ${isHovered || isBookmarked ? "opacity-100" : "opacity-0"}`}
                        >
                            <TbBookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                        </button>

                        {/* Content overlay on image */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                            {/* Title */}
                            <h3 className="text-xl md:text-2xl font-bold text-white leading-tight line-clamp-2 mb-3 group-hover:text-primary-foreground transition-colors">
                                {post.title}
                            </h3>

                            {/* Stats row */}
                            <div className="flex items-center gap-4 text-white/80 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                                        {post.author.name.charAt(0)}
                                    </div>
                                    <span>{post.author.name}</span>
                                </div>
                                <span>•</span>
                                <span>{formatRelativeDate(post.publishedAt)}</span>

                            </div>
                        </div>
                    </div>

                    {/* Bottom stats bar */}
                    <div className="px-6 py-4 flex items-center justify-between border-t border-border/50">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1 hover:text-foreground transition-colors">
                                <TbEye className="w-4 h-4" />
                                {formatNumber(post.views)}
                            </span>
                            <span className="flex items-center gap-1 hover:text-foreground transition-colors">
                                <TbMessage className="w-4 h-4" />
                                {formatNumber(post.comments)}
                            </span>
                            <span className="flex items-center gap-1 text-red-500">
                                <TbHeart className="w-4 h-4" />
                                {formatNumber(getTotalReactions(post.reactions))}
                            </span>
                            <span className="flex items-center gap-1 hover:text-foreground transition-colors">
                                <TbShare className="w-4 h-4" />
                                {formatNumber(post.shares)}
                            </span>
                        </div>

                        {/* Read more */}
                        <div className={`flex items-center gap-1 text-primary text-sm font-medium transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
                            <span>წაიკითხე</span>
                            <TbArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
