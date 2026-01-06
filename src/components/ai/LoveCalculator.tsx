"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TbHeart, TbRefresh, TbShare, TbSparkles, TbLoader2 } from "react-icons/tb"

interface LoveResult {
    percentage: number
    title: string
    description: string
}

export function LoveCalculator() {
    const [name1, setName1] = useState("")
    const [name2, setName2] = useState("")
    const [result, setResult] = useState<LoveResult | null>(null)
    const [isCalculating, setIsCalculating] = useState(false)

    const handleCalculate = async () => {
        if (!name1.trim() || !name2.trim()) return

        setIsCalculating(true)

        try {
            const response = await fetch("/api/mystic/love", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name1, name2 }),
            })

            if (!response.ok) throw new Error("API error")

            const data = await response.json()
            setResult(data)
        } catch {
            setResult({
                percentage: 78,
                title: "ვარსკვლავებით დაწერილი კავშირი",
                description: "თქვენს გულებს შორის უჩინარი ძაფი გადაჭიმულია, რომელიც სამყაროს ენერგიებით პულსირებს."
            })
        } finally {
            setIsCalculating(false)
        }
    }

    const handleReset = () => {
        setName1("")
        setName2("")
        setResult(null)
    }

    const handleShare = () => {
        if (!result) return
        const text = `${name1} + ${name2} = ${result.percentage}%`
        if (navigator.share) {
            navigator.share({ text, url: window.location.href })
        } else {
            navigator.clipboard.writeText(text)
        }
    }

    return (
        <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl sm:rounded-3xl blur-xl opacity-20" />

            <div className="relative rounded-2xl sm:rounded-3xl bg-[#12121a] border border-white/10 overflow-hidden">
                {/* Header gradient */}
                <div className="absolute top-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-b from-pink-600/20 to-transparent pointer-events-none" />

                <div className="relative p-5 sm:p-6 lg:p-8">
                    {!result ? (
                        <div className="space-y-4 sm:space-y-6">
                            {/* Heart animation */}
                            <div className="flex justify-center mb-6 sm:mb-8">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-pink-500/30 rounded-full blur-2xl animate-pulse" />
                                    <TbHeart className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-pink-500 fill-pink-500" />
                                </div>
                            </div>

                            {/* Names input */}
                            <div className="space-y-3 sm:space-y-4">
                                <Input
                                    value={name1}
                                    onChange={(e) => setName1(e.target.value)}
                                    placeholder="პირველი სახელი..."
                                    className="h-11 sm:h-12 lg:h-14 bg-white/5 border-white/10 text-white text-center text-base sm:text-lg placeholder:text-gray-600 rounded-lg sm:rounded-xl focus:border-pink-500"
                                />

                                <div className="flex justify-center">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                                        <TbHeart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 fill-pink-400" />
                                    </div>
                                </div>

                                <Input
                                    value={name2}
                                    onChange={(e) => setName2(e.target.value)}
                                    placeholder="მეორე სახელი..."
                                    className="h-11 sm:h-12 lg:h-14 bg-white/5 border-white/10 text-white text-center text-base sm:text-lg placeholder:text-gray-600 rounded-lg sm:rounded-xl focus:border-pink-500"
                                />
                            </div>

                            <Button
                                onClick={handleCalculate}
                                disabled={!name1.trim() || !name2.trim() || isCalculating}
                                className="w-full h-11 sm:h-12 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-sm sm:text-base lg:text-lg border-0 shadow-lg shadow-pink-500/25"
                            >
                                {isCalculating ? (
                                    <span className="flex items-center gap-2 sm:gap-3">
                                        <TbLoader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                        <span className="hidden sm:inline">AI ანალიზი...</span>
                                        <span className="sm:hidden">იტვირთება...</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 sm:gap-3">
                                        <TbHeart className="w-4 h-4 sm:w-5 sm:h-5" />
                                        გამოთვალე
                                    </span>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Names */}
                            <div className="flex items-center justify-center gap-2 sm:gap-4 text-base sm:text-lg lg:text-xl">
                                <span className="font-semibold text-white truncate max-w-[100px] sm:max-w-none">{name1}</span>
                                <TbHeart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 fill-pink-500 flex-shrink-0" />
                                <span className="font-semibold text-white truncate max-w-[100px] sm:max-w-none">{name2}</span>
                            </div>

                            {/* Percentage circle */}
                            <div className="flex justify-center py-2 sm:py-4">
                                <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            className="text-white/5"
                                            strokeWidth="6"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="45%"
                                            cx="50%"
                                            cy="50%"
                                        />
                                        <circle
                                            className="text-pink-500"
                                            strokeWidth="6"
                                            strokeDasharray={`${(result.percentage / 100) * 283} 283`}
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="45%"
                                            cx="50%"
                                            cy="50%"
                                            style={{ transition: "stroke-dasharray 1s ease-out" }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">{result.percentage}</span>
                                        <span className="text-sm sm:text-base lg:text-lg text-pink-400">%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
                                    <TbSparkles className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                                    <h3 className="text-base sm:text-lg font-bold text-white">{result.title}</h3>
                                </div>
                                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{result.description}</p>
                            </div>

                            {/* Buttons */}
                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                <Button
                                    onClick={handleReset}
                                    variant="outline"
                                    className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-white/10 text-white hover:bg-white/5 bg-transparent text-sm sm:text-base"
                                >
                                    <TbRefresh className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                                    ხელახლა
                                </Button>
                                <Button
                                    onClick={handleShare}
                                    className="h-10 sm:h-12 rounded-lg sm:rounded-xl bg-pink-600 hover:bg-pink-500 text-white border-0 text-sm sm:text-base"
                                >
                                    <TbShare className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                                    გაზიარება
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
