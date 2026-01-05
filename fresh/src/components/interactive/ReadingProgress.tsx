"use client"

import { useState, useEffect } from "react"

interface ReadingProgressProps {
    className?: string
    showPercentage?: boolean
    color?: string
    position?: 'top' | 'bottom'
    height?: number
}

export function ReadingProgress({
    className = "",
    showPercentage = false,
    color = "from-primary via-accent to-primary",
    position = "top",
    height = 4
}: ReadingProgressProps) {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const calculateProgress = () => {
            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight - windowHeight
            const scrollTop = window.scrollY
            const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0
            setProgress(Math.min(100, Math.max(0, progress)))
        }

        calculateProgress()
        window.addEventListener("scroll", calculateProgress, { passive: true })
        window.addEventListener("resize", calculateProgress)

        return () => {
            window.removeEventListener("scroll", calculateProgress)
            window.removeEventListener("resize", calculateProgress)
        }
    }, [])

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
            {/* Progress bar */}
            <div className="h-1 bg-muted/30 backdrop-blur-sm">
                <div
                    className={`h-full bg-gradient-to-r ${color} transition-all duration-150 ease-out`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Optional percentage badge */}
            {showPercentage && progress > 0 && (
                <div
                    className="absolute top-2 right-4 bg-background/80 backdrop-blur-sm border border-border rounded-full px-2 py-0.5 text-xs font-medium text-muted-foreground shadow-lg transition-opacity duration-300"
                    style={{ opacity: progress > 5 ? 1 : 0 }}
                >
                    {Math.round(progress)}%
                </div>
            )}
        </div>
    )
}
