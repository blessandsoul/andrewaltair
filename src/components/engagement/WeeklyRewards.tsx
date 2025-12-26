'use client'

import { useState, useEffect } from 'react'
import { Gift, Calendar, CheckCircle2, Lock, Sparkles, Clock, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DayReward {
    day: number
    reward: string
    xp: number
    claimed: boolean
    available: boolean
    special?: boolean
}

const WEEKLY_REWARDS: DayReward[] = [
    { day: 1, reward: '10 AI კრედიტი', xp: 10, claimed: false, available: true },
    { day: 2, reward: '15 XP ბონუსი', xp: 15, claimed: false, available: false },
    { day: 3, reward: '20 AI კრედიტი', xp: 20, claimed: false, available: false },
    { day: 4, reward: '25 XP ბონუსი', xp: 25, claimed: false, available: false },
    { day: 5, reward: '30 AI კრედიტი', xp: 30, claimed: false, available: false },
    { day: 6, reward: '50 XP ბონუსი', xp: 50, claimed: false, available: false },
    { day: 7, reward: '🎁 Premium 1 დღით!', xp: 100, claimed: false, available: false, special: true }
]

export function WeeklyRewards() {
    const [rewards, setRewards] = useState<DayReward[]>(WEEKLY_REWARDS)
    const [currentDay, setCurrentDay] = useState(1)
    const [showCelebration, setShowCelebration] = useState(false)
    const [timeUntilNext, setTimeUntilNext] = useState('')

    useEffect(() => {
        // Load progress
        const saved = localStorage.getItem('weekly_rewards')
        const lastClaim = localStorage.getItem('last_reward_claim')

        if (saved) {
            setRewards(JSON.parse(saved))
        }

        // Calculate current day based on last claim
        if (lastClaim) {
            const lastDate = new Date(lastClaim)
            const today = new Date()
            const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

            if (daysDiff >= 1) {
                // New day available
                const nextDay = Math.min((JSON.parse(saved || '[]').filter((r: DayReward) => r.claimed).length) + 1, 7)
                setCurrentDay(nextDay)

                // Update availability
                setRewards(prev => prev.map((r, i) => ({
                    ...r,
                    available: i === nextDay - 1 && !r.claimed
                })))
            }
        }

        // Countdown timer
        const updateTimer = () => {
            const now = new Date()
            const tomorrow = new Date(now)
            tomorrow.setDate(tomorrow.getDate() + 1)
            tomorrow.setHours(0, 0, 0, 0)

            const diff = tomorrow.getTime() - now.getTime()
            const hours = Math.floor(diff / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)

            setTimeUntilNext(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
        }

        updateTimer()
        const interval = setInterval(updateTimer, 1000)
        return () => clearInterval(interval)
    }, [])

    const claimReward = (day: number) => {
        const updated = rewards.map(r => {
            if (r.day === day && r.available) {
                return { ...r, claimed: true, available: false }
            }
            return r
        })

        setRewards(updated)
        localStorage.setItem('weekly_rewards', JSON.stringify(updated))
        localStorage.setItem('last_reward_claim', new Date().toISOString())

        // Add XP
        const reward = rewards.find(r => r.day === day)
        if (reward) {
            const currentXP = parseInt(localStorage.getItem('xp_points') || '0')
            localStorage.setItem('xp_points', String(currentXP + reward.xp))
        }

        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 2000)
    }

    const claimedCount = rewards.filter(r => r.claimed).length
    const totalXP = rewards.filter(r => r.claimed).reduce((sum, r) => sum + r.xp, 0)

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-5">
                {/* Celebration overlay */}
                {showCelebration && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 animate-in fade-in">
                        <div className="text-center">
                            <span className="text-6xl animate-bounce">🎁</span>
                            <p className="text-white font-bold mt-2">ჯილდო მოპოვებულია!</p>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl">
                            <Gift className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">კვირის ჯილდოები</h3>
                            <p className="text-white/50 text-xs">შემოდი ყოველდღე და მიიღე ჯილდო!</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-pink-500/20 rounded-full">
                        <Sparkles className="w-4 h-4 text-pink-400" />
                        <span className="text-pink-400 font-bold text-sm">{totalXP} XP</span>
                    </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                        <span>{claimedCount}/7 დღე</span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            შემდეგი: {timeUntilNext}
                        </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500"
                            style={{ width: `${(claimedCount / 7) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {rewards.map(reward => (
                        <button
                            key={reward.day}
                            onClick={() => reward.available && claimReward(reward.day)}
                            disabled={!reward.available}
                            className={`relative p-2 rounded-xl text-center transition-all ${reward.claimed
                                    ? 'bg-emerald-500/20 border border-emerald-500/30'
                                    : reward.available
                                        ? 'bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/50 hover:scale-105 cursor-pointer animate-pulse'
                                        : 'bg-slate-800/50 border border-slate-700/50'
                                } ${reward.special ? 'col-span-1' : ''}`}
                        >
                            {/* Day number */}
                            <span className={`text-xs font-bold ${reward.claimed ? 'text-emerald-400' : reward.available ? 'text-pink-300' : 'text-white/40'
                                }`}>
                                {reward.day}
                            </span>

                            {/* Status icon */}
                            <div className="mt-1">
                                {reward.claimed ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                                ) : reward.available ? (
                                    <Gift className="w-4 h-4 text-pink-400 mx-auto" />
                                ) : (
                                    <Lock className="w-4 h-4 text-slate-600 mx-auto" />
                                )}
                            </div>

                            {/* Special badge for day 7 */}
                            {reward.special && !reward.claimed && (
                                <Crown className="absolute -top-1 -right-1 w-3 h-3 text-amber-400" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Today's Reward */}
                {rewards[currentDay - 1] && !rewards[currentDay - 1].claimed && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-xl border border-pink-500/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/60 text-xs">დღის ჯილდო</p>
                                <p className="text-white font-medium">{rewards[currentDay - 1].reward}</p>
                            </div>
                            <Button
                                onClick={() => claimReward(currentDay)}
                                disabled={!rewards[currentDay - 1].available}
                                size="sm"
                                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                            >
                                <Gift className="w-4 h-4 mr-1" />
                                მიღება
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
