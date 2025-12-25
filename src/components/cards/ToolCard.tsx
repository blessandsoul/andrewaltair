"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ExternalLink,
    Star,
    Bookmark,
    Sparkles,
    Zap,
    Crown
} from "lucide-react"
import { useState } from "react"

interface Tool {
    id: string
    name: string
    description: string
    category: string
    url: string
    icon?: string
    featured?: boolean
    pricing?: "free" | "freemium" | "paid"
    rating?: number
    tags?: string[]
}

interface ToolCardProps {
    tool: Tool
    categoryColor?: string
}

export function ToolCard({ tool, categoryColor = "#6366f1" }: ToolCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsBookmarked(!isBookmarked)
    }

    // Pricing badge config
    const pricingConfig = {
        free: { label: "უფასო", color: "#10b981", icon: "✓" },
        freemium: { label: "Freemium", color: "#f59e0b", icon: "⚡" },
        paid: { label: "ფასიანი", color: "#ef4444", icon: "💎" },
    }

    const pricingInfo = pricingConfig[tool.pricing || "free"]

    return (
        <Link href={tool.url} target="_blank">
            <Card
                className="group h-full border-0 shadow-lg bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <CardContent className="p-5 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                        {/* Tool Icon */}
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 group-hover:scale-110"
                            style={{
                                background: `linear-gradient(135deg, ${categoryColor}20, ${categoryColor}10)`,
                                boxShadow: isHovered ? `0 8px 32px ${categoryColor}30` : 'none'
                            }}
                        >
                            {tool.icon || "🔧"}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col items-end gap-2">
                            {tool.featured && (
                                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs">
                                    <Crown className="w-3 h-3 mr-1" />
                                    ტოპ
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

                    {/* Title & Description */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                                {tool.name}
                            </h3>
                            {tool.rating && (
                                <span className="flex items-center gap-0.5 text-yellow-500 text-sm">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    {tool.rating}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {tool.description}
                        </p>
                    </div>

                    {/* Tags */}
                    {tool.tags && tool.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {tool.tags.slice(0, 3).map(tag => (
                                <span
                                    key={tag}
                                    className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        {/* Pricing */}
                        <Badge
                            variant="outline"
                            className="text-xs font-medium"
                            style={{
                                borderColor: pricingInfo.color,
                                color: pricingInfo.color
                            }}
                        >
                            {pricingInfo.icon} {pricingInfo.label}
                        </Badge>

                        {/* Category + Link */}
                        <div className="flex items-center gap-2">
                            <Badge
                                variant="secondary"
                                className="text-xs"
                                style={{
                                    backgroundColor: `${categoryColor}15`,
                                    color: categoryColor
                                }}
                            >
                                {tool.category}
                            </Badge>
                            <ExternalLink className={`w-4 h-4 text-muted-foreground transition-all duration-300 ${isHovered ? 'text-primary translate-x-1' : ''}`} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
