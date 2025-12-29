"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Users, Eye } from "lucide-react"

interface LiveVisitorCounterProps {
    className?: string
    minVisitors?: number
    maxVisitors?: number
    showLabel?: boolean
    variant?: "badge" | "inline" | "floating"
}

export function LiveVisitorCounter({
    className,
    minVisitors = 15,
    maxVisitors = 150,
    showLabel = true,
    variant = "badge",
}: LiveVisitorCounterProps) {
    const [count, setCount] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        // Initialize with a random count
        const initial = Math.floor(minVisitors + Math.random() * (maxVisitors - minVisitors))
        setCount(initial)

        // Simulate count changes
        const interval = setInterval(() => {
            setCount((prev) => {
                const change = Math.floor(Math.random() * 5) - 2 // -2 to +2
                const newCount = Math.max(minVisitors, Math.min(maxVisitors, prev + change))

                if (newCount !== prev) {
                    setIsAnimating(true)
                    setTimeout(() => setIsAnimating(false), 300)
                }

                return newCount
            })
        }, 3000 + Math.random() * 2000)

        return () => clearInterval(interval)
    }, [minVisitors, maxVisitors])

    if (variant === "floating") {
        return (
            <div
                className={cn(
                    "fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-card/90 backdrop-blur-lg px-4 py-2 shadow-lg border",
                    className
                )}
            >
                <div className="relative">
                    <Eye className="h-4 w-4 text-primary" />
                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <span
                    className={cn(
                        "font-bold tabular-nums transition-all",
                        isAnimating && "scale-110 text-primary"
                    )}
                >
                    {count}
                </span>
                {showLabel && (
                    <span className="text-sm text-muted-foreground">ონლაინ</span>
                )}
            </div>
        )
    }

    if (variant === "inline") {
        return (
            <span className={cn("inline-flex items-center gap-1.5", className)}>
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <span
                    className={cn(
                        "font-medium tabular-nums transition-all",
                        isAnimating && "text-primary"
                    )}
                >
                    {count}
                </span>
                {showLabel && (
                    <span className="text-muted-foreground">კითხულობს ახლა</span>
                )}
            </span>
        )
    }

    // Default badge variant
    return (
        <div
            className={cn(
                "inline-flex items-center gap-2 rounded-full bg-secondary/80 backdrop-blur px-3 py-1.5",
                className
            )}
        >
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span
                className={cn(
                    "text-sm font-semibold tabular-nums transition-all",
                    isAnimating && "scale-110 text-primary"
                )}
            >
                {count}
            </span>
            {showLabel && (
                <span className="text-sm text-muted-foreground">ონლაინ</span>
            )}
        </div>
    )
}

// Page-specific visitor counter
export function PageVisitorCounter({
    pageSlug,
    className,
}: {
    pageSlug: string
    className?: string
}) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        // Simulate based on page slug hash
        const hash = pageSlug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
        const baseCount = (hash % 50) + 5

        setCount(baseCount)

        const interval = setInterval(() => {
            setCount((prev) => {
                const change = Math.floor(Math.random() * 3) - 1
                return Math.max(1, prev + change)
            })
        }, 5000)

        return () => clearInterval(interval)
    }, [pageSlug])

    return (
        <span className={cn("inline-flex items-center gap-1.5 text-sm text-muted-foreground", className)}>
            <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
            </span>
            {count} ადამიანი კითხულობს
        </span>
    )
}
