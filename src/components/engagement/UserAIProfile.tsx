'use client'

import { useState, useEffect } from 'react'
import { Brain, Sparkles, Share2, Target, Lightbulb, Rocket, Eye, Palette, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'

const AI_TYPES = [
    {
        id: 'visionary',
        name: 'AI ვიზიონერი',
        emoji: '🔮',
        icon: Eye,
        color: 'from-purple-500 to-indigo-500',
        description: 'შენ ხედავ AI-ს უზარმაზარ პოტენციალს და მზად ხარ ტექნოლოგიების მომავლისთვის.',
        traits: ['ინოვაციური', 'მომავალზე ორიენტირებული', 'სტრატეგიული']
    },
    {
        id: 'creator',
        name: 'AI კრეატორი',
        emoji: '🎨',
        icon: Palette,
        color: 'from-pink-500 to-rose-500',
        description: 'შენ იყენებ AI-ს კრეატიული პროექტებისთვის და ხელოვნებისთვის.',
        traits: ['კრეატიული', 'ექსპერიმენტატორი', 'მხატვრული']
    },
    {
        id: 'developer',
        name: 'AI დეველოპერი',
        emoji: '💻',
        icon: Code,
        color: 'from-cyan-500 to-blue-500',
        description: 'შენ იყენებ AI-ს კოდის წერაში და ტექნიკური პრობლემების გადაჭრაში.',
        traits: ['ტექნიკური', 'ლოგიკური', 'პროდუქტიული']
    },
    {
        id: 'explorer',
        name: 'AI მკვლევარი',
        emoji: '🧭',
        icon: Target,
        color: 'from-emerald-500 to-teal-500',
        description: 'შენ მუდმივად იკვლევ ახალ AI ინსტრუმენტებს და ტექნოლოგიებს.',
        traits: ['ცნობისმოყვარე', 'ადაპტირებადი', 'სწავლაზე მოწყურებული']
    },
    {
        id: 'innovator',
        name: 'AI ინოვატორი',
        emoji: '💡',
        icon: Lightbulb,
        color: 'from-amber-500 to-orange-500',
        description: 'შენ იყენებ AI-ს ახალი იდეების გენერირებისა და ბიზნესისთვის.',
        traits: ['ინოვაციური', 'მეწარმე', 'პრობლემის გადამჭრელი']
    },
    {
        id: 'pioneer',
        name: 'AI პიონერი',
        emoji: '🚀',
        icon: Rocket,
        color: 'from-red-500 to-pink-500',
        description: 'შენ ხარ AI-ს ადრეული მომხმარებელი და ტექნოლოგიების ლიდერი.',
        traits: ['რისკზე მწყობი', 'ლიდერი', 'ტრენდსეტერი']
    }
]

interface UserAIProfileProps {
    onShare?: () => void
}

export function UserAIProfile({ onShare }: UserAIProfileProps) {
    const [aiType, setAiType] = useState(AI_TYPES[0])
    const [stats, setStats] = useState({
        toolsExplored: 0,
        articlesRead: 0,
        daysActive: 0,
        xpPoints: 0
    })
    const [isRevealed, setIsRevealed] = useState(false)

    useEffect(() => {
        // Load user data from localStorage
        const toolsExplored = parseInt(localStorage.getItem('tools_explored') || '0')
        const articlesRead = parseInt(localStorage.getItem('articles_read') || '0')
        const firstVisit = localStorage.getItem('first_visit')

        // Calculate days active
        const daysActive = firstVisit
            ? Math.floor((Date.now() - new Date(firstVisit).getTime()) / (1000 * 60 * 60 * 24)) + 1
            : 1

        if (!firstVisit) {
            localStorage.setItem('first_visit', new Date().toISOString())
        }

        // Calculate XP
        const xpPoints = toolsExplored * 10 + articlesRead * 5 + daysActive * 2

        setStats({ toolsExplored, articlesRead, daysActive, xpPoints })

        // Determine AI type based on behavior
        const savedType = localStorage.getItem('ai_type')
        if (savedType) {
            const type = AI_TYPES.find(t => t.id === savedType)
            if (type) setAiType(type)
        } else {
            // Random assignment for now (could be quiz-based)
            const randomType = AI_TYPES[Math.floor(Math.random() * AI_TYPES.length)]
            setAiType(randomType)
            localStorage.setItem('ai_type', randomType.id)
        }
    }, [])

    const handleReveal = () => {
        setIsRevealed(true)
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `მე ვარ ${aiType.name}!`,
                text: `${aiType.description} გაიგე შენი AI ტიპი Andrew Altair-ზე!`,
                url: window.location.origin
            })
        }
    }

    const TypeIcon = aiType.icon

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6">
                {/* Background glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${aiType.color} opacity-10`} />

                {!isRevealed ? (
                    /* Pre-reveal state */
                    <div className="relative text-center py-8">
                        <div className="mb-6">
                            <div className="inline-flex p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full mb-4 animate-pulse">
                                <Brain className="w-12 h-12 text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">რა ტიპის AI მომხმარებელი ხარ?</h2>
                            <p className="text-white/60">გაიგე შენი AI პროფილი და მიიღე პერსონალიზებული რეკომენდაციები</p>
                        </div>

                        <Button
                            onClick={handleReveal}
                            className={`bg-gradient-to-r ${aiType.color} hover:opacity-90 text-white font-bold px-8 py-3`}
                        >
                            <Sparkles className="w-5 h-5 mr-2" />
                            გამოავლინე შენი ტიპი
                        </Button>
                    </div>
                ) : (
                    /* Revealed profile */
                    <div className="relative">
                        {/* Profile Card */}
                        <div className="text-center mb-6">
                            <div className={`inline-flex p-4 bg-gradient-to-br ${aiType.color} rounded-2xl shadow-lg mb-4`}>
                                <TypeIcon className="w-10 h-10 text-white" />
                            </div>
                            <div className="text-4xl mb-2">{aiType.emoji}</div>
                            <h2 className={`text-2xl font-bold bg-gradient-to-r ${aiType.color} bg-clip-text text-transparent mb-2`}>
                                {aiType.name}
                            </h2>
                            <p className="text-white/70 text-sm">{aiType.description}</p>
                        </div>

                        {/* Traits */}
                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                            {aiType.traits.map((trait, i) => (
                                <span
                                    key={i}
                                    className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${aiType.color} bg-opacity-20 text-white border border-white/10`}
                                >
                                    {trait}
                                </span>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-2 mb-6">
                            {[
                                { label: 'XP', value: stats.xpPoints },
                                { label: 'ინსტრუმენტი', value: stats.toolsExplored },
                                { label: 'სტატია', value: stats.articlesRead },
                                { label: 'დღე', value: stats.daysActive }
                            ].map((stat, i) => (
                                <div key={i} className="bg-slate-800/50 rounded-xl p-2 text-center">
                                    <p className="text-white font-bold">{stat.value}</p>
                                    <p className="text-white/50 text-xs">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Share Button */}
                        <Button
                            onClick={handleShare}
                            variant="outline"
                            className="w-full border-slate-600 text-white hover:bg-slate-700"
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            გააზიარე პროფილი
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
