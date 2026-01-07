"use client"

import Link from "next/link"
import TbPhoto from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TbEye, TbFlame, TbHeart, TbMessage, TbShare, TbClock, TbBookmark, TbSparkles, TbTrendingUp } from "react-icons/tb"
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

interface TrendingCardProps {
    post: Post
    rank: number
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

export function TrendingCard({ post, rank }: TrendingCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const categoryInfo = getCategoryInfo(post.category)

    // Rank colors
    const rankColors = {
        1: "from-yellow-400 to-orange-500", // Gold
        2: "from-gray-300 to-gray-400",     // Silver
        3: "from-amber-600 to-amber-700"    // Bronze
    }

    const rankColor = rankColors[rank as keyof typeof rankColors] || "from-primary to-accent"

    return (
        <Link href={`/blog/${post.slug}`}>
            <Card
                className="group h-full border-0 shadow-lg bg-card transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <CardContent className="p-0">
                    {/* TbPhoto Container */}
                    <div className="aspect-video relative overflow-hidden">
                        {/* Background */}
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
                                <TbSparkles className="w-12 h-12 text-primary/30" />
                            </div>
                        )}

                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Rank Badge - Premium style */}
                        <div className={`absolute top-3 left-3 w-12 h-12 bg-gradient-to-br ${rankColor} text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg z-10 transition-transform duration-300 ${isHovered ? 'scale-110 rotate-3' : ''}`}>
                            {rank}
                        </div>

                        {/* Category Badge */}
                        <Badge
                            className="absolute top-3 right-3 text-xs z-10 border-0 backdrop-blur-md"
                            style={{
                                backgroundColor: `${categoryInfo.color}30`,
                                color: categoryInfo.color
                            }}
                        >
                            {categoryInfo.name}
                        </Badge>

                        {/* Trending indicator */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs z-10">
                            <TbTrendingUp className="w-4 h-4 text-red-400" />
                            <span className="font-medium">ტრენდში</span>
                        </div>

                        {/* Stats on image */}
                        <div className="absolute bottom-3 right-3 flex items-center gap-3 text-white/90 text-xs z-10">
                            <span className="flex items-center gap-1">
                                <TbEye className="w-3.5 h-3.5" />
                                {formatNumber(post.views)}
                            </span>
                            <span className="flex items-center gap-1">
                                <TbHeart className="w-3.5 h-3.5 text-red-400" />
                                {formatNumber(getTotalReactions(post.reactions))}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                        {/* Title */}
                        <h3 className="text-lg font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {post.excerpt}
                        </p>

                        {/* Bottom row */}
                        <div className="flex items-center justify-between pt-3 border-t border-border/50">
                            {/* Author */}
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                                    {post.author.name.charAt(0)}
                                </div>
                                <span className="text-xs text-muted-foreground">{post.author.name}</span>
                            </div>


                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
