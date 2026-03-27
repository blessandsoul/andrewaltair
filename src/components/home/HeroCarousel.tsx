"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  TbChevronLeft,
  TbChevronRight,
  TbFlame,
  TbEye,
  TbHeart,
  TbClock,
  TbSparkles,
  TbArrowRight,
} from "react-icons/tb"

import { getAuthorAvatar, getCategoryInfo, formatNumber, getTotalReactions } from "@/lib/blog-utils"

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
      className="relative rounded-2xl overflow-hidden group aspect-9/16 sm:aspect-auto sm:min-h-125"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPost.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* Mobile: vertical 9:16 image */}
          {(currentPost.coverImages?.vertical || currentPost.coverImage) && (
            <Image
              src={currentPost.coverImages?.vertical || currentPost.coverImage || ""}
              alt={currentPost.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 sm:hidden"
              priority
            />
          )}
          {/* Desktop: horizontal 16:9 image */}
          {(currentPost.coverImages?.horizontal || currentPost.coverImage) ? (
            <Image
              src={currentPost.coverImages?.horizontal || currentPost.coverImage || ""}
              alt={currentPost.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 hidden sm:block"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
              <TbSparkles className="w-20 h-20 text-primary/30" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Top badges */}
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
            backgroundColor: `${getCategoryInfo(currentPost.category || "ai").color}40`,
            color: "white",
          }}
        >
          {getCategoryInfo(currentPost.category || "ai").name}
        </Badge>
      </div>

      {/* Author — top right */}
      {currentPost.author && (
        <div className="absolute top-4 right-4 z-10 hidden sm:block">
          <div className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/20">
              <Image
                src={getAuthorAvatar(currentPost.author)}
                alt={currentPost.author.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs font-medium text-white/90">{currentPost.author.name}</span>
          </div>
        </div>
      )}

      {/* Bottom content overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 space-y-4">
        {/* Stats row */}
        <div className="flex items-center gap-4 text-white/80 text-sm">
          <span className="flex items-center gap-1.5">
            <TbEye className="w-4 h-4" />
            {formatNumber(currentPost.views || 0)}
          </span>
          <span className="flex items-center gap-1.5">
            <TbHeart className="w-4 h-4 text-red-400 fill-red-400" />
            {formatNumber(getTotalReactions(currentPost.reactions))}
          </span>
        </div>

        {/* Title & excerpt */}
        <div>
          <h2 className="text-xl sm:text-2xl font-headline font-bold text-white leading-tight line-clamp-2 mb-2">
            {currentPost.title}
          </h2>
          <p className="text-white/70 text-sm line-clamp-2 hidden sm:block">
            {currentPost.excerpt}
          </p>
        </div>

        {/* CTAs + dots */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/blog/${currentPost.slug}`}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-sm transition-all duration-300",
                "bg-linear-to-br from-primary to-primary-container text-white shadow-sm hover:shadow-lg hover:shadow-primary/20"
              )}
            >
              წაიკითხე
              <TbArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Dot indicators */}
          {posts.length > 1 && (
            <div className="flex items-center gap-2">
              {posts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex ? "bg-white w-6" : "bg-white/40 w-1.5 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prev/Next arrows */}
      {posts.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
            aria-label="Previous post"
          >
            <TbChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
            aria-label="Next post"
          >
            <TbChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  )
}
