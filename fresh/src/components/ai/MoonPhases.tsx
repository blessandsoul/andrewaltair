"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Star, RefreshCw, Calendar, Sparkles } from "lucide-react"

interface MoonPhaseData {
    phase: string
    phaseEmoji: string
    illumination: number
    nextFullMoon: string
    nextNewMoon: string
    energy: string
    rituals: string[]
    advice: string
}

const MOON_PHASES = [
    { name: "ახალი მთვარე", emoji: "🌑", energy: "დასაწყისი", description: "ახალი იდეებისა და განზრახვების დრო" },
    { name: "მზარდი ნახევარმთვარე", emoji: "🌒", energy: "ზრდა", description: "ქმედებების დაწყების დრო" },
    { name: "პირველი მეოთხედი", emoji: "🌓", energy: "მოქმედება", description: "გადაწყვეტილებების და ქმედების დრო" },
    { name: "მზარდი სამეოთხედი", emoji: "🌔", energy: "დახვეწა", description: "პროგრესის შეფასებისა და კორექტირების დრო" },
    { name: "სავსე მთვარე", emoji: "🌕", energy: "კულმინაცია", description: "შედეგების მოსავლის აღების დრო" },
    { name: "კლებადი სამეოთხედი", emoji: "🌖", energy: "მადლიერება", description: "მიღწევების დაფასების დრო" },
    { name: "ბოლო მეოთხედი", emoji: "🌗", energy: "გაშვება", description: "ძველისაგან გათავისუფლების დრო" },
    { name: "კლებადი ნახევარმთვარე", emoji: "🌘", energy: "დასვენება", description: "რეფლექსიისა და მომზადების დრო" },
]

function getMoonPhase(): MoonPhaseData {
    const now = new Date()
    const synodicMonth = 29.53059 // days

    // Reference new moon: January 6, 2000 (known new moon)
    const reference = new Date(2000, 0, 6, 18, 14, 0)
    const daysSinceReference = (now.getTime() - reference.getTime()) / (1000 * 60 * 60 * 24)
    const moonAge = daysSinceReference % synodicMonth

    // Calculate illumination (0-100%)
    const illumination = Math.round((1 - Math.cos(2 * Math.PI * moonAge / synodicMonth)) / 2 * 100)

    // Determine phase
    let phaseIndex: number
    if (moonAge < 1.85) phaseIndex = 0
    else if (moonAge < 7.38) phaseIndex = 1
    else if (moonAge < 9.23) phaseIndex = 2
    else if (moonAge < 14.77) phaseIndex = 3
    else if (moonAge < 16.61) phaseIndex = 4
    else if (moonAge < 22.15) phaseIndex = 5
    else if (moonAge < 24.00) phaseIndex = 6
    else phaseIndex = 7

    const phase = MOON_PHASES[phaseIndex]

    // Calculate next full and new moon
    const daysToNextNew = (synodicMonth - moonAge) % synodicMonth
    const daysToNextFull = ((synodicMonth / 2) - moonAge + synodicMonth) % synodicMonth

    const nextNew = new Date(now.getTime() + daysToNextNew * 24 * 60 * 60 * 1000)
    const nextFull = new Date(now.getTime() + daysToNextFull * 24 * 60 * 60 * 1000)

    const formatDate = (d: Date) => d.toLocaleDateString('ka-GE', { month: 'long', day: 'numeric' })

    // Rituals based on phase
    const rituals: Record<number, string[]> = {
        0: ["ახალი განზრახვების ჩაწერა", "მედიტაცია მიზნებზე", "ახალი პროექტის დაგეგმვა"],
        1: ["აქტიური ნაბიჯების გადადგმა", "ახალი უნარების სწავლა", "ენერგიის აკუმულირება"],
        2: ["გადაწყვეტილებების მიღება", "სირთულეების გადალახვა", "სიმამაცის გამოვლენა"],
        3: ["პროგრესის შეფასება", "გეგმების კორექტირება", "მოთმინების პრაქტიკა"],
        4: ["მადლიერების რიტუალი", "აღსარებები და დაფასება", "ენერგიის გათავისუფლება"],
        5: ["სხვებთან გაზიარება", "მიღწევების დაფასება", "სიბრძნის გადაცემა"],
        6: ["ძველისაგან გათავისუფლება", "პატიება", "სივრცის გაწმენდა"],
        7: ["დასვენება და რეფლექსია", "ინტროსპექცია", "საკუთარ თავთან შერიგება"],
    }

    return {
        phase: phase.name,
        phaseEmoji: phase.emoji,
        illumination,
        nextFullMoon: formatDate(nextFull),
        nextNewMoon: formatDate(nextNew),
        energy: phase.energy,
        rituals: rituals[phaseIndex],
        advice: phase.description
    }
}

export function MoonPhases() {
    const [moonData, setMoonData] = useState<MoonPhaseData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        // Simulate brief loading for effect
        setTimeout(() => {
            setMoonData(getMoonPhase())
            setIsLoading(false)
        }, 500)
    }, [])

    const handleRefresh = () => {
        setIsLoading(true)
        setTimeout(() => {
            setMoonData(getMoonPhase())
            setIsLoading(false)
        }, 500)
    }

    const today = new Date().toLocaleDateString("ka-GE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    if (isLoading || !moonData) {
        return (
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-indigo-600 rounded-2xl sm:rounded-3xl blur-xl opacity-20" />
                <div className="relative rounded-2xl sm:rounded-3xl bg-[#12121a] border border-white/10 p-8">
                    <div className="flex justify-center">
                        <Moon className="w-12 h-12 text-slate-400 animate-pulse" />
                    </div>
                    <p className="text-center text-gray-500 mt-4">მთვარის ფაზა იტვირთება...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-indigo-600 rounded-2xl sm:rounded-3xl blur-xl opacity-20" />

            <div className="relative rounded-2xl sm:rounded-3xl bg-[#12121a] border border-white/10 overflow-hidden">
                {/* Header gradient */}
                <div className="absolute top-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-b from-indigo-600/20 to-transparent pointer-events-none" />

                <div className="relative p-5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                    {/* Moon display */}
                    <div className="text-center">
                        <div className="relative inline-block mb-4">
                            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl" />
                            <div className="relative text-7xl sm:text-8xl lg:text-9xl animate-float">
                                {moonData.phaseEmoji}
                            </div>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{moonData.phase}</h2>
                        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{today}</span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                            <div className="text-xl sm:text-2xl font-bold text-indigo-400">{moonData.illumination}%</div>
                            <div className="text-[10px] sm:text-xs text-gray-500">განათება</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                            <div className="text-sm sm:text-base font-bold text-amber-400">{moonData.nextFullMoon}</div>
                            <div className="text-[10px] sm:text-xs text-gray-500">სავსე მთვარე</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                            <div className="text-sm sm:text-base font-bold text-slate-400">{moonData.nextNewMoon}</div>
                            <div className="text-[10px] sm:text-xs text-gray-500">ახალი მთვარე</div>
                        </div>
                    </div>

                    {/* Energy */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-indigo-400" />
                            </div>
                            <span className="font-semibold text-white">ენერგია: {moonData.energy}</span>
                        </div>
                        <p className="text-sm text-gray-300">{moonData.advice}</p>
                    </div>

                    {/* Rituals */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2 mb-3">
                            <Star className="w-4 h-4 text-amber-400" />
                            <span className="font-medium text-white text-sm">რეკომენდებული რიტუალები</span>
                        </div>
                        <div className="space-y-2">
                            {moonData.rituals.map((ritual, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                    {ritual}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={handleRefresh}
                        variant="outline"
                        className="w-full h-10 sm:h-12 rounded-xl border-white/10 text-white hover:bg-white/5 bg-transparent"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        განახლება
                    </Button>
                </div>
            </div>
        </div>
    )
}
