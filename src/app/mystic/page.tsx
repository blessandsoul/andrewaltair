"use client"

import { useState } from "react"
import { Sparkles, Moon, Heart, Star, Wand2, AlertTriangle, ChevronLeft } from "lucide-react"
import { FortuneTeller } from "@/components/ai/FortuneTeller"
import { LoveCalculator } from "@/components/ai/LoveCalculator"
import { DreamInterpreter } from "@/components/ai/DreamInterpreter"
import { Horoscope } from "@/components/ai/Horoscope"
import {
    MysticQuotes,
    AboutMystic,
    InteractiveConstellation,
    MysticAmbience,
    FloatingParticles
} from "@/components/mystic"

const TOOLS = [
    {
        id: "fortune",
        name: "მისტიკური მკითხავი",
        shortName: "მკითხავი",
        description: "AI წინასწარმეტყველება",
        icon: Sparkles,
        gradient: "from-purple-600 via-violet-600 to-indigo-600",
        bgGlow: "bg-purple-500/20",
        component: FortuneTeller
    },
    {
        id: "love",
        name: "სიყვარულის კალკულატორი",
        shortName: "სიყვარული",
        description: "თავსებადობის ანალიზი",
        icon: Heart,
        gradient: "from-pink-600 via-rose-600 to-red-600",
        bgGlow: "bg-pink-500/20",
        component: LoveCalculator
    },
    {
        id: "dream",
        name: "სიზმრების ახსნა",
        shortName: "სიზმრები",
        description: "ფსიქოანალიზი",
        icon: Moon,
        gradient: "from-blue-600 via-cyan-600 to-teal-600",
        bgGlow: "bg-blue-500/20",
        component: DreamInterpreter
    },
    {
        id: "horoscope",
        name: "დღის ჰოროსკოპი",
        shortName: "ჰოროსკოპი",
        description: "ვარსკვლავების პროგნოზი",
        icon: Star,
        gradient: "from-amber-500 via-orange-500 to-yellow-500",
        bgGlow: "bg-amber-500/20",
        component: Horoscope
    },
]

export default function MysticPage() {
    const [activeToolId, setActiveToolId] = useState<string | null>(null)
    const activeTool = TOOLS.find(t => t.id === activeToolId)

    return (
        <div className="min-h-screen bg-[#0a0a12] text-white relative overflow-hidden font-georgian">
            {/* Ambient Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-[#0f0f1a] via-[#1a1025] to-[#0f0a1a] -z-20" />
            <InteractiveConstellation />
            <FloatingParticles />

            {/* Audio Ambience */}
            <MysticAmbience />

            {/* Content */}
            <div className="relative z-10">
                {/* Hero Section - ONLY show when no tool selected */}
                {!activeToolId && (
                    <section className="pt-8 pb-6 sm:pt-12 sm:pb-10 lg:pt-16 lg:pb-8">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                            <div className="text-center space-y-6 sm:space-y-8">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm animate-fade-in-up">
                                    <Wand2 className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                                    <span className="text-xs sm:text-sm text-purple-200">AI მისტიკა</span>
                                </div>

                                {/* Title - Responsive */}
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight animate-fade-in-up delay-100">
                                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                                        მისტიკური
                                    </span>
                                    <span className="ml-2 sm:ml-3">AI</span>
                                </h1>

                                {/* Subtitle */}
                                <p className="text-sm sm:text-base text-gray-400 max-w-md mx-auto animate-fade-in-up delay-200">
                                    ხელოვნური ინტელექტი შეხვდება უძველეს სიბრძნეს.
                                    აღმოაჩინე შენი ბედი ვარსკვლავებში.
                                </p>

                                {/* Quotes Component */}
                                <div className="animate-fade-in-up delay-300">
                                    <MysticQuotes />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Tools Section */}
                <section className={activeToolId ? "py-4 sm:py-6" : "py-6 sm:py-10"}>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                        {!activeToolId ? (
                            /* Tool Selection Grid */
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 animate-fade-in-up delay-500">
                                {TOOLS.map((tool) => {
                                    const Icon = tool.icon
                                    return (
                                        <button
                                            key={tool.id}
                                            onClick={() => setActiveToolId(tool.id)}
                                            className="group relative p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm 
                                                       hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300
                                                       active:scale-[0.98] hover:scale-[1.02] overflow-hidden"
                                        >
                                            {/* Glow effect */}
                                            <div className={`absolute inset-0 rounded-3xl ${tool.bgGlow} opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500`} />

                                            <div className="relative z-10 text-center space-y-2 sm:space-y-3">
                                                {/* Icon */}
                                                <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br ${tool.gradient} p-0.5 group-hover:scale-110 transition-transform duration-300`}>
                                                    <div className="w-full h-full rounded-xl sm:rounded-2xl bg-[#0a0a12] flex items-center justify-center">
                                                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                                                    </div>
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white">
                                                    <span className="sm:hidden">{tool.shortName}</span>
                                                    <span className="hidden sm:inline">{tool.name}</span>
                                                </h3>

                                                {/* Description */}
                                                <p className="hidden sm:block text-xs lg:text-sm text-gray-500">{tool.description}</p>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        ) : (
                            /* Active Tool View */
                            <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Back Button + Tool Title */}
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <button
                                        onClick={() => setActiveToolId(null)}
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 
                                                   hover:bg-white/10 transition-colors flex items-center justify-center flex-shrink-0"
                                    >
                                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                                    </button>

                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${activeTool?.gradient} p-0.5 flex-shrink-0`}>
                                        <div className="w-full h-full rounded-xl sm:rounded-2xl bg-[#0a0a12] flex items-center justify-center">
                                            {activeTool && <activeTool.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
                                        </div>
                                    </div>

                                    <div className="min-w-0">
                                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">{activeTool?.name}</h2>
                                        <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">{activeTool?.description}</p>
                                    </div>
                                </div>

                                {/* Tool Component */}
                                <div className="max-w-2xl mx-auto">
                                    {activeTool && <activeTool.component />}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* About & Disclaimer Sections - Only show when no tool selected */}
                {!activeToolId && (
                    <>
                        <AboutMystic />

                        <section className="py-6 sm:py-8 lg:py-10 border-t border-white/5">
                            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-500/5 border border-amber-500/10">
                                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs sm:text-sm text-gray-500">
                                        ეს ინსტრუმენტები <span className="text-amber-400">გართობისთვისაა</span> და არ უნდა
                                        ჩაითვალოს რეალურ წინასწარმეტყველებად. AI პასუხები გენერირებულია მხოლოდ გასართობი მიზნით.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    )
}

