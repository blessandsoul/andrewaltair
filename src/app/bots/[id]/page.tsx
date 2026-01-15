'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { TbRobot, TbStar, TbDownload, TbHeart, TbShare, TbShield, TbClock, TbCheck, TbArrowLeft, TbSend, TbUser, TbLock, TbShoppingCart, TbCopy, TbBolt, TbCrown, TbMessage, TbTarget, TbWorld, TbSparkles, TbTrendingUp, TbPencil, TbPalette, TbBrain, TbRocket, TbGift, TbFlame, TbUsers, TbChevronDown, TbPlayerPlay, TbX } from "react-icons/tb";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// ═══════════════════════════════════════════════════════════════════════════
// ICON MAP
// ═══════════════════════════════════════════════════════════════════════════
const iconMap: Record<string, React.ReactNode> = {
    Bot: <TbRobot className="w-10 h-10" />,
    MessageCircle: <TbMessage className="w-10 h-10" />,
    TbSparkles: <TbSparkles className="w-10 h-10" />,
    TbTrendingUp: <TbTrendingUp className="w-10 h-10" />,
    TbPencil: <TbPencil className="w-10 h-10" />,
    TbPalette: <TbPalette className="w-10 h-10" />,
    Share2: <TbShare className="w-10 h-10" />,
    Brain: <TbBrain className="w-10 h-10" />,
    TbBolt: <TbBolt className="w-10 h-10" />,
    Crown: <TbCrown className="w-10 h-10" />,
    Heart: <TbHeart className="w-10 h-10" />,
    Star: <TbStar className="w-10 h-10" />,
    Rocket: <TbRocket className="w-10 h-10" />,
    Target: <TbTarget className="w-10 h-10" />,
    Gift: <TbGift className="w-10 h-10" />,
};

// ═══════════════════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════════════════
interface AIBot {
    id: string;
    name: string;
    codename: string;
    version: string;
    description: string;
    shortDescription: string;
    category: string;
    tier: 'free' | 'premium' | 'private';
    price?: number;
    icon: string;
    color: string;
    features: string[];
    masterPrompt?: string;
    rating: number;
    downloads: number;
    likes: number;
    isRecentlyAdded?: boolean;
    isFeatured?: boolean;
    targetAudience?: string[];
    languages?: string[];
    purchasedToday?: number;
    responseTime?: string;
    timeSaved?: string;
    moneySaved?: string;
    creator?: {
        name: string;
        avatar?: string;
        bio?: string;
        verified: boolean;
        totalSales: number;
        rating: number;
        responseTime?: string;
    };
    guarantees?: {
        moneyBack: number;
        freeUpdates: boolean;
        support: {
            type: string;
            responseTime: string;
            languages: string[];
        };
        warranty?: string;
    };
    // Marketplace Features
    salePrice?: number;
    saleEndsAt?: string;
    updates?: {
        lastUpdated: string;
        changelog: Array<{
            version: string;
            date: string;
            changes: string[];
        }>;
    };
}

interface BotVersion {
    _id: string;
    version: string;
    description: string;
    changelog: string[];
    createdAt: string;
}

interface Comment {
    id: string;
    botId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    text: string;
    rating?: number;
    createdAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function BotDetailPage() {
    const params = useParams();
    const router = useRouter();

    const [bot, setBot] = useState<AIBot | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(5);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [checkingPurchase, setCheckingPurchase] = useState(true);
    const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'bot'; text: string }>>([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [versions, setVersions] = useState<BotVersion[]>([]);
    const [activeTab, setActiveTab] = useState<'description' | 'history' | 'reviews'>('description');

    useEffect(() => {
        if (params.id) {
            fetchBot();
            fetchVersions(); // New
            fetchComments();
            checkPurchaseStatus();
            checkWishlistStatus(); // New
        }
    }, [params.id]);

    const checkWishlistStatus = async () => {
        try {
            // Auth check handled in API or assumes user is logged in for personalized features
            // For now simple fetch
            const response = await fetch(`/api/bots/${params.id}/wishlist`);
            const data = await response.json();
            setIsWishlisted(data.isWishlisted);
        } catch (e) { console.error(e); }
    };

    const toggleWishlist = async () => {
        try {
            const response = await fetch(`/api/bots/${params.id}/wishlist`, { method: 'POST' });
            if (response.ok) {
                const data = await response.json();
                setIsWishlisted(data.isWishlisted);
            }
        } catch (e) { console.error(e); }
    };

    const fetchVersions = async () => {
        try {
            const response = await fetch(`/api/bots/${params.id}/versions`);
            const data = await response.json();
            setVersions(data.versions || []);
        } catch (e) { console.error(e); }
    };

    const checkPurchaseStatus = async () => {
        try {
            const tempToken = localStorage.getItem('auth_token');
            const headers: HeadersInit = {};
            if (tempToken) headers['Authorization'] = `Bearer ${tempToken}`;
            const response = await fetch(`/api/bots/${params.id}/check-purchase`, { headers });
            const data = await response.json();
            setHasPurchased(data.hasPurchased || false);
        } catch (error) {
            setHasPurchased(false);
        } finally {
            setCheckingPurchase(false);
        }
    };

    const fetchBot = async () => {
        try {
            const response = await fetch(`/api/bots/${params.id}`);
            const data = await response.json();
            setBot(data);
        } catch (error) {
            console.error('Error fetching bot:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/bot-comments?botId=${params.id}`);
            const data = await response.json();
            setComments(data.comments || []);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;
        try {
            const response = await fetch('/api/bot-comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ botId: params.id, text: newComment, rating })
            });
            if (response.ok) {
                setNewComment('');
                setRating(5);
                fetchComments();
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const handleSendMessage = async (message: string) => {
        if (!message.trim() || chatMessages.length >= 10) return;
        const userMessage = { role: 'user' as const, text: message };
        setChatMessages(prev => [...prev, userMessage]);
        setChatInput('');
        setIsChatLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, botId: params.id, masterPrompt: bot?.masterPrompt })
            });
            const data = await response.json();
            setChatMessages(prev => [...prev, { role: 'bot', text: data.response }]);
        } catch (error) {
            setChatMessages(prev => [...prev, { role: 'bot', text: 'შეცდომა. სცადეთ თავიდან.' }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const suggestedMessages = ['როგორ მუშაობს?', 'რა შეუძლია?', 'მაჩვენე მაგალითი'];

    // ═══════════════════════════════════════════════════════════════════════
    // LOADING STATE
    // ═══════════════════════════════════════════════════════════════════════
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-muted/30 rounded-full" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-violet-500 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (!bot) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <TbX className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-4">ბოტი ვერ მოიძებნა</h1>
                    <Button onClick={() => router.push('/bots')} variant="outline" className="border-border">
                        <TbArrowLeft className="w-4 h-4 mr-2" />
                        უკან დაბრუნება
                    </Button>
                </div>
            </div>
        );
    }

    // SEO: Structured Data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": bot.name,
        "operatingSystem": "Web",
        "applicationCategory": bot.category,
        "offers": {
            "@type": "Offer",
            "price": bot.salePrice || bot.price || "0",
            "priceCurrency": "GEL"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": bot.rating,
            "ratingCount": bot.stats?.totalReviews || 1
        },
        "description": bot.description,
        "author": {
            "@type": "Person",
            "name": bot.creator?.name || "Andrew Altair"
        }
    };

    const tierConfig = {
        free: { label: 'უფასო', bg: 'bg-gradient-to-r from-emerald-500 to-green-500', icon: TbBolt },
        premium: { label: 'PREMIUM', bg: 'bg-gradient-to-r from-amber-500 to-orange-500', icon: TbCrown },
        private: { label: 'პირადი', bg: 'bg-gradient-to-r from-violet-500 to-purple-500', icon: TbLock }
    };

    const tierInfo = tierConfig[bot.tier] || tierConfig.free;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* ═══════════════════════════════════════════════════════════════════
                AMBIENT BACKGROUND GLOW
            ═══════════════════════════════════════════════════════════════════ */}


            {/* ═══════════════════════════════════════════════════════════════════
                HERO SECTION - LIGHT MINIMALIST
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="relative pt-8 pb-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Back button */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => router.push('/bots')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 group transition-colors"
                    >
                        <TbArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">ყველა ბოტი</span>
                    </motion.button>

                    {/* Main Hero Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border border-border shadow-xl rounded-3xl overflow-hidden"
                    >
                        {/* Gradient Header */}
                        <div className={`h-32 bg-gradient-to-br ${bot.color} relative`}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                            <div className="absolute -bottom-12 left-8">
                                <div className={`w-24 h-24 bg-gradient-to-br ${bot.color} rounded-2xl flex items-center justify-center text-white shadow-xl border-4 border-white`}>
                                    {iconMap[bot.icon] || <TbRobot className="w-12 h-12" />}
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <span className={`px-3 py-1.5 ${tierInfo.bg} text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5`}>
                                    <tierInfo.icon className="w-3.5 h-3.5" />
                                    {tierInfo.label}
                                </span>
                                {bot.isRecentlyAdded && (
                                    <span className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
                                        <TbFlame className="w-3.5 h-3.5" />
                                        ახალი
                                    </span>
                                )}
                                {bot.isFeatured && (
                                    <span className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
                                        <TbStar className="w-3.5 h-3.5 fill-current" />
                                        რჩეული
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="pt-16 pb-8 px-8">
                            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                                {/* Left: Title & Meta */}
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">
                                            {bot.codename} • v{bot.version}
                                        </span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                                        {bot.name}
                                    </h1>
                                    <p className="text-lg text-muted-foreground max-w-xl">
                                        {bot.shortDescription}
                                    </p>
                                </div>

                                {/* Right: Stats */}
                                <div className="flex flex-wrap gap-4">
                                    {[
                                        { icon: TbStar, value: bot.rating.toFixed(1), label: 'რეიტინგი', color: 'text-amber-500', fill: true },
                                        { icon: TbDownload, value: `${(bot.downloads / 1000).toFixed(1)}k`, label: 'გადმოწერა', color: 'text-blue-500' },
                                        { icon: TbHeart, value: bot.likes, label: 'ლაიქი', color: 'text-pink-500' },
                                    ].map((stat, i) => (
                                        <div key={i} className="flex items-center gap-3 px-4 py-3 bg-secondary/50 border border-border rounded-xl">
                                            <stat.icon className={`w-5 h-5 ${stat.color} ${stat.fill ? 'fill-current' : ''}`} />
                                            <div>
                                                <div className="text-lg font-bold text-foreground">{stat.value}</div>
                                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-border">
                                {bot.tier === 'premium' ? (
                                    <Button className={`px-6 py-3 h-auto bg-gradient-to-r ${bot.color} text-white font-bold text-base shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]`}>
                                        <TbShoppingCart className="w-5 h-5 mr-2" />
                                        {bot.salePrice ? (
                                            <div className="flex flex-col items-start leading-tight">
                                                <span className="text-[10px] opacity-80 line-through">₾{bot.price}</span>
                                                <span>ყიდვა — ₾{bot.salePrice}</span>
                                            </div>
                                        ) : (
                                            <span>ყიდვა — ₾{bot.price}</span>
                                        )}
                                    </Button>
                                ) : bot.tier === 'free' ? (
                                    <Button className="px-6 py-3 h-auto bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                                        <TbCopy className="w-5 h-5 mr-2" />
                                        კოპირება უფასოდ
                                    </Button>
                                ) : (
                                    <Button disabled className="px-6 py-3 h-auto bg-muted text-muted-foreground font-bold cursor-not-allowed">
                                        <TbLock className="w-5 h-5 mr-2" />
                                        პირადი ბოტი
                                    </Button>
                                )}

                                <Button
                                    variant="outline"
                                    onClick={() => setIsLiked(!isLiked)}
                                    className={`px-4 py-3 h-auto border-2 transition-all ${isLiked ? 'bg-pink-500/10 border-pink-500/30 text-pink-500' : 'border-border text-muted-foreground hover:border-pink-500/30 hover:text-pink-500'}`}
                                >
                                    <TbHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={toggleWishlist}
                                    className={`px-4 py-3 h-auto border-2 transition-all ${isWishlisted ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'border-border text-muted-foreground hover:border-amber-500/30 hover:text-amber-500'}`}
                                >
                                    <TbStar className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                </Button>

                                <Button variant="outline" className="px-4 py-3 h-auto border-2 border-border text-muted-foreground hover:border-blue-500/30 hover:text-blue-500">
                                    <TbShare className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                MAIN CONTENT GRID
            ═══════════════════════════════════════════════════════════════════ */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 pb-20">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-card border border-border shadow-lg rounded-2xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bot.color} flex items-center justify-center text-white`}>
                                    <TbMessage className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">აღწერა</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {bot.description}
                            </p>

                            {/* Version History Section */}
                            {versions.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-border">
                                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                        <TbClock className="w-5 h-5 text-muted-foreground" />
                                        ისტორია
                                    </h3>
                                    <div className="space-y-4">
                                        {versions.map((ver) => (
                                            <div key={ver._id} className="relative pl-4 border-l-2 border-border">
                                                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-muted-foreground" />
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-bold text-foreground">v{ver.version}</span>
                                                    <span className="text-xs text-muted-foreground">{new Date(ver.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{ver.description}</p>
                                                {ver.changelog?.length > 0 && (
                                                    <ul className="mt-2 space-y-1">
                                                        {ver.changelog.map((change, i) => (
                                                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                                                <span className="mt-1 w-1 h-1 rounded-full bg-primary/50" />
                                                                {change}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Features */}
                        {bot.features?.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-card border border-border shadow-lg rounded-2xl p-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white">
                                        <TbCheck className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-bold text-foreground">ფუნქციები</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {bot.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                            <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                                <TbCheck className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-foreground text-sm font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Target Audience & Languages */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {bot.targetAudience && bot.targetAudience.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-card border border-border shadow-lg rounded-2xl p-5"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <TbUsers className="w-5 h-5 text-violet-500" />
                                        <h3 className="font-bold text-foreground">ვისთვის არის</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {bot.targetAudience.map((audience, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-lg text-sm text-violet-500 font-medium">
                                                {audience}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {bot.languages && bot.languages.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-card border border-border shadow-lg rounded-2xl p-5"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <TbWorld className="w-5 h-5 text-blue-500" />
                                        <h3 className="font-bold text-foreground">ენები</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {bot.languages.map((lang, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-500 font-medium">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Comments Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-card border border-border shadow-lg rounded-2xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center text-white">
                                    <TbMessage className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">
                                    კომენტარები <span className="text-muted-foreground font-normal">({comments.length})</span>
                                </h2>
                            </div>

                            {/* Comment form */}
                            {checkingPurchase ? (
                                <div className="mb-6 p-6 bg-secondary/50 rounded-xl flex items-center justify-center gap-3 text-muted-foreground">
                                    <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-transparent rounded-full animate-spin" />
                                    <span>მოწმდება...</span>
                                </div>
                            ) : !hasPurchased ? (
                                <div className="mb-6 p-5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                        <TbLock className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-amber-500 mb-1">მხოლოდ მყიდველებს</h3>
                                        <p className="text-amber-500/80 text-sm">შეიძინე ბოტი რომ დატოვო შეფასება</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-6 p-5 bg-secondary/30 border border-border rounded-xl space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">შეფასება</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} onClick={() => setRating(star)}>
                                                    <TbStar className={`w-6 h-6 transition-colors ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted/50 hover:text-muted-foreground'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <Textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="გაუზიარე გამოცდილება..."
                                        className="min-h-[100px] bg-background border-border focus:border-violet-400 resize-none"
                                    />
                                    <Button
                                        onClick={handleSubmitComment}
                                        disabled={!newComment.trim()}
                                        className={`w-full h-11 font-bold transition-all ${newComment.trim() ? `bg-gradient-to-r ${bot.color} text-white hover:opacity-90` : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
                                    >
                                        <TbSend className="w-5 h-5 mr-2" />
                                        გაგზავნა
                                    </Button>
                                </div>
                            )}

                            {/* Comments list */}
                            <div className="space-y-4">
                                {comments.length === 0 ? (
                                    <div className="text-center py-10 border-2 border-dashed border-border rounded-xl">
                                        <TbMessage className="w-10 h-10 text-muted mx-auto mb-3" />
                                        <p className="text-muted-foreground">კომენტარები არ არის</p>
                                    </div>
                                ) : (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="p-4 bg-secondary/30 hover:bg-secondary/50 border border-border rounded-xl transition-colors">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                    {comment.userAvatar ? (
                                                        <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <TbUser className="w-5 h-5 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-semibold text-foreground">{comment.userName}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(comment.createdAt).toLocaleDateString('ka-GE')}
                                                        </span>
                                                    </div>
                                                    {comment.rating && (
                                                        <div className="flex gap-0.5 mb-2">
                                                            {[...Array(5)].map((_, i) => (
                                                                <TbStar key={i} className={`w-3.5 h-3.5 ${i < comment.rating! ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                                                            ))}
                                                        </div>
                                                    )}
                                                    <p className="text-muted-foreground text-sm">{comment.text}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN - Sidebar */}
                    <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                        {/* Live Demo Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-card border border-border shadow-lg rounded-2xl overflow-hidden"
                        >
                            <div className={`h-2 bg-gradient-to-r ${bot.color}`} />
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                            <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                                        </span>
                                        <span className="text-sm font-bold text-foreground">Live Demo</span>
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-secondary rounded text-muted-foreground font-mono">
                                        {Math.floor(chatMessages.length / 2)}/5
                                    </span>
                                </div>

                                {/* Messages */}
                                <div className="min-h-[160px] max-h-[200px] overflow-y-auto space-y-2 mb-4">
                                    {chatMessages.length === 0 ? (
                                        <div className="text-center py-6">
                                            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${bot.color} flex items-center justify-center opacity-50`}>
                                                <TbMessage className="w-6 h-6 text-white" />
                                            </div>
                                            <p className="text-xs text-muted-foreground">სცადე ბოტი — 5 მესიჯი უფასოდ</p>
                                        </div>
                                    ) : (
                                        chatMessages.map((msg, idx) => (
                                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${msg.role === 'user'
                                                    ? `bg-gradient-to-r ${bot.color} text-white rounded-br-none`
                                                    : 'bg-secondary text-secondary-foreground rounded-bl-none'
                                                    }`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {isChatLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-secondary rounded-2xl rounded-bl-none px-4 py-3">
                                                <div className="flex gap-1">
                                                    {[0, 1, 2].map((i) => (
                                                        <motion.div
                                                            key={i}
                                                            animate={{ y: [0, -4, 0] }}
                                                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                                            className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Quick suggestions */}
                                {chatMessages.length === 0 && (
                                    <div className="space-y-2 mb-4">
                                        {suggestedMessages.map((msg, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSendMessage(msg)}
                                                className="w-full text-left text-xs px-3 py-2 bg-secondary/50 hover:bg-secondary border border-border rounded-lg text-muted-foreground hover:text-foreground transition-all"
                                            >
                                                {msg}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Input */}
                                <div className="relative">
                                    {chatMessages.length >= 10 && (
                                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                                            <div className="text-center">
                                                <TbLock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                                                <p className="text-xs text-muted-foreground">ლიმიტი ამოიწურა</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(chatInput)}
                                            placeholder="მესიჯი..."
                                            disabled={isChatLoading || chatMessages.length >= 10}
                                            className="flex-1 bg-secondary/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-400 disabled:opacity-50 transition-colors"
                                        />
                                        <Button
                                            onClick={() => handleSendMessage(chatInput)}
                                            disabled={!chatInput.trim() || isChatLoading || chatMessages.length >= 10}
                                            size="icon"
                                            className={`w-10 h-10 rounded-xl transition-all ${chatInput.trim() ? `bg-gradient-to-r ${bot.color}` : 'bg-muted'}`}
                                        >
                                            <TbSend className={`w-4 h-4 ${chatInput.trim() ? 'text-white' : 'text-muted-foreground'}`} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Price Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${bot.color} text-white shadow-xl`}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                            <div className="relative z-10 text-center">
                                {bot.tier === 'free' ? (
                                    <>
                                        <div className="text-3xl font-black mb-1">უფასო</div>
                                        <div className="text-sm text-white/80 mb-5">დააკოპირე და გამოიყენე</div>
                                    </>
                                ) : bot.tier === 'private' ? (
                                    <>
                                        <div className="text-3xl font-black mb-1">პირადი</div>
                                        <div className="text-sm text-white/80 mb-5">ექსკლუზიური წვდომა</div>
                                    </>
                                ) : (
                                    <>
                                        {bot.salePrice ? (
                                            <div className="mb-5">
                                                <div className="text-xl text-white/60 line-through decoration-white/40 decoration-2">{bot.price} ₾</div>
                                                <div className="text-6xl font-black mb-1">{bot.salePrice} ₾</div>
                                                {bot.saleEndsAt && (
                                                    <div className="text-sm font-bold text-amber-300 animate-pulse">
                                                        აქცია სრულდება: {new Date(bot.saleEndsAt).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-5xl font-black mb-1">{bot.price} ₾</div>
                                        )}
                                        <div className="text-sm text-white/80 mb-1">ერთჯერადი გადახდა</div>
                                        {bot.guarantees?.moneyBack && (
                                            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-5">
                                                {bot.guarantees.moneyBack} დღიანი გარანტია
                                            </div>
                                        )}
                                    </>
                                )}

                                {bot.tier === 'private' ? (
                                    <Button disabled className="w-full h-12 bg-black/20 text-white cursor-not-allowed font-bold rounded-xl">
                                        <TbLock className="w-5 h-5 mr-2" />
                                        პირადი
                                    </Button>
                                ) : (
                                    <Button className="w-full h-12 bg-card text-foreground hover:bg-muted font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02]">
                                        {bot.tier === 'premium' ? (
                                            <>
                                                <TbShoppingCart className="w-5 h-5 mr-2" />
                                                ყიდვა ახლავე
                                            </>
                                        ) : (
                                            <>
                                                <TbCopy className="w-5 h-5 mr-2" />
                                                კოპირება
                                            </>
                                        )}
                                    </Button>
                                )}

                                {bot.purchasedToday && bot.purchasedToday > 0 && (
                                    <div className="mt-5 pt-4 border-t border-white/20 flex items-center justify-center gap-2 text-sm">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute h-full w-full rounded-full bg-red-300 opacity-75" />
                                            <span className="relative h-2 w-2 rounded-full bg-red-400" />
                                        </span>
                                        <span><strong>{bot.purchasedToday}</strong> იყიდა დღეს</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Guarantees */}
                        {bot.guarantees && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-card border border-border shadow-lg rounded-2xl p-5"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <TbShield className="w-5 h-5 text-emerald-500" />
                                    <h3 className="font-bold text-foreground">გარანტიები</h3>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-600">
                                        <TbCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        <span>{bot.guarantees.moneyBack} დღიანი თანხის დაბრუნება</span>
                                    </div>
                                    {bot.guarantees.freeUpdates && (
                                        <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm text-blue-600">
                                            <TbCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                            <span>უფასო განახლებები</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 p-3 bg-secondary/50 border border-border rounded-xl text-sm text-muted-foreground">
                                        <TbClock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                        <span>{bot.guarantees.support.type}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Creator info */}
                        {bot.creator && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-card border border-border shadow-lg rounded-2xl p-5"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 border border-border flex items-center justify-center overflow-hidden">
                                        {bot.creator.avatar ? (
                                            <img src={bot.creator.avatar} alt={bot.creator.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <TbUser className="w-6 h-6 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-foreground">{bot.creator.name}</span>
                                            {bot.creator.verified && (
                                                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                                                    <TbCheck className="w-2.5 h-2.5 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        {bot.creator.bio && (
                                            <p className="text-xs text-muted-foreground line-clamp-1">{bot.creator.bio}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-secondary/30 rounded-xl p-3 text-center border border-border">
                                        <div className="text-xs text-muted-foreground mb-1">გაყიდვები</div>
                                        <div className="font-bold text-foreground">{bot.creator.totalSales}</div>
                                    </div>
                                    <div className="bg-secondary/30 rounded-xl p-3 text-center border border-border">
                                        <div className="text-xs text-muted-foreground mb-1">რეიტინგი</div>
                                        <div className="font-bold text-amber-500 flex items-center justify-center gap-1">
                                            {bot.creator.rating} <TbStar className="w-3 h-3 fill-current" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div >
            </div >
        </div >
    );
}
