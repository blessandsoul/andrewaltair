"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { TbSparkles, TbArrowsShuffle, TbRefresh, TbLoader2, TbEye, TbLock } from "react-icons/tb"

// Major Arcana Tarot Cards
const TAROT_CARDS = [
    { id: 0, name: "ბრიყვი", nameEn: "The Fool", meaning: "ახალი დასაწყისი, სპონტანურობა, თავგადასავალი" },
    { id: 1, name: "მოგვი", nameEn: "The Magician", meaning: "მანიფესტაცია, ოსტატობა, ძალაუფლება" },
    { id: 2, name: "ქურუმი", nameEn: "The High Priestess", meaning: "ინტუიცია, საიდუმლო, ქვეცნობიერი" },
    { id: 3, name: "იმპერატრიცა", nameEn: "The Empress", meaning: "ნაყოფიერება, სილამაზე, ბუნება" },
    { id: 4, name: "იმპერატორი", nameEn: "The Emperor", meaning: "ავტორიტეტი, სტრუქტურა, კონტროლი" },
    { id: 5, name: "იეროფანტი", nameEn: "The Hierophant", meaning: "ტრადიცია, სულიერება, სწავლება" },
    { id: 6, name: "შეყვარებულები", nameEn: "The Lovers", meaning: "სიყვარული, ჰარმონია, არჩევანი" },
    { id: 7, name: "ეტლი", nameEn: "The Chariot", meaning: "ნებისყოფა, წარმატება, დეტერმინაცია" },
    { id: 8, name: "ძალა", nameEn: "Strength", meaning: "სიმამაცე, მოთმინება, თვითკონტროლი" },
    { id: 9, name: "განდეგილი", nameEn: "The Hermit", meaning: "თვითანალიზი, სიბრძნე, მარტოობა" },
    { id: 10, name: "ბედის ბორბალი", nameEn: "Wheel of Fortune", meaning: "ცვლილება, ციკლი, ბედი" },
    { id: 11, name: "სამართლიანობა", nameEn: "Justice", meaning: "ჭეშმარიტება, სამართალი, კარმა" },
    { id: 12, name: "ჩამოკიდებული", nameEn: "The Hanged Man", meaning: "პაუზა, განთავისუფლება, ახალი პერსპექტივა" },
    { id: 13, name: "სიკვდილი", nameEn: "Death", meaning: "ტრანსფორმაცია, დასასრული, ახალი დასაწყისი" },
    { id: 14, name: "ზომიერება", nameEn: "Temperance", meaning: "ბალანსი, მოთმინება, მიზანი" },
    { id: 15, name: "ეშმაკი", nameEn: "The Devil", meaning: "ჩრდილი, მიჯაჭვულობა, ილუზია" },
    { id: 16, name: "გოდოლი", nameEn: "The Tower", meaning: "განადგურება, გამოცდის, ცვლილება" },
    { id: 17, name: "ვარსკვლავი", nameEn: "The Star", meaning: "იმედი, რწმენა, განახლება" },
    { id: 18, name: "მთვარე", nameEn: "The Moon", meaning: "ილუზია, შიში, ქვეცნობიერი" },
    { id: 19, name: "მზე", nameEn: "The Sun", meaning: "ბედნიერება, წარმატება, ვიტალობა" },
    { id: 20, name: "განსჯა", nameEn: "Judgement", meaning: "აღორძინება, გადაწყვეტილება, განახლება" },
    { id: 21, name: "სამყარო", nameEn: "The World", meaning: "დასრულება, ინტეგრაცია, მიღწევა" },
]

interface TarotResult {
    cards: typeof TAROT_CARDS[number][];
    interpretation: string;
    advice: string;
}

interface TarotCardsProps {
    isPremium?: boolean;
}

export function TarotCards({ isPremium = false }: TarotCardsProps) {
    const { csrfToken } = useAuth()
    const [selectedCards, setSelectedCards] = useState<typeof TAROT_CARDS[number][]>([])
    const [isShuffling, setIsShuffling] = useState(false)
    const [isRevealing, setIsRevealing] = useState(false)
    const [result, setResult] = useState<TarotResult | null>(null)
    const [revealedIndices, setRevealedIndices] = useState<number[]>([])
    const [spreadType, setSpreadType] = useState<'three' | 'celtic'>('three')

    const cardCount = spreadType === 'three' ? 3 : 10

    const handleShuffle = () => {
        setIsShuffling(true)
        setResult(null)
        setRevealedIndices([])

        // TbArrowsShuffle and pick cards
        setTimeout(() => {
            const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5)
            setSelectedCards(shuffled.slice(0, cardCount))
            setIsShuffling(false)
        }, 1500)
    }

    const handleRevealCard = async (index: number) => {
        if (revealedIndices.includes(index)) return

        setRevealedIndices(prev => [...prev, index])

        // When all cards are revealed, get AI interpretation
        if (revealedIndices.length + 1 === cardCount) {
            setIsRevealing(true)
            try {
                const response = await fetch("/api/mystic/tarot", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-csrf-token": csrfToken || ""
                    },
                    body: JSON.stringify({
                        cards: selectedCards.map(c => c.name),
                        spreadType,
                    }),
                })

                if (!response.ok) throw new Error("API error")
                const data = await response.json()
                setResult(data)
            } catch {
                setResult({
                    cards: selectedCards,
                    interpretation: "კარტები მოგითხრობენ მნიშვნელოვან ისტორიას. წარსული და აწმყო ერთმანეთს უკავშირდება, რათა გზა გაგიხსნას მომავლისკენ.",
                    advice: "მიენდე შენს ინტუიციას და გაბედე სწორი ნაბიჯის გადადგმა."
                })
            } finally {
                setIsRevealing(false)
            }
        }
    }

    const handleReset = () => {
        setSelectedCards([])
        setResult(null)
        setRevealedIndices([])
    }

    const spreadLabels = spreadType === 'three'
        ? ['წარსული', 'აწმყო', 'მომავალი']
        : ['აწმყო', 'გამოწვევა', 'წარსული', 'მომავალი', 'მიზანი', 'გარემო', 'შენ', 'გავლენა', 'იმედი/შიში', 'შედეგი']

    return (
        <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl sm:rounded-3xl blur-xl opacity-20" />

            <div className="relative rounded-2xl sm:rounded-3xl bg-[#12121a] border border-white/10 overflow-hidden">
                {/* Header gradient */}
                <div className="absolute top-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-b from-indigo-600/20 to-transparent pointer-events-none" />

                <div className="relative p-5 sm:p-6 lg:p-8">
                    {selectedCards.length === 0 ? (
                        <div className="space-y-4 sm:space-y-6">
                            {/* Header */}
                            <div className="flex justify-center mb-6 sm:mb-8">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-2xl animate-pulse" />
                                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-indigo-400 via-violet-500 to-purple-600 p-1">
                                        <div className="w-full h-full rounded-full bg-[#12121a] flex items-center justify-center text-3xl sm:text-4xl">
                                            🃏
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Spread type selector */}
                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={() => setSpreadType('three')}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${spreadType === 'three'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    3 კარტი
                                </button>
                                <button
                                    onClick={() => setSpreadType('celtic')}
                                    disabled={!isPremium}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${spreadType === 'celtic'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        } ${!isPremium ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {!isPremium && <TbLock className="w-3 h-3" />}
                                    კელტური ჯვარი (10)
                                </button>
                            </div>

                            <p className="text-center text-gray-400 text-sm">
                                აურიე კარტები და გაიგე რას გეტყვის ბედი
                            </p>

                            <Button
                                onClick={handleShuffle}
                                disabled={isShuffling}
                                className="w-full h-12 sm:h-14 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-base sm:text-lg border-0"
                            >
                                {isShuffling ? (
                                    <span className="flex items-center gap-3">
                                        <TbArrowsShuffle className="w-5 h-5 animate-spin" />
                                        იურევა...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-3">
                                        <TbArrowsShuffle className="w-5 h-5" />
                                        აურიე კარტები
                                    </span>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Cards grid */}
                            <div className={`grid gap-2 sm:gap-3 ${spreadType === 'three' ? 'grid-cols-3' : 'grid-cols-5'}`}>
                                {selectedCards.map((card, index) => {
                                    const isRevealed = revealedIndices.includes(index)
                                    return (
                                        <button
                                            key={card.id}
                                            onClick={() => handleRevealCard(index)}
                                            disabled={isRevealed}
                                            className={`aspect-[2/3] rounded-lg sm:rounded-xl transition-all duration-500 ${isRevealed
                                                ? 'bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/30'
                                                : 'bg-gradient-to-br from-indigo-900 to-violet-900 hover:scale-105 cursor-pointer border border-indigo-500/50'
                                                }`}
                                        >
                                            <div className="w-full h-full flex flex-col items-center justify-center p-1 sm:p-2">
                                                {isRevealed ? (
                                                    <>
                                                        <div className="text-lg sm:text-2xl mb-1">✨</div>
                                                        <div className="text-[8px] sm:text-xs text-indigo-300 font-bold text-center leading-tight">
                                                            {card.name}
                                                        </div>
                                                        <div className="text-[6px] sm:text-[8px] text-gray-500 mt-0.5">
                                                            {spreadLabels[index]}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="text-xl sm:text-3xl mb-1">🃏</div>
                                                        <TbEye className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-400" />
                                                    </>
                                                )}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Loading */}
                            {isRevealing && (
                                <div className="text-center py-4">
                                    <TbLoader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                                    <p className="text-gray-400 mt-2 text-sm">AI კითხულობს კარტებს...</p>
                                </div>
                            )}

                            {/* Result */}
                            {result && (
                                <div className="space-y-3 animate-in fade-in duration-500">
                                    <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                                <TbSparkles className="w-5 h-5 text-indigo-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">ინტერპრეტაცია</h3>
                                                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{result.interpretation}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                        <p className="text-sm text-gray-400">
                                            <span className="text-amber-400 font-medium">💡 რჩევა: </span>
                                            {result.advice}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Reset button */}
                            {(result || revealedIndices.length === cardCount) && (
                                <Button
                                    onClick={handleReset}
                                    variant="outline"
                                    className="w-full h-10 sm:h-12 rounded-xl border-white/10 text-white hover:bg-white/5 bg-transparent"
                                >
                                    <TbRefresh className="w-4 h-4 mr-2" />
                                    ახალი კითხვა
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
