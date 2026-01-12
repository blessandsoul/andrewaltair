"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { TbMoon, TbStar, TbRefresh, TbSparkles, TbTree, TbWalk, TbPaw, TbHome, TbUser, TbLoader2 } from "react-icons/tb"

interface DreamSymbol {
    word: string
    meaning: string
    category: string
}

interface DreamResult {
    symbols: DreamSymbol[]
    generalMessage: string
}

const categoryIcons: Record<string, { icon: typeof TbStar; color: string }> = {
    "ბუნება": { icon: TbTree, color: "text-green-400 bg-green-500/20" },
    "მოქმედება": { icon: TbWalk, color: "text-orange-400 bg-orange-500/20" },
    "ცხოველი": { icon: TbPaw, color: "text-amber-400 bg-amber-500/20" },
    "ადგილი": { icon: TbHome, color: "text-blue-400 bg-blue-500/20" },
    "სიმბოლო": { icon: TbSparkles, color: "text-purple-400 bg-purple-500/20" },
    "ადამიანი": { icon: TbUser, color: "text-cyan-400 bg-cyan-500/20" },
}

export function DreamInterpreter() {
    const { csrfToken } = useAuth()
    const [dreamText, setDreamText] = useState("")
    const [result, setResult] = useState<DreamResult | null>(null)
    const [isInterpreting, setIsInterpreting] = useState(false)

    const handleInterpret = async () => {
        if (!dreamText.trim()) return

        setIsInterpreting(true)

        try {
            const response = await fetch("/api/mystic/dream", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-csrf-token": csrfToken || ""
                },
                body: JSON.stringify({ dream: dreamText }),
            })

            if (!response.ok) throw new Error("API error")

            const data = await response.json()
            setResult(data)
        } catch {
            setResult({
                symbols: [{ word: "სიზმარი", meaning: "შენი ქვეცნობიერი მნიშვნელოვან მესიჯს გიგზავნის.", category: "სიმბოლო" }],
                generalMessage: "შენი სიზმარი ქვეცნობიერის კარებს ხსნის და შენთან საუბრობს სიმბოლოების ენით."
            })
        } finally {
            setIsInterpreting(false)
        }
    }

    const handleReset = () => {
        setDreamText("")
        setResult(null)
    }

    return (
        <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl sm:rounded-3xl blur-xl opacity-20" />

            <div className="relative rounded-2xl sm:rounded-3xl bg-[#12121a] border border-white/10 overflow-hidden">
                {/* Header gradient */}
                <div className="absolute top-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-b from-blue-600/20 to-transparent pointer-events-none" />

                <div className="relative p-5 sm:p-6 lg:p-8">
                    {!result ? (
                        <div className="space-y-4 sm:space-y-6">
                            {/* Moon animation */}
                            <div className="flex justify-center mb-6 sm:mb-8">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl animate-pulse" />
                                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-blue-300 via-cyan-400 to-blue-500 p-1">
                                        <div className="w-full h-full rounded-full bg-[#12121a] flex items-center justify-center">
                                            <TbMoon className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-blue-400" />
                                        </div>
                                    </div>
                                    <TbStar className="absolute -right-1 -top-1 sm:-right-2 sm:-top-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-300 fill-yellow-300" />
                                </div>
                            </div>

                            {/* Textarea */}
                            <div>
                                <label className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">აღწერე შენი სიზმარი</label>
                                <textarea
                                    value={dreamText}
                                    onChange={(e) => setDreamText(e.target.value)}
                                    placeholder="ვნახე რომ ვფრინავდი ზღვის ზემოთ..."
                                    className="w-full h-28 sm:h-32 lg:h-36 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-white text-sm sm:text-base placeholder:text-gray-600 p-3 sm:p-4 resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                                />
                            </div>

                            <Button
                                onClick={handleInterpret}
                                disabled={!dreamText.trim() || isInterpreting}
                                className="w-full h-11 sm:h-12 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm sm:text-base lg:text-lg border-0 shadow-lg shadow-blue-500/25"
                            >
                                {isInterpreting ? (
                                    <span className="flex items-center gap-2 sm:gap-3">
                                        <TbLoader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                        <span className="hidden sm:inline">AI ანალიზი...</span>
                                        <span className="sm:hidden">იტვირთება...</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 sm:gap-3">
                                        <TbMoon className="w-4 h-4 sm:w-5 sm:h-5" />
                                        ახსენი
                                    </span>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Symbols */}
                            {result.symbols && result.symbols.length > 0 && (
                                <div className="space-y-2 sm:space-y-3">
                                    <h3 className="text-xs sm:text-sm font-medium text-gray-400 flex items-center gap-1.5 sm:gap-2">
                                        <TbStar className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                                        სიმბოლოები ({result.symbols.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {result.symbols.map((symbol, i) => {
                                            const cat = categoryIcons[symbol.category] || categoryIcons["სიმბოლო"]
                                            const Icon = cat.icon
                                            return (
                                                <div
                                                    key={i}
                                                    className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5"
                                                >
                                                    <div className="flex items-start gap-2.5 sm:gap-3">
                                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${cat.color} flex items-center justify-center flex-shrink-0`}>
                                                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-semibold text-white text-sm sm:text-base">{symbol.word}</div>
                                                            <div className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1">{symbol.meaning}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* General interpretation */}
                            <div className="p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                    <TbSparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                                    <h3 className="text-base sm:text-lg font-bold text-white">ინტერპრეტაცია</h3>
                                </div>
                                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{result.generalMessage}</p>
                            </div>

                            <Button
                                onClick={handleReset}
                                variant="outline"
                                className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl border-white/10 text-white hover:bg-white/5 bg-transparent text-sm sm:text-base"
                            >
                                <TbRefresh className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                                სხვა სიზმარი
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
