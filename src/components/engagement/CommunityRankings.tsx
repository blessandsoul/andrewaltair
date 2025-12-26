'use client'

import { useState } from 'react'
import { MapPin, Trophy, Medal, Crown, Flame, ChevronUp, ChevronDown } from 'lucide-react'

interface CityRanking {
    rank: number
    city: string
    users: number
    xpTotal: number
    change: 'up' | 'down' | 'same'
    changeAmount?: number
}

const RANKINGS: CityRanking[] = [
    { rank: 1, city: 'თბილისი', users: 2450, xpTotal: 125000, change: 'same' },
    { rank: 2, city: 'ბათუმი', users: 890, xpTotal: 45000, change: 'up', changeAmount: 2 },
    { rank: 3, city: 'ქუთაისი', users: 720, xpTotal: 38000, change: 'down', changeAmount: 1 },
    { rank: 4, city: 'რუსთავი', users: 450, xpTotal: 22500, change: 'up', changeAmount: 1 },
    { rank: 5, city: 'გორი', users: 320, xpTotal: 16000, change: 'down', changeAmount: 2 },
    { rank: 6, city: 'ზუგდიდი', users: 280, xpTotal: 14000, change: 'same' },
    { rank: 7, city: 'ფოთი', users: 190, xpTotal: 9500, change: 'up', changeAmount: 1 },
    { rank: 8, city: 'თელავი', users: 170, xpTotal: 8500, change: 'same' },
    { rank: 9, city: 'ახალციხე', users: 150, xpTotal: 7500, change: 'down', changeAmount: 1 },
    { rank: 10, city: 'მცხეთა', users: 120, xpTotal: 6000, change: 'up', changeAmount: 3 }
]

type TabType = 'weekly' | 'monthly' | 'alltime'

export function CommunityRankings() {
    const [activeTab, setActiveTab] = useState<TabType>('weekly')
    const [userCity, setUserCity] = useState<string | null>(null)

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Crown className="w-5 h-5 text-amber-400" />
            case 2: return <Medal className="w-5 h-5 text-slate-300" />
            case 3: return <Medal className="w-5 h-5 text-amber-600" />
            default: return <span className="text-white/50 font-mono">{rank}</span>
        }
    }

    const getRankStyle = (rank: number) => {
        switch (rank) {
            case 1: return 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/30'
            case 2: return 'bg-gradient-to-r from-slate-400/10 to-slate-300/10 border-slate-400/30'
            case 3: return 'bg-gradient-to-r from-amber-700/10 to-amber-600/10 border-amber-700/30'
            default: return 'bg-slate-800/30 border-slate-700/50'
        }
    }

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K'
        }
        return num.toString()
    }

    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                            <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">საქართველოს რეიტინგი</h3>
                            <p className="text-white/50 text-xs">ქალაქების AI აქტივობა</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-indigo-500/20 rounded-full">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-400 font-bold text-sm">Live</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-slate-800/50 rounded-xl p-1 mb-4">
                    {[
                        { id: 'weekly' as TabType, label: 'კვირა' },
                        { id: 'monthly' as TabType, label: 'თვე' },
                        { id: 'alltime' as TabType, label: 'სულ' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-indigo-500 text-white'
                                    : 'text-white/60 hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Rankings List */}
                <div className="space-y-2">
                    {RANKINGS.map((city, index) => (
                        <div
                            key={city.city}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer ${getRankStyle(city.rank)
                                } ${userCity === city.city ? 'ring-2 ring-indigo-500' : ''}`}
                            onClick={() => setUserCity(city.city === userCity ? null : city.city)}
                        >
                            {/* Rank */}
                            <div className="w-8 h-8 flex items-center justify-center">
                                {getRankIcon(city.rank)}
                            </div>

                            {/* City */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-indigo-400" />
                                    <span className="text-white font-medium">{city.city}</span>
                                    {userCity === city.city && (
                                        <span className="px-2 py-0.5 bg-indigo-500/30 rounded-full text-xs text-indigo-300">
                                            შენი ქალაქი
                                        </span>
                                    )}
                                </div>
                                <p className="text-white/50 text-xs mt-0.5">
                                    {city.users.toLocaleString()} მომხმარებელი
                                </p>
                            </div>

                            {/* XP */}
                            <div className="text-right">
                                <p className="text-white font-bold">{formatNumber(city.xpTotal)} XP</p>
                                <div className={`flex items-center gap-1 text-xs ${city.change === 'up'
                                        ? 'text-emerald-400'
                                        : city.change === 'down'
                                            ? 'text-red-400'
                                            : 'text-white/30'
                                    }`}>
                                    {city.change === 'up' && <ChevronUp className="w-3 h-3" />}
                                    {city.change === 'down' && <ChevronDown className="w-3 h-3" />}
                                    {city.changeAmount ? `${city.change === 'up' ? '+' : '-'}${city.changeAmount}` : '—'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-6 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20 text-center">
                    <p className="text-white/80 text-sm mb-1">🏆 წარმოადგინე შენი ქალაქი!</p>
                    <p className="text-white/50 text-xs">შეაგროვე XP და აიყვანე შენი ქალაქი რეიტინგში</p>
                </div>
            </div>
        </div>
    )
}
