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
import { SpinWheel, useSpinWheel } from "@/components/gamification/SpinWheel"
import { AIToolQuiz } from "@/components/gamification/Quiz"

// AI
import { TLDRSummary } from "@/components/ai/TLDRSummary"
import { VoiceSearchInput } from "@/components/ai/VoiceSearch"
import { MiniNarrator } from "@/components/ai/ArticleNarrator"

// Interactive
import { TextCompare } from "@/components/interactive/BeforeAfterSlider"
import { QuoteCardGenerator } from "@/components/interactive/QuoteCardGenerator"
import { Footnote, HoverTooltip } from "@/components/interactive/Footnotes"
import { BackToTop } from "@/components/interactive/InfiniteScroll"
import { ReadingProgress } from "@/components/interactive/ReadingProgress"
import { BookmarkButton } from "@/components/interactive/BookmarkSystem"

// UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Gift, Zap, Trophy, Flame, Eye, MousePointer, Gamepad2, Brain, Share2, BookOpen, Palette, Volume2, MessageSquare, Search, Bookmark, List, Quote, FileText, ArrowUp, Clock, Users, Target, Star, Heart, ExternalLink } from "lucide-react"

// ============ ALL FEATURES DATA ============

interface Feature {
    id: string
    name: string
    description: string
    icon: string
    category: string
    path?: string
    isNew?: boolean
}

// ENGAGEMENT FEATURES (29)
const engagementFeatures: Feature[] = [
    { id: 'ai-avatar', name: 'AI Avatar', description: 'Персонализированный AI аватар', icon: '🤖', category: 'Engagement' },
    { id: 'ai-certification', name: 'AI Certification', description: 'Сертификация навыков AI', icon: '🎓', category: 'Engagement' },
    { id: 'ai-for-profession', name: 'AI For Profession', description: 'AI инструменты по профессиям', icon: '👔', category: 'Engagement' },
    { id: 'ai-tool-battles', name: 'AI Tool Battles', description: 'Битвы AI инструментов', icon: '⚔️', category: 'Engagement' },
    { id: 'ai-usage-credits', name: 'AI Usage Credits', description: 'Система кредитов AI', icon: '💎', category: 'Engagement' },
    { id: 'ai-workspace', name: 'AI Workspace', description: 'Рабочее пространство AI', icon: '📂', category: 'Engagement' },
    { id: 'activity-feed', name: 'Activity Feed', description: 'Лента активности', icon: '📰', category: 'Engagement' },
    { id: 'community-forum', name: 'Community Forum', description: 'Форум сообщества', icon: '💬', category: 'Engagement', path: '/community' },
    { id: 'community-rankings', name: 'Community Rankings', description: 'Рейтинг сообщества', icon: '🏆', category: 'Engagement' },
    { id: 'daily-challenge', name: 'Daily Challenge', description: 'Ежедневные челленджи', icon: '🎯', category: 'Engagement' },
    { id: 'expert-qa', name: 'Expert Q&A', description: 'Вопросы экспертам', icon: '❓', category: 'Engagement' },
    { id: 'free-trial-timer', name: 'Free Trial Timer', description: 'Таймер пробного периода', icon: '⏰', category: 'Engagement' },
    { id: 'learning-path', name: 'Learning Path', description: 'Путь обучения AI', icon: '🛤️', category: 'Engagement' },
    { id: 'live-demo-sessions', name: 'Live Demo Sessions', description: 'Живые демо-сессии', icon: '🎥', category: 'Engagement', path: '/live' },
    { id: 'nft-collection', name: 'NFT Collection', description: 'Коллекция NFT наград', icon: '🖼️', category: 'Engagement' },
    { id: 'news-digest', name: 'News Digest', description: 'Дайджест AI новостей', icon: '📧', category: 'Engagement' },
    { id: 'personal-ai-report', name: 'Personal AI Report', description: 'Персональный AI отчёт', icon: '📊', category: 'Engagement' },
    { id: 'pricing-comparison', name: 'Pricing Comparison', description: 'Сравнение цен', icon: '💰', category: 'Engagement' },
    { id: 'prompt-library', name: 'Prompt Library', description: 'Библиотека промптов', icon: '📚', category: 'Engagement' },
    { id: 'roi-calculator', name: 'ROI Calculator', description: 'Калькулятор ROI', icon: '📈', category: 'Engagement' },
    { id: 'referral-program', name: 'Referral Program', description: 'Реферальная программа', icon: '🤝', category: 'Engagement', path: '/affiliates' },
    { id: 'smart-notifications', name: 'Smart Notifications', description: 'Умные уведомления', icon: '🔔', category: 'Engagement' },
    { id: 'smart-onboarding', name: 'Smart Onboarding', description: 'Умный онбординг', icon: '🚀', category: 'Engagement' },
    { id: 'success-stories', name: 'Success Stories', description: 'Истории успеха', icon: '🌟', category: 'Engagement', path: '/testimonials' },
    { id: 'tool-comparison', name: 'Tool Comparison', description: 'Сравнение инструментов', icon: '⚖️', category: 'Engagement', path: '/tools' },
    { id: 'user-ai-profile', name: 'User AI Profile', description: 'AI профиль пользователя', icon: '👤', category: 'Engagement' },
    { id: 'user-reviews', name: 'User Reviews', description: 'Отзывы пользователей', icon: '⭐', category: 'Engagement' },
    { id: 'user-workflows', name: 'User Workflows', description: 'Воркфлоу пользователей', icon: '⚙️', category: 'Engagement' },
    { id: 'weekly-rewards', name: 'Weekly Rewards', description: 'Недельные награды', icon: '🎁', category: 'Engagement' },
]

// GAMIFICATION FEATURES (5)
const gamificationFeatures: Feature[] = [
    { id: 'achievement-badge', name: 'Achievement Badges', description: 'Бейджи достижений', icon: '🏅', category: 'Gamification' },
    { id: 'leaderboard', name: 'Leaderboard', description: 'Таблица лидеров', icon: '🥇', category: 'Gamification' },
    { id: 'quiz', name: 'AI Quiz', description: 'Квиз по AI инструментам', icon: '🎮', category: 'Gamification', path: '/quiz' },
    { id: 'spin-wheel', name: 'Spin Wheel', description: 'Колесо удачи', icon: '🎡', category: 'Gamification' },
    { id: 'streak-counter', name: 'Streak Counter', description: 'Счётчик серии', icon: '🔥', category: 'Gamification' },
]

// INTERACTIVE FEATURES (18)
const interactiveFeatures: Feature[] = [
    { id: 'before-after-slider', name: 'Before/After Slider', description: 'Слайдер до/после', icon: '↔️', category: 'Interactive' },
    { id: 'bookmark-system', name: 'Bookmark System', description: 'Система закладок', icon: '🔖', category: 'Interactive' },
    { id: 'comments', name: 'Comments', description: 'Система комментариев', icon: '💬', category: 'Interactive' },
    { id: 'content-filters', name: 'Content Filters', description: 'Фильтры контента', icon: '🔍', category: 'Interactive' },
    { id: 'easter-egg', name: 'Easter Eggs', description: 'Пасхалки (Konami код)', icon: '🥚', category: 'Interactive' },
    { id: 'footnotes', name: 'Footnotes', description: 'Сноски и подсказки', icon: '📌', category: 'Interactive' },
    { id: 'highlight-share', name: 'Highlight Share', description: 'Выделить и поделиться', icon: '✍️', category: 'Interactive' },
    { id: 'infinite-scroll', name: 'Infinite Scroll', description: 'Бесконечная прокрутка', icon: '♾️', category: 'Interactive' },
    { id: 'live-visitor-counter', name: 'Live Visitor Counter', description: 'Счётчик посетителей', icon: '👥', category: 'Interactive' },
    { id: 'newsletter-popup', name: 'Newsletter Popup', description: 'Popup подписки', icon: '📧', category: 'Interactive' },
    { id: 'quote-card-generator', name: 'Quote Card Generator', description: 'Генератор цитат', icon: '💭', category: 'Interactive' },
    { id: 'reaction-bar', name: 'Reaction Bar', description: 'Панель реакций', icon: '❤️', category: 'Interactive' },
    { id: 'reading-mode', name: 'Reading Mode', description: 'Режим чтения', icon: '📖', category: 'Interactive' },
    { id: 'reading-progress', name: 'Reading Progress', description: 'Прогресс чтения', icon: '📊', category: 'Interactive' },
    { id: 'search-dialog', name: 'Search Dialog', description: 'Диалог поиска', icon: '🔎', category: 'Interactive' },
    { id: 'share-buttons', name: 'Share Buttons', description: 'Кнопки шаринга', icon: '📤', category: 'Interactive' },
    { id: 'social-proof-toast', name: 'Social Proof Toast', description: 'Уведомления активности', icon: '🔔', category: 'Interactive' },
    { id: 'table-of-contents', name: 'Table of Contents', description: 'Оглавление статей', icon: '📑', category: 'Interactive' },
]

// AI FEATURES (9)
const aiFeatures: Feature[] = [
    { id: 'ai-chat-assistant', name: 'AI Chat Assistant', description: 'AI чат-ассистент', icon: '🤖', category: 'AI' },
    { id: 'article-narrator', name: 'Article Narrator', description: 'Озвучка статей', icon: '🔊', category: 'AI' },
    { id: 'dream-interpreter', name: 'Dream Interpreter', description: 'Толкование снов', icon: '💭', category: 'AI', path: '/mystic' },
    { id: 'fortune-teller', name: 'Fortune Teller', description: 'Предсказания', icon: '🔮', category: 'AI', path: '/mystic' },
    { id: 'horoscope', name: 'Horoscope', description: 'Гороскоп', icon: '⭐', category: 'AI', path: '/mystic' },
    { id: 'love-calculator', name: 'Love Calculator', description: 'Калькулятор любви', icon: '💕', category: 'AI', path: '/mystic' },
    { id: 'smart-recommendations-ai', name: 'Smart Recommendations', description: 'Умные рекомендации', icon: '🎯', category: 'AI' },
    { id: 'tldr-summary', name: 'TL;DR Summary', description: 'Краткое резюме', icon: '📝', category: 'AI' },
    { id: 'voice-search', name: 'Voice Search', description: 'Голосовой поиск', icon: '🎤', category: 'AI' },
]

// EFFECTS FEATURES (8)
const effectsFeatures: Feature[] = [
    { id: 'cursor-trail', name: 'Cursor Trail', description: 'След курсора', icon: '✨', category: 'Effects' },
    { id: 'liquid-blob', name: 'Liquid Blob', description: 'Фоновые капли', icon: '💧', category: 'Effects' },
    { id: 'magnetic-button', name: 'Magnetic Button', description: 'Магнитные кнопки', icon: '🧲', category: 'Effects' },
    { id: 'micro-interactions', name: 'Micro Interactions', description: 'Микро-анимации', icon: '⚡', category: 'Effects' },
    { id: 'page-transition', name: 'Page Transition', description: 'Переходы страниц', icon: '🔄', category: 'Effects' },
    { id: 'parallax-section', name: 'Parallax Section', description: 'Параллакс эффект', icon: '🖼️', category: 'Effects' },
    { id: 'text-scramble', name: 'Text Scramble', description: 'Эффект текста', icon: '🔤', category: 'Effects' },
    { id: 'tilt-card', name: '3D Tilt Card', description: '3D наклон карты', icon: '📐', category: 'Effects' },
]

// CONVERSION FEATURES (20) - NEW!
const conversionFeatures: Feature[] = [
    { id: 'mystery-box', name: 'Mystery Box', description: 'Ежедневный сундук', icon: '🎁', category: 'Conversion', isNew: true },
    { id: 'limited-time-deals', name: 'Limited Time Deals', description: 'Горящие предложения', icon: '🔥', category: 'Conversion', isNew: true },
    { id: 'micro-lessons', name: 'Micro Lessons', description: '2-минутные уроки', icon: '⚡', category: 'Conversion', isNew: true },
    { id: 'ai-companion-mascot', name: 'AI Companion', description: 'AI-помощник маскот', icon: '🤗', category: 'Conversion', isNew: true },
    { id: 'savings-calculator', name: 'Savings Calculator', description: 'Калькулятор экономии', icon: '💰', category: 'Conversion', isNew: true },
    { id: 'ai-health-score', name: 'AI Health Score', description: 'Оценка AI-зрелости', icon: '🏥', category: 'Conversion', isNew: true },
    { id: 'prompt-playground', name: 'Prompt Playground', description: 'Песочница промптов', icon: '🎮', category: 'Conversion', isNew: true },
    { id: 'case-study-builder', name: 'Case Study Builder', description: 'Конструктор кейсов', icon: '📋', category: 'Conversion', isNew: true },
    { id: 'ai-quest-journey', name: 'AI Quest Journey', description: 'Квесты обучения', icon: '⚔️', category: 'Conversion', isNew: true },
    { id: 'skill-tree', name: 'Skill Tree', description: 'Дерево навыков', icon: '🌳', category: 'Conversion', isNew: true },
    { id: 'season-pass', name: 'Season Pass', description: 'Сезонный пропуск', icon: '🎫', category: 'Conversion', isNew: true },
    { id: 'live-challenges', name: 'Live Challenges', description: 'Живые челленджи', icon: '🏆', category: 'Conversion', isNew: true },
    { id: 'ai-buddy-matching', name: 'AI Buddy Matching', description: 'Поиск напарника', icon: '🤝', category: 'Conversion', isNew: true },
    { id: 'expert-office-hours', name: 'Expert Office Hours', description: 'Консультации', icon: '📅', category: 'Conversion', isNew: true },
    { id: 'proof-wall', name: 'Proof Wall', description: 'Стена результатов', icon: '🏆', category: 'Conversion', isNew: true },
    { id: 'smart-recommendations-conv', name: 'Smart Recommendations', description: 'Умные рекомендации', icon: '🎯', category: 'Conversion', isNew: true },
    { id: 'ai-readiness-assessment', name: 'AI Readiness Assessment', description: 'Тест готовности', icon: '📊', category: 'Conversion', isNew: true },
    { id: 'implementation-roadmap', name: 'Implementation Roadmap', description: 'Roadmap внедрения', icon: '🗺️', category: 'Conversion', isNew: true },
    { id: 'ai-news-curator', name: 'AI News Curator', description: 'Куратор новостей', icon: '📰', category: 'Conversion', isNew: true },
    { id: 'progress-snapshot', name: 'Progress Snapshot', description: 'Снимок прогресса', icon: '📸', category: 'Conversion', isNew: true },
]

// PAGES (20+)
const pageFeatures: Feature[] = [
    { id: 'page-home', name: 'Home Page', description: 'Главная страница', icon: '🏠', category: 'Pages', path: '/' },
    { id: 'page-about', name: 'About', description: 'О нас', icon: 'ℹ️', category: 'Pages', path: '/about' },
    { id: 'page-tools', name: 'AI Tools Directory', description: 'Каталог AI инструментов', icon: '🔧', category: 'Pages', path: '/tools' },
    { id: 'page-blog', name: 'Blog', description: 'Блог AI новостей', icon: '📝', category: 'Pages', path: '/blog' },
    { id: 'page-guides', name: 'Guides', description: 'Гайды по AI', icon: '📚', category: 'Pages', path: '/guides' },
    { id: 'page-resources', name: 'Resources', description: 'Ресурсы AI', icon: '📦', category: 'Pages', path: '/resources' },
    { id: 'page-mystic', name: 'Mystic Zone', description: 'Мистическая зона', icon: '🔮', category: 'Pages', path: '/mystic' },
    { id: 'page-quiz', name: 'Quiz Page', description: 'Страница квизов', icon: '🎮', category: 'Pages', path: '/quiz' },
    { id: 'page-live', name: 'Live Sessions', description: 'Живые трансляции', icon: '🎥', category: 'Pages', path: '/live' },
    { id: 'page-community', name: 'Community', description: 'Сообщество', icon: '👥', category: 'Pages', path: '/community' },
    { id: 'page-dashboard', name: 'Dashboard', description: 'Личный кабинет', icon: '📊', category: 'Pages', path: '/dashboard' },
    { id: 'page-services', name: 'Services', description: 'Услуги', icon: '💼', category: 'Pages', path: '/services' },
    { id: 'page-products', name: 'Products', description: 'Продукты', icon: '📦', category: 'Pages', path: '/products' },
    { id: 'page-podcast', name: 'Podcast', description: 'Подкаст', icon: '🎙️', category: 'Pages', path: '/podcast' },
    { id: 'page-videos', name: 'Videos', description: 'Видео контент', icon: '📹', category: 'Pages', path: '/videos' },
    { id: 'page-events', name: 'Events', description: 'Мероприятия', icon: '📅', category: 'Pages', path: '/events' },
    { id: 'page-testimonials', name: 'Testimonials', description: 'Отзывы', icon: '⭐', category: 'Pages', path: '/testimonials' },
    { id: 'page-case-studies', name: 'Case Studies', description: 'Кейсы', icon: '📋', category: 'Pages', path: '/case-studies' },
    { id: 'page-faq', name: 'FAQ', description: 'Частые вопросы', icon: '❓', category: 'Pages', path: '/faq' },
    { id: 'page-contact', name: 'Contact', description: 'Контакты', icon: '📞', category: 'Pages', path: '/contact' },
    { id: 'page-affiliates', name: 'Affiliates', description: 'Партнёрская программа', icon: '🤝', category: 'Pages', path: '/affiliates' },
    { id: 'page-press', name: 'Press', description: 'Для прессы', icon: '📰', category: 'Pages', path: '/press' },
    { id: 'page-admin', name: 'Admin Panel', description: 'Админ панель', icon: '⚙️', category: 'Pages', path: '/admin' },
    { id: 'page-new-features', name: 'New Features Demo', description: 'Демо новых функций', icon: '✨', category: 'Pages', path: '/new-features', isNew: true },
]

// ALL FEATURES COMBINED
const allFeatures = [
    ...engagementFeatures,
    ...gamificationFeatures,
    ...interactiveFeatures,
    ...aiFeatures,
    ...effectsFeatures,
    ...conversionFeatures,
    ...pageFeatures,
]

const categories = [
    { id: 'all', name: 'Все', icon: '📋', count: allFeatures.length },
    { id: 'Engagement', name: 'Engagement', icon: '🎯', count: engagementFeatures.length },
    { id: 'Gamification', name: 'Gamification', icon: '🎮', count: gamificationFeatures.length },
    { id: 'Interactive', name: 'Interactive', icon: '⚡', count: interactiveFeatures.length },
    { id: 'AI', name: 'AI', icon: '🤖', count: aiFeatures.length },
    { id: 'Effects', name: 'Effects', icon: '✨', count: effectsFeatures.length },
    { id: 'Conversion', name: 'Conversion', icon: '💰', count: conversionFeatures.length },
    { id: 'Pages', name: 'Pages', icon: '📄', count: pageFeatures.length },
]

// Feature Card Component
function FeatureCard({ feature }: { feature: Feature }) {
    return (
        <div className="bg-card border rounded-xl p-4 hover:border-primary/50 hover:-translate-y-1 transition-all cursor-pointer group relative">
            {feature.isNew && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">NEW</span>
            )}
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm truncate">{feature.name}</h3>
                        {feature.path && <ExternalLink className="w-3 h-3 text-muted-foreground" />}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{feature.description}</p>
                </div>
            </div>
            {feature.path && (
                <Link href={feature.path} className="absolute inset-0" />
            )}
        </div>
    )
}

export default function FeaturesShowcase() {
    const spinWheel = useSpinWheel()
    const [activeCategory, setActiveCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredFeatures = allFeatures.filter(f => {
        const matchesCategory = activeCategory === 'all' || f.category === activeCategory
        const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="min-h-screen">
            <ReadingProgress position="top" color="gradient" height={3} />

            {/* Hero */}
            <section className="relative py-16 overflow-hidden">
                <LiquidBlobBackground className="opacity-20" />
                <div className="container relative mx-auto px-4 max-w-6xl text-center">
                    <Badge className="mb-4" variant="outline">🚀 {allFeatures.length}+ ფიჩერი</Badge>
                    <ScrambleTitle text="100% ყველა ფიჩერი" className="text-4xl md:text-5xl font-bold mb-4" />
                    <TypewriterText text="ყველა ფუნქცია რაც ჩვენს პლატფორმას აქვს ერთ ადგილას ✨" className="text-lg text-muted-foreground" />

                    <div className="flex flex-wrap justify-center gap-6 mt-10">
                        <div className="text-center">
                            <AnimatedCounter value={allFeatures.length} className="text-4xl font-bold text-gradient" />
                            <div className="text-sm text-muted-foreground">Features</div>
                        </div>
                        <div className="text-center">
                            <AnimatedCounter value={categories.length - 1} className="text-4xl font-bold text-gradient" />
                            <div className="text-sm text-muted-foreground">Categories</div>
                        </div>
                        <div className="text-center">
                            <AnimatedCounter value={conversionFeatures.length} className="text-4xl font-bold text-gradient" />
                            <div className="text-sm text-muted-foreground">New Features</div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-8">
                        <MagneticButton>
                            <Button size="lg" onClick={spinWheel.open} className="gap-2">
                                <Gift className="h-5 w-5" /> მოიგე პრიზი!
                            </Button>
                        </MagneticButton>
                        <Link href="/new-features">
                            <Button size="lg" variant="outline" className="gap-2">
                                <Sparkles className="h-5 w-5" /> New Features Demo
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 max-w-7xl pb-20">
                {/* Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="🔍 ძებნა..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full max-w-md mx-auto block bg-card border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-card border hover:border-primary/50'
                                }`}
                        >
                            {cat.icon} {cat.name} ({cat.count})
                        </button>
                    ))}
                </div>

                {/* Results Count */}
                <div className="text-center text-muted-foreground text-sm mb-6">
                    ნაპოვნია: {filteredFeatures.length} ფიჩერი
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredFeatures.map(feature => (
                        <FeatureCard key={feature.id} feature={feature} />
                    ))}
                </div>

                {filteredFeatures.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        <div className="text-4xl mb-4">🔍</div>
                        <p>ფიჩერი ვერ მოიძებნა</p>
                    </div>
                )}

                {/* Interactive Demos Section */}
                <section className="mt-20 pt-10 border-t">
                    <h2 className="text-2xl font-bold text-center mb-8">🎮 ინტერაქტიული დემო</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader><CardTitle className="text-lg">🎡 Spin Wheel</CardTitle></CardHeader>
                            <CardContent>
                                <Button onClick={spinWheel.open} className="w-full gap-2"><Gift className="h-4 w-4" /> ითამაშე!</Button>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="text-lg">🔥 Streak Counter</CardTitle></CardHeader>
                            <CardContent><StreakCounter variant="badge" /></CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="text-lg">🎤 Voice Search</CardTitle></CardHeader>
                            <CardContent><VoiceSearchInput onSearch={(t) => setSearchQuery(t)} /></CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="text-lg">📝 TL;DR</CardTitle></CardHeader>
                            <CardContent><TLDRSummary summary="AI ფიჩერები" keyPoints={["Fast", "Smart"]} readingTime={2} /></CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="text-lg">🔖 Bookmark</CardTitle></CardHeader>
                            <CardContent><BookmarkButton id="demo" slug="features" title="Features" excerpt="All features" showLabel /></CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="text-lg">💬 Quote Card</CardTitle></CardHeader>
                            <CardContent><Link href="#quote"><Button variant="outline" className="w-full">შექმენი →</Button></Link></CardContent>
                        </Card>
                    </div>
                </section>

                {/* Quiz Section */}
                <section id="quiz" className="mt-20 pt-10 border-t">
                    <h2 className="text-2xl font-bold text-center mb-8">🎮 რომელი AI ხელსაწყო ხარ?</h2>
                    <div className="max-w-2xl mx-auto"><AIToolQuiz /></div>
                </section>

                {/* Quote Generator */}
                <section id="quote" className="mt-20 pt-10 border-t">
                    <h2 className="text-2xl font-bold text-center mb-8">💬 ციტატის კარტი</h2>
                    <div className="max-w-2xl mx-auto">
                        <QuoteCardGenerator quote="AI არ ჩაანაცვლებს შენ, მაგრამ ადამიანი რომელიც AI-ს იყენებს, ჩაანაცვლებს." author="Andrew Altair" source="AI ბლოგი" />
                    </div>
                </section>
            </div>

            <SpinWheel isOpen={spinWheel.isOpen} onClose={spinWheel.close} onWin={(prize) => console.log("Won:", prize)} />
            <BackToTop />
        </div>
    )
}
