'use client'

import { useState, useEffect } from 'react'
import { Swords, Trophy, ThumbsUp, Users, Clock, Flame, ChevronRight, Share2, Star, Zap, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AITool {
    id: string
    name: string
    icon: string
    category: string
    color: string
}

interface Battle {
    id: string
    tool1: AITool
    tool2: AITool
    votes1: number
    votes2: number
    totalVotes: number
    category: string
    status: 'active' | 'upcoming' | 'completed'
    endsAt: string
    winner?: 'tool1' | 'tool2'
}

interface UserVote {
    battleId: string
    votedFor: 'tool1' | 'tool2'
}

const AI_TOOLS: AITool[] = [
    { id: 'chatgpt', name: 'ChatGPT', icon: '🤖', category: 'ჩატბოტი', color: 'from-green-500 to-emerald-600' },
    { id: 'claude', name: 'Claude', icon: '🧠', category: 'ჩატბოტი', color: 'from-orange-500 to-amber-600' },
    { id: 'gemini', name: 'Gemini', icon: '✨', category: 'ჩატბოტი', color: 'from-blue-500 to-indigo-600' },
    { id: 'midjourney', name: 'Midjourney', icon: '🎨', category: 'გამოსახულება', color: 'from-purple-500 to-fuchsia-600' },
    { id: 'dalle', name: 'DALL-E 3', icon: '🖼️', category: 'გამოსახულება', color: 'from-cyan-500 to-teal-600' },
    { id: 'copilot', name: 'GitHub Copilot', icon: '💻', category: 'კოდი', color: 'from-gray-600 to-zinc-700' },
    { id: 'cursor', name: 'Cursor', icon: '⚡', category: 'კოდი', color: 'from-violet-500 to-purple-600' },
    { id: 'runway', name: 'Runway', icon: '🎬', category: 'ვიდეო', color: 'from-pink-500 to-rose-600' }
]

const BATTLES: Battle[] = [
    {
        id: '1',
        tool1: AI_TOOLS[0], // ChatGPT
        tool2: AI_TOOLS[1], // Claude
        votes1: 1247,
        votes2: 1089,
        totalVotes: 2336,
        category: 'ჩატბოტი',
        status: 'active',
        endsAt: '2024-12-28T18:00:00'
    },
    {
        id: '2',
        tool1: AI_TOOLS[3], // Midjourney
        tool2: AI_TOOLS[4], // DALL-E
        votes1: 2156,
        votes2: 1567,
        totalVotes: 3723,
        category: 'გამოსახულება',
        status: 'active',
        endsAt: '2024-12-27T12:00:00'
    },
    {
        id: '3',
        tool1: AI_TOOLS[5], // Copilot
        tool2: AI_TOOLS[6], // Cursor
        votes1: 892,
        votes2: 1245,
        totalVotes: 2137,
        category: 'კოდი',
        status: 'active',
        endsAt: '2024-12-29T20:00:00'
    },
    {
        id: '4',
        tool1: AI_TOOLS[0], // ChatGPT
        tool2: AI_TOOLS[2], // Gemini
        votes1: 3421,
        votes2: 2876,
        totalVotes: 6297,
        category: 'ჩატბოტი',
        status: 'completed',
        endsAt: '2024-12-20T18:00:00',
        winner: 'tool1'
    }
]

export function AIToolBattles() {
    const [userVotes, setUserVotes] = useState<UserVote[]>([])
    const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all')
    const [animatingBattle, setAnimatingBattle] = useState<string | null>(null)
    const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({})

    // Calculate countdown timers
    useEffect(() => {
        const updateCountdowns = () => {
            const newCountdowns: { [key: string]: string } = {}
            BATTLES.forEach(battle => {
                if (battle.status === 'active') {
                    const end = new Date(battle.endsAt).getTime()
                    const now = Date.now()
                    const diff = end - now

                    if (diff > 0) {
                        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
                        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

                        if (days > 0) {
                            newCountdowns[battle.id] = `${days}დ ${hours}სთ`
                        } else if (hours > 0) {
                            newCountdowns[battle.id] = `${hours}სთ ${minutes}წთ`
                        } else {
                            newCountdowns[battle.id] = `${minutes}წთ`
                        }
                    } else {
                        newCountdowns[battle.id] = 'დასრულებული'
                    }
                }
            })
            setCountdowns(newCountdowns)
        }

        updateCountdowns()
        const interval = setInterval(updateCountdowns, 60000)
        return () => clearInterval(interval)
    }, [])

    const handleVote = (battleId: string, votedFor: 'tool1' | 'tool2') => {
        // Check if already voted
        if (userVotes.find(v => v.battleId === battleId)) return

        setAnimatingBattle(battleId)
        setTimeout(() => {
            setUserVotes([...userVotes, { battleId, votedFor }])
            setAnimatingBattle(null)
        }, 500)
    }

    const getUserVote = (battleId: string) => {
        return userVotes.find(v => v.battleId === battleId)
    }

    const categories = ['all', ...new Set(BATTLES.map(b => b.category))]

    const filteredBattles = BATTLES.filter(battle =>
        selectedCategory === 'all' || battle.category === selectedCategory
    )

    const activeBattles = filteredBattles.filter(b => b.status === 'active')
    const completedBattles = filteredBattles.filter(b => b.status === 'completed')

    return (
        <div className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 mb-4">
                        <Swords className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-red-300">AI ბრძოლები</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        AI Tool <span className="text-gradient">Battles</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        ხმა მიეცი შენს საყვარელ AI ინსტრუმენტს და გაიგე რომელია საზოგადოების ფავორიტი
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 text-center">
                        <div className="text-3xl font-bold text-white">{activeBattles.length}</div>
                        <div className="text-sm text-zinc-500">აქტიური ბრძოლა</div>
                    </div>
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 text-center">
                        <div className="text-3xl font-bold text-yellow-400">
                            {BATTLES.reduce((sum, b) => sum + b.totalVotes, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-zinc-500">სულ ხმა</div>
                    </div>
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 text-center">
                        <div className="text-3xl font-bold text-purple-400">{userVotes.length}</div>
                        <div className="text-sm text-zinc-500">შენი ხმები</div>
                    </div>
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 text-center">
                        <div className="text-3xl font-bold text-green-400">+50 XP</div>
                        <div className="text-sm text-zinc-500">ხმაზე</div>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${selectedCategory === cat
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800'
                                }`}
                        >
                            {cat === 'all' ? 'ყველა' : cat}
                        </button>
                    ))}
                </div>

                {/* Active Battles */}
                <div className="mb-10">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-400" />
                        აქტიური ბრძოლები
                    </h3>
                    <div className="grid gap-6">
                        {activeBattles.map((battle) => {
                            const userVote = getUserVote(battle.id)
                            const percent1 = Math.round((battle.votes1 / battle.totalVotes) * 100)
                            const percent2 = 100 - percent1
                            const isAnimating = animatingBattle === battle.id

                            return (
                                <div
                                    key={battle.id}
                                    className={`bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6 transition-all ${isAnimating ? 'scale-[0.99]' : ''
                                        }`}
                                >
                                    {/* Battle Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm flex items-center gap-1">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                </span>
                                                LIVE
                                            </span>
                                            <span className="text-sm text-zinc-500">{battle.category}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                                            <Clock className="w-4 h-4" />
                                            {countdowns[battle.id] || 'იტვირთება...'}
                                        </div>
                                    </div>

                                    {/* Battle Arena */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        {/* Tool 1 */}
                                        <button
                                            onClick={() => handleVote(battle.id, 'tool1')}
                                            disabled={!!userVote}
                                            className={`relative p-6 rounded-xl border-2 transition-all ${userVote?.votedFor === 'tool1'
                                                    ? 'border-green-500 bg-green-500/10'
                                                    : userVote
                                                        ? 'border-zinc-700 opacity-60'
                                                        : 'border-zinc-700 hover:border-indigo-500 hover:bg-indigo-500/5'
                                                }`}
                                        >
                                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${battle.tool1.color} opacity-10`} />
                                            <div className="relative text-center">
                                                <div className="text-5xl mb-3">{battle.tool1.icon}</div>
                                                <h4 className="text-xl font-bold text-white">{battle.tool1.name}</h4>
                                                <div className="text-sm text-zinc-400 mt-1">{battle.tool1.category}</div>

                                                {userVote?.votedFor === 'tool1' && (
                                                    <div className="absolute top-2 right-2">
                                                        <ThumbsUp className="w-5 h-5 text-green-400 fill-green-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </button>

                                        {/* Tool 2 */}
                                        <button
                                            onClick={() => handleVote(battle.id, 'tool2')}
                                            disabled={!!userVote}
                                            className={`relative p-6 rounded-xl border-2 transition-all ${userVote?.votedFor === 'tool2'
                                                    ? 'border-green-500 bg-green-500/10'
                                                    : userVote
                                                        ? 'border-zinc-700 opacity-60'
                                                        : 'border-zinc-700 hover:border-indigo-500 hover:bg-indigo-500/5'
                                                }`}
                                        >
                                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${battle.tool2.color} opacity-10`} />
                                            <div className="relative text-center">
                                                <div className="text-5xl mb-3">{battle.tool2.icon}</div>
                                                <h4 className="text-xl font-bold text-white">{battle.tool2.name}</h4>
                                                <div className="text-sm text-zinc-400 mt-1">{battle.tool2.category}</div>

                                                {userVote?.votedFor === 'tool2' && (
                                                    <div className="absolute top-2 right-2">
                                                        <ThumbsUp className="w-5 h-5 text-green-400 fill-green-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    </div>

                                    {/* VS Divider */}
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden md:block">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg shadow-red-500/30">
                                            VS
                                        </div>
                                    </div>

                                    {/* Results Bar */}
                                    <div className="relative">
                                        <div className="flex h-10 rounded-full overflow-hidden bg-zinc-800">
                                            <div
                                                className={`flex items-center justify-center transition-all duration-500 bg-gradient-to-r ${battle.tool1.color}`}
                                                style={{ width: `${percent1}%` }}
                                            >
                                                <span className="text-sm font-bold text-white drop-shadow">
                                                    {percent1}%
                                                </span>
                                            </div>
                                            <div
                                                className={`flex items-center justify-center transition-all duration-500 bg-gradient-to-r ${battle.tool2.color}`}
                                                style={{ width: `${percent2}%` }}
                                            >
                                                <span className="text-sm font-bold text-white drop-shadow">
                                                    {percent2}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Stats */}
                                    <div className="flex items-center justify-between mt-4 text-sm text-zinc-400">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {battle.totalVotes.toLocaleString()} ხმა
                                            </span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                                            <Share2 className="w-4 h-4 mr-2" />
                                            გაზიარება
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Completed Battles */}
                {completedBattles.length > 0 && (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-400" />
                            დასრულებული ბრძოლები
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {completedBattles.map((battle) => {
                                const winner = battle.winner === 'tool1' ? battle.tool1 : battle.tool2
                                const loser = battle.winner === 'tool1' ? battle.tool2 : battle.tool1
                                const winnerVotes = battle.winner === 'tool1' ? battle.votes1 : battle.votes2
                                const loserVotes = battle.winner === 'tool1' ? battle.votes2 : battle.votes1

                                return (
                                    <div
                                        key={battle.id}
                                        className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-5"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm text-zinc-500">{battle.category}</span>
                                            <span className="px-2 py-1 rounded-full bg-zinc-800 text-xs text-zinc-400">
                                                დასრულდა
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {/* Winner */}
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="relative">
                                                    <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center text-3xl">
                                                        {winner.icon}
                                                    </div>
                                                    <Crown className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{winner.name}</div>
                                                    <div className="text-sm text-green-400">{winnerVotes.toLocaleString()} ხმა</div>
                                                </div>
                                            </div>

                                            <div className="text-zinc-600 text-sm">vs</div>

                                            {/* Loser */}
                                            <div className="flex items-center gap-3 flex-1 opacity-60">
                                                <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center text-3xl">
                                                    {loser.icon}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-zinc-400">{loser.name}</div>
                                                    <div className="text-sm text-zinc-500">{loserVotes.toLocaleString()} ხმა</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
