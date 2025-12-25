"use client"

import Link from "next/link"
import { StreakCounter } from "@/components/gamification/StreakCounter"
import { LeaderboardMini } from "@/components/gamification/Leaderboard"
import { AIToolQuiz } from "@/components/gamification/Quiz"
import { TLDRSummary } from "@/components/ai/TLDRSummary"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Sparkles, Flame, BookOpen } from "lucide-react"

// Featured post data for TL;DR
const featuredTLDR = {
    summary: "ხელოვნური ინტელექტი სწრაფად ვითარდება და ცვლის როგორც ვმუშაობთ. ChatGPT, Midjourney და სხვა ინსტრუმენტები ხელმისაწვდომია ყველასთვის.",
    keyPoints: [
        "AI ინსტრუმენტები უფასოა ან ხელმისაწვდომი",
        "პრომპტის ხელოვნება მთავარი უნარია",
        "ავტომატიზაცია დროს ზოგავს",
    ],
    readingTime: 8,
}

// Mock trending data for sidebar
const trendingTopics = [
    { id: 1, title: "ChatGPT 5 რა ახალია?", views: 12500, badge: "🔥" },
    { id: 2, title: "Midjourney v7 ტუტორიალი", views: 8900, badge: "🎨" },
    { id: 3, title: "AI ავტომატიზაცია", views: 7200, badge: "⚡" },
]

export function HomeSidebar() {
    return (
        <aside className="space-y-6">
            {/* Streak Widget */}
            <StreakCounter variant="card" />

            {/* Leaderboard Mini */}
            <LeaderboardMini />

            {/* Trending Topics */}
            <Card>
                <CardContent className="p-4">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Flame className="h-4 w-4 text-red-500" />
                        ტრენდული თემები
                    </h3>
                    <div className="space-y-3">
                        {trendingTopics.map((topic, i) => (
                            <Link
                                key={topic.id}
                                href="#"
                                className="flex items-start gap-3 group"
                            >
                                <span className="text-lg">{topic.badge}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">
                                        {topic.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {(topic.views / 1000).toFixed(1)}K ნახვა
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </aside>
    )
}

export function FeaturedTLDR() {
    return (
        <TLDRSummary
            summary={featuredTLDR.summary}
            keyPoints={featuredTLDR.keyPoints}
            readingTime={featuredTLDR.readingTime}
        />
    )
}

export function QuizWidget() {
    return (
        <div className="py-12">
            <div className="text-center mb-8">
                <Badge className="mb-4">🎮 ინტერაქტიული</Badge>
                <h2 className="text-2xl font-bold mb-2">რომელი AI ხელსაწყო ხარ?</h2>
                <p className="text-muted-foreground">გაიგე შენი AI პერსონალობა!</p>
            </div>
            <div className="max-w-lg mx-auto">
                <AIToolQuiz />
            </div>
        </div>
    )
}

// Community stats widget
export function CommunityStats() {
    const stats = [
        { label: "მკითხველი", value: "50K+", icon: "👥" },
        { label: "სტატია", value: "150+", icon: "📚" },
        { label: "ვიდეო", value: "200+", icon: "🎬" },
        { label: "კურსი", value: "5", icon: "🎓" },
    ]

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <Card key={stat.label} className="text-center hover-lift">
                    <CardContent className="p-4">
                        <div className="text-3xl mb-2">{stat.icon}</div>
                        <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

// Achievement showcase
export function AchievementShowcase() {
    const achievements = [
        { emoji: "🌟", name: "ახალი მკითხველი", unlocked: true },
        { emoji: "📚", name: "წიგნის ჭია", unlocked: false },
        { emoji: "💬", name: "კომენტატორი", unlocked: false },
        { emoji: "🔥", name: "7 დღის სტრიკი", unlocked: false },
    ]

    return (
        <Card>
            <CardContent className="p-4">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    შენი მიღწევები
                </h3>
                <div className="grid grid-cols-4 gap-2">
                    {achievements.map((ach) => (
                        <div
                            key={ach.name}
                            className={`text-center p-2 rounded-lg ${ach.unlocked ? "bg-primary/10" : "bg-secondary opacity-50"
                                }`}
                            title={ach.name}
                        >
                            <span className="text-2xl">{ach.emoji}</span>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                    1/4 განბლოკილი
                </p>
            </CardContent>
        </Card>
    )
}
