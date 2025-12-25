"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Flame, Calendar, Gift } from "lucide-react"

const STORAGE_KEY = "user-streak"

interface StreakData {
    currentStreak: number
    longestStreak: number
    lastVisit: string
    startDate: string
}

// Hook to manage streaks
export function useStreak() {
    const [streak, setStreak] = useState<StreakData>({
        currentStreak: 0,
        longestStreak: 0,
        lastVisit: "",
        startDate: "",
    })
    const [showBonus, setShowBonus] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        const today = new Date().toDateString()

        if (stored) {
            const data: StreakData = JSON.parse(stored)
            const lastVisit = new Date(data.lastVisit).toDateString()
            const yesterday = new Date(Date.now() - 86400000).toDateString()

            if (lastVisit === today) {
                // Already visited today
                setStreak(data)
            } else if (lastVisit === yesterday) {
                // Continue streak
                const newStreak = data.currentStreak + 1
                const newData: StreakData = {
                    ...data,
                    currentStreak: newStreak,
                    longestStreak: Math.max(newStreak, data.longestStreak),
                    lastVisit: today,
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
                setStreak(newData)

                // Show bonus for milestone streaks
                if ([3, 7, 14, 30].includes(newStreak)) {
                    setShowBonus(true)
                }
            } else {
                // Streak broken, start new
                const newData: StreakData = {
                    currentStreak: 1,
                    longestStreak: data.longestStreak,
                    lastVisit: today,
                    startDate: today,
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
                setStreak(newData)
            }
        } else {
            // First visit ever
            const newData: StreakData = {
                currentStreak: 1,
                longestStreak: 1,
                lastVisit: today,
                startDate: today,
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
            setStreak(newData)
        }
    }, [])

    return { streak, showBonus, dismissBonus: () => setShowBonus(false) }
}

// Streak counter display
export function StreakCounter({
    className,
    variant = "badge",
}: {
    className?: string
    variant?: "badge" | "card" | "inline"
}) {
    const { streak, showBonus, dismissBonus } = useStreak()

    if (variant === "inline") {
        return (
            <span className={cn("inline-flex items-center gap-1.5", className)}>
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="font-bold">{streak.currentStreak}</span>
                <span className="text-muted-foreground text-sm">დღის სტრიკი</span>
            </span>
        )
    }

    if (variant === "badge") {
        return (
            <div
                className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm",
                    streak.currentStreak >= 7
                        ? "bg-orange-500/20 text-orange-500"
                        : "bg-secondary text-muted-foreground",
                    className
                )}
            >
                <Flame className={cn("h-4 w-4", streak.currentStreak >= 7 && "animate-pulse")} />
                <span className="font-bold">{streak.currentStreak}</span>
                <span>დღე</span>
            </div>
        )
    }

    // Card variant
    return (
        <div className={cn("rounded-xl border bg-card p-6", className)}>
            {/* Streak bonus notification */}
            {showBonus && (
                <div className="mb-4 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4 border border-orange-500/30">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                            <Gift className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold">სტრიკ ბონუსი! 🎉</p>
                            <p className="text-sm text-muted-foreground">
                                {streak.currentStreak} დღის სტრიკი მიაღწიე!
                            </p>
                        </div>
                        <button
                            onClick={dismissBonus}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        მიმდინარე სტრიკი
                    </p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-4xl font-bold text-gradient">
                            {streak.currentStreak}
                        </span>
                        <span className="text-lg text-muted-foreground">დღე</span>
                    </div>
                </div>

                <div className="relative">
                    <div
                        className={cn(
                            "h-16 w-16 rounded-full flex items-center justify-center",
                            streak.currentStreak >= 7
                                ? "bg-gradient-to-br from-orange-500 to-red-500"
                                : "bg-secondary"
                        )}
                    >
                        <Flame
                            className={cn(
                                "h-8 w-8",
                                streak.currentStreak >= 7 ? "text-white animate-pulse" : "text-muted-foreground"
                            )}
                        />
                    </div>
                    {streak.currentStreak >= 7 && (
                        <div className="absolute -inset-2 rounded-full bg-orange-500/30 blur-md -z-10" />
                    )}
                </div>
            </div>

            {/* Progress to next milestone */}
            <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>მომდევნო მილესთონამდე</span>
                    <span>{getNextMilestone(streak.currentStreak)} დღე</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
                        style={{
                            width: `${getMilestoneProgress(streak.currentStreak)}%`,
                        }}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-center">
                <div>
                    <p className="text-2xl font-bold">{streak.longestStreak}</p>
                    <p className="text-xs text-muted-foreground">ყველაზე გრძელი</p>
                </div>
                <div>
                    <p className="text-2xl font-bold">
                        {streak.startDate ? getDaysSince(streak.startDate) : 0}
                    </p>
                    <p className="text-xs text-muted-foreground">დღე წევრობის</p>
                </div>
            </div>
        </div>
    )
}

// Helper functions
function getNextMilestone(current: number): number {
    const milestones = [3, 7, 14, 30, 60, 90, 180, 365]
    return milestones.find((m) => m > current) || current + 30
}

function getMilestoneProgress(current: number): number {
    const milestones = [0, 3, 7, 14, 30, 60, 90, 180, 365]
    const next = milestones.find((m) => m > current) || 365
    const prev = milestones.filter((m) => m <= current).pop() || 0
    return ((current - prev) / (next - prev)) * 100
}

function getDaysSince(dateString: string): number {
    const start = new Date(dateString)
    const now = new Date()
    return Math.floor((now.getTime() - start.getTime()) / 86400000)
}
