"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Play,
    Eye,
    Clock,
    Heart,
    MessageCircle,
    Share2,
    Youtube,
    Bookmark
} from "lucide-react"
import { useState } from "react"

interface Video {
    id: string
    title: string
    description?: string
    thumbnail?: string
    duration: string
    views: number
    likes?: number
    comments?: number
    category?: string
    youtubeId?: string
    featured?: boolean
}

interface VideoCardProps {
    video: Video
    variant?: "default" | "short" | "featured"
}

// Format numbers
function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
}

export function VideoCard({ video, variant = "default" }: VideoCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsBookmarked(!isBookmarked)
    }

    const thumbnailUrl = video.thumbnail ||
        (video.youtubeId ? `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg` : null)

    const isShort = variant === "short" || video.duration.includes("0:")

    return (
        <Link href={video.youtubeId ? `https://youtube.com/watch?v=${video.youtubeId}` : "#"} target="_blank">
            <Card
                className="group h-full border-0 shadow-lg bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <CardContent className="p-0">
                    {/* Thumbnail */}
                    <div className={`relative overflow-hidden ${isShort ? 'aspect-[9/16]' : 'aspect-video'}`}>
                        {/* Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-purple-500/20" />

                        {/* Thumbnail Image */}
                        {thumbnailUrl ? (
                            <Image
                                src={thumbnailUrl}
                                alt={video.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-500/30 to-purple-500/30">
                                <Youtube className="w-16 h-16 text-white/50" />
                            </div>
                        )}

                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Play button */}
                        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-70 scale-90'
                            }`}>
                            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                                <Play className="w-7 h-7 text-white fill-current ml-1" />
                            </div>
                        </div>

                        {/* Duration badge */}
                        <Badge className="absolute bottom-3 right-3 bg-black/80 text-white border-0 text-xs z-10">
                            {video.duration}
                        </Badge>

                        {/* Category badge */}
                        {video.category && (
                            <Badge className="absolute top-3 left-3 bg-red-500/90 text-white border-0 text-xs z-10 backdrop-blur-sm">
                                {video.category}
                            </Badge>
                        )}

                        {/* Bookmark button */}
                        <button
                            onClick={handleBookmark}
                            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${isBookmarked
                                    ? "bg-primary text-white"
                                    : "bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                                } ${isHovered || isBookmarked ? "opacity-100" : "opacity-0"}`}
                        >
                            <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                        </button>

                        {/* Featured badge */}
                        {video.featured && (
                            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs z-10">
                                რჩეული
                            </Badge>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                        {/* Title */}
                        <h3 className="font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {video.title}
                        </h3>

                        {/* Description */}
                        {video.description && !isShort && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {video.description}
                            </p>
                        )}

                        {/* Stats */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted-foreground">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                    <Eye className="w-3.5 h-3.5" />
                                    {formatNumber(video.views)}
                                </span>
                                {video.likes && (
                                    <span className="flex items-center gap-1 text-red-500">
                                        <Heart className="w-3.5 h-3.5" />
                                        {formatNumber(video.likes)}
                                    </span>
                                )}
                            </div>
                            {video.comments && (
                                <span className="flex items-center gap-1">
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    {formatNumber(video.comments)}
                                </span>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
