"use client"

import { useState } from "react"
import Link from "next/link"

// Effects
import { TiltCard } from "@/components/effects/TiltCard"
import { MagneticButton } from "@/components/effects/MagneticButton"
import { LiquidBlobBackground } from "@/components/effects/LiquidBlob"
import { ScrambleTitle } from "@/components/effects/TextScramble"
import { HoverScale, PulseGlow, FloatEffect, GlowBorder, TypewriterText, AnimatedCounter, ClickRipple, ShakeOnHover } from "@/components/effects/MicroInteractions"

// Gamification
import { StreakCounter } from "@/components/gamification/StreakCounter"
import { AchievementsGrid, AchievementBadge } from "@/components/gamification/AchievementBadge"
import { SpinWheel, useSpinWheel } from "@/components/gamification/SpinWheel"
import { Leaderboard } from "@/components/gamification/Leaderboard"
import { AIToolQuiz } from "@/components/gamification/Quiz"

// AI
import { TLDRSummary } from "@/components/ai/TLDRSummary"
import { VoiceSearchInput } from "@/components/ai/VoiceSearch"
import { MiniNarrator } from "@/components/ai/ArticleNarrator"

// Interactive
import { TextCompare, BeforeAfterSlider } from "@/components/interactive/BeforeAfterSlider"
import { QuoteCardGenerator } from "@/components/interactive/QuoteCardGenerator"
import { Footnote, FootnotesList, HoverTooltip, InlineDefinition } from "@/components/interactive/Footnotes"
import { BackToTop } from "@/components/interactive/InfiniteScroll"
import { ReadingProgress } from "@/components/interactive/ReadingProgress"
import { BookmarkButton } from "@/components/interactive/BookmarkSystem"
import { TableOfContentsMobile } from "@/components/interactive/TableOfContents"
import { ReadingModeFAB } from "@/components/interactive/ReadingMode"

// UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Sparkles, Gift, Zap, Trophy, Flame, Eye, MousePointer,
    Gamepad2, Brain, Share2, BookOpen, Palette, Volume2,
    MessageSquare, Search, Bookmark, List, Quote, FileText,
    ArrowUp, Clock, Users, Target, Star, Heart, ExternalLink
} from "lucide-react"

// Feature card component
function FeatureCard({
    title,
    description,
    icon: Icon,
    category,
    children
}: {
    title: string
    description: string
    icon: React.ElementType
    category: string
    children?: React.ReactNode
}) {
    return (
        <Card className="h-full hover-lift overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{title}</CardTitle>
                            <Badge variant="outline" className="mt-1 text-xs">{category}</Badge>
                        </div>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{description}</p>
            </CardHeader>
            {children && (
                <CardContent className="pt-0">
                    {children}
                </CardContent>
            )}
        </Card>
    )
}

// Category section
function CategorySection({
    title,
    icon: Icon,
    description,
    children
}: {
    title: string
    icon: React.ElementType
    description: string
    children: React.ReactNode
}) {
    return (
        <section className="py-12">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <p className="text-muted-foreground">{description}</p>
                </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
                {children}
            </div>
        </section>
    )
}

export default function FeaturesShowcase() {
    const spinWheel = useSpinWheel()
    const [demoText] = useState("ეს არის ტექსტი რომელსაც AI შეიძლება წაიკითხოს")

    return (
        <div className="min-h-screen">
            {/* Reading Progress */}
            <ReadingProgress position="top" color="gradient" height={3} />

            {/* Hero */}
            <section className="relative py-20 overflow-hidden">
                <LiquidBlobBackground className="opacity-20" />
                <div className="container relative mx-auto px-4 max-w-6xl text-center">
                    <Badge className="mb-4" variant="outline">🚀 45+ ფიჩერი</Badge>
                    <ScrambleTitle
                        text="ყველა ფიჩერი ერთ ადგილას"
                        className="text-4xl md:text-6xl font-bold mb-4"
                    />
                    <TypewriterText
                        text="აღმოაჩინე ყველა ფუნქცია რაც ჩვენს ვებსაიტს აქვს ✨"
                        className="text-xl text-muted-foreground"
                    />

                    {/* Quick Stats */}
                    <div className="flex flex-wrap justify-center gap-8 mt-12">
                        <div className="text-center">
                            <AnimatedCounter value={45} className="text-4xl font-bold text-gradient" />
                            <div className="text-sm text-muted-foreground">ფიჩერი</div>
                        </div>
                        <div className="text-center">
                            <AnimatedCounter value={38} className="text-4xl font-bold text-gradient" />
                            <div className="text-sm text-muted-foreground">კომპონენტი</div>
                        </div>
                        <div className="text-center">
                            <AnimatedCounter value={5} className="text-4xl font-bold text-gradient" />
                            <div className="text-sm text-muted-foreground">კატეგორია</div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="flex justify-center gap-4 mt-8">
                        <MagneticButton>
                            <Button size="lg" onClick={spinWheel.open} className="gap-2">
                                <Gift className="h-5 w-5" />
                                მოიგე პრიზი!
                            </Button>
                        </MagneticButton>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 max-w-7xl">
                {/* Navigation Tabs */}
                <Tabs defaultValue="all" className="mb-8">
                    <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent">
                        <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            ყველა
                        </TabsTrigger>
                        <TabsTrigger value="effects" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            🎨 ეფექტები
                        </TabsTrigger>
                        <TabsTrigger value="gamification" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            🎮 გეიმიფიკაცია
                        </TabsTrigger>
                        <TabsTrigger value="ai" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            🤖 AI
                        </TabsTrigger>
                        <TabsTrigger value="interactive" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            ⚡ ინტერაქტიული
                        </TabsTrigger>
                        <TabsTrigger value="social" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            🌐 სოციალური
                        </TabsTrigger>
                    </TabsList>

                    {/* All Features */}
                    <TabsContent value="all" className="mt-8">
                        {/* Visual Effects */}
                        <CategorySection
                            title="ვიზუალური ეფექტები"
                            icon={Palette}
                            description="თვალისმომჭრელი ანიმაციები და ეფექტები"
                        >
                            <FeatureCard
                                title="3D Tilt კარტები"
                                description="მაუსის მოძრაობით დახრილი კარტები პერსპექტივით"
                                icon={Eye}
                                category="ეფექტი"
                            >
                                <TiltCard tiltAmount={15} glareEnabled>
                                    <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg p-6 text-center">
                                        <Sparkles className="h-8 w-8 mx-auto text-primary" />
                                        <p className="mt-2 text-sm">დამხარე მაუსი!</p>
                                    </div>
                                </TiltCard>
                            </FeatureCard>

                            <FeatureCard
                                title="მაგნიტური ღილაკები"
                                description="ღილაკები რომლებიც მაუსს მიჰყვებიან"
                                icon={MousePointer}
                                category="ეფექტი"
                            >
                                <div className="flex gap-2">
                                    <MagneticButton>
                                        <Button>მომაახლოვე</Button>
                                    </MagneticButton>
                                    <MagneticButton>
                                        <Button variant="outline">მე მაგნიტი ვარ</Button>
                                    </MagneticButton>
                                </div>
                            </FeatureCard>

                            <FeatureCard
                                title="Hover ეფექტები"
                                description="ელემენტების გადიდება და ანიმაციები"
                                icon={Zap}
                                category="ეფექტი"
                            >
                                <div className="flex gap-3">
                                    <HoverScale scale={1.1}>
                                        <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center">
                                            <Star className="h-6 w-6" />
                                        </div>
                                    </HoverScale>
                                    <GlowBorder>
                                        <div className="w-16 h-16 rounded-lg bg-card flex items-center justify-center">
                                            <Heart className="h-6 w-6" />
                                        </div>
                                    </GlowBorder>
                                    <ShakeOnHover>
                                        <div className="w-16 h-16 rounded-lg bg-accent/20 flex items-center justify-center">
                                            <Flame className="h-6 w-6" />
                                        </div>
                                    </ShakeOnHover>
                                </div>
                            </FeatureCard>

                            <FeatureCard
                                title="მცურავი ელემენტები"
                                description="ელემენტები რომლებიც ჰაერში ცურავენ"
                                icon={Sparkles}
                                category="ეფექტი"
                            >
                                <FloatEffect>
                                    <PulseGlow className="inline-block px-4 py-2 rounded-full bg-primary text-primary-foreground">
                                        მცურავი ✨
                                    </PulseGlow>
                                </FloatEffect>
                            </FeatureCard>

                            <FeatureCard
                                title="კლიკის ტალღა"
                                description="დააჭირე რომ ტალღის ეფექტი ნახო"
                                icon={Target}
                                category="ეფექტი"
                            >
                                <ClickRipple>
                                    <div className="bg-secondary rounded-lg p-8 text-center cursor-pointer">
                                        <p>დამაკლიკე!</p>
                                    </div>
                                </ClickRipple>
                            </FeatureCard>

                            <FeatureCard
                                title="კურსორის კვალი"
                                description="მაუსის უკან მიმავალი პარტიკულები"
                                icon={MousePointer}
                                category="ეფექტი"
                            >
                                <p className="text-sm text-muted-foreground">
                                    👀 მაუსი დაატარე გვერდზე რომ ნახო!
                                </p>
                            </FeatureCard>
                        </CategorySection>

                        {/* Gamification */}
                        <CategorySection
                            title="გეიმიფიკაცია"
                            icon={Gamepad2}
                            description="თამაშის ელემენტები და ჯილდოები"
                        >
                            <FeatureCard
                                title="დღიური სტრიკი"
                                description="თვალყური ადევნე შენს აქტივობას"
                                icon={Flame}
                                category="გეიმიფიკაცია"
                            >
                                <StreakCounter variant="badge" />
                            </FeatureCard>

                            <FeatureCard
                                title="მიღწევების ბეჯები"
                                description="განბლოკე ბეჯები აქტივობით"
                                icon={Trophy}
                                category="გეიმიფიკაცია"
                            >
                                <div className="flex gap-2">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl">📚</div>
                                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl opacity-50">🔥</div>
                                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl opacity-50">💬</div>
                                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl opacity-50">⭐</div>
                                </div>
                            </FeatureCard>

                            <FeatureCard
                                title="ბორბალი"
                                description="მოატრიალე და მოიგე პრიზი"
                                icon={Gift}
                                category="გეიმიფიკაცია"
                            >
                                <Button onClick={spinWheel.open} className="w-full gap-2">
                                    <Gift className="h-4 w-4" />
                                    ითამაშე!
                                </Button>
                            </FeatureCard>

                            <FeatureCard
                                title="ლიდერბორდი"
                                description="შეხედე ტოპ მომხმარებლებს"
                                icon={Users}
                                category="გეიმიფიკაცია"
                            >
                                <div className="text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span>🥇 გიორგი</span>
                                        <span className="text-primary">1,250 ქულა</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>🥈 ანა</span>
                                        <span className="text-primary">980 ქულა</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>🥉 ნიკა</span>
                                        <span className="text-primary">875 ქულა</span>
                                    </div>
                                </div>
                            </FeatureCard>

                            <FeatureCard
                                title="აკურალური ქვიზი"
                                description="გაიგე რომელი AI ხელსაწყო ხარ"
                                icon={Brain}
                                category="გეიმიფიკაცია"
                            >
                                <Link href="#quiz">
                                    <Button variant="outline" className="w-full">
                                        დაიწყე ქვიზი →
                                    </Button>
                                </Link>
                            </FeatureCard>

                            <FeatureCard
                                title="Easter Eggs"
                                description="საიდუმლო ფუნქციები"
                                icon={Star}
                                category="გეიმიფიკაცია"
                            >
                                <p className="text-sm text-muted-foreground">
                                    🎮 კონამის კოდი: ↑↑↓↓←→←→BA
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    🐍 404 გვერდზე Snake თამაში
                                </p>
                            </FeatureCard>
                        </CategorySection>

                        {/* AI Features */}
                        <CategorySection
                            title="AI ფიჩერები"
                            icon={Brain}
                            description="ხელოვნური ინტელექტის ფუნქციები"
                        >
                            <FeatureCard
                                title="AI ჩატ ასისტენტი"
                                description="დაუსვი კითხვები AI-ს"
                                icon={MessageSquare}
                                category="AI"
                            >
                                <p className="text-sm text-muted-foreground">
                                    💬 შეხედე ქვედა მარჯვენა კუთხეს!
                                </p>
                            </FeatureCard>

                            <FeatureCard
                                title="ხმოვანი ძებნა"
                                description="მოძებნე ხმით"
                                icon={Search}
                                category="AI"
                            >
                                <VoiceSearchInput
                                    onSearch={(text) => console.log(text)}
                                />
                            </FeatureCard>

                            <FeatureCard
                                title="TL;DR შეჯამება"
                                description="სტატიების მოკლე შეჯამება"
                                icon={FileText}
                                category="AI"
                            >
                                <TLDRSummary
                                    summary="AI ხელსაწყოები გეხმარებიან უფრო პროდუქტიული იყო."
                                    keyPoints={["ChatGPT", "Midjourney", "Claude"]}
                                    readingTime={5}
                                />
                            </FeatureCard>

                            <FeatureCard
                                title="სტატიის გახმოვანება"
                                description="მოისმინე სტატია"
                                icon={Volume2}
                                category="AI"
                            >
                                <MiniNarrator content={demoText} />
                            </FeatureCard>

                            <FeatureCard
                                title="ჭკვიანი რეკომენდაციები"
                                description="შენზე მორგებული კონტენტი"
                                icon={Target}
                                category="AI"
                            >
                                <p className="text-sm text-muted-foreground">
                                    📊 ალგორითმი გთავაზობს რელევანტურ სტატიებს
                                </p>
                            </FeatureCard>

                            <FeatureCard
                                title="ტექსტის შედარება"
                                description="შეადარე ორიგინალი და AI ვერსია"
                                icon={FileText}
                                category="AI"
                            >
                                <TextCompare
                                    beforeText="ტექსტი შეცდომებით"
                                    afterText="გასწორებული ტექსტი"
                                    beforeLabel="წინ"
                                    afterLabel="შემდეგ"
                                />
                            </FeatureCard>
                        </CategorySection>

                        {/* Interactive */}
                        <CategorySection
                            title="ინტერაქტიული"
                            icon={Zap}
                            description="ინტერაქტიული კომპონენტები"
                        >
                            <FeatureCard
                                title="კითხვის პროგრესი"
                                description="ნახე რამდენი წაიკითხე"
                                icon={BookOpen}
                                category="ინტერაქტიული"
                            >
                                <p className="text-sm text-muted-foreground">
                                    👆 შეხედე გვერდის თავში!
                                </p>
                            </FeatureCard>

                            <FeatureCard
                                title="სანიშნე სისტემა"
                                description="შეინახე სტატიები"
                                icon={Bookmark}
                                category="ინტერაქტიული"
                            >
                                <BookmarkButton
                                    id="demo-1"
                                    slug="demo"
                                    title="დემო სტატია"
                                    excerpt="ეს არის დემო"
                                    showLabel
                                />
                            </FeatureCard>

                            <FeatureCard
                                title="სარჩევი"
                                description="ავტომატური სარჩევი სტატიებისთვის"
                                icon={List}
                                category="ინტერაქტიული"
                            >
                                <p className="text-sm text-muted-foreground">
                                    📑 სტატიებში ავტომატურად ჩნდება
                                </p>
                            </FeatureCard>

                            <FeatureCard
                                title="ციტატის კარტი"
                                description="შექმენი გასაზიარებელი ციტატა"
                                icon={Quote}
                                category="ინტერაქტიული"
                            >
                                <Link href="#quote-generator">
                                    <Button variant="outline" size="sm" className="w-full">
                                        შექმენი კარტი →
                                    </Button>
                                </Link>
                            </FeatureCard>

                            <FeatureCard
                                title="სქოლიოები"
                                description="ტექსტში დამატებითი ინფო"
                                icon={FileText}
                                category="ინტერაქტიული"
                            >
                                <p className="text-sm">
                                    მაგალითი{" "}
                                    <Footnote id="1" note="ეს არის სქოლიოს მაგალითი">
                                        <span className="text-primary cursor-help border-b border-dashed">სქოლიოს</span>
                                    </Footnote>
                                </p>
                            </FeatureCard>

                            <FeatureCard
                                title="Tooltip-ები"
                                description="დაატარე მაუსი მეტი ინფოსთვის"
                                icon={Eye}
                                category="ინტერაქტიული"
                            >
                                <HoverTooltip tooltip="ეს არის tooltip!">
                                    <span className="text-primary border-b border-dashed cursor-help">
                                        დამატარე მაუსი
                                    </span>
                                </HoverTooltip>
                            </FeatureCard>
                        </CategorySection>

                        {/* Social */}
                        <CategorySection
                            title="სოციალური"
                            icon={Share2}
                            description="გაზიარება და ჩართულობა"
                        >
                            <FeatureCard
                                title="გაზიარების ღილაკები"
                                description="გააზიარე სოციალურ ქსელებში"
                                icon={Share2}
                                category="სოციალური"
                            >
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon">
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                    </Button>
                                </div>
                            </FeatureCard>

                            <FeatureCard
                                title="ტექსტის გაზიარება"
                                description="მონიშნე ტექსტი და გააზიარე"
                                icon={Share2}
                                category="სოციალური"
                            >
                                <p className="text-sm text-muted-foreground">
                                    ✍️ მონიშნე ნებისმიერი ტექსტი გვერდზე!
                                </p>
                            </FeatureCard>

                            <FeatureCard
                                title="რეაქციები"
                                description="გამოხატე შენი აზრი"
                                icon={Heart}
                                category="სოციალური"
                            >
                                <div className="flex gap-2 text-2xl">
                                    <button className="hover:scale-125 transition-transform">🔥</button>
                                    <button className="hover:scale-125 transition-transform">❤️</button>
                                    <button className="hover:scale-125 transition-transform">🎉</button>
                                    <button className="hover:scale-125 transition-transform">🤯</button>
                                    <button className="hover:scale-125 transition-transform">👏</button>
                                </div>
                            </FeatureCard>

                            <FeatureCard
                                title="Social Proof"
                                description="ნახე სხვების აქტივობა"
                                icon={Users}
                                category="სოციალური"
                            >
                                <p className="text-sm text-muted-foreground">
                                    🔔 ნოტიფიკაციები ავტომატურად ჩნდება
                                </p>
                            </FeatureCard>

                            <FeatureCard
                                title="ცოცხალი მთვლელი"
                                description="რამდენი ადამიანი კითხულობს"
                                icon={Eye}
                                category="სოციალური"
                            >
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span>12 ადამიანი ახლა კითხულობს</span>
                                </div>
                            </FeatureCard>

                            <FeatureCard
                                title="Newsletter"
                                description="გამოიწერე სიახლეები"
                                icon={MessageSquare}
                                category="სოციალური"
                            >
                                <p className="text-sm text-muted-foreground">
                                    📧 Exit-intent popup გამოწერისთვის
                                </p>
                            </FeatureCard>
                        </CategorySection>
                    </TabsContent>

                    {/* Other tabs show filtered content */}
                    <TabsContent value="effects">
                        <p className="text-center text-muted-foreground py-8">
                            აირჩიე "ყველა" ყველა ფიჩერის სანახავად
                        </p>
                    </TabsContent>
                    <TabsContent value="gamification">
                        <p className="text-center text-muted-foreground py-8">
                            აირჩიე "ყველა" ყველა ფიჩერის სანახავად
                        </p>
                    </TabsContent>
                    <TabsContent value="ai">
                        <p className="text-center text-muted-foreground py-8">
                            აირჩიე "ყველა" ყველა ფიჩერის სანახავად
                        </p>
                    </TabsContent>
                    <TabsContent value="interactive">
                        <p className="text-center text-muted-foreground py-8">
                            აირჩიე "ყველა" ყველა ფიჩერის სანახავად
                        </p>
                    </TabsContent>
                    <TabsContent value="social">
                        <p className="text-center text-muted-foreground py-8">
                            აირჩიე "ყველა" ყველა ფიჩერის სანახავად
                        </p>
                    </TabsContent>
                </Tabs>

                {/* Full Quiz Section */}
                <section id="quiz" className="py-16 border-t">
                    <h2 className="text-3xl font-bold text-center mb-8">🎮 რომელი AI ხელსაწყო ხარ?</h2>
                    <div className="max-w-2xl mx-auto">
                        <AIToolQuiz />
                    </div>
                </section>

                {/* Quote Generator Section */}
                <section id="quote-generator" className="py-16 border-t">
                    <h2 className="text-3xl font-bold text-center mb-8">💬 ციტატის კარტი</h2>
                    <div className="max-w-2xl mx-auto">
                        <QuoteCardGenerator
                            quote="ხელოვნური ინტელექტი არ ჩაანაცვლებს შენ, მაგრამ ის ადამიანი რომელიც AI-ს იყენებს, ჩაანაცვლებს მას ვინც არ იყენებს."
                            author="Andrew Altair"
                            source="AI ბლოგი"
                        />
                    </div>
                </section>
            </div>

            {/* Spin Wheel Modal */}
            <SpinWheel
                isOpen={spinWheel.isOpen}
                onClose={spinWheel.close}
                onWin={(prize) => console.log("Won:", prize)}
            />

            {/* Back to Top */}
            <BackToTop />
        </div>
    )
}
