"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TbEye, TbFlame, TbHeart, TbMessage, TbShare, TbBookmark, TbSparkles, TbStar, TbArrowRight, TbClock } from "react-icons/tb"
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
    const [imageError, setImageError] = useState(false)
    const [avatarError, setAvatarError] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const categoryStr = post.categories && post.categories.length > 0 ? post.categories[0] : ((post as unknown as { category: string }).category || 'ai')
    const categoryInfo = getCategoryInfo(categoryStr)

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsBookmarked(!isBookmarked)
    }

    return (
        <Link href={`/blog/${post.slug}`} className="block h-full">
            <Card
                className="group h-full border-0 bg-card overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <CardContent className="p-0 h-full relative">
                    {/* Background Image Container */}
                    <div className="absolute inset-0 z-0">
                        {post.coverImage && !imageError ? (
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                <TbSparkles className="w-20 h-20 text-white/20" />
                            </div>
                        )}

                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Content Container */}
                    <div className="relative z-10 p-8 h-full flex flex-col justify-end">

                        {/* Top Badges */}
                        <div className="absolute top-6 left-6 flex items-center gap-3">
                            <Badge className="bg-amber-400/90 text-black border-0 px-3 py-1 text-xs font-bold shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-pulse">
                                <TbStar className="w-3.5 h-3.5 mr-1.5 fill-black" />
                                <FEATURED>FEATURED</FEATURED>
                            </Badge>

                            <Badge
                                className="backdrop-blur-md border border-white/20 text-xs font-bold px-3 py-1 shadow-lg"
                                style={{
                                    backgroundColor: `${categoryInfo.color}CC`,
                                    color: "white"
                                }}
                            >
                                {categoryInfo.name}
                            </Badge>
                        </div>

                        {/* Bookmark Button */}
                        <button
                            onClick={handleBookmark}
                            className={cn(
                                "absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md",
                                isBookmarked
                                    ? "bg-primary text-white shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                            )}
                        >
                            <TbBookmark className={cn("w-5 h-5", isBookmarked && "fill-current")} />
                        </button>

                        <div className="space-y-4 max-w-2xl transform transition-transform duration-500 group-hover:translate-x-2">
                            {/* Meta Info */}
                            <div className="flex items-center gap-3 text-white/70 text-sm font-medium">
                                <span className="flex items-center gap-1.5">
                                    <TbClock className="w-4 h-4" />
                                    {formatRelativeDate(post.publishedAt)}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-white/30" />
                                <span>{post.readingTime} წთ კითხვა</span>
                            </div>

                            {/* Title */}
                            <h3 className="text-3xl sm:text-4xl font-bold text-white leading-tight drop-shadow-lg">
                                {post.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-lg text-white/80 line-clamp-2 leading-relaxed max-w-xl">
                                {post.excerpt}
                            </p>

                            {/* Author & Actions */}
                            <div className="pt-6 flex items-center justify-between border-t border-white/10">
                                <div className="flex items-center gap-3">
                                    {post.author.avatar && !avatarError ? (
                                        <div className="w-10 h-10 rounded-full ring-2 ring-white/20 overflow-hidden relative">
                                            <Image
                                                src={post.author.avatar}
                                                alt={post.author.name}
                                                fill
                                                className="object-cover"
                                                onError={() => setAvatarError(true)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white ring-2 ring-white/20">
                                            {post.author.name.charAt(0)}
                                        </div>
                                    )}

                                    <div>
                                        <div className="text-white font-medium text-sm">{post.author.name}</div>
                                        <div className="text-white/50 text-xs">{post.author.role}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <ButtonGhost icon={TbEye} count={formatNumber(post.views)} />
                                    <ButtonGhost icon={TbHeart} count={formatNumber(getTotalReactions(post.reactions))} className="hover:text-red-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

function ButtonGhost({ icon: Icon, count, className }: { icon: any, count: string, className?: string }) {
    return (
        <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-xs font-medium transition-colors hover:bg-white/10",
            className
        )}>
            <Icon className="w-4 h-4" />
            {count}
        </div>
    )
}
