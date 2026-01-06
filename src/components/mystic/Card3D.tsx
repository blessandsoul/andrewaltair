"use client"

import { useState, useEffect } from "react"

interface Card3DProps {
    isFlipped: boolean
    frontContent: React.ReactNode
    backContent: React.ReactNode
    onFlip?: () => void
    glowColor?: string
}

export function Card3D({ isFlipped, frontContent, backContent, onFlip, glowColor = "#a855f7" }: Card3DProps) {
    const [localFlipped, setLocalFlipped] = useState(isFlipped)

    useEffect(() => {
        setLocalFlipped(isFlipped)
    }, [isFlipped])

    return (
        <div
            className="relative w-full aspect-[2/3] cursor-pointer perspective-1000"
            onClick={() => {
                setLocalFlipped(!localFlipped)
                onFlip?.()
            }}
        >
            <div
                className={`relative w-full h-full transition-transform duration-700 preserve-3d
                   ${localFlipped ? 'rotate-y-180' : ''}`}
                style={{
                    transformStyle: 'preserve-3d',
                    transform: localFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* Front (back of card - mystic pattern) */}
                <div
                    className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden"
                    style={{
                        backfaceVisibility: 'hidden',
                        boxShadow: `0 10px 40px -10px ${glowColor}40`,
                    }}
                >
                    <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 
                          border-2 border-purple-500/30 rounded-2xl p-4">
                        {/* Mystic pattern */}
                        <div className="w-full h-full border border-purple-400/30 rounded-xl 
                            bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.2)_0%,transparent_70%)]
                            flex items-center justify-center relative overflow-hidden">
                            {/* Corner decorations */}
                            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-purple-400/50 rounded-tl-lg" />
                            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-purple-400/50 rounded-tr-lg" />
                            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-purple-400/50 rounded-bl-lg" />
                            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-purple-400/50 rounded-br-lg" />

                            {/* Center symbol */}
                            <div className="text-6xl text-purple-300/50 animate-pulse">✧</div>

                            {/* Rotating ring */}
                            <div className="absolute inset-8 border border-purple-400/20 rounded-full animate-spin-slow" />
                            <div className="absolute inset-12 border border-purple-400/10 rounded-full animate-spin-slow"
                                style={{ animationDirection: 'reverse', animationDuration: '30s' }} />

                            {backContent}
                        </div>
                    </div>
                </div>

                {/* Back (front of card - revealed content) */}
                <div
                    className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        boxShadow: `0 20px 60px -15px ${glowColor}60`,
                    }}
                >
                    <div
                        className="w-full h-full rounded-2xl border-2 p-4"
                        style={{
                            background: `linear-gradient(145deg, ${glowColor}20 0%, rgba(12,12,20,0.98) 50%, ${glowColor}10 100%)`,
                            borderColor: `${glowColor}40`,
                        }}
                    >
                        {frontContent}
                    </div>
                </div>
            </div>

            {/* Hover glow */}
            <div
                className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    boxShadow: `0 0 40px ${glowColor}30`,
                }}
            />
        </div>
    )
}

// 3D Card Deck for dramatic reveals
export function CardDeck3D() {
    const [revealedCards, setRevealedCards] = useState<number[]>([])
    const [isRevealing, setIsRevealing] = useState(false)

    const cards = [
        { id: 1, name: "წარსული", symbol: "☽", meaning: "რა იყო" },
        { id: 2, name: "აწმყო", symbol: "☀", meaning: "რა არის" },
        { id: 3, name: "მომავალი", symbol: "★", meaning: "რა იქნება" },
    ]

    const revealAllCards = async () => {
        if (isRevealing) return
        setIsRevealing(true)
        setRevealedCards([])

        for (let i = 0; i < cards.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 600))
            setRevealedCards(prev => [...prev, cards[i].id])
        }

        setIsRevealing(false)
    }

    const resetCards = () => {
        setRevealedCards([])
    }

    return (
        <div className="space-y-8">
            {/* Cards */}
            <div className="flex justify-center gap-4 sm:gap-8">
                {cards.map((card, index) => (
                    <div
                        key={card.id}
                        className="w-24 sm:w-32"
                        style={{
                            transform: `translateY(${index === 1 ? -10 : 0}px)`,
                            animationDelay: `${index * 0.2}s`,
                        }}
                    >
                        <Card3D
                            isFlipped={revealedCards.includes(card.id)}
                            glowColor={index === 0 ? "#3b82f6" : index === 1 ? "#a855f7" : "#ec4899"}
                            frontContent={
                                <div className="w-full h-full flex flex-col items-center justify-center text-center">
                                    <span className="text-4xl mb-2">{card.symbol}</span>
                                    <span className="text-lg font-bold text-white">{card.name}</span>
                                    <span className="text-xs text-gray-400 mt-1">{card.meaning}</span>
                                </div>
                            }
                            backContent={null}
                        />
                        {/* Card label */}
                        <div className="text-center mt-3 text-sm text-gray-400">{card.name}</div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={revealAllCards}
                    disabled={isRevealing}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 
                     hover:from-purple-500 hover:to-pink-500 text-white font-medium
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                    {isRevealing ? "გამოვლენა..." : "გამოავლინე კარტები"}
                </button>

                {revealedCards.length > 0 && !isRevealing && (
                    <button
                        onClick={resetCards}
                        className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700
                       text-gray-300 font-medium transition-all duration-200
                       border border-slate-700"
                    >
                        ახლიდან
                    </button>
                )}
            </div>
        </div>
    )
}
