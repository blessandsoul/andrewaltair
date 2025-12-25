"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Trophy, Star, Flame, BookOpen, MessageSquare, Share2, Eye, Calendar } from "lucide-react"

interface Achievement {
    id: string
    name: string
    description: string
    icon: React.ReactNode
    requirement: number
    type: "articles" | "comments" | "shares" | "visits" | "streak"
    unlocked: boolean
    progress: number
}

const ACHIEVEMENTS: Omit<Achievement, "unlocked" | "progress">[] = [
    {
        id: "first-read",
        name: "პირველი ნაბიჯი",
        description: "წაიკითხე პირველი სტატია",
        icon: <BookOpen className="h-6 w-6" />,
        requirement: 1,
        type: "articles",
    },
    {
        id: "bookworm",
        name: "წიგნის ჭია 📚",
        description: "წაიკითხე 10 სტატია",
        icon: <BookOpen className="h-6 w-6" />,
        requirement: 10,
        type: "articles",
    },
    {
        id: "ai-expert",
        name: "AI ექსპერტი 🤖",
        description: "წაიკითხე 50 სტატია",
        icon: <Star className="h-6 w-6" />,
        requirement: 50,
        type: "articles",
    },
    {
        id: "commentator",
        name: "კომენტატორი 💬",
        description: "დატოვე 5 კომენტარი",
        icon: <MessageSquare className="h-6 w-6" />,
        requirement: 5,
        type: "comments",
    },
    {
        id: "sharer",
        name: "გამზიარებელი 🔗",
        description: "გააზიარე 3 სტატია",
        icon: <Share2 className="h-6 w-6" />,
        requirement: 3,
        type: "shares",
    },
    {
        id: "regular",
        name: "რეგულარი 🏠",
        description: "ეწვიე საიტს 7 დღე ზედიზედ",
        icon: <Calendar className="h-6 w-6" />,
        requirement: 7,
        type: "streak",
    },
    {
        id: "loyal-fan",
        name: "ერთგული ფანი ❤️",
        description: "ეწვიე საიტს 30 დღე ზედიზედ",
        icon: <Flame className="h-6 w-6" />,
        requirement: 30,
        type: "streak",
    },
    {
        id: "popular",
        name: "ტრენდი 🔥",
        description: "მიიღე 100 ნახვა შენს კომენტარზე",
        icon: <Eye className="h-6 w-6" />,
        requirement: 100,
        type: "visits",
    },
]

const STORAGE_KEY = "user-achievements"

// Hook to manage achievements
export function useAchievements() {
    const [achievements, setAchievements] = useState<Achievement[]>([])
    const [newUnlock, setNewUnlock] = useState<Achievement | null>(null)

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        const progress = stored ? JSON.parse(stored) : {}

        const updated = ACHIEVEMENTS.map((ach) => ({
            ...ach,
            progress: progress[ach.type] || 0,
            unlocked: (progress[ach.type] || 0) >= ach.requirement,
        }))

        setAchievements(updated)
    }, [])

    const updateProgress = (type: Achievement["type"], increment = 1) => {
        const stored = localStorage.getItem(STORAGE_KEY)
        const progress = stored ? JSON.parse(stored) : {}
        const newValue = (progress[type] || 0) + increment

        progress[type] = newValue
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))

        // Check for new unlocks
        const justUnlocked = ACHIEVEMENTS.find(
            (ach) =>
                ach.type === type &&
                newValue >= ach.requirement &&
                (progress[type] - increment) < ach.requirement
        )

        if (justUnlocked) {
            setNewUnlock({
                ...justUnlocked,
                progress: newValue,
                unlocked: true,
            })

            // Clear notification after 5 seconds
            setTimeout(() => setNewUnlock(null), 5000)
        }

        // Update state
        setAchievements((prev) =>
            prev.map((ach) => ({
                ...ach,
                progress: ach.type === type ? newValue : ach.progress,
                unlocked: ach.type === type ? newValue >= ach.requirement : ach.unlocked,
            }))
        )
    }

    return { achievements, updateProgress, newUnlock, clearNewUnlock: () => setNewUnlock(null) }
}

// Achievement badge component
export function AchievementBadge({
    achievement,
    size = "md",
    showProgress = true,
}: {
    achievement: Achievement
    size?: "sm" | "md" | "lg"
    showProgress?: boolean
}) {
    const sizeClasses = {
        sm: "w-12 h-12",
        md: "w-16 h-16",
        lg: "w-20 h-20",
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className={cn(
                    "relative rounded-full flex items-center justify-center transition-all",
                    sizeClasses[size],
                    achievement.unlocked
                        ? "bg-gradient-to-br from-primary to-accent text-white shadow-lg"
                        : "bg-secondary text-muted-foreground"
                )}
            >
                {achievement.icon}
                {!achievement.unlocked && (
                    <div className="absolute inset-0 rounded-full bg-background/50" />
                )}
            </div>
            <div className="text-center">
                <p className={cn("font-medium text-sm", !achievement.unlocked && "text-muted-foreground")}>
                    {achievement.name}
                </p>
                {showProgress && !achievement.unlocked && (
                    <p className="text-xs text-muted-foreground">
                        {achievement.progress}/{achievement.requirement}
                    </p>
                )}
            </div>
        </div>
    )
}

// Achievement unlock notification
export function AchievementUnlockNotification({
    achievement,
    onClose,
}: {
    achievement: Achievement | null
    onClose: () => void
}) {
    if (!achievement) return null

    return (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right fade-in duration-500">
            <div className="flex items-center gap-4 rounded-xl bg-card/95 backdrop-blur-lg px-6 py-4 shadow-2xl border">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                    <Trophy className="h-7 w-7" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">მიღწევა განბლოკილია!</p>
                    <p className="font-bold text-lg">{achievement.name}</p>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                <button
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground"
                >
                    ✕
                </button>
            </div>
        </div>
    )
}

// Achievements grid display
export function AchievementsGrid() {
    const { achievements, newUnlock, clearNewUnlock } = useAchievements()

    const unlockedCount = achievements.filter((a) => a.unlocked).length
    const total = achievements.length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        მიღწევები
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {unlockedCount}/{total} განბლოკილი
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                        {Math.round((unlockedCount / total) * 100)}%
                    </div>
                    <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                            style={{ width: `${(unlockedCount / total) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-4">
                {achievements.map((achievement) => (
                    <AchievementBadge key={achievement.id} achievement={achievement} size="sm" />
                ))}
            </div>

            {/* Unlock notification */}
            <AchievementUnlockNotification achievement={newUnlock} onClose={clearNewUnlock} />
        </div>
    )
}
