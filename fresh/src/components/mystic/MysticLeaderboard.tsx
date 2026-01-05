"use client"

import { useState, useEffect } from "react"
import { TbTrophy, TbFlame, TbStar, TbMedal, TbCrown, TbTrendingUp } from "react-icons/tb"

interface LeaderboardUser {
    rank: number
    sessionId: string
    displayName: string
    totalPredictions: number
    currentStreak: number
    longestStreak: number
    badges: string[]
}

// Mock data for demonstration - in production this would come from API
const MOCK_LEADERBOARD: LeaderboardUser[] = [
    { rank: 1, sessionId: "s1", displayName: "მარიამ ⭐", totalPredictions: 247, currentStreak: 15, longestStreak: 30, badges: ["streak_30", "predictions_100"] },
    { rank: 2, sessionId: "s2", displayName: "გიორგი 🔮", totalPredictions: 189, currentStreak: 12, longestStreak: 22, badges: ["streak_7", "tarot_master"] },
    { rank: 3, sessionId: "s3", displayName: "ანა ✨", totalPredictions: 156, currentStreak: 8, longestStreak: 18, badges: ["zodiac_explorer"] },
    { rank: 4, sessionId: "s4", displayName: "ნიკა", totalPredictions: 134, currentStreak: 5, longestStreak: 14, badges: ["love_guru"] },
    { rank: 5, sessionId: "s5", displayName: "თეკლა", totalPredictions: 98, currentStreak: 3, longestStreak: 10, badges: ["dream_walker"] },
    { rank: 6, sessionId: "s6", displayName: "დავითი", totalPredictions: 87, currentStreak: 7, longestStreak: 12, badges: [] },
    { rank: 7, sessionId: "s7", displayName: "ლიკა", totalPredictions: 76, currentStreak: 2, longestStreak: 8, badges: [] },
    { rank: 8, sessionId: "s8", displayName: "შოთა", totalPredictions: 65, currentStreak: 4, longestStreak: 7, badges: [] },
    { rank: 9, sessionId: "s9", displayName: "ნინო", totalPredictions: 54, currentStreak: 1, longestStreak: 5, badges: [] },
    { rank: 10, sessionId: "s10", displayName: "ლაშა", totalPredictions: 43, currentStreak: 0, longestStreak: 4, badges: [] },
]

type TimeFilter = 'daily' | 'weekly' | 'monthly' | 'allTime'

export function MysticLeaderboard() {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('weekly')
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [myRank, setMyRank] = useState<number | null>(null)

    useEffect(() => {
        // Simulate API call
        setIsLoading(true)
        setTimeout(() => {
            setLeaderboard(MOCK_LEADERBOARD)
            setMyRank(Math.floor(Math.random() * 50) + 11)
            setIsLoading(false)
        }, 500)
    }, [timeFilter])

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <TbCrown className="w-5 h-5 text-amber-400" />
            case 2: return <TbMedal className="w-5 h-5 text-gray-300" />
            case 3: return <TbMedal className="w-5 h-5 text-amber-600" />
            default: return <span className="text-gray-500 font-medium text-sm">#{rank}</span>
        }
    }

    const getRankBg = (rank: number) => {
        switch (rank) {
            case 1: return "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/30"
            case 2: return "bg-gradient-to-r from-gray-400/10 to-gray-300/10 border-gray-400/30"
            case 3: return "bg-gradient-to-r from-amber-700/10 to-orange-600/10 border-amber-700/30"
            default: return "bg-white/5 border-white/5"
        }
    }

    return (
        <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl sm:rounded-3xl blur-xl opacity-20" />

            <div className="relative rounded-2xl sm:rounded-3xl bg-[#12121a] border border-white/10 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-white/10 bg-gradient-to-r from-amber-600/10 to-orange-600/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <TbTrophy className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">ლიდერბორდი</h3>
                            <p className="text-xs text-gray-500">ყველაზე აქტიური მისტიკოსები</p>
                        </div>
                    </div>
                </div>

                {/* Time filter */}
                <div className="p-3 border-b border-white/5 flex gap-2">
                    {[
                        { id: 'daily', label: 'დღეს' },
                        { id: 'weekly', label: 'კვირა' },
                        { id: 'monthly', label: 'თვე' },
                        { id: 'allTime', label: 'სულ' },
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setTimeFilter(f.id as TimeFilter)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${timeFilter === f.id
                                    ? "bg-amber-500/20 text-amber-400"
                                    : "text-gray-500 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Leaderboard list */}
                <div className="max-h-[400px] overflow-y-auto">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <TbTrophy className="w-8 h-8 text-gray-600 animate-pulse mx-auto" />
                            <p className="text-gray-500 mt-3 text-sm">იტვირთება...</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {leaderboard.map((user) => (
                                <div
                                    key={user.sessionId}
                                    className={`p-3 sm:p-4 flex items-center gap-3 ${getRankBg(user.rank)} border-l-2`}
                                >
                                    <div className="w-8 flex justify-center">
                                        {getRankIcon(user.rank)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-white text-sm truncate">{user.displayName}</span>
                                            {user.badges.length > 0 && (
                                                <div className="flex -space-x-1">
                                                    {user.badges.slice(0, 2).map((badge, i) => (
                                                        <span key={i} className="text-xs">
                                                            {badge === 'streak_30' && '🏆'}
                                                            {badge === 'predictions_100' && '💯'}
                                                            {badge === 'tarot_master' && '🃏'}
                                                            {badge === 'zodiac_explorer' && '♈'}
                                                            {badge === 'love_guru' && '💕'}
                                                            {badge === 'dream_walker' && '🌙'}
                                                            {badge === 'streak_7' && '🔥'}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <TbStar className="w-3 h-3" />
                                                {user.totalPredictions}
                                            </span>
                                            {user.currentStreak > 0 && (
                                                <span className="flex items-center gap-1 text-orange-400">
                                                    <TbFlame className="w-3 h-3" />
                                                    {user.currentStreak}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <TbTrendingUp className="w-3 h-3" />
                                            <span>მაქს. {user.longestStreak}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* My rank */}
                {myRank && (
                    <div className="p-4 border-t border-white/10 bg-gradient-to-r from-violet-600/10 to-purple-600/10">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">შენი რეიტინგი</span>
                            <span className="font-bold text-violet-400">#{myRank}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
