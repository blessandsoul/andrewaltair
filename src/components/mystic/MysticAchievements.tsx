"use client"

import { useState, useEffect } from "react"
import { TbAward, TbLock, TbCheck, TbFlame, TbStar, TbHeart, TbMoon } from "react-icons/tb"
import { BADGE_DEFINITIONS, BadgeId } from "@/lib/badges"

interface Achievement {
    id: BadgeId
    isEarned: boolean
    earnedAt?: string
    progress?: number
    maxProgress?: number
}

const ACHIEVEMENTS_ORDER: BadgeId[] = [
    'first_prediction',
    'streak_3',
    'streak_7',
    'streak_30',
    'predictions_10',
    'predictions_50',
    'predictions_100',
    'zodiac_explorer',
    'tarot_master',
    'love_guru',
    'dream_walker',
    'night_owl',
    'early_bird',
    'share_star',
    'gift_giver',
    'premium_member',
]

// Mock achievements - in production would come from API
const MOCK_ACHIEVEMENTS: Achievement[] = [
    { id: 'first_prediction', isEarned: true, earnedAt: '2024-12-01' },
    { id: 'streak_3', isEarned: true, earnedAt: '2024-12-05' },
    { id: 'streak_7', isEarned: false, progress: 4, maxProgress: 7 },
    { id: 'streak_30', isEarned: false, progress: 4, maxProgress: 30 },
    { id: 'predictions_10', isEarned: true, earnedAt: '2024-12-10' },
    { id: 'predictions_50', isEarned: false, progress: 24, maxProgress: 50 },
    { id: 'predictions_100', isEarned: false, progress: 24, maxProgress: 100 },
    { id: 'zodiac_explorer', isEarned: false, progress: 5, maxProgress: 12 },
    { id: 'tarot_master', isEarned: false, progress: 8, maxProgress: 50 },
    { id: 'love_guru', isEarned: false, progress: 6, maxProgress: 20 },
    { id: 'dream_walker', isEarned: false, progress: 3, maxProgress: 30 },
    { id: 'night_owl', isEarned: false },
    { id: 'early_bird', isEarned: false },
    { id: 'share_star', isEarned: true, earnedAt: '2024-12-15' },
    { id: 'gift_giver', isEarned: false },
    { id: 'premium_member', isEarned: false },
]

export function MysticAchievements() {
    const [achievements, setAchievements] = useState<Achievement[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState({ earned: 0, total: 0, currentStreak: 0 })

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setAchievements(MOCK_ACHIEVEMENTS)
            const earned = MOCK_ACHIEVEMENTS.filter(a => a.isEarned).length
            setStats({ earned, total: MOCK_ACHIEVEMENTS.length, currentStreak: 4 })
            setIsLoading(false)
        }, 300)
    }, [])

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return ''
        return new Date(dateStr).toLocaleDateString('ka-GE', { month: 'short', day: 'numeric' })
    }

    if (isLoading) {
        return (
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-2xl blur-xl opacity-20" />
                <div className="relative rounded-2xl bg-[#12121a] border border-white/10 p-8 text-center">
                    <TbAward className="w-8 h-8 text-gray-600 animate-pulse mx-auto" />
                    <p className="text-gray-500 mt-3 text-sm">იტვირთება...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-2xl sm:rounded-3xl blur-xl opacity-20" />

            <div className="relative rounded-2xl sm:rounded-3xl bg-[#12121a] border border-white/10 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-white/10 bg-gradient-to-r from-yellow-600/10 to-amber-600/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                <TbAward className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">მიღწევები</h3>
                                <p className="text-xs text-gray-500">{stats.earned}/{stats.total} მოპოვებული</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                            <TbFlame className="w-4 h-4 text-orange-400" />
                            <span className="text-sm font-bold text-orange-400">{stats.currentStreak}</span>
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="px-4 py-3 border-b border-white/5">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>პროგრესი</span>
                        <span>{Math.round((stats.earned / stats.total) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full transition-all duration-500"
                            style={{ width: `${(stats.earned / stats.total) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Achievements grid */}
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-h-[400px] overflow-y-auto">
                    {ACHIEVEMENTS_ORDER.map(badgeId => {
                        const achievement = achievements.find(a => a.id === badgeId)
                        const badge = BADGE_DEFINITIONS[badgeId]
                        if (!badge) return null

                        const isEarned = achievement?.isEarned || false
                        const hasProgress = achievement?.progress !== undefined && achievement?.maxProgress !== undefined

                        return (
                            <div
                                key={badgeId}
                                className={`p-3 rounded-xl border transition-all ${isEarned
                                    ? 'bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20'
                                    : 'bg-white/5 border-white/5 opacity-60'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <span className="text-2xl">{badge.emoji}</span>
                                    {isEarned ? (
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <TbCheck className="w-3 h-3 text-green-400" />
                                        </div>
                                    ) : (
                                        <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
                                            <TbLock className="w-3 h-3 text-gray-500" />
                                        </div>
                                    )}
                                </div>
                                <h4 className="font-medium text-white text-xs mb-0.5 truncate">{badge.name}</h4>
                                <p className="text-[10px] text-gray-500 line-clamp-2">{badge.description}</p>

                                {isEarned && achievement?.earnedAt && (
                                    <p className="text-[10px] text-amber-400 mt-1.5">{formatDate(achievement.earnedAt)}</p>
                                )}

                                {!isEarned && hasProgress && (
                                    <div className="mt-2">
                                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gray-500 rounded-full"
                                                style={{ width: `${(achievement.progress! / achievement.maxProgress!) * 100}%` }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-1">
                                            {achievement.progress}/{achievement.maxProgress}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
