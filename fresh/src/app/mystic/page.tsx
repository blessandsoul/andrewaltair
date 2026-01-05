"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { MagicWand, Moon, Heart, Star, Warning, CaretLeft, Hash, Crown, ClockCounterClockwise, Trophy, Medal, ChatCircle, User, HeartStraight } from "@phosphor-icons/react"
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
import { FloatingParticles } from "@/components/mystic/FloatingParticles"
import { MagicCursor } from "@/components/mystic/MagicCursor"
import { DailyHoroscope } from "@/components/mystic/DailyHoroscope"
import { useFavorites } from "@/hooks/useFavorites"
// NEW EPIC FEATURES
import { InteractiveConstellation } from "@/components/mystic/InteractiveConstellation"
import { LiveMoonPhase } from "@/components/mystic/LiveMoonPhase"
import { MysticQuotes } from "@/components/mystic/MysticQuotes"
import { MysticAmbience } from "@/components/mystic/MysticAmbience"

// Tool definitions
const TOOLS = [
    {
        id: "fortune",
        name: "მისტიკური გადალი",
        shortName: "გადალი",
        description: "AI წინასწარმეტყველება",
        icon: MagicWand,
        color: "#a855f7",
        component: FortuneTeller,
        isPremium: false
    },
    {
        id: "tarot",
        name: "ტაროს კარტები",
        shortName: "ტაროტი",
        description: "კარტების კითხვა",
        icon: MagicWand,
        color: "#6366f1",
        component: TarotCards,
        isPremium: false
    },
    {
        id: "love",
        name: "სიყვარულის კალკულატორი",
        shortName: "სიყვარული",
        description: "თავსებადობის ანალიზი",
        icon: Heart,
        color: "#ec4899",
        component: LoveCalculator,
        isPremium: false
    },
    {
        id: "dream",
        name: "სიზმრების ახსნა",
        shortName: "სიზმრები",
        description: "ფსიქოანალიზი",
        icon: Moon,
        color: "#0ea5e9",
        component: DreamInterpreter,
        isPremium: false
    },
    {
        id: "horoscope",
        name: "დღის ჰოროსკოპი",
        shortName: "ჰოროსკოპი",
        description: "ვარსკვლავების პროგნოზი",
        icon: Star,
        color: "#f59e0b",
        component: Horoscope,
        isPremium: false
    },
    {
        id: "numerology",
        name: "ნუმეროლოგია",
        shortName: "რიცხვები",
        description: "რიცხვების ენერგია",
        icon: Hash,
        color: "#10b981",
        component: Numerology,
        isPremium: false
    },
    {
        id: "moon",
        name: "მთვარის ფაზები",
        shortName: "მთვარე",
        description: "კოსმიური ენერგია",
        icon: Moon,
        color: "#64748b",
        component: MoonPhases,
        isPremium: false
    },
    {
        id: "chat",
        name: "AI მისტიკოსი",
        shortName: "ჩატი",
        description: "პირადი მრჩეველი",
        icon: ChatCircle,
        color: "#d946ef",
        component: MysticChat,
        isPremium: false
    },
]

// Feature sections
const FEATURE_SECTIONS = [
    { id: "history", name: "ისტორია", icon: ClockCounterClockwise, color: "#3b82f6" },
    { id: "leaderboard", name: "რეიტინგი", icon: Trophy, color: "#f59e0b" },
    { id: "achievements", name: "ბეჯები", icon: Medal, color: "#ec4899" },
    { id: "about", name: "ჩემ შესახებ", icon: User, color: "#22c55e" },
]

// WOW Cosmic Background with nebula and stars
function CosmicBackground() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Deep space base */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0d0d20] to-[#0a0a1a]" />

            {/* Cosmic nebula layers */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.15)_0%,transparent_50%)]" />
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(236,72,153,0.12)_0%,transparent_50%)]" />
                <div className="absolute bottom-0 left-1/3 w-full h-full bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
            </div>

            {/* TbStars layer */}
            <div className="absolute inset-0">
                {/* Small stars */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            radial-gradient(1px 1px at 10% 10%, rgba(255,255,255,0.8), transparent),
                            radial-gradient(1px 1px at 20% 50%, rgba(255,255,255,0.6), transparent),
                            radial-gradient(1px 1px at 30% 20%, rgba(255,255,255,0.7), transparent),
                            radial-gradient(1px 1px at 50% 60%, rgba(255,255,255,0.5), transparent),
                            radial-gradient(1px 1px at 70% 30%, rgba(255,255,255,0.6), transparent),
                            radial-gradient(1px 1px at 80% 80%, rgba(255,255,255,0.7), transparent),
                            radial-gradient(1px 1px at 90% 40%, rgba(255,255,255,0.5), transparent),
                            radial-gradient(1.5px 1.5px at 15% 70%, rgba(255,255,255,0.9), transparent),
                            radial-gradient(1.5px 1.5px at 45% 15%, rgba(255,255,255,0.8), transparent),
                            radial-gradient(1.5px 1.5px at 75% 65%, rgba(255,255,255,0.7), transparent),
                            radial-gradient(2px 2px at 25% 35%, rgba(168,85,247,0.9), transparent),
                            radial-gradient(2px 2px at 65% 85%, rgba(236,72,153,0.8), transparent),
                            radial-gradient(2px 2px at 85% 25%, rgba(59,130,246,0.9), transparent)
                        `,
                        backgroundSize: '350px 350px',
                    }}
                />

                {/* Twinkling bright stars */}
                <div className="absolute w-1 h-1 bg-white rounded-full top-[15%] left-[25%] animate-pulse shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]" style={{ animationDuration: '2s' }} />
                <div className="absolute w-1.5 h-1.5 bg-purple-200 rounded-full top-[35%] right-[20%] animate-pulse shadow-[0_0_15px_3px_rgba(168,85,247,0.6)]" style={{ animationDuration: '3s' }} />
                <div className="absolute w-1 h-1 bg-blue-200 rounded-full top-[60%] left-[15%] animate-pulse shadow-[0_0_10px_2px_rgba(59,130,246,0.7)]" style={{ animationDuration: '2.5s' }} />
                <div className="absolute w-1.5 h-1.5 bg-pink-200 rounded-full top-[80%] right-[35%] animate-pulse shadow-[0_0_12px_2px_rgba(236,72,153,0.6)]" style={{ animationDuration: '3.5s' }} />
                <div className="absolute w-1 h-1 bg-white rounded-full top-[25%] right-[45%] animate-pulse shadow-[0_0_8px_2px_rgba(255,255,255,0.7)]" style={{ animationDuration: '2.2s' }} />
            </div>

            {/* Subtle vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,26,0.4)_70%,rgba(10,10,26,0.8)_100%)]" />
        </div>
    )
}

export default function MysticPage() {
    const [activeToolId, setActiveToolId] = useState<string | null>(null)
    const [activeSection, setActiveSection] = useState<string | null>(null)
    const [showPremium, setShowPremium] = useState(false)
    const activeTool = TOOLS.find(t => t.id === activeToolId)
    const containerRef = useRef<HTMLDivElement>(null)
    const { favorites, toggleFavorite, isFavorite } = useFavorites()


    // Автоскролл вверх при переключении блоков
    useEffect(() => {
        if (activeToolId || activeSection) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [activeToolId, activeSection])

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
        <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden font-georgian">
            {/* WOW Cosmic Background */}
            <CosmicBackground />

            {/* Interactive Star Constellation - TbStars connect when mouse hovers! */}
            <InteractiveConstellation />

            {/* Floating Particles Effect */}
            <FloatingParticles count={25} />

            {/* Magic Cursor Trail */}
            <MagicCursor />

            {/* Ambient Sound Controls */}
            <MysticAmbience />

            {/* Live Moon Phase Widget */}
            <LiveMoonPhase />

            {/* Premium Modal */}
            <PremiumUpsell isOpen={showPremium} onClose={() => setShowPremium(false)} />

            {/* Daily Horoscope Popup */}
            <DailyHoroscope />

            {/* Content */}
            <div className="relative z-10">
                {/* Full Viewport Hero Section */}
                {!activeToolId && !activeSection && (
                    <section className="h-screen flex flex-col items-center justify-center relative px-4">
                        <div className="container mx-auto max-w-5xl">
                            <div className="text-center space-y-8">

                                {/* Glowing badge */}
                                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full 
                                              bg-gradient-to-r from-purple-900/40 via-purple-800/30 to-purple-900/40
                                              border border-purple-500/30 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                                    <MagicWand size={20} weight="duotone" className="text-purple-400" />
                                    <span className="text-sm font-medium bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                                        AI მისტიკა
                                    </span>
                                    <button onClick={() => setShowPremium(true)} className="hover:scale-105 transition-transform">
                                        <PremiumBadge />
                                    </button>
                                </div>

                                {/* WOW Gradient Title */}
                                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight">
                                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent
                                                   drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                                        მისტიკური
                                    </span>
                                    <span className="ml-3 sm:ml-4 text-white">AI</span>
                                </h1>

                                {/* Subtitle */}
                                <p className="text-lg sm:text-xl text-gray-300 max-w-lg mx-auto leading-relaxed">
                                    ხელოვნური ინტელექტი შეხვდება <span className="text-purple-400">უძველეს სიბრძნეს</span>
                                </p>

                                {/* Premium Stats with Icons */}
                                <div className="flex justify-center gap-8 sm:gap-12 pt-8">
                                    <div className="text-center group">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2 rounded-2xl 
                                                      bg-gradient-to-br from-purple-500/20 to-purple-900/30
                                                      border border-purple-500/30 flex items-center justify-center
                                                      shadow-[0_0_25px_rgba(139,92,246,0.2)]
                                                      group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-2xl sm:text-3xl font-bold text-purple-400">8</span>
                                        </div>
                                        <div className="text-sm text-gray-400">AI ინსტრუმენტი</div>
                                    </div>
                                    <div className="text-center group">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2 rounded-2xl 
                                                      bg-gradient-to-br from-pink-500/20 to-pink-900/30
                                                      border border-pink-500/30 flex items-center justify-center
                                                      shadow-[0_0_25px_rgba(236,72,153,0.2)]
                                                      group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-2xl sm:text-3xl font-bold text-pink-400">∞</span>
                                        </div>
                                        <div className="text-sm text-gray-400">უსასრულო პასუხი</div>
                                    </div>
                                    <div className="text-center group">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2 rounded-2xl 
                                                      bg-gradient-to-br from-amber-500/20 to-amber-900/30
                                                      border border-amber-500/30 flex items-center justify-center
                                                      shadow-[0_0_25px_rgba(245,158,11,0.2)]
                                                      group-hover:scale-110 transition-transform duration-300">
                                            <MagicWand size={28} weight="duotone" className="text-amber-400" />
                                        </div>
                                        <div className="text-sm text-gray-400">AI ძალა</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Scroll Indicator - raised higher */}
                        <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                            <span className="text-xs text-gray-400 tracking-wider uppercase">გადაახვიე</span>
                            <div className="w-6 h-10 rounded-full border-2 border-purple-500/40 flex items-start justify-center p-2">
                                <div className="w-1.5 h-2.5 bg-purple-400 rounded-full animate-pulse" />
                            </div>
                        </div>
                    </section>
                )}

                {/* Main Content */}
                <section className={activeToolId || activeSection ? "py-4 sm:py-6" : "py-6 sm:py-10"}>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                        {!activeToolId && !activeSection ? (
                            <>
                                {/* Mystical Quotes - Auto rotating wisdom */}
                                <MysticQuotes />

                                {/* WOW Premium Tools Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-10">
                                    {TOOLS.map((tool) => {
                                        const Icon = tool.icon
                                        const isFav = isFavorite(tool.id)
                                        return (
                                            <div key={tool.id} className="relative">
                                                {/* Favorite Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        e.stopPropagation()
                                                        toggleFavorite(tool.id)
                                                    }}
                                                    className={`absolute top-3 left-3 z-20 p-2 rounded-full 
                                                               transition-all duration-200 hover:scale-110
                                                               ${isFav
                                                            ? 'bg-pink-500/30 border-pink-500/50'
                                                            : 'bg-white/5 border-white/10 opacity-0 group-hover:opacity-100'
                                                        } border`}
                                                    title={isFav ? "წაშლა ფავორიტებიდან" : "დამატება ფავორიტებში"}
                                                >
                                                    <HeartStraight
                                                        size={14}
                                                        weight={isFav ? "fill" : "regular"}
                                                        className={isFav ? "text-pink-400" : "text-gray-400"}
                                                    />
                                                </button>

                                                <Link
                                                    href={`/mystic/${tool.id}`}
                                                    className="group relative p-6 sm:p-7 rounded-2xl overflow-hidden
                                                               transition-all duration-300 hover:scale-[1.02] block mystic-card-glow"
                                                    style={{
                                                        background: `linear-gradient(145deg, ${tool.color}12 0%, rgba(12,12,20,0.95) 50%, ${tool.color}08 100%)`,
                                                        border: `1px solid ${isFav ? tool.color + '50' : tool.color + '25'}`,
                                                        boxShadow: isFav
                                                            ? `0 4px 20px -5px ${tool.color}40, 0 0 0 1px ${tool.color}20`
                                                            : `0 4px 20px -5px ${tool.color}20`,
                                                    }}
                                                >
                                                    {/* Hover glow */}
                                                    <div
                                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                                                        style={{
                                                            boxShadow: `inset 0 0 30px ${tool.color}20, 0 0 40px ${tool.color}25`,
                                                        }}
                                                    />

                                                    {/* Premium badge */}
                                                    {tool.isPremium && (
                                                        <div className="absolute top-3 right-3 z-10">
                                                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
                                                                <Crown size={10} weight="fill" className="text-amber-400" />
                                                                <span className="text-[9px] font-bold text-amber-400">PRO</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Favorite indicator glow */}
                                                    {isFav && (
                                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
                                                    )}

                                                    <div className="relative z-10 text-center space-y-4">
                                                        {/* Icon with glow */}
                                                        <div
                                                            className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex items-center justify-center
                                                                      transition-transform duration-300 group-hover:scale-110"
                                                            style={{
                                                                backgroundColor: tool.color + '20',
                                                                boxShadow: `0 0 25px ${tool.color}30`,
                                                            }}
                                                        >
                                                            <Icon size={28} weight="duotone" style={{ color: tool.color }} />
                                                        </div>

                                                        {/* Title */}
                                                        <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-opacity-100">
                                                            <span className="sm:hidden">{tool.shortName}</span>
                                                            <span className="hidden sm:inline">{tool.name}</span>
                                                        </h3>

                                                        {/* Description */}
                                                        <p className="text-xs text-gray-400 hidden sm:block leading-relaxed">{tool.description}</p>
                                                    </div>
                                                </Link>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* WOW Feature Sections */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {FEATURE_SECTIONS.map((section) => {
                                        const Icon = section.icon
                                        return (
                                            <button
                                                key={section.id}
                                                onClick={() => setActiveSection(section.id)}
                                                className="group p-5 rounded-xl text-center transition-all duration-300 hover:scale-[1.02]"
                                                style={{
                                                    background: `linear-gradient(145deg, ${section.color}10 0%, rgba(12,12,20,0.9) 100%)`,
                                                    border: `1px solid ${section.color}20`,
                                                    boxShadow: `0 4px 15px -5px ${section.color}15`,
                                                }}
                                            >
                                                <Icon
                                                    size={26}
                                                    weight="duotone"
                                                    className="mx-auto mb-3 transition-transform duration-300 group-hover:scale-110"
                                                    style={{ color: section.color }}
                                                />
                                                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                                                    {section.name}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </>
                        ) : activeSection ? (
                            /* Active Section View */
                            <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Back Button */}
                                <button
                                    onClick={() => setActiveSection(null)}
                                    className="group flex items-center gap-2 px-4 py-2.5 rounded-xl
                                               bg-[#1a1a24] border border-[#2a2a3a]
                                               hover:border-[#3a3a4a] hover:bg-[#1e1e2a]
                                               transition-all duration-200"
                                >
                                    <CaretLeft size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">უკან</span>
                                </button>

                                {/* Section Content */}
                                <div className="max-w-2xl mx-auto">
                                    {renderActiveSection()}
                                </div>
                            </div>
                        ) : (
                            /* Active Tool View */
                            <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Back Button + Tool Title */}
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <button
                                        onClick={() => setActiveToolId(null)}
                                        className="group w-11 h-11 sm:w-12 sm:h-12 rounded-xl
                                                   bg-[#1a1a24] border border-[#2a2a3a]
                                                   hover:border-[#3a3a4a] hover:bg-[#1e1e2a]
                                                   transition-all duration-200 flex items-center justify-center flex-shrink-0"
                                    >
                                        <CaretLeft size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                                    </button>

                                    <div
                                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: activeTool?.color + '20' }}
                                    >
                                        {activeTool && <activeTool.icon size={24} weight="duotone" style={{ color: activeTool.color }} />}
                                    </div>

                                    <div className="min-w-0">
                                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent truncate">{activeTool?.name}</h2>
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
                            <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <Warning size={20} weight="fill" className="text-amber-500 flex-shrink-0 mt-0.5" />
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
        </div >
    )
}
