'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TbRobot, TbStar, TbDownload, TbHeart, TbShare, TbShield, TbClock, TbCheck, TbArrowLeft, TbSend, TbUser, TbLock, TbShoppingCart, TbCopy, TbBolt, TbCrown, TbMessage, TbTarget, TbWorld, TbSparkles, TbTrendingUp, TbPencil, TbPalette, TbBrain, TbRocket, TbGift } from "react-icons/tb";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const iconMap: Record<string, React.ReactNode> = {
    Bot: <TbRobot className="w-12 h-12" />,
    MessageCircle: <TbMessage className="w-12 h-12" />,
    TbSparkles: <TbSparkles className="w-12 h-12" />,
    TbTrendingUp: <TbTrendingUp className="w-12 h-12" />,
    TbPencil: <TbPencil className="w-12 h-12" />,
    TbPalette: <TbPalette className="w-12 h-12" />,
    Share2: <TbShare className="w-12 h-12" />,
    Brain: <TbBrain className="w-12 h-12" />,
    TbBolt: <TbBolt className="w-12 h-12" />,
    Crown: <TbCrown className="w-12 h-12" />,
    Heart: <TbHeart className="w-12 h-12" />,
    Star: <TbStar className="w-12 h-12" />,
    Rocket: <TbRocket className="w-12 h-12" />,
    Target: <TbTarget className="w-12 h-12" />,
    Gift: <TbGift className="w-12 h-12" />,
};

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

    useEffect(() => {
        if (params.id) {
            fetchBot();
            fetchComments();
            checkPurchaseStatus();
        }
    }, [params.id]);

    const checkPurchaseStatus = async () => {
        try {
            const tempToken = localStorage.getItem('auth_token'); // Manual fallback if useAuth is slow or context issue
            const headers: HeadersInit = {};
            if (tempToken) {
                headers['Authorization'] = `Bearer ${tempToken}`;
            }

            const response = await fetch(`/api/bots/${params.id}/check-purchase`, {
                headers
            });
            const data = await response.json();
            setHasPurchased(data.hasPurchased || false);
        } catch (error) {
            console.error('Error checking purchase:', error);
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
                body: JSON.stringify({
                    botId: params.id,
                    text: newComment,
                    rating
                })
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
        if (!message.trim() || chatMessages.length >= 10) return; // 5 pairs = 10 messages

        const userMessage = { role: 'user' as const, text: message };
        setChatMessages(prev => [...prev, userMessage]);
        setChatInput('');
        setIsChatLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    botId: params.id,
                    masterPrompt: bot?.masterPrompt
                })
            });

            const data = await response.json();
            const botMessage = { role: 'bot' as const, text: data.response };
            setChatMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = { role: 'bot' as const, text: 'უკაცრავად, დაფიქსირდა შეცდომა. სცადეთ თავიდან.' };
            setChatMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const suggestedMessages = [
        'როგორ მუშაობს ეს ბოტი?',
        'რა შეუძლია ამ ბოტს?',
        'მაჩვენე მაგალითი',
        'რა არის შენი უპირატესობები?'
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
            </div>
        );
    }

    if (!bot) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">ბოტი ვერ მოიძებნა</h1>
                    <Button onClick={() => router.push('/bots')} variant="outline" className="border-violet-500/50 text-violet-400 hover:bg-violet-950/30">
                        <TbArrowLeft className="w-4 h-4 mr-2" />
                        უკან დაბრუნება
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-gray-100 font-sans selection:bg-violet-500/30">
            {/* Ambient Background Glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full blur-[100px] opacity-20 bg-gradient-to-br ${bot.color}`}></div>
                <div className="absolute top-[40%] -right-[10%] w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-10 bg-blue-600"></div>
            </div>

            {/* Hero Header */}
            <div className="relative z-10 border-b border-white/5 bg-white/5 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <Button
                        variant="ghost"
                        className="mb-8 text-gray-400 hover:text-white hover:bg-white/10"
                        onClick={() => router.push('/bots')}
                    >
                        <TbArrowLeft className="w-4 h-4 mr-2" />
                        ყველა ბოტი
                    </Button>

                    <div className="grid md:grid-cols-[auto_1fr_auto] gap-8 items-start">
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative group"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${bot.color} rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`}></div>
                            <div className="relative w-32 h-32 bg-[#12121a] rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                                <div className={`text-transparent bg-clip-text bg-gradient-to-br ${bot.color} drop-shadow-sm`}>
                                    <div className="text-white">
                                        {iconMap[bot.icon] || <TbRobot className="w-16 h-16" />}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Main Info */}
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-lg">{bot.name}</h1>
                                {bot.tier === 'premium' && (
                                    <span className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 text-amber-400 text-xs font-bold rounded-full shadow-lg flex items-center gap-1 backdrop-blur-md">
                                        <TbCrown className="w-3 h-3" />
                                        PREMIUM
                                    </span>
                                )}
                                {bot.tier === 'free' && (
                                    <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 text-green-400 text-xs font-bold rounded-full shadow-lg flex items-center gap-1 backdrop-blur-md">
                                        <TbBolt className="w-3 h-3" />
                                        უფასო
                                    </span>
                                )}
                                {bot.tier === 'private' && (
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-gray-400 text-xs font-bold rounded-full shadow-lg flex items-center gap-1 backdrop-blur-md">
                                        <TbLock className="w-3 h-3" />
                                        პირადი
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-400 font-mono">
                                    {bot.codename}
                                </span>
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-400 font-mono">
                                    v{bot.version}
                                </span>
                                {bot.isRecentlyAdded && (
                                    <span className="px-3 py-1 bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold rounded-full animate-pulse">
                                        ახალი
                                    </span>
                                )}
                                {bot.isFeatured && (
                                    <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold rounded-full flex items-center gap-1">
                                        <TbStar className="w-3 h-3 fill-current" />
                                        რჩეული
                                    </span>
                                )}
                            </div>

                            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
                                {bot.shortDescription}
                            </p>

                            {/* Stats */}
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <div className="flex items-center gap-2 bg-[#12121a]/50 border border-white/5 px-4 py-2 rounded-xl backdrop-blur-sm">
                                    <TbStar className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                                    <span className="font-bold text-lg text-white">{bot.rating}</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">რეიტინგი</span>
                                </div>
                                <div className="flex items-center gap-2 bg-[#12121a]/50 border border-white/5 px-4 py-2 rounded-xl backdrop-blur-sm">
                                    <TbDownload className="w-5 h-5 text-blue-400" />
                                    <span className="font-bold text-lg text-white">{(bot.downloads / 1000).toFixed(1)}k</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">გადმოწერა</span>
                                </div>
                                <div className="flex items-center gap-2 bg-[#12121a]/50 border border-white/5 px-4 py-2 rounded-xl backdrop-blur-sm">
                                    <TbHeart className="w-5 h-5 text-pink-400" />
                                    <span className="font-bold text-lg text-white">{bot.likes}</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">ლაიქი</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            {bot.tier === 'private' ? (
                                <Button disabled size="lg" className="w-full bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed">
                                    <TbLock className="w-5 h-5 mr-2" />
                                    პირადი ბოტი
                                </Button>
                            ) : bot.tier === 'premium' ? (
                                <Button size="lg" className="w-full bg-white text-black hover:bg-gray-200 font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105">
                                    <TbShoppingCart className="w-5 h-5 mr-2" />
                                    ყიდვა ₾{bot.price}
                                </Button>
                            ) : (
                                <Button size="lg" className="w-full bg-white text-black hover:bg-gray-200 font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105">
                                    <TbCopy className="w-5 h-5 mr-2" />
                                    კოპირება
                                </Button>
                            )}
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1 border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20">
                                    <TbHeart className="w-4 h-4 mr-1" />
                                    მოწონება
                                </Button>
                                <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20">
                                    <TbShare className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#12121a] rounded-2xl p-8 border border-white/5 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bot.color} flex items-center justify-center shadow-lg`}>
                                    <TbMessage className="w-5 h-5 text-white" />
                                </div>
                                აღწერა
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">{bot.description}</p>
                        </motion.div>

                        {/* Features */}
                        {bot.features && bot.features.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-[#12121a] rounded-2xl p-8 border border-white/5 shadow-2xl"
                            >
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/80 to-emerald-500/80 flex items-center justify-center shadow-lg">
                                        <TbCheck className="w-5 h-5 text-white" />
                                    </div>
                                    ფუნქციები
                                </h2>
                                <div className="grid gap-4">
                                    {bot.features.map((feature, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + index * 0.05 }}
                                            className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 border border-green-500/30">
                                                <TbCheck className="w-3.5 h-3.5 text-green-400" />
                                            </div>
                                            <span className="text-gray-300 font-medium">{feature}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Target Audience & Languages Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Target Audience */}
                            {bot.targetAudience && bot.targetAudience.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-[#12121a] rounded-2xl p-6 border border-white/5 shadow-2xl h-full"
                                >
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/80 to-purple-500/80 flex items-center justify-center shadow-lg">
                                            <TbTarget className="w-4 h-4 text-white" />
                                        </div>
                                        ვისთვის არის
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {bot.targetAudience.map((audience, index) => (
                                            <span key={index} className="px-4 py-2 bg-violet-500/10 text-violet-300 rounded-lg text-sm font-semibold border border-violet-500/20">
                                                {audience}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Languages */}
                            {bot.languages && bot.languages.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-[#12121a] rounded-2xl p-6 border border-white/5 shadow-2xl h-full"
                                >
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/80 to-cyan-500/80 flex items-center justify-center shadow-lg">
                                            <TbWorld className="w-4 h-4 text-white" />
                                        </div>
                                        ენები
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {bot.languages.map((lang, index) => (
                                            <span key={index} className="px-4 py-2 bg-blue-500/10 text-blue-300 rounded-lg text-sm font-semibold border border-blue-500/20">
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
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-[#12121a] rounded-2xl p-8 border border-white/5 shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/80 to-pink-500/80 flex items-center justify-center shadow-lg">
                                    <TbMessage className="w-5 h-5 text-white" />
                                </div>
                                კომენტარები <span className="text-gray-500 text-lg">({comments.length})</span>
                            </h2>

                            {/* Add Comment Form */}
                            {checkingPurchase ? (
                                <div className="mb-8 p-8 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                                    <div className="flex items-center justify-center gap-3 text-gray-400">
                                        <div className="animate-spin w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full" />
                                        <span>მოწმდება უფლებები...</span>
                                    </div>
                                </div>
                            ) : !hasPurchased ? (
                                <div className="mb-8 p-8 bg-gradient-to-br from-amber-900/10 to-orange-900/10 rounded-2xl border border-amber-500/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                                            <TbLock className="w-6 h-6 text-amber-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">
                                                მხოლოდ მყიდველებს შეუძლიათ კომენტარი
                                            </h3>
                                            <p className="text-gray-400 text-sm">
                                                შეიძინე ბოტი რომ დატოვო შეფასება.
                                            </p>
                                        </div>
                                        <div className="ml-auto">
                                            {bot?.tier === 'premium' && (
                                                <Button size="sm" className="bg-amber-500 text-black hover:bg-amber-400 font-bold">
                                                    ყიდვა
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="mb-6">
                                        <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">
                                            შეაფასე
                                        </label>
                                        <div className="flex items-center gap-2 p-4 bg-[#0a0a0f] rounded-xl border border-white/10">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <motion.button
                                                    key={star}
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => setRating(star)}
                                                    className="transition-all focus:outline-none"
                                                >
                                                    <TbStar
                                                        className={`w-8 h-8 ${star <= rating
                                                            ? 'fill-yellow-500 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]'
                                                            : 'text-gray-700 hover:text-gray-500'
                                                            }`}
                                                    />
                                                </motion.button>
                                            ))}
                                            <span className="ml-auto text-2xl font-bold text-white font-mono">
                                                {rating}.0
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">
                                            შენი აზრი
                                        </label>
                                        <Textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="გაუზიარე შენი გამოცდილება..."
                                            className="min-h-[120px] bg-[#0a0a0f] border-white/10 focus:border-violet-500 text-white placeholder:text-gray-600 rounded-xl resize-none"
                                            rows={5}
                                        />
                                    </div>

                                    <Button
                                        onClick={handleSubmitComment}
                                        disabled={!newComment.trim()}
                                        className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-6 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all"
                                    >
                                        <TbSend className="w-5 h-5 mr-2" />
                                        კომენტარის გაგზავნა
                                    </Button>
                                </div>
                            )}

                            {/* Comments List */}
                            <div className="space-y-4">
                                {comments.length === 0 ? (
                                    <div className="text-center py-12 border border-white/5 rounded-2xl bg-white/[0.02]">
                                        <TbMessage className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                                        <p className="text-gray-500">
                                            ჯერ არ არის კომენტარები.
                                        </p>
                                    </div>
                                ) : (
                                    comments.map((comment) => (
                                        <motion.div
                                            key={comment.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-5 bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 rounded-xl transition-colors"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-white flex-shrink-0 ring-2 ring-white/10">
                                                    {comment.userAvatar ? (
                                                        <img
                                                            src={comment.userAvatar}
                                                            alt={comment.userName}
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <TbUser className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-bold text-white text-base">
                                                            {comment.userName}
                                                        </span>
                                                        <span className="text-xs text-gray-600 font-mono">
                                                            {new Date(comment.createdAt).toLocaleDateString('ka-GE')}
                                                        </span>
                                                    </div>


                                                    {comment.rating && (
                                                        <div className="flex items-center gap-0.5 mb-2">
                                                            {[...Array(5)].map((_, i) => (
                                                                <TbStar
                                                                    key={i}
                                                                    className={`w-3.5 h-3.5 ${i < comment.rating! ? 'fill-yellow-500 text-yellow-500' : 'text-gray-800'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                    <p className="text-gray-400 text-sm leading-relaxed">{comment.text}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Creator Info */}
                        {bot.creator && (
                            <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6 shadow-xl">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">შემქმნელი</h3>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-2xl flex items-center justify-center text-white">
                                        {bot.creator.avatar ? (
                                            <img
                                                src={bot.creator.avatar}
                                                alt={bot.creator.name}
                                                className="w-full h-full rounded-2xl object-cover"
                                            />
                                        ) : (
                                            <TbUser className="w-6 h-6 text-violet-400" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-white text-lg">{bot.creator.name}</span>
                                            {bot.creator.verified && (
                                                <TbCheck className="w-4 h-4 text-blue-400 bg-blue-400/10 rounded-full p-0.5" />
                                            )}
                                        </div>
                                        {bot.creator.bio && (
                                            <p className="text-xs text-gray-500 line-clamp-1">{bot.creator.bio}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                                        <div className="text-xs text-gray-500 mb-1">გაყიდვები</div>
                                        <div className="font-mono font-bold text-white">{bot.creator.totalSales}</div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                                        <div className="text-xs text-gray-500 mb-1">რეიტინგი</div>
                                        <div className="font-mono font-bold text-yellow-400 flex items-center justify-center gap-1">
                                            {bot.creator.rating} <TbStar className="w-3 h-3 fill-current" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Chat with Bot */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#12121a] rounded-2xl p-1 shadow-2xl border border-white/10 overflow-hidden"
                        >
                            <div className="bg-[#0a0a0f] rounded-xl p-4 min-h-[400px] flex flex-col">
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${bot.color.includes('green') ? 'bg-green-500' : 'bg-green-500'} animate-pulse`}></div>
                                        Live Demo
                                    </h3>
                                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-500 font-mono">
                                        LIMITED PREVIEW
                                    </span>
                                </div>

                                {/* Chat Messages */}
                                <div className="flex-1 space-y-4 mb-4 overflow-y-auto custom-scrollbar pr-2">
                                    {chatMessages.length === 0 ? (
                                        <div className="text-center py-8 opacity-50">
                                            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${bot.color} flex items-center justify-center opacity-20`}>
                                                <TbMessage className="w-8 h-8 text-white" />
                                            </div>
                                            <p className="text-xs text-gray-400">
                                                დაუსვი კითხვა ბოტს.<br />
                                                უფასო: 5 მესიჯი
                                            </p>
                                        </div>
                                    ) : (
                                        chatMessages.map((msg, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                                        ? 'bg-violet-600/20 text-violet-100 border border-violet-500/30 rounded-br-none'
                                                        : 'bg-white/10 text-gray-300 border border-white/5 rounded-bl-none'
                                                    }`}>
                                                    {msg.text}
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                    {isChatLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-white/5 rounded-2xl px-4 py-3 rounded-bl-none">
                                                <div className="flex gap-1">
                                                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Quick Suggestions */}
                                {chatMessages.length === 0 && (
                                    <div className="mb-4 grid grid-cols-1 gap-2">
                                        {suggestedMessages.slice(0, 2).map((msg, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSendMessage(msg)}
                                                className="text-left text-xs px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-lg text-gray-400 hover:text-white transition-all truncate"
                                            >
                                                {msg}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Input Area */}
                                <div className="mt-auto relative">
                                    {chatMessages.length >= 10 ? (
                                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-20">
                                            <div className="text-center p-4">
                                                <TbLock className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                                                <p className="text-xs text-gray-400 mb-2">ლიმიტი ამოიწურა</p>
                                                <Button size="sm" className="h-8 text-xs bg-amber-600 hover:bg-amber-500 text-white border-none">
                                                    ყიდვა
                                                </Button>
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(chatInput)}
                                            placeholder="მესიჯი..."
                                            disabled={isChatLoading || chatMessages.length >= 10}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all disabled:opacity-50"
                                        />
                                        <Button
                                            onClick={() => handleSendMessage(chatInput)}
                                            disabled={!chatInput.trim() || isChatLoading || chatMessages.length >= 10}
                                            size="icon"
                                            className="bg-white text-black hover:bg-gray-200 rounded-xl w-10 h-10 flex-shrink-0"
                                        >
                                            <TbSend className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    {chatMessages.length > 0 && (
                                        <div className="text-[10px] text-center mt-2 text-gray-600 font-mono">
                                            {Math.floor(chatMessages.length / 2)}/5 უფასო მესიჯი
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Guarantees */}
                        {bot.guarantees && (
                            <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <TbShield className="w-4 h-4 text-green-500" />
                                    გარანტიები
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-300 p-2 rounded-lg bg-green-500/5 border border-green-500/10">
                                        <TbCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        <span>{bot.guarantees.moneyBack} დღიანი თანხის დაბრუნება</span>
                                    </div>
                                    {bot.guarantees.freeUpdates && (
                                        <div className="flex items-center gap-3 text-sm text-gray-300 p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
                                            <TbCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                            <span>უფასო განახლებები</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-sm text-gray-300 p-2 rounded-lg bg-white/5 border border-white/5">
                                        <TbClock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span>{bot.guarantees.support.type}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sticky Buy Card (Desktop) or Bottom Sheet (Mobile) - For now just a card */}
                        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-2xl p-6 shadow-[0_0_30px_rgba(124,58,237,0.4)] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-white/30 transition-colors duration-500"></div>

                            <div className="relative z-10 text-center mb-6">
                                {bot.tier === 'free' ? (
                                    <>
                                        <div className="text-3xl font-black mb-1 drop-shadow-md">უფასო</div>
                                        <div className="text-sm text-white/80">დააკოპირე და გამოიყენე</div>
                                    </>
                                ) : bot.tier === 'private' ? (
                                    <>
                                        <div className="text-3xl font-black mb-1 drop-shadow-md">პირადი</div>
                                        <div className="text-sm text-white/80">მხოლოდ შერჩეულებისთვის</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-5xl font-black mb-1 drop-shadow-md tracking-tight">{bot.price} ₾</div>
                                        <div className="text-sm text-white/80">ერთჯერადი გადახდა</div>
                                        {bot.guarantees?.moneyBack && (
                                            <div className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">
                                                {bot.guarantees.moneyBack} დღიანი გარანტია
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="relative z-10">
                                {bot.tier === 'private' ? (
                                    <Button disabled className="w-full bg-black/40 text-white cursor-not-allowed font-semibold border border-white/10 h-12">
                                        <TbLock className="w-5 h-5 mr-2" />
                                        პირადი ბოტი
                                    </Button>
                                ) : bot.tier === 'premium' ? (
                                    <Button className="w-full bg-white text-violet-900 hover:bg-gray-100 font-bold h-14 text-lg shadow-xl transition-transform hover:scale-[1.02] active:scale-[0.98]">
                                        <TbShoppingCart className="w-6 h-6 mr-2" />
                                        ყიდვა ახლავე
                                    </Button>
                                ) : (
                                    <Button className="w-full bg-white text-violet-900 hover:bg-gray-100 font-bold h-14 text-lg shadow-xl transition-transform hover:scale-[1.02] active:scale-[0.98]">
                                        <TbCopy className="w-6 h-6 mr-2" />
                                        კოპირება
                                    </Button>
                                )}
                            </div>

                            {/* Additional Info */}
                            {bot.purchasedToday && bot.purchasedToday > 0 && (
                                <div className="relative z-10 mt-6 pt-4 border-t border-white/20 text-center">
                                    <div className="text-sm font-medium text-white/90 flex items-center justify-center gap-2">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                        </span>
                                        <span className="font-bold">{bot.purchasedToday}</span> ადამიანმა იყიდა დღეს
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Savings Stats */}
                        {(bot.timeSaved || bot.moneySaved) && (
                            <div className="grid grid-cols-2 gap-4">
                                {bot.timeSaved && (
                                    <div className="bg-[#12121a] border border-white/5 rounded-2xl p-4 text-center">
                                        <div className="text-gray-500 text-xs mb-1 uppercase">დროის დაზოგვა</div>
                                        <div className="text-green-400 font-bold text-lg">{bot.timeSaved} სთ</div>
                                    </div>
                                )}
                                {bot.moneySaved && (
                                    <div className="bg-[#12121a] border border-white/5 rounded-2xl p-4 text-center">
                                        <div className="text-gray-500 text-xs mb-1 uppercase">ფულის დაზოგვა</div>
                                        <div className="text-green-400 font-bold text-lg">₾{bot.moneySaved}</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
