"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ReadingProgressProps {
    className?: string
    color?: string
    height?: number
    position?: "top" | "bottom"
    showPercentage?: boolean
}

export function ReadingProgress({
    className,
    color,
    height = 3,
    position = "top",
    showPercentage = false,
}: ReadingProgressProps) {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const calculateProgress = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
            const scrolled = window.scrollY
            const percentage = Math.min((scrolled / scrollHeight) * 100, 100)
            setProgress(percentage)
        }

        window.addEventListener("scroll", calculateProgress, { passive: true })
        calculateProgress()

        return () => window.removeEventListener("scroll", calculateProgress)
    }, [])

    return (
        <>
            {/* Progress bar */}
            <div
                className={cn(
                    "fixed left-0 z-[60] w-full",
                    position === "top" ? "top-0" : "bottom-0",
                    className
                )}
                style={{ height: `${height}px` }}
            >
                <div
                    className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-100 ease-out"
                    style={{
                        width: `${progress}%`,
                        backgroundColor: color,
                        boxShadow: `0 0 10px var(--primary), 0 0 20px var(--accent)`,
                    }}
                />
            </div>

            {/* Optional percentage indicator */}
            {showPercentage && progress > 5 && (
                <div
                    className={cn(
                        "fixed right-4 z-50 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-lg transition-all",
                        position === "top" ? "top-4" : "bottom-4"
                    )}
                >
                    {Math.round(progress)}%
                </div>
            )}
        </>
    )
}

// Article-specific reading progress with time estimate
export function ArticleReadingProgress({
    totalWords,
    wordsPerMinute = 200,
}: {
    totalWords: number
    wordsPerMinute?: number
}) {
    const [progress, setProgress] = useState(0)
    const [timeLeft, setTimeLeft] = useState(0)

    useEffect(() => {
        const calculateProgress = () => {
            const article = document.querySelector("article")
            if (!article) return

            const rect = article.getBoundingClientRect()
            const articleTop = rect.top + window.scrollY
            const articleHeight = rect.height
            const scrolled = window.scrollY - articleTop
            const percentage = Math.max(0, Math.min((scrolled / articleHeight) * 100, 100))
            setProgress(percentage)

            // Calculate remaining reading time
            const wordsLeft = totalWords * (1 - percentage / 100)
            const minutesLeft = Math.ceil(wordsLeft / wordsPerMinute)
            setTimeLeft(minutesLeft)
        }

        window.addEventListener("scroll", calculateProgress, { passive: true })
        calculateProgress()

        return () => window.removeEventListener("scroll", calculateProgress)
    }, [totalWords, wordsPerMinute])

    return (
        <div className="fixed left-0 top-0 z-[60] w-full">
            {/* Progress bar */}
            <div className="h-1 w-full bg-secondary">
                <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-150"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Time remaining badge */}
            {progress > 0 && progress < 95 && (
                <div className="absolute right-4 top-3 flex items-center gap-2 rounded-full bg-card/80 px-3 py-1 text-xs shadow-lg backdrop-blur-sm">
                    <span className="text-muted-foreground">დარჩა:</span>
                    <span className="font-semibold text-primary">
                        {timeLeft} წთ
                    </span>
                </div>
            )}

            {/* Completion celebration */}
            {progress >= 95 && (
                <div className="absolute right-4 top-3 flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1 text-xs shadow-lg">
                    <span className="text-green-500">✓ წაკითხული!</span>
                </div>
            )}
        </div>
    )
}
