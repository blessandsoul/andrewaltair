"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Star, Heart, Briefcase, Activity, RefreshCw, Calendar, Loader2 } from "lucide-react"

const ZODIAC_SIGNS = [
    { id: "aries", name: "ვერძი", symbol: "♈", element: "ცეცხლი", color: "from-red-500 to-orange-500" },
    { id: "taurus", name: "კურო", symbol: "♉", element: "მიწა", color: "from-green-600 to-emerald-500" },
    { id: "gemini", name: "ტყუპები", symbol: "♊", element: "ჰაერი", color: "from-cyan-500 to-blue-500" },
    { id: "cancer", name: "კირჩხიბი", symbol: "♋", element: "წყალი", color: "from-blue-600 to-indigo-500" },
    { id: "leo", name: "ლომი", symbol: "♌", element: "ცეცხლი", color: "from-amber-500 to-yellow-500" },
    { id: "virgo", name: "ქალწული", symbol: "♍", element: "მიწა", color: "from-emerald-600 to-teal-500" },
    { id: "libra", name: "სასწორი", symbol: "♎", element: "ჰაერი", color: "from-pink-500 to-rose-500" },
    { id: "scorpio", name: "მორიელი", symbol: "♏", element: "წყალი", color: "from-purple-600 to-violet-500" },
    { id: "sagittarius", name: "მშვილდოსანი", symbol: "♐", element: "ცეცხლი", color: "from-orange-500 to-red-500" },
    { id: "capricorn", name: "თხის რქა", symbol: "♑", element: "მიწა", color: "from-gray-600 to-slate-500" },
    { id: "aquarius", name: "მერწყული", symbol: "♒", element: "ჰაერი", color: "from-sky-500 to-cyan-500" },
    { id: "pisces", name: "თევზები", symbol: "♓", element: "წყალი", color: "from-indigo-500 to-purple-500" },
]

interface HoroscopeResult {
    general: string
    love: string
    career: string
    health: string
}

export function Horoscope() {
    const [selectedSign, setSelectedSign] = useState<typeof ZODIAC_SIGNS[0] | null>(null)
    const [horoscope, setHoroscope] = useState<HoroscopeResult | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSelectSign = async (sign: typeof ZODIAC_SIGNS[0]) => {
        setSelectedSign(sign)
        setIsLoading(true)

        try {
            const response = await fetch("/api/mystic/horoscope", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sign: sign.id, signName: sign.name }),
            })

            if (!response.ok) throw new Error("API error")

            const data = await response.json()
            setHoroscope(data)
        } catch {
            setHoroscope({
                general: "დღეს კოსმიური ენერგიები შენს მხარესაა. ინტუიცია განსაკუთრებულად ძლიერია.",
                love: "სიყვარულის სფეროში სითბო და ჰარმონია მნათობს.",
                career: "პროფესიულ ასპარეზზე შენი ძალისხმევა შენიშნული იქნება.",
                health: "შენი ენერგია ბალანსშია. მოუსმინე სხეულს."
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        setSelectedSign(null)
        setHoroscope(null)
    }

    const today = new Date().toLocaleDateString("ka-GE", {
        weekday: "long",
        month: "long",
        day: "numeric",
    })

    return (
        <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl sm:rounded-3xl blur-xl opacity-20" />

            <div className="relative rounded-2xl sm:rounded-3xl bg-[#12121a] border border-white/10 overflow-hidden">
                {/* Header gradient */}
                <div className="absolute top-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-b from-amber-500/20 to-transparent pointer-events-none" />

                <div className="relative p-5 sm:p-6 lg:p-8">
                    {!selectedSign ? (
                        <div className="space-y-4 sm:space-y-6">
                            {/* Star header */}
                            <div className="text-center mb-6 sm:mb-8">
                                <div className="relative inline-block mb-3 sm:mb-4">
                                    <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-2xl animate-pulse" />
                                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                                        <Star className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white fill-white" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-gray-400 text-xs sm:text-sm">
                                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{today}</span>
                                </div>
                            </div>

                            {/* Zodiac grid - 4 cols on mobile, same on desktop */}
                            <div>
                                <p className="text-center text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">აირჩიე ზოდიაქო</p>
                                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                                    {ZODIAC_SIGNS.map((sign) => (
                                        <button
                                            key={sign.id}
                                            onClick={() => handleSelectSign(sign)}
                                            className="group p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all active:scale-95"
                                        >
                                            <div className="text-xl sm:text-2xl mb-0.5 sm:mb-1">{sign.symbol}</div>
                                            <div className="text-[10px] sm:text-xs text-gray-400 group-hover:text-white transition-colors truncate">{sign.name}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : isLoading ? (
                        <div className="text-center py-12 sm:py-16">
                            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 animate-spin mx-auto" />
                            <p className="text-gray-400 mt-3 sm:mt-4 text-sm sm:text-base">AI კითხულობს...</p>
                        </div>
                    ) : horoscope ? (
                        <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Sign header */}
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${selectedSign.color} flex items-center justify-center text-2xl sm:text-3xl`}>
                                    {selectedSign.symbol}
                                </div>
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-white">{selectedSign.name}</h3>
                                    <p className="text-xs sm:text-sm text-gray-500">{selectedSign.element}</p>
                                </div>
                            </div>

                            {/* Predictions */}
                            <div className="space-y-2 sm:space-y-3">
                                {/* General */}
                                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex items-start gap-2.5 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-semibold text-white text-sm sm:text-base mb-0.5 sm:mb-1">ზოგადი</div>
                                            <div className="text-xs sm:text-sm text-gray-400">{horoscope.general}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Love */}
                                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex items-start gap-2.5 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-semibold text-white text-sm sm:text-base mb-0.5 sm:mb-1">სიყვარული</div>
                                            <div className="text-xs sm:text-sm text-gray-400">{horoscope.love}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Career */}
                                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex items-start gap-2.5 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-semibold text-white text-sm sm:text-base mb-0.5 sm:mb-1">კარიერა</div>
                                            <div className="text-xs sm:text-sm text-gray-400">{horoscope.career}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Health */}
                                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex items-start gap-2.5 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-semibold text-white text-sm sm:text-base mb-0.5 sm:mb-1">ჯანმრთელობა</div>
                                            <div className="text-xs sm:text-sm text-gray-400">{horoscope.health}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleReset}
                                variant="outline"
                                className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl border-white/10 text-white hover:bg-white/5 bg-transparent text-sm sm:text-base"
                            >
                                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                                სხვა ნიშანი
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
