"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ExternalLink,
    Star,
    Bookmark,
    Download,
    Users,
    Calendar
} from "lucide-react"
import { useState } from "react"

interface Resource {
    id: string
    title: string
    description: string
    category: string
    type: string
    url: string
    featured?: boolean
    downloads?: number
    users?: number
    rating?: number
    date?: string
}

interface ResourceCardProps {
    resource: Resource
    categoryColor?: string
}

// Format numbers
function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
}

export function ResourceCard({ resource, categoryColor = "#6366f1" }: ResourceCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsBookmarked(!isBookmarked)
    }

    // Type icons
    const typeConfig: Record<string, { icon: string; color: string }> = {
        "pdf": { icon: "📄", color: "#ef4444" },
        "video": { icon: "🎬", color: "#8b5cf6" },
        "course": { icon: "📚", color: "#10b981" },
        "template": { icon: "📋", color: "#f59e0b" },
        "tool": { icon: "🔧", color: "#6366f1" },
        "ebook": { icon: "📖", color: "#ec4899" },
    }

    const typeInfo = typeConfig[resource.type] || { icon: "📁", color: "#71717a" }

    return (
        <Link href={resource.url} target="_blank">
            <Card
                className="group h-full border-0 shadow-lg bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <CardContent className="p-5 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                        {/* Icon */}
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300"
                            style={{ backgroundColor: `${typeInfo.color}15` }}
                        >
                            {typeInfo.icon}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {resource.featured && (
                                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs">
                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                    რჩეული
                                </Badge>
                            )}
                            <button
                                onClick={handleBookmark}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isBookmarked
                                        ? "bg-primary text-white"
                                        : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                    } ${isHovered || isBookmarked ? "opacity-100" : "opacity-0"}`}
                            >
                                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                            </button>
                        </div>
                    </div>

                    {/* Category badge */}
                    <Badge
                        variant="secondary"
                        className="text-xs"
                        style={{
                            backgroundColor: `${categoryColor}15`,
                            color: categoryColor
                        }}
                    >
                        {resource.category}
                    </Badge>

                    {/* Title & Description */}
                    <div className="space-y-2">
                        <h3 className="font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {resource.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {resource.description}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                            {resource.downloads && (
                                <span className="flex items-center gap-1">
                                    <Download className="w-3.5 h-3.5" />
                                    {formatNumber(resource.downloads)}
                                </span>
                            )}
                            {resource.users && (
                                <span className="flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5" />
                                    {formatNumber(resource.users)}
                                </span>
                            )}
                            {resource.rating && (
                                <span className="flex items-center gap-1 text-yellow-500">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    {resource.rating}
                                </span>
                            )}
                        </div>

                        {/* Open link icon */}
                        <ExternalLink className={`w-4 h-4 transition-all duration-300 ${isHovered ? 'text-primary translate-x-1' : ''}`} />
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
