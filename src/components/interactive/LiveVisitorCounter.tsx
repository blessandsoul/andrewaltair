"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { TbUsers, TbEye } from "react-icons/tb"

interface OnlineData {
    online: number
    desktop: number
    mobile: number
    tablet: number
}

interface LiveVisitorCounterProps {
    className?: string
    showLabel?: boolean
    variant?: "badge" | "inline" | "floating"
    pollInterval?: number
    hideIfZero?: boolean
}

export function LiveVisitorCounter({
    className,
    showLabel = true,
    variant = "badge",
    pollInterval = 30000,
    hideIfZero = false,
}: LiveVisitorCounterProps) {
    const [data, setData] = useState<OnlineData | null>(null)
    const [isAnimating, setIsAnimating] = useState(false)
    const [prevCount, setPrevCount] = useState(0)

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await fetch('/api/tracking/visitors')
                if (res.ok) {
                    const json = await res.json()
                    setData(json)

                    // Animate if count changed
                    if (json.online !== prevCount) {
                        setIsAnimating(true)
                        setTimeout(() => setIsAnimating(false), 300)
                        setPrevCount(json.online)
                    }
                }
            } catch (error) {
                // Silently fail - don't show fake data
            }
        }

        // Initial fetch
        fetchCount()

        // Poll for updates
        const interval = setInterval(fetchCount, pollInterval)

        return () => clearInterval(interval)
    }, [pollInterval, prevCount])

    const count = data?.online ?? 0

    // Hide if zero and hideIfZero is true
    if (hideIfZero && count === 0) return null

    if (variant === "floating") {
        return (
            <div
                className={cn(
                    "fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-card/90 backdrop-blur-lg px-4 py-2 shadow-lg border",
                    className
                )}
            >
                <div className="relative">
                    <TbEye className="h-4 w-4 text-primary" />
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
            <TbUsers className="h-3.5 w-3.5 text-muted-foreground" />
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

// Page-specific visitor counter (real implementation would track per-page)
export function PageVisitorCounter({
    pageSlug,
    className,
}: {
    pageSlug: string
    className?: string
}) {
    const [count, setCount] = useState<number | null>(null)

    useEffect(() => {
        // In a full implementation, this would fetch real per-page counts
        // For now, we just don't show anything as we don't have per-page tracking
        setCount(null)
    }, [pageSlug])

    // Don't render if no data
    if (count === null || count === 0) return null

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
