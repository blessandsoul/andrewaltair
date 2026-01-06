"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TbArrowLeft, TbStar, TbExternalLink, TbMessage, TbPhoto as TbPhoto, TbVideo, TbMusic, TbCode, TbSearch, TbBolt, TbSparkles, TbPresentation, TbPalette, TbFileText, TbTrendingUp, TbLanguage, TbMicrophone, TbFileSearch, TbMail, TbHeadphones, TbCurrencyDollar, TbCamera, TbWorld, TbChartBar, TbSchool, TbTerminal, TbBook, TbUser, TbCompass, TbScale, TbWallet, TbBuildingBank, TbDeviceGamepad2, TbBox, TbWand, TbClock, TbHeart, TbShare, TbArrowUpRight, TbEye, TbThumbUp, TbThumbDown, TbCircleCheck, TbPlayerPlay, TbTarget, TbChevronDown, TbChevronUp, TbSend, TbBell, TbArrowsShuffle, TbUsers, TbTrendingDown, TbAlertCircle, TbGift, TbRocket, TbAward, TbBookmark, TbBrandYoutube, TbHelp, TbX } from "react-icons/tb"
import { Comments } from "@/components/interactive/Comments"
import { ShareButtons } from "@/components/interactive/ShareButtons"
import { ReactionBar } from "@/components/interactive/ReactionBar"
import { cn } from "@/lib/utils"

// Tools will be fetched from API
// Category icons mapping
const categoryIcons: Record<string, any> = {
    "ჩატბოტები": TbMessage,
    "სურათები": TbPhoto,
    "ვიდეო": TbVideo,
    "აუდიო": TbMusic,
    "კოდი": TbCode,
    "ძებნა": TbSearch,
    "ავტომატიზაცია": TbBolt,
    "პროდუქტიულობა": TbSparkles,
    "პრეზენტაცია": TbPresentation,
    "დიზაინი": TbPalette,
    "კონტენტი": TbFileText,
    "SEO": TbTrendingUp,
    "წერა": TbFileText,
    "თარგმანი": TbLanguage,
    "ტრანსკრიფცია": TbMicrophone,
    "დოკუმენტები": TbFileSearch,
    "ელფოსტა": TbMail,
    "მომხმარებელი": TbHeadphones,
    "გაყიდვები": TbCurrencyDollar,
    "ფოტო რედაქცია": TbCamera,
    "ვებსაიტი": TbWorld,
    "ანალიტიკა": TbChartBar,
    "განათლება": TbSchool,
    "დეველოპერი": TbTerminal,
    "კვლევა": TbBook,
    "ავატარი": TbUser,
    "ბრაუზერი": TbCompass,
    "სამართალი": TbScale,
    "ფინანსები": TbWallet,
    "No-TbCode": TbBuildingBank,
    "თამაშები": TbDeviceGamepad2,
    "3D": TbBox,
    "VFX": TbWand,
    "მარკეტინგი": TbTrendingUp,
    "სუბტიტრები": TbMicrophone,
    "კალენდარი": TbClock,
    "ჩატბოტი": TbMessage,
    "AI აგენტები": TbBolt,
    "AI Labs": TbTerminal,
    "რეკლამა": TbCurrencyDollar,
    "ML პლატფორმა": TbTerminal,
    "HR": TbUser,
}

// Category colors
const categoryColors: Record<string, string> = {
    "ჩატბოტები": "#6366f1",
    "სურათები": "#ec4899",
    "ვიდეო": "#f43f5e",
    "აუდიო": "#8b5cf6",
    "კოდი": "#22d3ee",
    "ძებნა": "#10b981",
    "ავტომატიზაცია": "#f59e0b",
    "პროდუქტიულობა": "#6366f1",
    "პრეზენტაცია": "#f97316",
    "დიზაინი": "#a855f7",
    "კონტენტი": "#14b8a6",
    "SEO": "#84cc16",
    "წერა": "#0ea5e9",
    "თარგმანი": "#06b6d4",
    "ტრანსკრიფცია": "#d946ef",
    "დოკუმენტები": "#64748b",
    "ელფოსტა": "#ef4444",
    "მომხმარებელი": "#22c55e",
    "გაყიდვები": "#eab308",
    "ფოტო რედაქცია": "#f472b6",
    "ვებსაიტი": "#3b82f6",
    "ანალიტიკა": "#10b981",
    "განათლება": "#8b5cf6",
    "დეველოპერი": "#0891b2",
    "კვლევა": "#7c3aed",
    "ავატარი": "#ec4899",
    "ბრაუზერი": "#f97316",
    "სამართალი": "#78716c",
    "ფინანსები": "#059669",
    "No-TbCode": "#8b5cf6",
    "თამაშები": "#dc2626",
    "3D": "#0ea5e9",
    "VFX": "#f472b6",
    "მარკეტინგი": "#f59e0b",
    "სუბტიტრები": "#a855f7",
    "კალენდარი": "#10b981",
    "ჩატბოტი": "#6366f1",
    "AI აგენტები": "#f43f5e",
    "AI Labs": "#22d3ee",
    "რეკლამა": "#eab308",
    "ML პლატფორმა": "#0891b2",
    "HR": "#7c3aed",
}

// Pricing labels
const pricingLabels: Record<string, { label: string; color: string; description: string }> = {
    "free": { label: "უფასო", color: "bg-green-500/10 text-green-600 dark:text-green-400", description: "სრულიად უფასოდ ხელმისაწვდომი" },
    "freemium": { label: "Freemium", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", description: "უფასო ვერსია + პრემიუმ ფუნქციები" },
    "paid": { label: "ფასიანი", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400", description: "მოითხოვს გადახდას" },
}

// Generate pros/cons based on tool data
const generateProsConsData = (tool: any) => {
    const basePros = [
        tool.pricing === "free" ? "სრულიად უფასო" : tool.pricing === "freemium" ? "უფასო ვერსია ხელმისაწვდომია" : null,
        tool.rating >= 4 ? "მაღალი რეიტინგი მომხმარებლებისგან" : null,
        tool.featured ? "რეკომენდებული ჩვენი გუნდის მიერ" : null,
        "მარტივი ინტერფეისი",
        "რეგულარული განახლებები"
    ].filter(Boolean)

    const baseCons = [
        tool.pricing === "paid" ? "მოითხოვს გადახდას" : null,
        "ზოგიერთ ფუნქციას სჭირდება პრემიუმი",
        "შეზღუდული უფასო ვერსია"
    ].filter(Boolean)

    return {
        pros: basePros.slice(0, 4),
        cons: baseCons.slice(0, 3)
    }
}

// Generate FAQ data
const generateFAQData = (tool: any) => [
    {
        question: `რა არის ${tool.name}?`,
        answer: tool.description
    },
    {
        question: `${tool.name} უფასოა?`,
        answer: tool.pricing === "free"
            ? "დიახ, ეს სერვისი სრულიად უფასოა."
            : tool.pricing === "freemium"
                ? "სერვისს აქვს უფასო ვერსია შეზღუდული ფუნქციებით და ფასიანი პრემიუმ გეგმა."
                : "ეს ფასიანი სერვისია. შეამოწმეთ ოფიციალური საიტი ფასების შესახებ ინფორმაციისთვის."
    },
    {
        question: `როგორ დავიწყო ${tool.name}-ის გამოყენება?`,
        answer: `ეწვიეთ ${tool.name}-ის ოფიციალურ საიტს, შექმენით ანგარიში და დაიწყეთ სერვისის გამოყენება. უმეტეს შემთხვევაში, რეგისტრაცია მარტივია და რამდენიმე წუთს საჭიროებს.`
    },
    {
        question: `რა ალტერნატივები არსებობს?`,
        answer: `ნახეთ "მსგავსი ინსტრუმენტები" სექცია ქვემოთ იმავე კატეგორიის სხვა AI სერვისების სანახავად.`
    }
]

// Get logo URL
const getLogoUrl = (tool: any) => {
    if (tool.logo && tool.logo.includes('favicon.ico')) {
        try {
            const url = new URL(tool.url)
            return `https://icons.duckduckgo.com/ip3/${url.hostname}.ico`
        } catch {
            return tool.logo
        }
    }
    return tool.logo
}

// Get fallback logo URL
const getFallbackLogoUrl = (tool: any) => {
    try {
        const url = new URL(tool.url)
        return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`
    } catch {
        return tool.logo
    }
}

// Get DuckDuckGo icon URL
const getDuckDuckGoIcon = (tool: any) => {
    try {
        const url = new URL(tool.url)
        return `https://icons.duckduckgo.com/ip3/${url.hostname}.ico`
    } catch {
        return null
    }
}

// ToolLogo component
const ToolLogo = ({ tool, size = 48, className = "" }: { tool: any, size?: number, className?: string }) => {
    const [imgSrc, setImgSrc] = useState(getLogoUrl(tool))
    const [fallbackLevel, setFallbackLevel] = useState(0)

    const handleError = () => {
        if (fallbackLevel === 0) {
            const ddgIcon = getDuckDuckGoIcon(tool)
            if (ddgIcon) {
                setImgSrc(ddgIcon)
                setFallbackLevel(1)
                return
            }
        }
        if (fallbackLevel <= 1) {
            setImgSrc(getFallbackLogoUrl(tool))
            setFallbackLevel(2)
            return
        }
        setFallbackLevel(3)
    }

    if (fallbackLevel === 3) {
        const initial = tool.name.charAt(0).toUpperCase()
        const color = categoryColors[tool.category] || '#6366f1'
        return (
            <div
                className={`flex items-center justify-center font-bold text-white rounded-2xl ${className}`}
                style={{
                    width: size,
                    height: size,
                    backgroundColor: color,
                    fontSize: size * 0.4
                }}
            >
                {initial}
            </div>
        )
    }

    return (
        <img
            src={imgSrc}
            alt={tool.name}
            width={size}
            height={size}
            className={`object-contain ${className}`}
            onError={handleError}
        />
    )
}

// =========================================
// ENGAGEMENT COMPONENTS
// =========================================

// 1. Live Viewers Counter
function LiveViewers() {
    const [viewers, setViewers] = useState(0)

    useEffect(() => {
        // Simulate random viewers
        const base = Math.floor(Math.random() * 20) + 5
        setViewers(base)

        const interval = setInterval(() => {
            setViewers(prev => {
                const change = Math.random() > 0.5 ? 1 : -1
                return Math.max(1, prev + change)
            })
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex items-center gap-2 text-sm">
            <div className="relative">
                <TbEye className="w-4 h-4 text-green-500" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <span className="text-muted-foreground">
                <span className="font-semibold text-foreground">{viewers}</span> ადამიანი უყურებს ახლა
            </span>
        </div>
    )
}

// 2. User Rating Component
function UserRating({ toolId, initialRating }: { toolId: string, initialRating: number }) {
    const [userRating, setUserRating] = useState<number | null>(null)
    const [hoveredRating, setHoveredRating] = useState<number | null>(null)
    const [totalRatings, setTotalRatings] = useState(Math.floor(Math.random() * 500) + 100)
    const [averageRating, setAverageRating] = useState(initialRating)

    useEffect(() => {
        const saved = localStorage.getItem(`tool-rating-${toolId}`)
        if (saved) setUserRating(parseInt(saved))
    }, [toolId])

    const handleRate = (rating: number) => {
        setUserRating(rating)
        localStorage.setItem(`tool-rating-${toolId}`, rating.toString())
        setTotalRatings(prev => prev + 1)
        // Recalculate average (simplified)
        setAverageRating(prev => ((prev * (totalRatings - 1)) + rating) / totalRatings)
    }

    return (
        <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <TbStar className="w-5 h-5 text-yellow-500" />
                    შეაფასე ინსტრუმენტი
                </h3>

                <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => handleRate(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(null)}
                                className="transition-transform hover:scale-110"
                            >
                                <TbStar
                                    className={cn(
                                        "w-8 h-8 transition-colors",
                                        (hoveredRating !== null ? star <= hoveredRating : star <= (userRating || 0))
                                            ? "text-yellow-500 fill-yellow-500"
                                            : "text-muted-foreground"
                                    )}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="text-sm text-muted-foreground">
                        {userRating ? (
                            <span className="text-green-500 flex items-center gap-1">
                                <TbCircleCheck className="w-4 h-4" />
                                შენი შეფასება: {userRating}/5
                            </span>
                        ) : (
                            "დააჭირე ვარსკვლავს"
                        )}
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
                    საშუალო: <span className="font-semibold text-foreground">{averageRating.toFixed(1)}</span> / 5
                    <span className="ml-2">({totalRatings} შეფასება)</span>
                </div>
            </CardContent>
        </Card>
    )
}

// 3. Usage Poll Component
function UsagePoll({ toolId }: { toolId: string }) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [votes, setVotes] = useState({
        using: Math.floor(Math.random() * 200) + 50,
        wantToTry: Math.floor(Math.random() * 150) + 30,
        tried: Math.floor(Math.random() * 100) + 20
    })

    useEffect(() => {
        const saved = localStorage.getItem(`tool-poll-${toolId}`)
        if (saved) setSelectedOption(saved)
    }, [toolId])

    const total = votes.using + votes.wantToTry + votes.tried

    const handleVote = (option: string) => {
        if (selectedOption) return // Already voted

        setSelectedOption(option)
        localStorage.setItem(`tool-poll-${toolId}`, option)
        setVotes(prev => ({
            ...prev,
            [option]: prev[option as keyof typeof prev] + 1
        }))
    }

    const options = [
        { key: "using", label: "ვიყენებ 💪", icon: TbCircleCheck, color: "bg-green-500" },
        { key: "wantToTry", label: "მინდა ვცადო 🤔", icon: TbTarget, color: "bg-blue-500" },
        { key: "tried", label: "ვცადე 👀", icon: TbEye, color: "bg-purple-500" }
    ]

    return (
        <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <TbUsers className="w-5 h-5 text-primary" />
                    რა სტატუსში ხარ?
                </h3>

                <div className="space-y-3">
                    {options.map((option) => {
                        const count = votes[option.key as keyof typeof votes]
                        const percentage = ((count / (total + (selectedOption ? 1 : 0))) * 100).toFixed(0)
                        const isSelected = selectedOption === option.key

                        return (
                            <button
                                key={option.key}
                                onClick={() => handleVote(option.key)}
                                disabled={!!selectedOption}
                                className={cn(
                                    "w-full relative overflow-hidden rounded-xl p-4 text-left transition-all",
                                    isSelected
                                        ? "ring-2 ring-primary bg-primary/10"
                                        : selectedOption
                                            ? "bg-muted/50"
                                            : "bg-muted hover:bg-muted/80 hover:scale-[1.02]"
                                )}
                            >
                                {selectedOption && (
                                    <div
                                        className={cn("absolute inset-y-0 left-0 opacity-20", option.color)}
                                        style={{ width: `${percentage}%` }}
                                    />
                                )}
                                <div className="relative flex items-center justify-between">
                                    <span className="font-medium">{option.label}</span>
                                    {selectedOption && (
                                        <span className="text-sm font-semibold">{percentage}%</span>
                                    )}
                                </div>
                            </button>
                        )
                    })}
                </div>

                <div className="mt-4 text-sm text-muted-foreground text-center">
                    {total + (selectedOption ? 1 : 0)} ხმა
                </div>
            </CardContent>
        </Card>
    )
}

// 4. Pros and Cons Component
function ProsConsList({ tool }: { tool: any }) {
    const { pros, cons } = generateProsConsData(tool)

    return (
        <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <TbScale className="w-5 h-5" />
                    დადებითი და უარყოფითი
                </h3>

                <div className="grid gap-6 sm:grid-cols-2">
                    {/* Pros */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-green-500 flex items-center gap-2">
                            <TbThumbUp className="w-4 h-4" />
                            დადებითი
                        </h4>
                        <ul className="space-y-2">
                            {pros.map((pro, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <TbCircleCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{pro}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Cons */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-red-500 flex items-center gap-2">
                            <TbThumbDown className="w-4 h-4" />
                            უარყოფითი
                        </h4>
                        <ul className="space-y-2">
                            {cons.map((con, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <TbX className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    <span>{con}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// 5. FAQ Section
function FAQSection({ tool }: { tool: any }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const faqs = generateFAQData(tool)

    return (
        <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <TbHelp className="w-5 h-5 text-primary" />
                    ხშირად დასმული კითხვები
                </h3>

                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-border rounded-xl overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                            >
                                <span className="font-medium">{faq.question}</span>
                                {openIndex === index ? (
                                    <TbChevronUp className="w-5 h-5 text-muted-foreground" />
                                ) : (
                                    <TbChevronDown className="w-5 h-5 text-muted-foreground" />
                                )}
                            </button>
                            {openIndex === index && (
                                <div className="px-4 pb-4 text-muted-foreground text-sm animate-in slide-in-from-top-2">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

// 6. Popularity Chart (simplified bar)
function PopularityChart({ tool }: { tool: any }) {
    const [data] = useState(() => {
        // Generate fake weekly data
        return Array.from({ length: 7 }, (_, i) => ({
            day: ['ო', 'ს', 'ს', 'ო', 'ხ', 'პ', 'შ'][i],
            value: Math.floor(Math.random() * 80) + 20
        }))
    })

    const max = Math.max(...data.map(d => d.value))

    return (
        <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <TbTrendingUp className="w-5 h-5 text-green-500" />
                    პოპულარობა (ბოლო 7 დღე)
                </h3>

                <div className="flex items-end justify-between gap-2 h-32">
                    {data.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div
                                className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-t-lg transition-all hover:from-primary hover:to-primary/80"
                                style={{ height: `${(d.value / max) * 100}%` }}
                            />
                            <span className="text-xs text-muted-foreground">{d.day}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">ტრენდი:</span>
                    <span className="text-green-500 flex items-center gap-1 font-medium">
                        <TbTrendingUp className="w-4 h-4" />
                        +12% ამ კვირაში
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}

// 7. TbVideo Tutorial Placeholder
function VideoTutorial({ tool }: { tool: any }) {
    const [showVideo, setShowVideo] = useState(false)

    return (
        <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-0">
                {!showVideo ? (
                    <button
                        onClick={() => setShowVideo(true)}
                        className="relative w-full aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group"
                    >
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                        <div className="relative z-10 text-center space-y-4">
                            <div className="w-20 h-20 mx-auto rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                <TbPlayerPlay className="w-12 h-12 text-primary ml-1" />
                            </div>
                            <div>
                                <p className="font-bold text-lg">ვიდეო ტუტორიალი</p>
                                <p className="text-sm text-muted-foreground">დააჭირე სანახავად</p>
                            </div>
                        </div>
                    </button>
                ) : (
                    <div className="aspect-video bg-black flex items-center justify-center">
                        <div className="text-center text-white/60">
                            <TbBrandYoutube className="w-16 h-16 mx-auto mb-4" />
                            <p>ვიდეო ჩაირთვება მალე</p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={() => setShowVideo(false)}
                            >
                                დახურვა
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// 8. Alternatives Cards (Modern Grid)
function AlternativesCards({ alternatives, categoryColor }: { alternatives: any[], categoryColor: string }) {
    if (alternatives.length === 0) return null

    return (
        <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <TbArrowsShuffle className="w-5 h-5" style={{ color: categoryColor }} />
                    ალტერნატივები
                </h3>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {alternatives.slice(0, 6).map((alt) => (
                        <Link key={alt.id} href={`/tools/${alt.id}`}>
                            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                                            <ToolLogo tool={alt} size={48} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">
                                                {alt.name}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge className={cn("text-xs px-2 py-0.5", pricingLabels[alt.pricing]?.color)}>
                                                    {pricingLabels[alt.pricing]?.label}
                                                </Badge>
                                                <span className="flex items-center gap-1 text-xs">
                                                    <TbStar className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                    {alt.rating}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {alt.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

// 9. Subscribe to Updates
function SubscribeUpdates({ toolName }: { toolName: string }) {
    const [email, setEmail] = useState("")
    const [subscribed, setSubscribed] = useState(false)

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        if (email) {
            setSubscribed(true)
        }
    }

    if (subscribed) {
        return (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500/10 to-green-500/5">
                <CardContent className="p-6 text-center">
                    <TbCircleCheck className="w-12 h-12 mx-auto text-green-500 mb-4" />
                    <h3 className="font-bold text-lg">გამოწერილია!</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        მიიღებ შეტყობინებას {toolName}-ის განახლებებზე
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <TbBell className="w-5 h-5 text-primary" />
                    გამოიწერე განახლებები
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    მიიღე შეტყობინება როცა {toolName} განახლდება
                </p>

                <form onSubmit={handleSubscribe} className="flex gap-2">
                    <Input
                        type="email"
                        placeholder="შეიყვანე ელფოსტა"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1"
                        required
                    />
                    <Button type="submit">
                        <TbBell className="w-4 h-4 mr-2" />
                        გამოწერა
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

// 10. Tool Collection / My Arsenal
function AddToCollection({ toolId, toolName }: { toolId: string, toolName: string }) {
    const [inCollection, setInCollection] = useState(false)

    useEffect(() => {
        const collection = JSON.parse(localStorage.getItem("ai-arsenal") || "[]")
        setInCollection(collection.includes(toolId))
    }, [toolId])

    const toggleCollection = () => {
        const collection = JSON.parse(localStorage.getItem("ai-arsenal") || "[]")
        if (inCollection) {
            const updated = collection.filter((id: string) => id !== toolId)
            localStorage.setItem("ai-arsenal", JSON.stringify(updated))
            setInCollection(false)
        } else {
            collection.push(toolId)
            localStorage.setItem("ai-arsenal", JSON.stringify(collection))
            setInCollection(true)
        }
    }

    return (
        <Button
            variant={inCollection ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={toggleCollection}
        >
            <TbBookmark className={cn("w-4 h-4", inCollection && "fill-current")} />
            {inCollection ? "შენახულია" : "შენახვა"}
        </Button>
    )
}

// =========================================
// MAIN PAGE COMPONENT
// =========================================

export default function ToolDetailPage() {
    const params = useParams()
    const toolId = params.id as string
    const [toolsData, setToolsData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Fetch tools from API
    useEffect(() => {
        async function fetchTools() {
            try {
                const res = await fetch('/api/tools?limit=2000')
                if (res.ok) {
                    const data = await res.json()
                    setToolsData(data.tools || [])
                }
            } catch (error) {
                console.error('Error fetching tools:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchTools()
    }, [])

    // Track tool view
    useEffect(() => {
        if (toolId) {
            fetch(`/api/tools/${toolId}/view`, {
                method: 'POST'
            }).catch(err => console.error('Failed to track view:', err))
        }
    }, [toolId])

    const tool = toolsData.find(t => t.id === toolId)

    // Related tools from same category
    const relatedTools = useMemo(() => {
        if (!tool) return []
        return toolsData
            .filter(t => t.category === tool.category && t.id !== tool.id)
            .slice(0, 6)
    }, [tool, toolsData])

    // Sample reactions data
    const sampleReactions = {
        fire: Math.floor(Math.random() * 100) + 20,
        love: Math.floor(Math.random() * 80) + 15,
        mindblown: Math.floor(Math.random() * 60) + 10,
        applause: Math.floor(Math.random() * 40) + 5,
        insightful: Math.floor(Math.random() * 30) + 5
    }

    // Show loading while fetching tools
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-muted-foreground">იტვირთება...</p>
                </div>
            </div>
        )
    }

    if (!tool) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
                        <TbSearch className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold">ინსტრუმენტი ვერ მოიძებნა</h1>
                    <p className="text-muted-foreground">
                        სამწუხაროდ, მოთხოვნილი AI ინსტრუმენტი არ არსებობს.
                    </p>
                    <Button asChild>
                        <Link href="/tools">
                            <TbArrowLeft className="w-4 h-4 mr-2" />
                            ინსტრუმენტებზე დაბრუნება
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    const CategoryIcon = categoryIcons[tool.category] || TbSparkles
    const pricing = pricingLabels[tool.pricing] || pricingLabels["freemium"]
    const categoryColor = categoryColors[tool.category] || "#6366f1"

    return (
        <div className="min-h-screen bg-background">
            {/* Compact Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
                <div className="container mx-auto px-4 py-6 relative">
                    {/* Back Button */}
                    <Link href="/tools">
                        <Button variant="ghost" size="sm" className="mb-4">
                            <TbArrowLeft className="w-4 h-4 mr-2" />
                            უკან
                        </Button>
                    </Link>

                    {/* Compact Tool Header */}
                    <div className="max-w-5xl mx-auto">
                        <Card className="border-0 shadow-xl">
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row gap-4 items-start">
                                    {/* Logo */}
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex items-center justify-center flex-shrink-0 shadow-md">
                                        <ToolLogo tool={tool} size={64} />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <Badge
                                                className="text-xs px-2 py-0.5"
                                                style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
                                            >
                                                <CategoryIcon className="w-3 h-3 mr-1" />
                                                {tool.category}
                                            </Badge>
                                            <Badge className={cn("text-xs px-2 py-0.5", pricing.color)}>
                                                {pricing.label}
                                            </Badge>
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <TbStar
                                                        key={i}
                                                        className={cn(
                                                            "w-3.5 h-3.5",
                                                            i < tool.rating ? "fill-yellow-500 text-yellow-500" : "fill-muted text-muted"
                                                        )}
                                                    />
                                                ))}
                                                <span className="text-xs text-muted-foreground ml-1">{tool.rating}/5</span>
                                            </div>
                                        </div>

                                        <h1 className="text-xl sm:text-2xl font-bold mb-2">{tool.name}</h1>

                                        <p className="text-muted-foreground text-sm mb-3 line-clamp-1">
                                            {tool.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <a href={tool.url} target="_blank" rel="noopener noreferrer">
                                                <Button size="sm" className="gap-1.5">
                                                    <TbExternalLink className="w-3.5 h-3.5" />
                                                    ვებსაიტი
                                                </Button>
                                            </a>
                                            <AddToCollection toolId={tool.id} toolName={tool.name} />
                                        </div>

                                        <ShareButtons
                                            url={`https://andrewaltair.ge/tools/${tool.id}`}
                                            title={`${tool.name} - AI ინსტრუმენტი`}
                                        />
                                    </div>
                                </div>

                                {/* Compact Stats */}
                                <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <TbEye className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">{tool.views || 0} ნახვა</span>
                                    </div>
                                    <LiveViewers />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <ProsConsList tool={tool} />
                            <FAQSection tool={tool} />
                            <VideoTutorial tool={tool} />
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-6 space-y-4">
                                    <h3 className="font-bold text-lg">მოკლე ინფო</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">ფასი</span>
                                            <Badge className={pricing.color}>{pricing.label}</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">კატეგორია</span>
                                            <span className="font-medium">{tool.category}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">რეიტინგი</span>
                                            <span className="flex items-center gap-1">
                                                <TbStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                {tool.rating}/5
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <SubscribeUpdates toolName={tool.name} />

                            <AlternativesCards alternatives={relatedTools} categoryColor={categoryColor} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Share & Comments Section */}
            <section className="py-12 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-8">
                    <ShareButtons
                        url={`https://andrewaltair.ge/tools/${tool.id}`}
                        title={`${tool.name} - AI ინსტრუმენტი`}
                    />

                    <div className="pt-8 border-t border-border">
                        <Comments postId={`tool-${tool.id}`} />
                    </div>
                </div>
            </section>

            {/* Related Tools */}
            {relatedTools.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                        <h2 className="text-2xl font-bold mb-8">მსგავსი ინსტრუმენტები</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedTools.map((relatedTool) => {
                                const relatedPricing = pricingLabels[relatedTool.pricing] || pricingLabels["freemium"]
                                return (
                                    <Link key={relatedTool.id} href={`/tools/${relatedTool.id}`}>
                                        <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                                            <CardContent className="p-5">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                                                        <ToolLogo tool={relatedTool} size={48} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                                                            {relatedTool.name}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                            {relatedTool.description}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-3">
                                                            <Badge className={`text-xs ${relatedPricing.color}`}>
                                                                {relatedPricing.label}
                                                            </Badge>
                                                            <div className="flex items-center gap-0.5">
                                                                {[...Array(relatedTool.rating)].map((_, i) => (
                                                                    <TbStar key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 animated-gradient opacity-90"></div>
                <div className="absolute inset-0 noise-overlay"></div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center text-white">
                    <div className="space-y-6">
                        <h2 className="text-3xl sm:text-4xl font-bold">
                            სხვა AI ინსტრუმენტებიც ნახე! 🚀
                        </h2>
                        <p className="text-xl text-white/80">
                            აღმოაჩინე 700+ AI ინსტრუმენტი ჩვენს კატალოგში
                        </p>
                        <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                            <Link href="/tools">
                                ყველა ინსტრუმენტი
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
