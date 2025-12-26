'use client'

import { useState, useEffect } from 'react'
import { GraduationCap, ChevronRight, Lock, CheckCircle2, Star, Trophy, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Level {
    id: number
    name: string
    description: string
    xpRequired: number
    rewards: string[]
    icon: string
    completed: boolean
    current: boolean
}

const LEVELS: Level[] = [
    {
        id: 1,
        name: 'AI დამწყები',
        description: 'გაეცანი AI-ს საფუძვლებს',
        xpRequired: 0,
        rewards: ['დამწყების ბეჯი', '10 დამატებითი კრედიტი'],
        icon: '🌱',
        completed: false,
        current: true
    },
    {
        id: 2,
        name: 'AI მკვლევარი',
        description: 'შეისწავლე 10 AI ინსტრუმენტი',
        xpRequired: 100,
        rewards: ['მკვლევარის ბეჯი', 'ექსკლუზიური კონტენტი'],
        icon: '🔭',
        completed: false,
        current: false
    },
    {
        id: 3,
        name: 'AI ენთუზიასტი',
        description: 'დაასრულე 5 ქვიზი',
        xpRequired: 300,
        rewards: ['ენთუზიასტის ბეჯი', 'Premium ფუნქციები 7 დღით'],
        icon: '⚡',
        completed: false,
        current: false
    },
    {
        id: 4,
        name: 'AI პრაქტიკოსი',
        description: 'გამოიყენე AI ინსტრუმენტები 20-ჯერ',
        xpRequired: 600,
        rewards: ['პრაქტიკოსის ბეჯი', 'პერსონალიზებული რეკომენდაციები'],
        icon: '🛠️',
        completed: false,
        current: false
    },
    {
        id: 5,
        name: 'AI ექსპერტი',
        description: 'მიაღწიე 1000 XP',
        xpRequired: 1000,
        rewards: ['ექსპერტის ბეჯი', 'სერტიფიკატი', 'Premium სამუდამოდ -20%'],
        icon: '🎓',
        completed: false,
        current: false
    },
    {
        id: 6,
        name: 'AI მასტერი',
        description: 'გახდი AI-ს ნამდვილი ოსტატი',
        xpRequired: 2500,
        rewards: ['მასტერის ბეჯი', 'VIP სტატუსი', 'ექსკლუზიური წვდომა'],
        icon: '👑',
        completed: false,
        current: false
    }
]

export function LearningPath() {
    const [levels, setLevels] = useState<Level[]>(LEVELS)
    const [currentXP, setCurrentXP] = useState(0)
    const [currentLevel, setCurrentLevel] = useState(1)

    useEffect(() => {
        const xp = parseInt(localStorage.getItem('xp_points') || '0')
        setCurrentXP(xp)

        // Update levels based on XP
        const updated = LEVELS.map((level, index) => {
            const completed = xp >= level.xpRequired
            const current = completed && (index === LEVELS.length - 1 || xp < LEVELS[index + 1].xpRequired)

            if (current) setCurrentLevel(level.id)

            return { ...level, completed, current }
        })

        setLevels(updated)
    }, [])

    // Calculate progress to next level
    const currentLevelData = levels.find(l => l.current) || levels[0]
    const nextLevel = levels.find(l => l.id === currentLevelData.id + 1)
    const progressToNext = nextLevel
        ? ((currentXP - currentLevelData.xpRequired) / (nextLevel.xpRequired - currentLevelData.xpRequired)) * 100
        : 100

    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">AI სწავლის გზა</h3>
                            <p className="text-white/50 text-xs">გახდი AI ექსპერტი ეტაპობრივად</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-indigo-500/20 rounded-full">
                        <Zap className="w-4 h-4 text-indigo-400" />
                        <span className="text-indigo-400 font-bold">{currentXP} XP</span>
                    </div>
                </div>

                {/* Current Level Card */}
                <div className="mb-6 p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl border border-indigo-500/30">
                    <div className="flex items-center gap-4">
                        <span className="text-4xl">{currentLevelData.icon}</span>
                        <div className="flex-1">
                            <p className="text-white/60 text-xs">ამჟამინდელი დონე</p>
                            <h4 className="text-xl font-bold text-white">{currentLevelData.name}</h4>
                            {nextLevel && (
                                <div className="mt-2">
                                    <div className="flex justify-between text-xs text-white/60 mb-1">
                                        <span>პროგრესი შემდეგ დონემდე</span>
                                        <span>{currentXP}/{nextLevel.xpRequired} XP</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                            style={{ width: `${Math.min(progressToNext, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Levels Timeline */}
                <div className="space-y-1">
                    {levels.map((level, index) => (
                        <div key={level.id} className="relative">
                            {/* Connector line */}
                            {index < levels.length - 1 && (
                                <div className={`absolute left-5 top-10 w-0.5 h-8 ${level.completed ? 'bg-emerald-500' : 'bg-slate-700'
                                    }`} />
                            )}

                            <div className={`flex items-center gap-4 p-3 rounded-xl transition-all ${level.current
                                    ? 'bg-indigo-500/10 border border-indigo-500/30'
                                    : level.completed
                                        ? 'bg-slate-800/30'
                                        : 'opacity-60'
                                }`}>
                                {/* Icon */}
                                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-xl ${level.completed
                                        ? 'bg-emerald-500/20'
                                        : level.current
                                            ? 'bg-indigo-500/20'
                                            : 'bg-slate-800'
                                    }`}>
                                    {level.completed ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    ) : level.current ? (
                                        <span>{level.icon}</span>
                                    ) : (
                                        <Lock className="w-4 h-4 text-slate-500" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className={`font-medium ${level.completed || level.current ? 'text-white' : 'text-white/50'}`}>
                                            {level.name}
                                        </h4>
                                        {level.current && (
                                            <span className="px-2 py-0.5 bg-indigo-500/30 rounded-full text-xs text-indigo-300">
                                                ამჟამად
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-white/50 text-xs">{level.description}</p>
                                </div>

                                {/* XP */}
                                <div className="text-right">
                                    <span className={`text-sm font-medium ${level.completed ? 'text-emerald-400' : 'text-white/40'
                                        }`}>
                                        {level.xpRequired} XP
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Rewards Preview */}
                {nextLevel && (
                    <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                            <Trophy className="w-4 h-4 text-amber-400" />
                            <h4 className="text-white text-sm font-medium">შემდეგი ჯილდოები</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {nextLevel.rewards.map((reward, i) => (
                                <span key={i} className="px-2 py-1 bg-amber-500/10 rounded-full text-xs text-amber-300">
                                    ⭐ {reward}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
