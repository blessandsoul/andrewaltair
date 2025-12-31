"use client"

import { useEffect, useState } from "react"

interface MoonData {
    phase: string
    illumination: number
    phaseName: string
    phaseEmoji: string
    advice: string
}

const MOON_PHASES = [
    { name: "ახალმთვარე", emoji: "🌑", advice: "ახალი დაწყებების იდეალური დრო" },
    { name: "ზრდადი ნამგალი", emoji: "🌒", advice: "დაიწყეთ ახალი პროექტები" },
    { name: "პირველი მეოთხედი", emoji: "🌓", advice: "გადაწყვეტილებების მიღების დრო" },
    { name: "ზრდადი გუმბათი", emoji: "🌔", advice: "მიზნებს მიუახლოვდით" },
    { name: "სავსე მთვარე", emoji: "🌕", advice: "ენერგია მაქსიმუმზეა!" },
    { name: "კლებადი გუმბათი", emoji: "🌖", advice: "მადლიერების დრო" },
    { name: "ბოლო მეოთხედი", emoji: "🌗", advice: "გაათავისუფლეთ რაც აღარ გჭირდებათ" },
    { name: "კლებადი ნამგალი", emoji: "🌘", advice: "დაისვენეთ და იფიქრეთ" },
]

function calculateMoonPhase(date: Date): MoonData {
    // Calculate days since known new moon (January 6, 2000)
    const knownNewMoon = new Date(2000, 0, 6, 18, 14, 0)
    const lunarCycle = 29.53058867 // days

    const daysSinceNew = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24)
    const currentCycleDay = ((daysSinceNew % lunarCycle) + lunarCycle) % lunarCycle

    // Calculate illumination (0-100%)
    const illumination = Math.round((1 - Math.cos(2 * Math.PI * currentCycleDay / lunarCycle)) / 2 * 100)

    // Determine phase (8 phases)
    const phaseIndex = Math.floor((currentCycleDay / lunarCycle) * 8) % 8
    const phase = MOON_PHASES[phaseIndex]

    return {
        phase: `day${Math.floor(currentCycleDay)}`,
        illumination,
        phaseName: phase.name,
        phaseEmoji: phase.emoji,
        advice: phase.advice,
    }
}

export function LiveMoonPhase() {
    const [moonData, setMoonData] = useState<MoonData | null>(null)
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        setMoonData(calculateMoonPhase(new Date()))
    }, [])

    if (!moonData) return null

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Collapsed View - Moon Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`relative group transition-all duration-500 ${isExpanded ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
            >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 
                        border border-slate-600/50 flex items-center justify-center
                        shadow-[0_0_30px_rgba(148,163,184,0.3)] hover:shadow-[0_0_40px_rgba(148,163,184,0.5)]
                        transition-all duration-300 group-hover:scale-110">
                    <span className="text-3xl">{moonData.phaseEmoji}</span>

                    {/* Glow ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-slate-400/20 animate-ping"
                        style={{ animationDuration: '3s' }} />
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 
                        transition-opacity duration-200 pointer-events-none">
                    <div className="bg-slate-900/95 border border-slate-700 rounded-lg px-3 py-2 
                          text-sm text-white whitespace-nowrap">
                        {moonData.phaseName}
                    </div>
                </div>
            </button>

            {/* Expanded View - Moon Card */}
            <div className={`absolute bottom-0 right-0 transition-all duration-500 origin-bottom-right
                       ${isExpanded ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
                <div className="w-72 bg-gradient-to-br from-slate-900/98 to-slate-950/98 
                        border border-slate-700/50 rounded-2xl overflow-hidden
                        shadow-2xl shadow-slate-900/50 backdrop-blur-xl">

                    {/* Header with Moon */}
                    <div className="relative h-32 bg-gradient-to-b from-slate-800/50 to-transparent 
                          flex items-center justify-center overflow-hidden">
                        {/* Stars background */}
                        <div className="absolute inset-0">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 2}s`,
                                        opacity: Math.random() * 0.7 + 0.3,
                                    }}
                                />
                            ))}
                        </div>

                        {/* Large Moon */}
                        <div className="relative z-10">
                            <span className="text-7xl drop-shadow-[0_0_20px_rgba(148,163,184,0.5)]">
                                {moonData.phaseEmoji}
                            </span>

                            {/* Glow */}
                            <div className="absolute inset-0 blur-xl opacity-50">
                                <span className="text-7xl">{moonData.phaseEmoji}</span>
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-800/80 
                         border border-slate-700 flex items-center justify-center
                         hover:bg-slate-700 transition-colors"
                        >
                            <span className="text-slate-400">✕</span>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4">
                        {/* Phase Name */}
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-white">{moonData.phaseName}</h3>
                            <p className="text-sm text-slate-400">დღევანდელი ფაზა</p>
                        </div>

                        {/* Illumination Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">განათება</span>
                                <span className="text-white font-medium">{moonData.illumination}%</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-slate-600 via-slate-400 to-white rounded-full
                             transition-all duration-1000"
                                    style={{ width: `${moonData.illumination}%` }}
                                />
                            </div>
                        </div>

                        {/* Advice */}
                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                            <p className="text-sm text-purple-200 text-center">
                                ✨ {moonData.advice}
                            </p>
                        </div>

                        {/* Date */}
                        <div className="text-center text-xs text-slate-500">
                            {new Date().toLocaleDateString('ka-GE', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
