"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
    TbBulb,
    TbBook,
    TbSettings,
    TbBriefcase,
    TbShoppingBag,
    TbInfoCircle,
    TbRobot,
    TbGift,
    TbActivity,
    TbClipboardCheck,
    TbSparkles,
    TbVideo,
    TbArrowRight
} from "react-icons/tb"

interface CardsLayoutProps {
    posts: any[]
    videos: any[]
}

const categoryCards = [
    {
        href: "/mystic",
        label: "მისტიკური AI",
        description: "ტაროს კითხვა, ნუმეროლოგია, ჰოროსკოპი და AI პრედიქციები",
        icon: TbBulb,
        gradient: "from-purple-600 via-pink-500 to-rose-500",
        bgPattern: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
        emoji: "🔮"
    },
    {
        href: "/encyclopedia",
        label: "AI ენციკლოპედია",
        description: "სრული AI ცოდნის ბაზა თემებად დაყოფილი",
        icon: TbBook,
        gradient: "from-blue-600 via-cyan-500 to-teal-400",
        bgPattern: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)",
        emoji: "📚"
    },
    {
        href: "/videos",
        label: "ვიდეო ტუტორიალები",
        description: "YouTube-ზე პრაქტიკული AI გაკვეთილები",
        icon: TbVideo,
        gradient: "from-red-600 via-orange-500 to-amber-400",
        bgPattern: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 40%)",
        emoji: "🎬"
    },
    {
        href: "/bots",
        label: "AI ჩატბოტები",
        description: "სპეციალიზებული ბოტები სხვადასხვა ამოცანებისთვის",
        icon: TbRobot,
        gradient: "from-indigo-600 via-violet-500 to-purple-400",
        bgPattern: "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.12) 0%, transparent 45%)",
        emoji: "🤖"
    },
    {
        href: "/quiz",
        label: "AI ქვიზი",
        description: "5 წუთში იპოვე შენთვის საუკეთესო AI ინსტრუმენტი",
        icon: TbInfoCircle,
        gradient: "from-amber-500 via-yellow-400 to-lime-400",
        bgPattern: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.15) 0%, transparent 50%)",
        emoji: "🧠"
    },
    {
        href: "/tools",
        label: "AI ინსტრუმენტები",
        description: "100+ AI ინსტრუმენტის რეიტინგი და მიმოხილვა",
        icon: TbSettings,
        gradient: "from-emerald-600 via-green-500 to-teal-400",
        bgPattern: "radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 40%)",
        emoji: "⚙️"
    },
    {
        href: "/mystery-box",
        label: "საჩუქრის ყუთი",
        description: "ყოველ 24 საათში გახსენი და მიიღე პრიზები",
        icon: TbGift,
        gradient: "from-pink-600 via-rose-500 to-red-400",
        bgPattern: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)",
        emoji: "🎁"
    },
    {
        href: "/lessons",
        label: "მიკრო-გაკვეთილები",
        description: "5-10 წუთიანი AI გაკვეთილები დამწყებთათვის",
        icon: TbBook,
        gradient: "from-teal-600 via-cyan-500 to-blue-400",
        bgPattern: "radial-gradient(circle at 60% 40%, rgba(255,255,255,0.1) 0%, transparent 45%)",
        emoji: "📖"
    },
    {
        href: "/prompt-builder",
        label: "Prompt Builder",
        description: "შექმენი იდეალური პრომპტი AI-სთვის",
        icon: TbSparkles,
        gradient: "from-violet-600 via-purple-500 to-fuchsia-400",
        bgPattern: "radial-gradient(circle at 40% 60%, rgba(255,255,255,0.12) 0%, transparent 50%)",
        emoji: "✨"
    },
    {
        href: "/prompts",
        label: "პრომპტების მაღაზია",
        description: "მზა პრომპტები ChatGPT, Claude, Midjourney-სთვის",
        icon: TbShoppingBag,
        gradient: "from-orange-600 via-red-500 to-pink-400",
        bgPattern: "radial-gradient(circle at 90% 10%, rgba(255,255,255,0.15) 0%, transparent 45%)",
        emoji: "🛍️"
    },
    {
        href: "/ai-health",
        label: "AI ჯანმრთელობა",
        description: "შეაფასე შენი AI მზადყოფნა და მიიღე რჩევები",
        icon: TbActivity,
        gradient: "from-cyan-600 via-blue-500 to-indigo-400",
        bgPattern: "radial-gradient(circle at 10% 90%, rgba(255,255,255,0.1) 0%, transparent 40%)",
        emoji: "💪"
    },
    {
        href: "/services",
        label: "კონსულტაცია",
        description: "პროფესიონალური AI კონსალტინგი ბიზნესისთვის",
        icon: TbBriefcase,
        gradient: "from-slate-700 via-gray-600 to-zinc-500",
        bgPattern: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1) 0%, transparent 40%)",
        emoji: "💼"
    },
]

export function CardsLayout({ posts, videos }: CardsLayoutProps) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
            {/* Section Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
                    <TbSparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">აღმოაჩინე ყველაფერი</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">რა გაინტერესებს?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    აირჩიე კატეგორია და ჩაიძირე AI-ს სამყაროში
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {categoryCards.map((card, index) => (
                    <Link
                        key={card.href}
                        href={card.href}
                        className="group"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <Card className={`h-full overflow-hidden border-0 shadow-xl hover-lift bg-gradient-to-br ${card.gradient} text-white relative`}>
                            {/* Background Pattern */}
                            <div
                                className="absolute inset-0 opacity-50"
                                style={{ background: card.bgPattern }}
                            />

                            {/* Shine effect on hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />

                            <CardContent className="relative p-6 h-full flex flex-col min-h-[180px]">
                                {/* Icon & Emoji */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                                        <card.icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-3xl opacity-70 group-hover:scale-125 transition-transform">
                                        {card.emoji}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-2 group-hover:underline decoration-2 underline-offset-4">
                                        {card.label}
                                    </h3>
                                    <p className="text-sm text-white/80 line-clamp-2">
                                        {card.description}
                                    </p>
                                </div>

                                {/* Arrow */}
                                <div className="mt-4 flex items-center text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                                    <span>გახსნა</span>
                                    <TbArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Blog & Videos CTA */}
            <div className="mt-12 grid sm:grid-cols-2 gap-6">
                <Link href="/blog" className="group">
                    <Card className="h-full border-2 border-dashed border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 transition-all">
                        <CardContent className="p-8 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-2">📝 ბლოგი</h3>
                                <p className="text-muted-foreground">{posts.length}+ სტატია AI-ზე</p>
                            </div>
                            <TbArrowRight className="w-8 h-8 text-primary group-hover:translate-x-2 transition-transform" />
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/videos" className="group">
                    <Card className="h-full border-2 border-dashed border-red-500/30 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 transition-all">
                        <CardContent className="p-8 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-2">🎬 ვიდეოები</h3>
                                <p className="text-muted-foreground">{videos.length}+ ტუტორიალი</p>
                            </div>
                            <TbArrowRight className="w-8 h-8 text-red-500 group-hover:translate-x-2 transition-transform" />
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
