'use client'

import { useState, useEffect } from 'react'
import { Target, CheckCircle2, Gift, Flame, Clock, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Challenge {
    id: string
    title: string
    description: string
    xpReward: number
    progress: number
    goal: number
    completed: boolean
    icon: string
}

const DAILY_CHALLENGES: Challenge[] = [
    {
        id: 'explore_tools',
        title: 'აღმოაჩინე ახალი',
        description: 'შეისწავლე 3 ახალი AI ინსტრუმენტი',
        xpReward: 30,
        progress: 0,
        goal: 3,
        completed: false,
        icon: '🔍'
    },
    {
        id: 'read_article',
        title: 'წაიკითხე და ისწავლე',
        description: 'წაიკითხე 1 სტატია ბლოგიდან',
        xpReward: 20,
        progress: 0,
        goal: 1,
        completed: false,
        icon: '📖'
    },
    {
        id: 'use_ai',
        title: 'გამოიყენე AI',
        description: 'სცადე AI ჩატბოტი ან მისტიკური ფუნქცია',
        xpReward: 25,
        progress: 0,
        goal: 1,
        completed: false,
        icon: '🤖'
    },
    {
        id: 'share_content',
        title: 'გააზიარე',
        description: 'გააზიარე რაიმე სოციალურ ქსელში',
        xpReward: 15,
        progress: 0,
        goal: 1,
        completed: false,
        icon: '📤'
    }
]

export function DailyChallenge() {
    const [challenges, setChallenges] = useState<Challenge[]>(DAILY_CHALLENGES)
    const [streak, setStreak] = useState(0)
    const [timeLeft, setTimeLeft] = useState('')
    const [showCelebration, setShowCelebration] = useState(false)

    useEffect(() => {
        // Load saved progress
        const savedDate = localStorage.getItem('challenge_date')
        const today = new Date().toDateString()

        if (savedDate !== today) {
            // Reset challenges for new day
            localStorage.setItem('challenge_date', today)
            localStorage.setItem('challenges', JSON.stringify(DAILY_CHALLENGES))
            setChallenges(DAILY_CHALLENGES)

            // Check streak
            const lastActive = localStorage.getItem('last_active_date')
            const yesterday = new Date(Date.now() - 86400000).toDateString()

            if (lastActive === yesterday) {
                const currentStreak = parseInt(localStorage.getItem('streak') || '0') + 1
                setStreak(currentStreak)
                localStorage.setItem('streak', String(currentStreak))
            } else if (lastActive !== today) {
                setStreak(1)
                localStorage.setItem('streak', '1')
            }

            localStorage.setItem('last_active_date', today)
        } else {
            const saved = localStorage.getItem('challenges')
            if (saved) setChallenges(JSON.parse(saved))
            setStreak(parseInt(localStorage.getItem('streak') || '0'))
        }

        // Update countdown timer
        const updateTimer = () => {
            const now = new Date()
            const tomorrow = new Date(now)
            tomorrow.setDate(tomorrow.getDate() + 1)
            tomorrow.setHours(0, 0, 0, 0)

            const diff = tomorrow.getTime() - now.getTime()
            const hours = Math.floor(diff / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

            setTimeLeft(`${hours}სთ ${minutes}წთ`)
        }

        updateTimer()
        const interval = setInterval(updateTimer, 60000)
        return () => clearInterval(interval)
    }, [])

    const completeChallenge = (id: string) => {
        const updated = challenges.map(c => {
            if (c.id === id && !c.completed) {
                const newProgress = Math.min(c.progress + 1, c.goal)
                const completed = newProgress >= c.goal

                if (completed) {
                    // Add XP
                    const currentXP = parseInt(localStorage.getItem('xp_points') || '0')
                    localStorage.setItem('xp_points', String(currentXP + c.xpReward))
                    setShowCelebration(true)
                    setTimeout(() => setShowCelebration(false), 2000)
                }

                return { ...c, progress: newProgress, completed }
            }
            return c
        })

        setChallenges(updated)
        localStorage.setItem('challenges', JSON.stringify(updated))
    }

    const completedCount = challenges.filter(c => c.completed).length
    const totalXP = challenges.filter(c => c.completed).reduce((sum, c) => sum + c.xpReward, 0)

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-5">
                {/* Celebration overlay */}
                {showCelebration && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 animate-in fade-in">
                        <div className="text-center">
                            <span className="text-6xl animate-bounce">🎉</span>
                            <p className="text-white font-bold mt-2">XP მოპოვებულია!</p>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
                            <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">დღის გამოწვევები</h3>
                            <div className="flex items-center gap-2 text-xs">
                                <Clock className="w-3 h-3 text-white/50" />
                                <span className="text-white/50">განახლდება: {timeLeft}</span>
                            </div>
                        </div>
                    </div>

                    {/* Streak */}
                    <div className="flex items-center gap-1 px-3 py-1 bg-orange-500/20 rounded-full">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-400 font-bold text-sm">{streak}</span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                        <span>{completedCount}/{challenges.length} შესრულებული</span>
                        <span>+{totalXP} XP</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                            style={{ width: `${(completedCount / challenges.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Challenges list */}
                <div className="space-y-2">
                    {challenges.map(challenge => (
                        <div
                            key={challenge.id}
                            className={`relative p-3 rounded-xl border transition-all ${challenge.completed
                                    ? 'bg-emerald-500/10 border-emerald-500/30'
                                    : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{challenge.icon}</span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-white font-medium text-sm">{challenge.title}</h4>
                                        {challenge.completed && (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        )}
                                    </div>
                                    <p className="text-white/50 text-xs">{challenge.description}</p>

                                    {/* Progress */}
                                    {!challenge.completed && challenge.goal > 1 && (
                                        <div className="mt-1 flex items-center gap-2">
                                            <div className="flex-1 h-1 bg-slate-700 rounded-full">
                                                <div
                                                    className="h-full bg-amber-500 rounded-full transition-all"
                                                    style={{ width: `${(challenge.progress / challenge.goal) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-white/50">{challenge.progress}/{challenge.goal}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="text-right">
                                    <span className={`text-xs font-medium ${challenge.completed ? 'text-emerald-400' : 'text-amber-400'}`}>
                                        +{challenge.xpReward} XP
                                    </span>
                                    {!challenge.completed && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => completeChallenge(challenge.id)}
                                            className="mt-1 h-6 text-xs text-white/60 hover:text-white p-0"
                                        >
                                            <ArrowRight className="w-3 h-3" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bonus for completing all */}
                {completedCount === challenges.length && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30 flex items-center gap-3">
                        <Gift className="w-6 h-6 text-amber-400" />
                        <div>
                            <p className="text-amber-300 font-medium text-sm">ყველა გამოწვევა შესრულებულია! 🎉</p>
                            <p className="text-amber-400/70 text-xs">ბონუს +50 XP მოპოვებულია</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
