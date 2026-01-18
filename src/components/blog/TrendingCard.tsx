"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TbEye, TbFlame, TbHeart, TbSparkles, TbTrendingUp, TbChartLine } from "react-icons/tb"
import { brand } from "@/lib/brand"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { getCategoryInfo, formatNumber, getTotalReactions } from "@/lib/blog-utils"

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



export function TrendingCard({ post, rank }: TrendingCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [imageError, setImageError] = useState(false)
    const categoryInfo = getCategoryInfo(post.category)

    // Rank colors
    const rankColors = {
        1: "from-yellow-400 to-orange-500 shadow-yellow-500/20", // Gold
        2: "from-slate-300 to-slate-400 shadow-slate-400/20",     // Silver
        3: "from-amber-600 to-amber-700 shadow-amber-600/20"    // Bronze
    }

    const rankGradient = rankColors[rank as keyof typeof rankColors] || "from-primary to-accent shadow-primary/20"

    const coverImage = post.coverImages?.horizontal || post.coverImage

    return (
        <Link href={`/blog/${post.slug}`} className="block h-full">
            <Card
                className="group h-full border-0 bg-card overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <CardContent className="p-0 flex h-24 sm:h-28">
                    {/* Rank Indicator */}
                    <div className="w-12 sm:w-14 flex items-center justify-center bg-secondary/30 border-r border-dashed border-border/60 relative overflow-hidden group-hover:bg-secondary/50 transition-colors">
                        <span className={cn(
                            "text-3xl sm:text-4xl font-black bg-gradient-to-br bg-clip-text text-transparent transform transition-transform duration-500",
                            rankGradient,
                            isHovered ? "scale-110" : ""
                        )}>
                            {rank}
                        </span>
                        <div className={cn("absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none")} />
                    </div>

                    {/* Image (Small Thumbnail) */}
                    <div className="relative w-24 sm:w-32 h-full overflow-hidden">
                        {coverImage && !imageError ? (
                            <Image
                                src={coverImage}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-secondary/10">
                                <TbSparkles className="w-6 h-6 text-primary/20" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-l from-card/0 to-black/20" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-3 sm:p-4 flex flex-col justify-center min-w-0">
                        {/* Category & Stats */}
                        <div className="flex items-center gap-2 mb-1.5 text-[10px] text-muted-foreground">
                            <span
                                className="font-bold uppercase tracking-wider"
                                style={{ color: categoryInfo.color }}
                            >
                                {categoryInfo.name}
                            </span>
                            <span className="w-0.5 h-0.5 rounded-full bg-border" />
                            <span className="flex items-center gap-1">
                                <TbChartLine className="w-3 h-3 text-green-500" />
                                +{formatNumber(post.views)}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm sm:text-base font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                        </h3>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
