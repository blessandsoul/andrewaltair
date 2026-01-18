"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    TbChevronLeft,
    TbChevronRight,
    TbFlame,
    TbEye,
    TbHeart,
    TbClock,
    TbSparkles
} from "react-icons/tb"
import { brand } from "@/lib/brand"

// Helper to get category info
function getCategoryInfo(categoryId?: string) {
    if (!categoryId) return { name: 'ბლოგი', color: '#6366f1' }
    const normalizedId = String(categoryId).trim().toLowerCase()

    // Flat search including subcategories
    const allCategories = brand.categories.flatMap(c => [c, ...(c.subcategories || [])])
    return allCategories.find(c => String(c.id).toLowerCase() === normalizedId) || {
        id: categoryId,
        name: categoryId, // Fallback
        color: "#6366f1"
    }
}

interface Post {
    id: string
    slug: string
    title: string
    excerpt: string
    coverImage?: string
    coverImages?: {
        horizontal?: string
        vertical?: string
    }
    category?: string
    trending?: boolean
    featured?: boolean
    views: number
    readingTime: number
    reactions: Record<string, number>
    author?: {
        name: string
        avatar?: string
        role?: string
    }
}

interface HeroCarouselProps {
    posts: Post[]
    autoPlayInterval?: number
}

// Helper to format numbers
function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

// Helper to get total reactions
function getTotalReactions(reactions: Record<string, number>): number {
    return Object.values(reactions || {}).reduce((a, b) => a + b, 0)
}

export function HeroCarousel({ posts, autoPlayInterval = 5000 }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % posts.length)
    }, [posts.length])

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length)
    }, [posts.length])

    // Auto-play
    useEffect(() => {
        if (isHovered || posts.length <= 1) return

        const interval = setInterval(goToNext, autoPlayInterval)
        return () => clearInterval(interval)
    }, [isHovered, goToNext, autoPlayInterval, posts.length])

    if (posts.length === 0) return null

    const currentPost = posts[currentIndex]

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentPost.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <Card className="relative glass-strong rounded-3xl overflow-hidden hover-lift group">
                        <CardContent className="p-0">
                            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative overflow-hidden">
                                {(currentPost.coverImage || currentPost.coverImages?.horizontal) ? (
                                    <Image
                                        src={currentPost.coverImages?.horizontal || currentPost.coverImage || ''}
                                        alt={currentPost.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        priority
                                    />
                                ) : (
                                    <TbSparkles className="w-16 h-16 text-primary/50" />
                                )}

                                {/* Dark gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Badges */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                    {currentPost.trending && (
                                        <Badge className="bg-red-500 text-white border-0 backdrop-blur-md">
                                            <TbFlame className="w-3 h-3 mr-1" />
                                            ტრენდული
                                        </Badge>
                                    )}
                                    <Badge
                                        variant="outline"
                                        className="border-0 backdrop-blur-md w-fit"
                                        style={{
                                            backgroundColor: `${getCategoryInfo(currentPost.category).color}40`,
                                            color: "white"
                                        }}
                                    >
                                        {getCategoryInfo(currentPost.category).name}
                                    </Badge>
                                </div>

                                {/* Author Indicator - Top Right */}
                                {currentPost.author && (
                                    <div className="absolute top-4 right-4 z-10 hidden sm:block">
                                        <div className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-lg">
                                            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/20">
                                                <Image
                                                    src={(currentPost.author.name.includes('Andrew') || currentPost.author.role === 'god') ? '/andrewaltair.png' : (currentPost.author.avatar || '/logo.png')}
                                                    alt={currentPost.author.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-white/90">
                                                {currentPost.author.name}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10 text-white/90 text-sm">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1.5">
                                            <TbEye className="w-4 h-4" />
                                            {formatNumber(currentPost.views || 0)}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <TbHeart className="w-4 h-4 text-red-500 fill-red-500" />
                                            {formatNumber(getTotalReactions(currentPost.reactions))}
                                        </span>
                                    </div>
                                    <span className="flex items-center gap-1.5">
                                        <TbClock className="w-4 h-4" />
                                        {currentPost.readingTime || 5} წთ
                                    </span>
                                </div>

                                {/* Navigation Arrows - Always visible */}
                                {posts.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => { e.preventDefault(); goToPrev(); }}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg"
                                            aria-label="Previous post"
                                        >
                                            <TbChevronLeft className="w-7 h-7" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.preventDefault(); goToNext(); }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg"
                                            aria-label="Next post"
                                        >
                                            <TbChevronRight className="w-7 h-7" />
                                        </button>
                                        {/* Slide counter badge - moved down to avoid author avatar */}
                                        <div className="absolute top-14 right-4 z-20 bg-black/60 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full pointer-events-none">
                                            {currentIndex + 1} / {posts.length}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="p-6 space-y-4">
                                <h3 className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                    {currentPost.title}
                                </h3>
                                <p className="text-muted-foreground line-clamp-2">
                                    {currentPost.excerpt}
                                </p>

                                <div className="flex items-center justify-between pt-2">
                                    <Button variant="ghost" size="sm" className="text-primary p-0 h-auto hover:bg-transparent hover:text-primary/80" asChild>
                                        <Link href={`/blog/${currentPost.slug}`} className="group/link flex items-center">
                                            წაიკითხე სრულად
                                            <TbChevronRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>

                                    {/* Dots indicator */}
                                    {posts.length > 1 && (
                                        <div className="flex items-center gap-2">
                                            {posts.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentIndex(index)}
                                                    className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                                        ? 'bg-primary w-6'
                                                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                                                        }`}
                                                    aria-label={`Go to slide ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
