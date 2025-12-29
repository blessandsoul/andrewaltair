"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Star, RefreshCw, Palette, Hash, Calendar, Loader2 } from "lucide-react"

interface FortunePrediction {
    prediction: string
    luckyColor: string
    luckyNumber: string
    luckyDay: string
}

export function FortuneTeller() {
    const [name, setName] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [result, setResult] = useState<FortunePrediction | null>(null)
    const [isRevealing, setIsRevealing] = useState(false)

    const handleReveal = async () => {
        if (!name.trim()) return

        setIsRevealing(true)

        try {
            const response = await fetch("/api/mystic/fortune", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, birthDate }),
            })

            if (!response.ok) throw new Error("API error")

            const data = await response.json()
            setResult(data)
        } catch {
            setResult({
                prediction: "ვარსკვლავთა ქარავანი შენს სახელს ეძებს ცის კამარაზე. დიდი ცვლილებები მოახლოვდა — მზად იყავი მიიღო ბედისწერის საჩუქარი.",
                luckyColor: "ზურმუხტისფერი",
                luckyNumber: "7",
                luckyDay: "პარასკევი"
            })
        } finally {
            setIsRevealing(false)
        }
    }

    const handleReset = () => {
        setName("")
        setBirthDate("")
        setResult(null)
    }

    return (
        <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl blur-xl opacity-20" />

            <div className="relative rounded-2xl sm:rounded-3xl bg-[#12121a] border border-white/10 overflow-hidden">
                {/* Header gradient */}
                <div className="absolute top-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-b from-purple-600/20 to-transparent pointer-events-none" />

                <div className="relative p-5 sm:p-6 lg:p-8">
                    {!result ? (
                        <div className="space-y-4 sm:space-y-6">
                            {/* Crystal ball animation */}
                            <div className="flex justify-center mb-6 sm:mb-8">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-2xl animate-pulse" />
                                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-600 p-1">
                                        <div className="w-full h-full rounded-full bg-[#12121a] flex items-center justify-center">
                                            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-purple-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="space-y-3 sm:space-y-4">
                                <div>
                                    <label className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">შენი სახელი</label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="შეიყვანე სახელი..."
                                        className="h-10 sm:h-12 bg-white/5 border-white/10 text-white text-sm sm:text-base placeholder:text-gray-600 rounded-lg sm:rounded-xl focus:border-purple-500 focus:ring-purple-500/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">
                                        დაბადების თარიღი <span className="text-gray-600 hidden sm:inline">(არასავალდებულო)</span>
                                    </label>
                                    <Input
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        className="h-10 sm:h-12 bg-white/5 border-white/10 text-white text-sm sm:text-base rounded-lg sm:rounded-xl focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleReveal}
                                disabled={!name.trim() || isRevealing}
                                className="w-full h-11 sm:h-12 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm sm:text-base lg:text-lg border-0 shadow-lg shadow-purple-500/25"
                            >
                                {isRevealing ? (
                                    <span className="flex items-center gap-2 sm:gap-3">
                                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                        <span className="hidden sm:inline">AI კითხულობს...</span>
                                        <span className="sm:hidden">იტვირთება...</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 sm:gap-3">
                                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                                        გაიგე მომავალი
                                    </span>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Prediction */}
                            <div className="p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2">
                                            {name}-ს წინასწარმეტყველება
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{result.prediction}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Lucky items grid */}
                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 text-center">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 rounded-lg sm:rounded-xl bg-pink-500/20 flex items-center justify-center">
                                        <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">ფერი</div>
                                    <div className="text-white font-medium text-xs sm:text-sm truncate">{result.luckyColor}</div>
                                </div>
                                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 text-center">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 rounded-lg sm:rounded-xl bg-blue-500/20 flex items-center justify-center">
                                        <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">რიცხვი</div>
                                    <div className="text-white font-medium text-xs sm:text-sm">{result.luckyNumber}</div>
                                </div>
                                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 text-center">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 rounded-lg sm:rounded-xl bg-green-500/20 flex items-center justify-center">
                                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">დღე</div>
                                    <div className="text-white font-medium text-xs sm:text-sm truncate">{result.luckyDay}</div>
                                </div>
                            </div>

                            <Button
                                onClick={handleReset}
                                variant="outline"
                                className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl border-white/10 text-white hover:bg-white/5 bg-transparent text-sm sm:text-base"
                            >
                                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                                ხელახლა
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
