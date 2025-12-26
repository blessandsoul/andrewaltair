'use client'

import { useState } from 'react'
import { Users, Gift, Copy, CheckCircle, Trophy, Zap, Crown, Star, ArrowRight, Share2, Link, Mail, MessageCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ReferralTier {
    id: number
    name: string
    referrals: number
    reward: string
    icon: string
    color: string
    isUnlocked: boolean
}

interface ReferralStats {
    totalReferrals: number
    pendingReferrals: number
    successfulReferrals: number
    totalEarnings: number
    currentTier: number
}

const TIERS: ReferralTier[] = [
    { id: 1, name: 'Starter', referrals: 0, reward: '+100 XP', icon: '🌱', color: 'from-green-600 to-emerald-600', isUnlocked: true },
    { id: 2, name: 'Ambassador', referrals: 3, reward: '1 თვე Premium', icon: '🚀', color: 'from-blue-600 to-indigo-600', isUnlocked: true },
    { id: 3, name: 'Influencer', referrals: 10, reward: '3 თვე Premium', icon: '⭐', color: 'from-purple-600 to-fuchsia-600', isUnlocked: false },
    { id: 4, name: 'Legend', referrals: 25, reward: '1 წელი Premium', icon: '👑', color: 'from-yellow-500 to-orange-500', isUnlocked: false },
    { id: 5, name: 'Founding Member', referrals: 50, reward: 'Lifetime Access', icon: '💎', color: 'from-cyan-400 to-blue-500', isUnlocked: false }
]

const RECENT_REFERRALS = [
    { name: 'გიორგი მ.', status: 'active', date: '2 დღის წინ', earnings: '+100 XP' },
    { name: 'ნინო ბ.', status: 'active', date: '5 დღის წინ', earnings: '+100 XP' },
    { name: 'დავით ხ.', status: 'pending', date: '1 კვირის წინ', earnings: 'მოლოდინში' },
    { name: 'მარიამი თ.', status: 'active', date: '2 კვირის წინ', earnings: '+100 XP' }
]

export function ReferralProgram() {
    const [copied, setCopied] = useState(false)
    const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'rewards'>('overview')

    const referralCode = 'ANDREW2024'
    const referralLink = `https://andrewaltair.ge/ref/${referralCode}`

    const stats: ReferralStats = {
        totalReferrals: 7,
        pendingReferrals: 1,
        successfulReferrals: 6,
        totalEarnings: 600,
        currentTier: 2
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const currentTier = TIERS.find(t => t.id === stats.currentTier)!
    const nextTier = TIERS.find(t => t.id === stats.currentTier + 1)
    const progressToNext = nextTier
        ? ((stats.successfulReferrals - currentTier.referrals) / (nextTier.referrals - currentTier.referrals)) * 100
        : 100

    return (
        <div className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 mb-4">
                        <Gift className="w-4 h-4 text-pink-400" />
                        <span className="text-sm text-pink-300">რეფერალური პროგრამა</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        მოიწვიე მეგობრები, <span className="text-gradient">მიიღე ჯილდოები</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        გააზიარე შენი რეფერალ ლინკი და მიიღე Premium წვდომა, XP და ექსკლუზიური ჯილდოები
                    </p>
                </div>

                {/* Referral Link Card */}
                <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl border border-indigo-500/30 p-6 md:p-8 mb-8">
                    <div className="flex flex-col lg:flex-row items-center gap-6">
                        <div className="flex-1 w-full">
                            <h3 className="text-lg font-semibold text-white mb-2">შენი რეფერალ ლინკი</h3>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-zinc-900/80 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-300 overflow-hidden">
                                    <span className="truncate block">{referralLink}</span>
                                </div>
                                <Button
                                    onClick={handleCopy}
                                    className={`px-6 ${copied ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-500'}`}
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            კოპირებულია!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 mr-2" />
                                            კოპირება
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Share Buttons */}
                            <div className="flex gap-2 mt-4">
                                <Button variant="outline" size="sm" className="border-zinc-700 hover:bg-zinc-800">
                                    <MessageCircle className="w-4 h-4 mr-2 text-blue-400" />
                                    Facebook
                                </Button>
                                <Button variant="outline" size="sm" className="border-zinc-700 hover:bg-zinc-800">
                                    <Send className="w-4 h-4 mr-2 text-sky-400" />
                                    Telegram
                                </Button>
                                <Button variant="outline" size="sm" className="border-zinc-700 hover:bg-zinc-800">
                                    <Mail className="w-4 h-4 mr-2 text-red-400" />
                                    Email
                                </Button>
                            </div>
                        </div>

                        {/* QR Code Placeholder */}
                        <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-4xl">📱</div>
                                <span className="text-xs text-zinc-500">QR Code</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-blue-500/20">
                                <Users className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-sm text-zinc-400">სულ მოწვეული</span>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.totalReferrals}</div>
                    </div>
                    <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-green-500/20">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                            </div>
                            <span className="text-sm text-zinc-400">წარმატებული</span>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.successfulReferrals}</div>
                    </div>
                    <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-yellow-500/20">
                                <Zap className="w-5 h-5 text-yellow-400" />
                            </div>
                            <span className="text-sm text-zinc-400">მიღებული XP</span>
                        </div>
                        <div className="text-3xl font-bold text-yellow-400">{stats.totalEarnings}</div>
                    </div>
                    <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-purple-500/20">
                                <Crown className="w-5 h-5 text-purple-400" />
                            </div>
                            <span className="text-sm text-zinc-400">მიმდინარე დონე</span>
                        </div>
                        <div className="text-3xl font-bold text-white flex items-center gap-2">
                            {currentTier.icon} {currentTier.name}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    {[
                        { id: 'overview', label: 'მიმოხილვა' },
                        { id: 'leaderboard', label: 'ლიდერბორდი' },
                        { id: 'rewards', label: 'ჯილდოები' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Tier Progress */}
                        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-6">
                            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-400" />
                                დონის პროგრესი
                            </h3>

                            {/* Current Tier */}
                            <div className={`bg-gradient-to-r ${currentTier.color} rounded-xl p-4 mb-4`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{currentTier.icon}</span>
                                        <div>
                                            <div className="font-bold text-white">{currentTier.name}</div>
                                            <div className="text-sm text-white/80">{currentTier.reward}</div>
                                        </div>
                                    </div>
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                            </div>

                            {/* Progress to Next */}
                            {nextTier && (
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-zinc-400">შემდეგი: {nextTier.name}</span>
                                        <span className="text-white">{stats.successfulReferrals}/{nextTier.referrals} მოწვევა</span>
                                    </div>
                                    <div className="bg-zinc-800 rounded-full h-2 mb-2">
                                        <div
                                            className={`bg-gradient-to-r ${nextTier.color} h-full rounded-full transition-all`}
                                            style={{ width: `${progressToNext}%` }}
                                        />
                                    </div>
                                    <div className="text-sm text-zinc-500">
                                        კიდევ {nextTier.referrals - stats.successfulReferrals} მოწვევა საჭიროა
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Recent Referrals */}
                        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-6">
                            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-400" />
                                ბოლო მოწვეულები
                            </h3>
                            <div className="space-y-3">
                                {RECENT_REFERRALS.map((ref, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-lg">
                                                👤
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{ref.name}</div>
                                                <div className="text-xs text-zinc-500">{ref.date}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs px-2 py-1 rounded-full ${ref.status === 'active'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {ref.status === 'active' ? 'აქტიური' : 'მოლოდინში'}
                                            </span>
                                            <div className="text-sm text-yellow-400 mt-1">{ref.earnings}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Rewards Tab */}
                {activeTab === 'rewards' && (
                    <div className="space-y-4">
                        {TIERS.map((tier, i) => (
                            <div
                                key={tier.id}
                                className={`rounded-xl border p-5 transition-all ${tier.isUnlocked
                                        ? 'bg-zinc-900/50 border-zinc-800/50'
                                        : 'bg-zinc-900/30 border-zinc-800/30 opacity-60'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`
                                            w-14 h-14 rounded-xl flex items-center justify-center text-3xl
                                            ${tier.isUnlocked
                                                ? `bg-gradient-to-br ${tier.color}`
                                                : 'bg-zinc-800'
                                            }
                                        `}>
                                            {tier.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-white">{tier.name}</h3>
                                                {tier.isUnlocked && (
                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                )}
                                            </div>
                                            <div className="text-sm text-zinc-400">
                                                {tier.referrals === 0 ? 'დარეგისტრირდი' : `${tier.referrals} მოწვევა`}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-semibold ${tier.isUnlocked ? 'text-green-400' : 'text-zinc-400'}`}>
                                            {tier.reward}
                                        </div>
                                        {!tier.isUnlocked && stats.successfulReferrals > 0 && (
                                            <div className="text-xs text-zinc-500 mt-1">
                                                {tier.referrals - stats.successfulReferrals} მოწვევა დარჩა
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Leaderboard Tab */}
                {activeTab === 'leaderboard' && (
                    <div className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 overflow-hidden">
                        <div className="p-4 border-b border-zinc-800">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-400" />
                                თვის ტოპ რეფერერები
                            </h3>
                        </div>
                        <div className="divide-y divide-zinc-800">
                            {[
                                { rank: 1, name: 'გიორგი მ.', referrals: 45, reward: '🥇' },
                                { rank: 2, name: 'ნინო ბ.', referrals: 38, reward: '🥈' },
                                { rank: 3, name: 'დავით ხ.', referrals: 32, reward: '🥉' },
                                { rank: 4, name: 'მარიამი თ.', referrals: 28, reward: '' },
                                { rank: 5, name: 'ლუკა კ.', referrals: 24, reward: '' },
                                { rank: 12, name: 'შენ', referrals: stats.successfulReferrals, reward: '', isCurrentUser: true }
                            ].map((user) => (
                                <div
                                    key={user.rank}
                                    className={`flex items-center justify-between p-4 ${user.isCurrentUser ? 'bg-indigo-600/10' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`font-bold text-lg w-8 ${user.rank <= 3 ? 'text-yellow-400' : 'text-zinc-500'
                                            }`}>
                                            #{user.rank}
                                        </span>
                                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-lg">
                                            {user.reward || '👤'}
                                        </div>
                                        <div>
                                            <div className={`font-medium ${user.isCurrentUser ? 'text-indigo-300' : 'text-white'}`}>
                                                {user.name}
                                            </div>
                                            <div className="text-xs text-zinc-500">{user.referrals} მოწვევა</div>
                                        </div>
                                    </div>
                                    {user.rank <= 3 && (
                                        <span className="text-xs px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                                            {user.rank === 1 ? '1 წელი Premium' : user.rank === 2 ? '6 თვე Premium' : '3 თვე Premium'}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
