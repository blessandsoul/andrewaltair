"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { TbHash } from "react-icons/tb"

interface FloatingTagCloudProps {
    tags: string[]
    className?: string
    baseUrl?: string
}

// Generate random but consistent properties for each tag
function getTagStyle(index: number, total: number) {
    // Create a circular/orbital distribution
    const angle = (index / total) * 360
    const radius = 30 + (index % 3) * 15
    const duration = 15 + (index % 5) * 3
    const delay = index * 0.3
    const size = ['text-xs', 'text-sm', 'text-base', 'text-sm', 'text-xs'][index % 5]
    const opacity = [0.7, 0.85, 1, 0.9, 0.75][index % 5]

    // Different animation types
    const animationType = index % 4

    return { angle, radius, duration, delay, size, opacity, animationType }
}

export function FloatingTagCloud({ tags, className, baseUrl = "/blog" }: FloatingTagCloudProps) {
    const [hoveredTag, setHoveredTag] = React.useState<string | null>(null)

    if (!tags || tags.length === 0) return null

    // Limit to 20 tags for performance
    const displayTags = tags.slice(0, 20)

    return (
        <div
            className={cn(
                "relative w-full min-h-[300px] rounded-2xl overflow-hidden",
                "bg-gradient-to-br from-primary/5 via-transparent to-accent/5",
                "border border-border/30",
                className
            )}
        >
            {/* Background glow effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Center title */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full",
                    "bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg",
                    "transition-all duration-500",
                    "scale-100 opacity-100"
                )}>
                    <TbHash className="w-5 h-5 text-primary" />
                    <span className="text-sm font-semibold text-muted-foreground">თეგები</span>
                </div>
            </div>

            {/* Floating tags */}
            <div className="relative w-full h-full min-h-[300px]">
                {displayTags.map((tag, index) => {
                    const style = getTagStyle(index, displayTags.length)
                    const isTagHovered = hoveredTag === tag

                    // Position calculations
                    const centerX = 50
                    const centerY = 50
                    const startX = centerX + Math.cos((style.angle * Math.PI) / 180) * style.radius
                    const startY = centerY + Math.sin((style.angle * Math.PI) / 180) * style.radius

                    return (
                        <Link
                            key={tag}
                            href={`${baseUrl}?tag=${encodeURIComponent(tag)}`}
                            className={cn(
                                "absolute inline-flex items-center gap-1 px-3 py-1.5 rounded-full",
                                "bg-card/80 backdrop-blur-sm border border-border/50",
                                "hover:bg-primary hover:text-primary-foreground hover:border-primary",
                                "hover:scale-125 hover:z-50 hover:shadow-xl",
                                "transition-all duration-300 cursor-pointer",
                                "whitespace-nowrap",
                                style.size,
                                isTagHovered && "scale-125 z-50 bg-primary text-primary-foreground border-primary shadow-xl"
                            )}
                            style={{
                                left: `${startX}%`,
                                top: `${startY}%`,
                                transform: 'translate(-50%, -50%)',
                                opacity: style.opacity,
                                animation: `float${style.animationType} ${style.duration}s ease-in-out infinite`,
                                animationPlayState: isTagHovered ? 'paused' : 'running',
                                animationDelay: `${style.delay}s`,
                            }}
                            onMouseEnter={() => setHoveredTag(tag)}
                            onMouseLeave={() => setHoveredTag(null)}
                        >
                            <TbHash className="w-3 h-3 opacity-60" />
                            <span className="font-medium">{tag}</span>
                        </Link>
                    )
                })}
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes float0 {
                    0%, 100% {
                        transform: translate(-50%, -50%) translateY(0px) translateX(0px);
                    }
                    25% {
                        transform: translate(-50%, -50%) translateY(-15px) translateX(10px);
                    }
                    50% {
                        transform: translate(-50%, -50%) translateY(-5px) translateX(-5px);
                    }
                    75% {
                        transform: translate(-50%, -50%) translateY(10px) translateX(15px);
                    }
                }
                
                @keyframes float1 {
                    0%, 100% {
                        transform: translate(-50%, -50%) translateX(0px) rotate(0deg);
                    }
                    33% {
                        transform: translate(-50%, -50%) translateX(20px) rotate(2deg);
                    }
                    66% {
                        transform: translate(-50%, -50%) translateX(-15px) rotate(-2deg);
                    }
                }
                
                @keyframes float2 {
                    0%, 100% {
                        transform: translate(-50%, -50%) translateY(0px) scale(1);
                    }
                    50% {
                        transform: translate(-50%, -50%) translateY(-20px) scale(1.05);
                    }
                }
                
                @keyframes float3 {
                    0% {
                        transform: translate(-50%, -50%) translateX(0) translateY(0);
                    }
                    25% {
                        transform: translate(-50%, -50%) translateX(12px) translateY(-8px);
                    }
                    50% {
                        transform: translate(-50%, -50%) translateX(-8px) translateY(-15px);
                    }
                    75% {
                        transform: translate(-50%, -50%) translateX(-12px) translateY(5px);
                    }
                    100% {
                        transform: translate(-50%, -50%) translateX(0) translateY(0);
                    }
                }
            `}</style>
        </div>
    )
}

// Compact inline version for smaller spaces
export function TagCloudInline({ tags, className, baseUrl = "/blog" }: FloatingTagCloudProps) {
    if (!tags || tags.length === 0) return null

    return (
        <div className={cn("flex flex-wrap gap-2", className)}>
            {tags.slice(0, 15).map((tag, index) => (
                <Link
                    key={tag}
                    href={`${baseUrl}?tag=${encodeURIComponent(tag)}`}
                    className={cn(
                        "inline-flex items-center gap-1 px-3 py-1.5 rounded-full",
                        "bg-secondary/50 hover:bg-primary hover:text-primary-foreground",
                        "border border-transparent hover:border-primary/20",
                        "transition-all duration-300 hover:scale-105 hover:shadow-md",
                        "text-sm font-medium text-muted-foreground hover:text-primary-foreground"
                    )}
                    style={{
                        animationDelay: `${index * 50}ms`
                    }}
                >
                    <TbHash className="w-3 h-3" />
                    {tag}
                </Link>
            ))}
        </div>
    )
}

export default FloatingTagCloud
