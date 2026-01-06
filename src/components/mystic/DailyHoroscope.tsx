"use client"

import { useState, useEffect } from "react"
import { X, Star, ArrowRight } from "@phosphor-icons/react"
import Link from "next/link"

const ZODIAC_SIGNS = [
    { id: "aries", name: "ვერძი", symbol: "♈", dates: "21 მარ - 19 აპრ" },
    { id: "taurus", name: "კურო", symbol: "♉", dates: "20 აპრ - 20 მაი" },
    { id: "gemini", name: "ტყუპები", symbol: "♊", dates: "21 მაი - 20 ივნ" },
    { id: "cancer", name: "კირჩხიბი", symbol: "♋", dates: "21 ივნ - 22 ივლ" },
    { id: "leo", name: "ლომი", symbol: "♌", dates: "23 ივლ - 22 აგვ" },
    { id: "virgo", name: "ქალწული", symbol: "♍", dates: "23 აგვ - 22 სექ" },
    { id: "libra", name: "სასწორი", symbol: "♎", dates: "23 სექ - 22 ოქტ" },
    { id: "scorpio", name: "მორიელი", symbol: "♏", dates: "23 ოქტ - 21 ნოე" },
    { id: "sagittarius", name: "მშვილდოსანი", symbol: "♐", dates: "22 ნოე - 21 დეკ" },
    { id: "capricorn", name: "თხის რქა", symbol: "♑", dates: "22 დეკ - 19 იან" },
    { id: "aquarius", name: "მერწყული", symbol: "♒", dates: "20 იან - 18 თებ" },
    { id: "pisces", name: "თევზები", symbol: "♓", dates: "19 თებ - 20 მარ" },
]

const MINI_HOROSCOPES = [
    "დღეს ვარსკვლავები თქვენს მხარეზეა! გამოიყენეთ ეს ენერგია ახალი დაწყებებისთვის.",
    "სიყვარულის პლანეტა თქვენს ზოდიაქოში გადადის. მოელით სასიამოვნო სიურპრიზებს!",
    "ფინანსური გადაწყვეტილებები დღეს წარმატებული იქნება. ენდეთ ინტუიციას.",
    "კრეატიული ენერგია მაქსიმუმზეა. შექმენით რაღაც ახალი!",
    "ურთიერთობებში ჰარმონიის დროა. გაამყარეთ კავშირები.",
]

export function DailyHoroscope() {
    const [isVisible, setIsVisible] = useState(false)
    const [selectedSign, setSelectedSign] = useState<string | null>(null)
    const [prediction, setPrediction] = useState("")
    const [hasSeenToday, setHasSeenToday] = useState(true)

    useEffect(() => {
        // Check if user has seen today's horoscope
        const lastSeen = localStorage.getItem("lastHoroscopeDate")
        const today = new Date().toDateString()

        if (lastSeen !== today) {
            setHasSeenToday(false)
            // Show popup after 2 seconds
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleSelectSign = (signId: string) => {
        setSelectedSign(signId)
        // Random prediction
        const randomPrediction = MINI_HOROSCOPES[Math.floor(Math.random() * MINI_HOROSCOPES.length)]
        setPrediction(randomPrediction)
    }

    const handleClose = () => {
        setIsVisible(false)
        localStorage.setItem("lastHoroscopeDate", new Date().toDateString())
    }

    if (!isVisible || hasSeenToday) return null

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-gradient-to-br from-[#12121a] to-[#0a0a0f] border border-purple-500/30 
                      rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-purple-900/30
                      animate-in zoom-in-95 fade-in duration-300">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <X size={18} className="text-gray-400" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-900/30 
                          border border-amber-500/30 flex items-center justify-center
                          shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                        <Star size={32} weight="duotone" className="text-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">დღის ჰოროსკოპი</h3>
                    <p className="text-sm text-gray-400 mt-1">აირჩიე შენი ზოდიაქო</p>
                </div>

                {!selectedSign ? (
                    /* Zodiac Grid */
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {ZODIAC_SIGNS.map((sign) => (
                            <button
                                key={sign.id}
                                onClick={() => handleSelectSign(sign.id)}
                                className="group p-3 rounded-xl bg-white/5 hover:bg-purple-500/20 
                           border border-white/10 hover:border-purple-500/40
                           transition-all duration-200 hover:scale-105"
                            >
                                <div className="text-2xl mb-1">{sign.symbol}</div>
                                <div className="text-[10px] text-gray-400 group-hover:text-white truncate">
                                    {sign.name}
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    /* Prediction */
                    <div className="space-y-4">
                        <div className="text-center">
                            <div className="text-4xl mb-2">
                                {ZODIAC_SIGNS.find(s => s.id === selectedSign)?.symbol}
                            </div>
                            <div className="text-lg font-medium text-purple-400">
                                {ZODIAC_SIGNS.find(s => s.id === selectedSign)?.name}
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 
                            border border-purple-500/20">
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {prediction}
                            </p>
                        </div>

                        <Link
                            href="/mystic/horoscope"
                            onClick={handleClose}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                         bg-gradient-to-r from-purple-600 to-pink-600 
                         hover:from-purple-500 hover:to-pink-500
                         text-white font-medium transition-all duration-200"
                        >
                            <span>სრული ჰოროსკოპი</span>
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                )}

                {/* Skip */}
                <button
                    onClick={handleClose}
                    className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                    გამოტოვება
                </button>
            </div>
        </div>
    )
}
