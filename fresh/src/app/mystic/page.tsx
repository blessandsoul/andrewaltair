"use client"

import { useState } from "react"
import { Sparkles, Moon, Heart, Star, Wand2, AlertTriangle, ChevronLeft, Hash, Crown, History, Trophy, Award, MessageCircle, User } from "lucide-react"
import { FortuneTeller } from "@/components/ai/FortuneTeller"
import { LoveCalculator } from "@/components/ai/LoveCalculator"
import { DreamInterpreter } from "@/components/ai/DreamInterpreter"
import { Horoscope } from "@/components/ai/Horoscope"
import { TarotCards } from "@/components/ai/TarotCards"
import { Numerology } from "@/components/ai/Numerology"
import { MoonPhases } from "@/components/ai/MoonPhases"
import { MysticChat } from "@/components/ai/MysticChat"
import { MysticHistory } from "@/components/mystic/MysticHistory"
import { MysticLeaderboard } from "@/components/mystic/MysticLeaderboard"
import { MysticAchievements } from "@/components/mystic/MysticAchievements"
import { AboutMystic } from "@/components/mystic/AboutMystic"
import { PremiumUpsell, PremiumBadge } from "@/components/mystic/PremiumUpsell"

// Tool definitions
const TOOLS = [
    {
        id: "fortune",
        name: "მისტიკური გადალი",
        shortName: "გადალი",
        description: "AI წინასწარმეტყველება",
        icon: Sparkles,
        gradient: "from-purple-600 via-violet-600 to-indigo-600",
        bgGlow: "bg-purple-500/20",
        component: FortuneTeller,
        isPremium: false
    },
    {
        id: "tarot",
        name: "ტაროს კარტები",
        shortName: "ტაროტი",
        description: "კარტების კითხვა",
        icon: Sparkles,
        gradient: "from-indigo-600 via-violet-600 to-purple-600",
        bgGlow: "bg-indigo-500/20",
        component: TarotCards,
        isPremium: false
    },
    {
        id: "love",
        name: "სიყვარულის კალკულატორი",
        shortName: "სიყვარული",
        description: "თავსებადობის ანალიზი",
        icon: Heart,
        gradient: "from-pink-600 via-rose-600 to-red-600",
        bgGlow: "bg-pink-500/20",
        component: LoveCalculator,
        isPremium: false
    },
    {
        id: "dream",
        name: "სიზმრების ახსნა",
        shortName: "სიზმრები",
        description: "ფსიქოანალიზი",
        icon: Moon,
        gradient: "from-blue-600 via-cyan-600 to-teal-600",
        bgGlow: "bg-blue-500/20",
        component: DreamInterpreter,
        isPremium: false
    },
    {
        id: "horoscope",
        name: "დღის ჰოროსკოპი",
        shortName: "ჰოროსკოპი",
        description: "ვარსკვლავების პროგნოზი",
        icon: Star,
        gradient: "from-amber-500 via-orange-500 to-yellow-500",
        bgGlow: "bg-amber-500/20",
        component: Horoscope,
        isPremium: false
    },
    {
        id: "numerology",
        name: "ნუმეროლოგია",
        shortName: "რიცხვები",
        description: "რიცხვების ენერგია",
        icon: Hash,
        gradient: "from-emerald-600 via-teal-600 to-green-600",
        bgGlow: "bg-emerald-500/20",
        component: Numerology,
        isPremium: false
    },
    {
        id: "moon",
        name: "მთვარის ფაზები",
        shortName: "მთვარე",
        description: "კოსმიური ენერგია",
        icon: Moon,
        gradient: "from-slate-600 via-gray-600 to-zinc-600",
        bgGlow: "bg-slate-500/20",
        component: MoonPhases,
        isPremium: false
    },
    {
        id: "chat",
        name: "AI მისტიკოსი",
        shortName: "ჩატი",
        description: "პირადი მრჩეველი",
        icon: MessageCircle,
        gradient: "from-violet-600 via-fuchsia-600 to-pink-600",
        bgGlow: "bg-violet-500/20",
        component: MysticChat,
        isPremium: false
    },
]

// Feature sections
const FEATURE_SECTIONS = [
    { id: "history", name: "ისტორია", icon: History },
    { id: "leaderboard", name: "რეიტინგი", icon: Trophy },
    { id: "achievements", name: "ბეჯები", icon: Award },
    { id: "about", name: "ჩემ შესახებ", icon: User },
]

// Animated stars background component
function StarsBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(60)].map((_, i) => (
                <div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${1 + Math.random() * 2}px`,
                        height: `${1 + Math.random() * 2}px`,
                        animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 3}s`,
                        opacity: 0.2 + Math.random() * 0.6,
                    }}
                />
            ))}
        </div>
    )
}

// Floating orbs - responsive sizes
function FloatingOrbs() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-purple-500/30 rounded-full blur-[80px] sm:blur-[100px] animate-float" />
            <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-pink-500/20 rounded-full blur-[100px] sm:blur-[120px] animate-float" style={{ animationDelay: "-2s" }} />
            <div className="absolute top-1/2 left-1/4 sm:left-1/3 w-40 sm:w-64 h-40 sm:h-64 bg-blue-500/20 rounded-full blur-[60px] sm:blur-[80px] animate-float" style={{ animationDelay: "-4s" }} />
        </div>
    )
}

export default function MysticPage() {
    const [activeToolId, setActiveToolId] = useState<string | null>(null)
    const [activeSection, setActiveSection] = useState<string | null>(null)
    const [showPremium, setShowPremium] = useState(false)
    const activeTool = TOOLS.find(t => t.id === activeToolId)

    const renderActiveSection = () => {
        switch (activeSection) {
            case "history":
                return <MysticHistory />
            case "leaderboard":
                return <MysticLeaderboard />
            case "achievements":
                return <MysticAchievements />
            case "about":
                return <AboutMystic />
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a12] text-white relative overflow-hidden font-georgian">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f1a] via-[#1a1025] to-[#0f0a1a]" />
            <StarsBackground />
            <FloatingOrbs />

            {/* Premium Modal */}
            <PremiumUpsell isOpen={showPremium} onClose={() => setShowPremium(false)} />

            {/* Content */}
            <div className="relative z-10">
                {/* Hero Section - ONLY show when nothing is selected */}
                {!activeToolId && !activeSection && (
                    <section className="pt-8 pb-6 sm:pt-12 sm:pb-10 lg:pt-16 lg:pb-12">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                            <div className="text-center space-y-4 sm:space-y-6">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <Wand2 className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                                    <span className="text-xs sm:text-sm text-purple-200">AI მისტიკა</span>
                                    <button
                                        onClick={() => setShowPremium(true)}
                                        className="ml-2"
                                    >
                                        <PremiumBadge />
                                    </button>
                                </div>

                                {/* Title - Responsive */}
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                                        მისტიკური
                                    </span>
                                    <span className="ml-2 sm:ml-3">AI</span>
                                </h1>

                                {/* Subtitle */}
                                <p className="text-sm sm:text-base text-gray-400 max-w-md mx-auto">
                                    ხელოვნური ინტელექტი შეხვდება უძველეს სიბრძნეს
                                </p>

                                {/* Stats - Compact */}
                                <div className="flex justify-center gap-6 sm:gap-8 pt-2">
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl font-bold text-purple-400">8</div>
                                        <div className="text-[10px] sm:text-xs text-gray-500">ინსტრუმენტი</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl font-bold text-pink-400">∞</div>
                                        <div className="text-[10px] sm:text-xs text-gray-500">პასუხი</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl font-bold text-amber-400">AI</div>
                                        <div className="text-[10px] sm:text-xs text-gray-500">ძალა</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Main Content */}
                <section className={activeToolId || activeSection ? "py-4 sm:py-6" : "py-6 sm:py-10"}>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                        {!activeToolId && !activeSection ? (
                            <>
                                {/* Tools Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
                                    {TOOLS.map((tool) => {
                                        const Icon = tool.icon
                                        return (
                                            <button
                                                key={tool.id}
                                                onClick={() => setActiveToolId(tool.id)}
                                                className="group relative p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm 
                                                           hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300
                                                           active:scale-[0.98] hover:scale-[1.02]"
                                            >
                                                {/* Premium indicator */}
                                                {tool.isPremium && (
                                                    <div className="absolute top-2 right-2">
                                                        <Crown className="w-4 h-4 text-amber-400" />
                                                    </div>
                                                )}

                                                {/* Glow effect */}
                                                <div className={`hidden sm:block absolute inset-0 rounded-3xl ${tool.bgGlow} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`} />

                                                <div className="relative z-10 text-center space-y-2 sm:space-y-3">
                                                    {/* Icon */}
                                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br ${tool.gradient} p-0.5`}>
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

                                {/* Feature sections */}
                                <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-8">
                                    {FEATURE_SECTIONS.map((section) => {
                                        const Icon = section.icon
                                        return (
                                            <button
                                                key={section.id}
                                                onClick={() => setActiveSection(section.id)}
                                                className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 
                                                           hover:bg-white/[0.06] transition-all text-center"
                                            >
                                                <Icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-gray-400 mb-1" />
                                                <span className="text-xs sm:text-sm text-gray-400">{section.name}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </>
                        ) : activeSection ? (
                            /* Active Section View */
                            <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Back Button */}
                                <button
                                    onClick={() => setActiveSection(null)}
                                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    <span className="text-sm">უკან</span>
                                </button>

                                {/* Section Content */}
                                <div className="max-w-2xl mx-auto">
                                    {renderActiveSection()}
                                </div>
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

                {/* Disclaimer - Only show when no tool selected */}
                {!activeToolId && !activeSection && (
                    <section className="py-6 sm:py-8 lg:py-10 border-t border-white/5">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                            <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-500/5 border border-amber-500/10">
                                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs sm:text-sm text-gray-500">
                                    ეს ინსტრუმენტები <span className="text-amber-400">გართობისთვისაა</span> და არ უნდა
                                    ჩაითვალოს რეალურ წინასწარმეტყველებად.
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* About Author Section - Only on main page */}
                {!activeToolId && !activeSection && (
                    <section className="py-6 sm:py-8">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
                            <AboutMystic />
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}
