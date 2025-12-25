"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Trophy, Crown, Medal, TrendingUp } from "lucide-react"

interface LeaderboardUser {
    id: string
    name: string
    avatar: string
    points: number
    streak: number
    articlesRead: number
    comments: number
    rank: number
}

// Sample data - in real app, this would come from API
const SAMPLE_USERS: Omit<LeaderboardUser, "rank">[] = [
    { id: "1", name: "გიორგი მ.", avatar: "🧑‍💻", points: 2450, streak: 15, articlesRead: 48, comments: 24 },
    { id: "2", name: "ნინო თ.", avatar: "👩‍🔬", points: 2180, streak: 22, articlesRead: 35, comments: 42 },
    { id: "3", name: "დავით ბ.", avatar: "👨‍🎨", points: 1920, streak: 8, articlesRead: 42, comments: 18 },
    { id: "4", name: "მარიამ კ.", avatar: "👩‍💼", points: 1750, streak: 12, articlesRead: 28, comments: 35 },
    { id: "5", name: "ალეკო ჯ.", avatar: "🧔", points: 1680, streak: 5, articlesRead: 33, comments: 22 },
    { id: "6", name: "თამარ შ.", avatar: "👩‍🏫", points: 1520, streak: 9, articlesRead: 25, comments: 28 },
    { id: "7", name: "ლუკა ვ.", avatar: "👨‍🚀", points: 1410, streak: 3, articlesRead: 30, comments: 15 },
    { id: "8", name: "ანა დ.", avatar: "👩‍🔧", points: 1350, streak: 7, articlesRead: 22, comments: 20 },
    { id: "9", name: "შენ", avatar: "⭐", points: 450, streak: 2, articlesRead: 8, comments: 3 },
    { id: "10", name: "სოფია ლ.", avatar: "👩‍🎤", points: 380, streak: 1, articlesRead: 6, comments: 5 },
]

type SortKey = "points" | "streak" | "articlesRead" | "comments"

interface LeaderboardProps {
    className?: string
    showCurrentUser?: boolean
    limit?: number
}

export function Leaderboard({
    className,
    showCurrentUser = true,
    limit = 10,
}: LeaderboardProps) {
    const [users, setUsers] = useState<LeaderboardUser[]>([])
    const [sortBy, setSortBy] = useState<SortKey>("points")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            const sorted = [...SAMPLE_USERS]
                .sort((a, b) => b[sortBy] - a[sortBy])
                .slice(0, limit)
                .map((user, index) => ({ ...user, rank: index + 1 }))
            setUsers(sorted)
            setLoading(false)
        }, 500)
    }, [sortBy, limit])

    const currentUserRank = users.findIndex((u) => u.id === "9") + 1

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown className="h-5 w-5 text-yellow-500" />
            case 2:
                return <Medal className="h-5 w-5 text-gray-400" />
            case 3:
                return <Medal className="h-5 w-5 text-amber-600" />
            default:
                return <span className="font-bold text-muted-foreground">{rank}</span>
        }
    }

    const sortOptions: { key: SortKey; label: string }[] = [
        { key: "points", label: "ქულები" },
        { key: "streak", label: "სტრიკი" },
        { key: "articlesRead", label: "სტატიები" },
        { key: "comments", label: "კომენტარები" },
    ]

    return (
        <div className={cn("rounded-xl border bg-card", className)}>
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <h3 className="font-bold">ლიდერბორდი</h3>
                </div>
                <div className="flex gap-1">
                    {sortOptions.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setSortBy(key)}
                            className={cn(
                                "px-3 py-1 text-xs rounded-full transition-colors",
                                sortBy === key
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="divide-y">
                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">
                        <div className="animate-pulse">იტვირთება...</div>
                    </div>
                ) : (
                    users.map((user) => (
                        <div
                            key={user.id}
                            className={cn(
                                "flex items-center gap-4 p-4 transition-colors",
                                user.id === "9" && "bg-primary/5"
                            )}
                        >
                            {/* Rank */}
                            <div className="w-8 flex justify-center">
                                {getRankIcon(user.rank)}
                            </div>

                            {/* Avatar */}
                            <div className="text-2xl">{user.avatar}</div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium truncate">{user.name}</span>
                                    {user.id === "9" && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                                            შენ
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span>🔥 {user.streak} დღე</span>
                                    <span>📚 {user.articlesRead}</span>
                                    <span>💬 {user.comments}</span>
                                </div>
                            </div>

                            {/* Points */}
                            <div className="text-right">
                                <div className="font-bold text-primary">
                                    {user[sortBy].toLocaleString()}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {sortOptions.find((o) => o.key === sortBy)?.label}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Current user highlight */}
            {showCurrentUser && currentUserRank > 0 && (
                <div className="border-t p-4 bg-secondary/50">
                    <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span>შენი რანკი: </span>
                        <span className="font-bold text-primary">#{currentUserRank}</span>
                        <span className="text-muted-foreground">— კითხვა გააგრძელე პოზიციის გასაუმჯობესებლად!</span>
                    </div>
                </div>
            )}
        </div>
    )
}

// Compact leaderboard for sidebar
export function LeaderboardMini({ className }: { className?: string }) {
    const topThree = SAMPLE_USERS
        .sort((a, b) => b.points - a.points)
        .slice(0, 3)

    return (
        <div className={cn("rounded-xl border bg-card p-4", className)}>
            <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">ტოპ 3</span>
            </div>
            <div className="space-y-3">
                {topThree.map((user, index) => (
                    <div key={user.id} className="flex items-center gap-3">
                        <span className="text-lg">{["🥇", "🥈", "🥉"][index]}</span>
                        <span className="text-sm flex-1">{user.name}</span>
                        <span className="text-xs font-bold text-primary">{user.points}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
