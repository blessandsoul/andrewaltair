'use client'

import { useState } from 'react'
import { Sparkles, ChevronRight, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Import all new engagement components
import { CommunityForum } from '@/components/engagement/CommunityForum'
import { ExpertQA } from '@/components/engagement/ExpertQA'
import { UserWorkflows } from '@/components/engagement/UserWorkflows'
import { NFTCollection } from '@/components/engagement/NFTCollection'
import { ReferralProgram } from '@/components/engagement/ReferralProgram'
import { AIToolBattles } from '@/components/engagement/AIToolBattles'
import { SmartOnboarding } from '@/components/engagement/SmartOnboarding'
import { AIForProfession } from '@/components/engagement/AIForProfession'
import { LiveDemoSessions } from '@/components/engagement/LiveDemoSessions'

const FEATURES = [
    {
        id: 'forum',
        name: 'Community Forum',
        description: 'AI საზოგადოების ფორუმი',
        icon: '💬',
        category: 'social',
        component: CommunityForum
    },
    {
        id: 'qa',
        name: 'Expert Q&A',
        description: 'კითხვა-პასუხი ექსპერტებთან',
        icon: '🎓',
        category: 'social',
        component: ExpertQA
    },
    {
        id: 'workflows',
        name: 'User Workflows',
        description: 'AI სამუშაო პროცესები',
        icon: '⚡',
        category: 'social',
        component: UserWorkflows
    },
    {
        id: 'nft',
        name: 'NFT Collection',
        description: 'კოლექციური კარტები',
        icon: '🎴',
        category: 'gamification',
        component: NFTCollection
    },
    {
        id: 'referral',
        name: 'Referral Program',
        description: 'რეფერალური პროგრამა',
        icon: '🎁',
        category: 'gamification',
        component: ReferralProgram
    },
    {
        id: 'battles',
        name: 'AI Tool Battles',
        description: 'AI ინსტრუმენტების ბრძოლა',
        icon: '⚔️',
        category: 'gamification',
        component: AIToolBattles
    },
    {
        id: 'onboarding',
        name: 'Smart Onboarding',
        description: 'ჭკვიანი ონბორდინგი',
        icon: '🚀',
        category: 'personalization',
        component: SmartOnboarding
    },
    {
        id: 'profession',
        name: 'AI for Profession',
        description: 'AI პროფესიებისთვის',
        icon: '💼',
        category: 'personalization',
        component: AIForProfession
    },
    {
        id: 'demos',
        name: 'Live Demo Sessions',
        description: 'ცოცხალი დემო სესიები',
        icon: '🎬',
        category: 'personalization',
        component: LiveDemoSessions
    }
]

const CATEGORIES = [
    { id: 'all', name: 'ყველა', icon: '📚' },
    { id: 'social', name: 'სოციალური', icon: '💬' },
    { id: 'gamification', name: 'გეიმიფიკაცია', icon: '🎮' },
    { id: 'personalization', name: 'პერსონალიზაცია', icon: '✨' }
]

export default function NewFeaturesPage() {
    const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [showOnboarding, setShowOnboarding] = useState(false)

    const filteredFeatures = FEATURES.filter(f =>
        selectedCategory === 'all' || f.category === selectedCategory
    )

    const ActiveComponent = selectedFeature
        ? FEATURES.find(f => f.id === selectedFeature)?.component
        : null

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Show Onboarding Modal */}
            {showOnboarding && (
                <SmartOnboarding
                    onComplete={() => setShowOnboarding(false)}
                    onSkip={() => setShowOnboarding(false)}
                />
            )}

            {/* Header */}
            <div className="bg-gradient-to-b from-indigo-900/20 to-transparent border-b border-zinc-800/50">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-4">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                            <span className="text-sm text-indigo-300">ახალი ფუნქციები</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            9 ახალი <span className="text-gradient">Engagement</span> ფუნქცია
                        </h1>
                        <p className="text-zinc-400 max-w-2xl mx-auto mb-8">
                            სოციალური ფუნქციები, გეიმიფიკაცია და პერსონალიზაცია — ყველაფერი რაც გჭირდებათ მომხმარებლების შესანარჩუნებლად
                        </p>

                        {/* Quick Action */}
                        <Button
                            onClick={() => setShowOnboarding(true)}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 gap-2"
                        >
                            <Sparkles className="w-4 h-4" />
                            სცადეთ Onboarding
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Category Filter */}
                <div className="flex justify-center gap-2 mb-8">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setSelectedCategory(cat.id)
                                setSelectedFeature(null)
                            }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${selectedCategory === cat.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800'
                                }`}
                        >
                            <span>{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Features Grid */}
                {!selectedFeature && (
                    <div className="grid md:grid-cols-3 gap-6">
                        {filteredFeatures.map((feature) => (
                            <button
                                key={feature.id}
                                onClick={() => setSelectedFeature(feature.id)}
                                className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6 text-left hover:border-indigo-500/50 hover:bg-zinc-900/80 transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="text-5xl">{feature.icon}</div>
                                    <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{feature.name}</h3>
                                <p className="text-zinc-400 text-sm">{feature.description}</p>
                                <div className="mt-4">
                                    <span className={`text-xs px-2 py-1 rounded-full ${feature.category === 'social' ? 'bg-blue-500/20 text-blue-400' :
                                            feature.category === 'gamification' ? 'bg-purple-500/20 text-purple-400' :
                                                'bg-green-500/20 text-green-400'
                                        }`}>
                                        {CATEGORIES.find(c => c.id === feature.category)?.name}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Active Component View */}
                {selectedFeature && ActiveComponent && (
                    <div>
                        <Button
                            variant="outline"
                            onClick={() => setSelectedFeature(null)}
                            className="mb-6 border-zinc-700"
                        >
                            ← უკან ფიჩერებზე
                        </Button>

                        <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800/50 overflow-hidden">
                            {selectedFeature === 'onboarding' ? (
                                <div className="p-12 text-center">
                                    <div className="text-6xl mb-4">🚀</div>
                                    <h3 className="text-2xl font-bold text-white mb-4">Smart Onboarding</h3>
                                    <p className="text-zinc-400 mb-6">ეს კომპონენტი გამოჩნდება როგორც full-screen modal</p>
                                    <Button
                                        onClick={() => setShowOnboarding(true)}
                                        className="bg-indigo-600 hover:bg-indigo-500"
                                    >
                                        გახსნა
                                    </Button>
                                </div>
                            ) : (
                                <ActiveComponent />
                            )}
                        </div>
                    </div>
                )}

                {/* Stats Summary */}
                {!selectedFeature && (
                    <div className="mt-12 grid md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-6 border border-blue-500/30 text-center">
                            <div className="text-4xl font-bold text-blue-400">3</div>
                            <div className="text-sm text-blue-300/80">სოციალური ფუნქცია</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-xl p-6 border border-purple-500/30 text-center">
                            <div className="text-4xl font-bold text-purple-400">3</div>
                            <div className="text-sm text-purple-300/80">გეიმიფიკაცია</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl p-6 border border-green-500/30 text-center">
                            <div className="text-4xl font-bold text-green-400">3</div>
                            <div className="text-sm text-green-300/80">პერსონალიზაცია</div>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-900/30 to-orange-800/20 rounded-xl p-6 border border-yellow-500/30 text-center">
                            <div className="text-4xl font-bold text-yellow-400">9</div>
                            <div className="text-sm text-yellow-300/80">სულ ახალი</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
