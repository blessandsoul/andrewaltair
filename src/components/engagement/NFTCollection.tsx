'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Lock, CheckCircle, Star, Gift, Trophy, Flame, Zap, Crown, Eye, Share2, Download, Play, Target, ArrowRight, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NFTCard {
    id: string
    name: string
    description: string
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
    category: string
    image: string
    unlockedAt?: string
    unlockCondition: string
    xpReward: number
    isUnlocked: boolean
    progress?: number
    progressMax?: number
    actionType?: 'quiz' | 'explore' | 'share' | 'streak' | 'community' | 'generate'
    actionLink?: string
}

const RARITY_STYLES = {
    common: {
        bg: 'from-zinc-600 to-zinc-700',
        border: 'border-zinc-500',
        text: 'text-zinc-300',
        glow: 'shadow-zinc-500/20',
        label: 'Common'
    },
    uncommon: {
        bg: 'from-green-600 to-emerald-700',
        border: 'border-green-500',
        text: 'text-green-300',
        glow: 'shadow-green-500/30',
        label: 'Uncommon'
    },
    rare: {
        bg: 'from-blue-600 to-indigo-700',
        border: 'border-blue-500',
        text: 'text-blue-300',
        glow: 'shadow-blue-500/30',
        label: 'Rare'
    },
    epic: {
        bg: 'from-purple-600 to-fuchsia-700',
        border: 'border-purple-500',
        text: 'text-purple-300',
        glow: 'shadow-purple-500/40',
        label: 'Epic'
    },
    legendary: {
        bg: 'from-yellow-500 via-orange-500 to-red-500',
        border: 'border-yellow-400',
        text: 'text-yellow-300',
        glow: 'shadow-yellow-500/50',
        label: 'Legendary'
    }
}

const INITIAL_CARDS: NFTCard[] = [
    {
        id: '1',
        name: 'ChatGPT Master',
        description: 'დაეუფლე ChatGPT-ს სრულყოფილად',
        rarity: 'legendary',
        category: 'ჩატბოტები',
        image: '🤖',
        unlockCondition: 'გამოიყენე ChatGPT 100-ჯერ',
        xpReward: 500,
        isUnlocked: true,
        unlockedAt: '2024-12-20'
    },
    {
        id: '2',
        name: 'Prompt Engineer',
        description: 'პრომპტების წერის ექსპერტი',
        rarity: 'epic',
        category: 'უნარები',
        image: '✍️',
        unlockCondition: 'შექმენი 50 პრომპტი',
        xpReward: 300,
        isUnlocked: true,
        unlockedAt: '2024-12-15'
    },
    {
        id: '3',
        name: 'Art Creator',
        description: 'Midjourney-ს შემოქმედი',
        rarity: 'epic',
        category: 'ხელოვნება',
        image: '🎨',
        unlockCondition: 'გენერირე 25 სურათი',
        xpReward: 300,
        isUnlocked: false,
        progress: 18,
        progressMax: 25,
        actionType: 'generate',
        actionLink: '/mystic'
    },
    {
        id: '4',
        name: 'AI Explorer',
        description: 'აღმოაჩინე 30 AI ხელსაწყო',
        rarity: 'rare',
        category: 'აღმოჩენა',
        image: '🔍',
        unlockCondition: 'შეისწავლე 30 ინსტრუმენტი',
        xpReward: 200,
        isUnlocked: false,
        progress: 22,
        progressMax: 30,
        actionType: 'explore',
        actionLink: '/tools'
    },
    {
        id: '5',
        name: 'Community Hero',
        description: 'დაეხმარე საზოგადოებას',
        rarity: 'rare',
        category: 'საზოგადოება',
        image: '🦸',
        unlockCondition: 'უპასუხე 20 კითხვას',
        xpReward: 200,
        isUnlocked: false,
        progress: 8,
        progressMax: 20,
        actionType: 'community',
        actionLink: '/community'
    },
    {
        id: '6',
        name: 'Early Adopter',
        description: 'ადრეული მომხმარებელი',
        rarity: 'uncommon',
        category: 'სპეციალური',
        image: '🌟',
        unlockCondition: 'შემოგვიერთდი 2024 წელს',
        xpReward: 100,
        isUnlocked: true,
        unlockedAt: '2024-01-15'
    },
    {
        id: '7',
        name: 'Quiz Champion',
        description: 'ქვიზის ჩემპიონი',
        rarity: 'uncommon',
        category: 'თამაში',
        image: '🏆',
        unlockCondition: 'მოიგე 5 ქვიზი',
        xpReward: 100,
        isUnlocked: false,
        progress: 3,
        progressMax: 5,
        actionType: 'quiz',
        actionLink: '/quiz'
    },
    {
        id: '8',
        name: 'Daily Warrior',
        description: 'ყოველდღიური მეომარი',
        rarity: 'common',
        category: 'აქტივობა',
        image: '⚔️',
        unlockCondition: '7-დღიანი სტრიკი',
        xpReward: 50,
        isUnlocked: true,
        unlockedAt: '2024-12-18'
    },
    {
        id: '9',
        name: 'First Steps',
        description: 'პირველი ნაბიჯები AI-ში',
        rarity: 'common',
        category: 'დამწყები',
        image: '👣',
        unlockCondition: 'დაასრულე პირველი გაკვეთილი',
        xpReward: 25,
        isUnlocked: true,
        unlockedAt: '2024-12-01'
    }
]

const ACTION_LABELS = {
    quiz: { label: 'ქვიზის გავლა', icon: Target },
    explore: { label: 'ინსტრუმენტების ნახვა', icon: Eye },
    share: { label: 'გაზიარება', icon: Share2 },
    streak: { label: 'სტრიკის გაგრძელება', icon: Flame },
    community: { label: 'საზოგადოებაში', icon: Trophy },
    generate: { label: 'სურათის გენერაცია', icon: Sparkles }
}

export function NFTCollection() {
    const [cards, setCards] = useState<NFTCard[]>(INITIAL_CARDS)
    const [selectedCard, setSelectedCard] = useState<NFTCard | null>(null)
    const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')
    const [animatingCard, setAnimatingCard] = useState<string | null>(null)
    const [unlockingCard, setUnlockingCard] = useState<string | null>(null)
    const [showUnlockCelebration, setShowUnlockCelebration] = useState<NFTCard | null>(null)
    const [totalXPEarned, setTotalXPEarned] = useState(0)

    // Load progress from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('nftCardProgress')
        if (saved) {
            try {
                const savedCards = JSON.parse(saved)
                setCards(savedCards)
            } catch (e) {
                console.error('Failed to load NFT progress')
            }
        }

        const savedXP = localStorage.getItem('nftTotalXP')
        if (savedXP) {
            setTotalXPEarned(parseInt(savedXP))
        }
    }, [])

    // Save progress to localStorage
    const saveProgress = (updatedCards: NFTCard[], xp: number) => {
        localStorage.setItem('nftCardProgress', JSON.stringify(updatedCards))
        localStorage.setItem('nftTotalXP', xp.toString())
    }

    const unlockedCount = cards.filter(c => c.isUnlocked).length
    const totalXP = cards.filter(c => c.isUnlocked).reduce((sum, c) => sum + c.xpReward, 0)

    const filteredCards = cards.filter(card => {
        if (filter === 'unlocked') return card.isUnlocked
        if (filter === 'locked') return !card.isUnlocked
        return true
    })

    const handleCardClick = (card: NFTCard) => {
        setAnimatingCard(card.id)
        setTimeout(() => {
            setSelectedCard(card)
            setAnimatingCard(null)
        }, 300)
    }

    // Simulate progress increase (for demo)
    const handleProgressAction = (card: NFTCard) => {
        if (card.isUnlocked || !card.progress || !card.progressMax) return

        const newProgress = Math.min(card.progress + 1, card.progressMax)
        const shouldUnlock = newProgress >= card.progressMax

        if (shouldUnlock) {
            // Trigger unlock animation
            setUnlockingCard(card.id)
            setSelectedCard(null)

            setTimeout(() => {
                const updatedCards = cards.map(c =>
                    c.id === card.id
                        ? {
                            ...c,
                            isUnlocked: true,
                            progress: card.progressMax,
                            unlockedAt: new Date().toISOString().split('T')[0]
                        }
                        : c
                )
                setCards(updatedCards)
                setUnlockingCard(null)

                const newTotalXP = totalXPEarned + card.xpReward
                setTotalXPEarned(newTotalXP)
                saveProgress(updatedCards, newTotalXP)

                // Show celebration
                const unlockedCard = updatedCards.find(c => c.id === card.id)
                if (unlockedCard) {
                    setShowUnlockCelebration(unlockedCard)
                }
            }, 2000)
        } else {
            // Just increase progress
            const updatedCards = cards.map(c =>
                c.id === card.id
                    ? { ...c, progress: newProgress }
                    : c
            )
            setCards(updatedCards)
            saveProgress(updatedCards, totalXPEarned)

            // Update selected card
            setSelectedCard({ ...card, progress: newProgress })
        }
    }

    // Instant unlock for demo
    const handleInstantUnlock = (card: NFTCard) => {
        if (card.isUnlocked) return

        setUnlockingCard(card.id)
        setSelectedCard(null)

        setTimeout(() => {
            const updatedCards = cards.map(c =>
                c.id === card.id
                    ? {
                        ...c,
                        isUnlocked: true,
                        progress: c.progressMax,
                        unlockedAt: new Date().toISOString().split('T')[0]
                    }
                    : c
            )
            setCards(updatedCards)
            setUnlockingCard(null)

            const newTotalXP = totalXPEarned + card.xpReward
            setTotalXPEarned(newTotalXP)
            saveProgress(updatedCards, newTotalXP)

            const unlockedCard = updatedCards.find(c => c.id === card.id)
            if (unlockedCard) {
                setShowUnlockCelebration(unlockedCard)
            }
        }, 2000)
    }

    return (
        <div className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 mb-4">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-yellow-300">კოლექცია</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        AI <span className="text-gradient">NFT Cards</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        შეაგროვე უნიკალური კარტები აქტივობისთვის — რაც მეტს აგროვებ, მით მეტი ბენეფიტი
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 text-center">
                        <div className="text-3xl font-bold text-white">{unlockedCount}/{cards.length}</div>
                        <div className="text-sm text-zinc-500">განბლოკილი</div>
                    </div>
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 text-center">
                        <div className="text-3xl font-bold text-yellow-400">{totalXP}</div>
                        <div className="text-sm text-zinc-500">XP მოგროვებული</div>
                    </div>
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 text-center">
                        <div className="text-3xl font-bold text-purple-400">
                            {cards.filter(c => c.isUnlocked && (c.rarity === 'epic' || c.rarity === 'legendary')).length}
                        </div>
                        <div className="text-sm text-zinc-500">Epic+ კარტები</div>
                    </div>
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 text-center">
                        <div className="text-3xl font-bold text-emerald-400">
                            {Math.round((unlockedCount / cards.length) * 100)}%
                        </div>
                        <div className="text-sm text-zinc-500">პროგრესი</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex justify-center gap-2 mb-8">
                    {[
                        { id: 'all', label: 'ყველა', count: cards.length },
                        { id: 'unlocked', label: 'განბლოკილი', count: unlockedCount },
                        { id: 'locked', label: 'ჩაკეტილი', count: cards.length - unlockedCount }
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id as typeof filter)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${filter === f.id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800'
                                }`}
                        >
                            {f.label}
                            <span className={`text-xs px-2 py-0.5 rounded-full ${filter === f.id ? 'bg-white/20' : 'bg-zinc-700'
                                }`}>
                                {f.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredCards.map((card) => (
                        <div
                            key={card.id}
                            onClick={() => handleCardClick(card)}
                            className={`relative cursor-pointer group transition-all duration-300 ${animatingCard === card.id ? 'scale-95' : 'hover:scale-105'
                                } ${unlockingCard === card.id ? 'animate-pulse' : ''}`}
                        >
                            {/* Unlock Animation Overlay */}
                            {unlockingCard === card.id && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500/80 to-orange-600/80 animate-pulse">
                                    <div className="text-center">
                                        <div className="text-5xl animate-bounce">🎉</div>
                                        <div className="text-white font-bold mt-2">განბლოკვა...</div>
                                    </div>
                                </div>
                            )}

                            <div className={`
                                rounded-xl border-2 overflow-hidden
                                ${card.isUnlocked ? RARITY_STYLES[card.rarity].border : 'border-zinc-700'}
                                ${card.isUnlocked ? `shadow-lg ${RARITY_STYLES[card.rarity].glow}` : ''}
                                ${!card.isUnlocked ? 'opacity-60 grayscale' : ''}
                            `}>
                                {/* Card Background */}
                                <div className={`
                                    aspect-[3/4] p-4 flex flex-col items-center justify-center
                                    ${card.isUnlocked
                                        ? `bg-gradient-to-br ${RARITY_STYLES[card.rarity].bg}`
                                        : 'bg-zinc-800'
                                    }
                                `}>
                                    {/* Rarity Badge */}
                                    <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${card.isUnlocked
                                        ? 'bg-black/30 text-white'
                                        : 'bg-zinc-700 text-zinc-400'
                                        }`}>
                                        {RARITY_STYLES[card.rarity].label}
                                    </div>

                                    {/* Lock Icon */}
                                    {!card.isUnlocked && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                            <Lock className="w-8 h-8 text-zinc-400" />
                                        </div>
                                    )}

                                    {/* Card Icon */}
                                    <div className="text-6xl mb-4 drop-shadow-lg">
                                        {card.image}
                                    </div>

                                    {/* Card Name */}
                                    <h3 className={`font-bold text-center text-sm ${card.isUnlocked ? 'text-white' : 'text-zinc-400'
                                        }`}>
                                        {card.name}
                                    </h3>

                                    {/* XP Reward */}
                                    <div className={`mt-2 flex items-center gap-1 text-xs ${card.isUnlocked ? 'text-yellow-200' : 'text-zinc-500'
                                        }`}>
                                        <Zap className="w-3 h-3" />
                                        +{card.xpReward} XP
                                    </div>

                                    {/* Progress (if locked) */}
                                    {!card.isUnlocked && card.progress !== undefined && (
                                        <div className="mt-3 w-full px-2">
                                            <div className="bg-zinc-700 rounded-full h-1.5">
                                                <div
                                                    className="bg-indigo-500 h-full rounded-full transition-all"
                                                    style={{ width: `${(card.progress / (card.progressMax || 1)) * 100}%` }}
                                                />
                                            </div>
                                            <div className="text-xs text-zinc-500 mt-1 text-center">
                                                {card.progress}/{card.progressMax}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Shine Effect */}
                            {card.isUnlocked && (
                                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Card Detail Modal */}
                {selectedCard && (
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedCard(null)}
                    >
                        <div
                            className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-md w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Card Header */}
                            <div className={`
                                p-8 text-center
                                ${selectedCard.isUnlocked
                                    ? `bg-gradient-to-br ${RARITY_STYLES[selectedCard.rarity].bg}`
                                    : 'bg-zinc-800'
                                }
                            `}>
                                <div className={`inline-block text-xs px-3 py-1 rounded-full mb-4 ${selectedCard.isUnlocked
                                    ? 'bg-black/30 text-white'
                                    : 'bg-zinc-700 text-zinc-400'
                                    }`}>
                                    {RARITY_STYLES[selectedCard.rarity].label}
                                </div>
                                <div className="text-8xl mb-4">{selectedCard.image}</div>
                                <h3 className="text-2xl font-bold text-white">{selectedCard.name}</h3>
                                <p className={`text-sm mt-2 ${RARITY_STYLES[selectedCard.rarity].text}`}>
                                    {selectedCard.description}
                                </p>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-400">კატეგორია</span>
                                    <span className="text-white">{selectedCard.category}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-400">XP ჯილდო</span>
                                    <span className="text-yellow-400 flex items-center gap-1">
                                        <Zap className="w-4 h-4" />
                                        +{selectedCard.xpReward}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-400">პირობა</span>
                                    <span className="text-white">{selectedCard.unlockCondition}</span>
                                </div>
                                {selectedCard.isUnlocked && selectedCard.unlockedAt && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-400">განბლოკვის თარიღი</span>
                                        <span className="text-green-400 flex items-center gap-1">
                                            <CheckCircle className="w-4 h-4" />
                                            {selectedCard.unlockedAt}
                                        </span>
                                    </div>
                                )}

                                {/* Progress */}
                                {!selectedCard.isUnlocked && selectedCard.progress !== undefined && (
                                    <div className="pt-4 border-t border-zinc-800">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-zinc-400">პროგრესი</span>
                                            <span className="text-white">{selectedCard.progress}/{selectedCard.progressMax}</span>
                                        </div>
                                        <div className="bg-zinc-800 rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all relative overflow-hidden"
                                                style={{ width: `${(selectedCard.progress / (selectedCard.progressMax || 1)) * 100}%` }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                                            </div>
                                        </div>
                                        <p className="text-xs text-zinc-500 mt-2 text-center">
                                            კიდევ {(selectedCard.progressMax || 0) - selectedCard.progress} დარჩენილია განბლოკვამდე
                                        </p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex flex-col gap-3 pt-4">
                                    {selectedCard.isUnlocked ? (
                                        <div className="flex gap-3">
                                            <Button variant="outline" className="flex-1 border-zinc-700">
                                                <Share2 className="w-4 h-4 mr-2" />
                                                გაზიარება
                                            </Button>
                                            <Button variant="outline" className="flex-1 border-zinc-700">
                                                <Download className="w-4 h-4 mr-2" />
                                                ჩამოტვირთვა
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Navigate to action page */}
                                            {selectedCard.actionLink ? (
                                                <Link href={selectedCard.actionLink} className="w-full">
                                                    <Button
                                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 gap-2"
                                                    >
                                                        {selectedCard.actionType && ACTION_LABELS[selectedCard.actionType] ? (
                                                            <>
                                                                {(() => {
                                                                    const Icon = ACTION_LABELS[selectedCard.actionType!].icon
                                                                    return <Icon className="w-4 h-4" />
                                                                })()}
                                                                {ACTION_LABELS[selectedCard.actionType].label}
                                                                <ExternalLink className="w-3 h-3 ml-1" />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ArrowRight className="w-4 h-4" />
                                                                გვერდზე გადასვლა
                                                            </>
                                                        )}
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button
                                                    className="w-full bg-indigo-600 hover:bg-indigo-500 gap-2"
                                                    onClick={() => handleProgressAction(selectedCard)}
                                                >
                                                    <Play className="w-4 h-4" />
                                                    პროგრესის დამატება
                                                </Button>
                                            )}

                                            {/* Quick progress button */}
                                            <Button
                                                variant="outline"
                                                className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                                onClick={() => handleProgressAction(selectedCard)}
                                            >
                                                <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                                                +1 პროგრესი (სიმულაცია)
                                            </Button>

                                            {/* Instant unlock for demo */}
                                            <Button
                                                variant="ghost"
                                                className="w-full text-zinc-500 hover:text-yellow-400 text-xs"
                                                onClick={() => handleInstantUnlock(selectedCard)}
                                            >
                                                <Gift className="w-3 h-3 mr-1" />
                                                მყისიერი განბლოკვა
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Unlock Celebration Modal */}
                {showUnlockCelebration && (
                    <div
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowUnlockCelebration(null)}
                    >
                        <div className="text-center animate-bounce-in">
                            {/* Confetti effect */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                {[...Array(20)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute animate-confetti"
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            top: '-10%',
                                            animationDelay: `${Math.random() * 2}s`,
                                            fontSize: '2rem'
                                        }}
                                    >
                                        {['🎉', '⭐', '✨', '🎊'][Math.floor(Math.random() * 4)]}
                                    </div>
                                ))}
                            </div>

                            <div className={`
                                inline-block p-8 rounded-2xl 
                                bg-gradient-to-br ${RARITY_STYLES[showUnlockCelebration.rarity].bg}
                                shadow-2xl ${RARITY_STYLES[showUnlockCelebration.rarity].glow}
                            `}>
                                <div className="text-6xl mb-4 animate-bounce">{showUnlockCelebration.image}</div>
                                <div className="text-xs px-3 py-1 rounded-full bg-black/30 text-white inline-block mb-2">
                                    {RARITY_STYLES[showUnlockCelebration.rarity].label}
                                </div>
                                <h3 className="text-3xl font-bold text-white">{showUnlockCelebration.name}</h3>
                                <p className="text-white/80 mt-2">გილოცავთ! კარტა განბლოკილია!</p>
                            </div>

                            <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-yellow-500/20 text-yellow-300 text-xl font-bold">
                                <Zap className="w-6 h-6" />
                                +{showUnlockCelebration.xpReward} XP
                            </div>

                            <p className="mt-4 text-zinc-400">დააჭირეთ გასაგრძელებლად</p>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes confetti {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                .animate-confetti {
                    animation: confetti 3s ease-in-out forwards;
                }
                @keyframes bounce-in {
                    0% { transform: scale(0.5); opacity: 0; }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-bounce-in {
                    animation: bounce-in 0.5s ease-out;
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    )
}
