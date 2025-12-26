'use client'

import { useState, useEffect } from 'react'
import { Swords, Trophy, Users, ChevronLeft, ChevronRight, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Tool {
    id: string
    name: string
    icon: string
    votes: number
    category: string
}

interface Battle {
    id: string
    tool1: Tool
    tool2: Tool
    endTime: string
    totalVotes: number
}

const SAMPLE_BATTLES: Battle[] = [
    {
        id: '1',
        tool1: { id: 'chatgpt', name: 'ChatGPT', icon: '🤖', votes: 1247, category: 'ჩატბოტი' },
        tool2: { id: 'claude', name: 'Claude', icon: '🧠', votes: 1089, category: 'ჩატბოტი' },
        endTime: '2024-12-28T00:00:00',
        totalVotes: 2336
    },
    {
        id: '2',
        tool1: { id: 'midjourney', name: 'Midjourney', icon: '🎨', votes: 892, category: 'სურათი' },
        tool2: { id: 'dalle', name: 'DALL-E 3', icon: '🖼️', votes: 756, category: 'სურათი' },
        endTime: '2024-12-28T00:00:00',
        totalVotes: 1648
    },
    {
        id: '3',
        tool1: { id: 'copilot', name: 'GitHub Copilot', icon: '💻', votes: 678, category: 'კოდი' },
        tool2: { id: 'cursor', name: 'Cursor', icon: '⌨️', votes: 542, category: 'კოდი' },
        endTime: '2024-12-28T00:00:00',
        totalVotes: 1220
    }
]

export function ToolComparison() {
    const [battles, setBattles] = useState<Battle[]>(SAMPLE_BATTLES)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [hasVoted, setHasVoted] = useState<{ [key: string]: string }>({})
    const [showResult, setShowResult] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('tool_votes')
        if (saved) setHasVoted(JSON.parse(saved))
    }, [])

    const currentBattle = battles[currentIndex]
    const tool1Percentage = Math.round((currentBattle.tool1.votes / currentBattle.totalVotes) * 100)
    const tool2Percentage = 100 - tool1Percentage

    const handleVote = (toolId: string) => {
        if (hasVoted[currentBattle.id]) return

        // Update votes
        setBattles(prev => prev.map(battle => {
            if (battle.id === currentBattle.id) {
                return {
                    ...battle,
                    tool1: {
                        ...battle.tool1,
                        votes: toolId === battle.tool1.id ? battle.tool1.votes + 1 : battle.tool1.votes
                    },
                    tool2: {
                        ...battle.tool2,
                        votes: toolId === battle.tool2.id ? battle.tool2.votes + 1 : battle.tool2.votes
                    },
                    totalVotes: battle.totalVotes + 1
                }
            }
            return battle
        }))

        // Save vote
        const newVotes = { ...hasVoted, [currentBattle.id]: toolId }
        setHasVoted(newVotes)
        localStorage.setItem('tool_votes', JSON.stringify(newVotes))
        setShowResult(true)
    }

    const nextBattle = () => {
        setShowResult(false)
        setCurrentIndex(prev => (prev + 1) % battles.length)
    }

    const prevBattle = () => {
        setShowResult(false)
        setCurrentIndex(prev => (prev - 1 + battles.length) % battles.length)
    }

    const voted = hasVoted[currentBattle.id]

    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-red-900/10 to-orange-900/10 border border-red-500/20 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl">
                            <Swords className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">AI ბრძოლა</h3>
                            <p className="text-white/50 text-xs">აირჩიე საუკეთესო!</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-red-500/20 rounded-full">
                        <Flame className="w-4 h-4 text-red-400" />
                        <span className="text-red-400 font-bold text-sm">Live</span>
                    </div>
                </div>

                {/* Battle Arena */}
                <div className="relative">
                    {/* VS Badge */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-red-500/30">
                            VS
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Tool 1 */}
                        <button
                            onClick={() => handleVote(currentBattle.tool1.id)}
                            disabled={!!voted}
                            className={`relative p-4 rounded-2xl border-2 transition-all ${voted === currentBattle.tool1.id
                                    ? 'bg-emerald-500/20 border-emerald-500'
                                    : voted
                                        ? 'bg-slate-800/50 border-slate-700 opacity-60'
                                        : 'bg-slate-800/50 border-slate-700 hover:border-indigo-500 hover:scale-105'
                                }`}
                        >
                            <span className="text-5xl block mb-2">{currentBattle.tool1.icon}</span>
                            <h4 className="text-white font-bold">{currentBattle.tool1.name}</h4>
                            <p className="text-white/50 text-xs">{currentBattle.tool1.category}</p>

                            {/* Vote count */}
                            {(voted || showResult) && (
                                <div className="mt-3">
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-1">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
                                            style={{ width: `${tool1Percentage}%` }}
                                        />
                                    </div>
                                    <p className="text-indigo-400 font-bold text-sm">{tool1Percentage}%</p>
                                    <p className="text-white/40 text-xs">{currentBattle.tool1.votes} ხმა</p>
                                </div>
                            )}

                            {voted === currentBattle.tool1.id && (
                                <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 rounded-full text-xs text-white">
                                    ✓ შენი
                                </div>
                            )}
                        </button>

                        {/* Tool 2 */}
                        <button
                            onClick={() => handleVote(currentBattle.tool2.id)}
                            disabled={!!voted}
                            className={`relative p-4 rounded-2xl border-2 transition-all ${voted === currentBattle.tool2.id
                                    ? 'bg-emerald-500/20 border-emerald-500'
                                    : voted
                                        ? 'bg-slate-800/50 border-slate-700 opacity-60'
                                        : 'bg-slate-800/50 border-slate-700 hover:border-indigo-500 hover:scale-105'
                                }`}
                        >
                            <span className="text-5xl block mb-2">{currentBattle.tool2.icon}</span>
                            <h4 className="text-white font-bold">{currentBattle.tool2.name}</h4>
                            <p className="text-white/50 text-xs">{currentBattle.tool2.category}</p>

                            {/* Vote count */}
                            {(voted || showResult) && (
                                <div className="mt-3">
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-1">
                                        <div
                                            className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-1000"
                                            style={{ width: `${tool2Percentage}%` }}
                                        />
                                    </div>
                                    <p className="text-pink-400 font-bold text-sm">{tool2Percentage}%</p>
                                    <p className="text-white/40 text-xs">{currentBattle.tool2.votes} ხმა</p>
                                </div>
                            )}

                            {voted === currentBattle.tool2.id && (
                                <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 rounded-full text-xs text-white">
                                    ✓ შენი
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6">
                    <button
                        onClick={prevBattle}
                        className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </button>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-white/50 text-sm">
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{currentBattle.totalVotes.toLocaleString()} ხმა</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4" />
                            <span>ბრძოლა #{currentIndex + 1}/{battles.length}</span>
                        </div>
                    </div>

                    <button
                        onClick={nextBattle}
                        className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>
        </div>
    )
}
