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
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!bot) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-4">ბოტი ვერ მოიძებნა</h1>
                    <Button onClick={() => router.push('/bots')}>
                        <TbArrowLeft className="w-4 h-4 mr-2" />
                        უკან დაბრუნება
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Hero Header */}
            <div className={`relative bg-gradient-to-br ${bot.color} text-white overflow-hidden`}>
                {/* Decorative Background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 py-12">
                    <Button
                        variant="ghost"
                        className="mb-8 text-white hover:bg-white/20 backdrop-blur-sm"
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
                            className="w-32 h-32 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white/30"
                        >
                            <div className="text-white">
                                {iconMap[bot.icon] || <TbRobot className="w-16 h-16" />}
                            </div>
                        </motion.div>

                        {/* Main Info */}
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-5xl font-black tracking-tight">{bot.name}</h1>
                                {bot.tier === 'premium' && (
                                    <span className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-1">
                                        <TbCrown className="w-4 h-4" />
                                        PREMIUM
                                    </span>
                                )}
                                {bot.tier === 'free' && (
                                    <span className="px-4 py-1.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-1">
                                        <TbBolt className="w-4 h-4" />
                                        უფასო
                                    </span>
                                )}
                                {bot.tier === 'private' && (
                                    <span className="px-4 py-1.5 bg-black/50 backdrop-blur-sm text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-1">
                                        <TbLock className="w-4 h-4" />
                                        პირადი
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                                    {bot.codename}
                                </span>
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                                    v{bot.version}
                                </span>
                                {bot.isRecentlyAdded && (
                                    <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold rounded-full shadow-lg animate-pulse">
                                        ახალი
                                    </span>
                                )}
                                {bot.isFeatured && (
                                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-1">
                                        <TbStar className="w-3 h-3 fill-current" />
                                        რჩეული
                                    </span>
                                )}
                            </div>

                            <p className="text-2xl font-medium text-white/95 leading-relaxed max-w-3xl">
                                {bot.shortDescription}
                            </p>

                            {/* Stats */}
                            <div className="flex flex-wrap items-center gap-6 pt-2">
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                                    <TbStar className="w-5 h-5 fill-current text-yellow-300" />
                                    <span className="font-bold text-lg">{bot.rating}</span>
                                    <span className="text-sm text-white/70">რეიტინგი</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                                    <TbDownload className="w-5 h-5" />
                                    <span className="font-bold text-lg">{(bot.downloads / 1000).toFixed(1)}k</span>
                                    <span className="text-sm text-white/70">ჩამოტვირთვა</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                                    <TbHeart className="w-5 h-5" />
                                    <span className="font-bold text-lg">{bot.likes}</span>
                                    <span className="text-sm text-white/70">მოწონება</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            {bot.tier === 'private' ? (
                                <Button disabled size="lg" className="bg-gray-500/50 text-white cursor-not-allowed backdrop-blur-sm">
                                    <TbLock className="w-5 h-5 mr-2" />
                                    პირადი ბოტი
                                </Button>
                            ) : bot.tier === 'premium' ? (
                                <Button size="lg" className="bg-white text-violet-600 hover:bg-white/90 font-bold shadow-2xl">
                                    <TbShoppingCart className="w-5 h-5 mr-2" />
                                    ყიდვა ₾{bot.price}
                                </Button>
                            ) : (
                                <Button size="lg" className="bg-white text-violet-600 hover:bg-white/90 font-bold shadow-2xl">
                                    <TbCopy className="w-5 h-5 mr-2" />
                                    კოპირება
                                </Button>
                            )}
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20">
                                    <TbHeart className="w-4 h-4 mr-1" />
                                    მოწონება
                                </Button>
                                <Button variant="outline" size="sm" className="border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20">
                                    <TbShare className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bot.color} flex items-center justify-center`}>
                                    <TbMessage className="w-5 h-5 text-white" />
                                </div>
                                აღწერა
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">{bot.description}</p>
                        </motion.div>

                        {/* Features */}
                        {bot.features && bot.features.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                            >
                                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
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
                                            className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <TbCheck className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-gray-700 font-medium">{feature}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Target Audience */}
                        {bot.targetAudience && bot.targetAudience.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                            >
                                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                                        <TbTarget className="w-5 h-5 text-white" />
                                    </div>
                                    ვისთვის არის განკუთვნილი
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {bot.targetAudience.map((audience, index) => (
                                        <span key={index} className="px-5 py-2.5 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 rounded-xl text-base font-semibold border border-violet-200">
                                            {audience}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* TbLanguage */}
                        {bot.languages && bot.languages.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                            >
                                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                        <TbWorld className="w-5 h-5 text-white" />
                                    </div>
                                    ენები
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {bot.languages.map((lang, index) => (
                                        <span key={index} className="px-5 py-2.5 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-xl text-base font-semibold border border-blue-200">
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Comments Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    <TbMessage className="w-5 h-5 text-white" />
                                </div>
                                კომენტარები ({comments.length})
                            </h2>

                            {/* Add Comment Form */}
                            {checkingPurchase ? (
                                <div className="mb-8 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                                    <div className="flex items-center justify-center gap-3 text-gray-500">
                                        <div className="animate-spin w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full" />
                                        <span>იტვირთება...</span>
                                    </div>
                                </div>
                            ) : !hasPurchased ? (
                                <div className="mb-8 p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                                            <TbLock className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                მხოლოდ მყიდველებს შეუძლიათ კომენტარის დატოვება
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                ამ ბოტზე კომენტარის დასატოვებლად, ჯერ უნდა შეიძინო იგი.
                                            </p>
                                            {bot?.tier === 'premium' && (
                                                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                                                    <TbShoppingCart className="w-4 h-4 mr-2" />
                                                    ყიდვა ₾{bot.price}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-8 p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border-2 border-violet-200">
                                    <div className="mb-6">
                                        <label className="block text-base font-bold text-gray-900 mb-3">
                                            შეაფასე ბოტი
                                        </label>
                                        <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-violet-100">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <motion.button
                                                    key={star}
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => setRating(star)}
                                                    className="transition-all"
                                                >
                                                    <TbStar
                                                        className={`w-8 h-8 ${star <= rating
                                                            ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg'
                                                            : 'text-gray-300 hover:text-gray-400'
                                                            }`}
                                                    />
                                                </motion.button>
                                            ))}
                                            <span className="ml-3 text-2xl font-bold text-violet-600">
                                                {rating}.0
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-base font-bold text-gray-900 mb-3">
                                            შენი აზრი
                                        </label>
                                        <Textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="გაუზიარე შენი გამოცდილება ამ ბოტთან..."
                                            className="min-h-[120px] text-base border-2 border-violet-200 focus:border-violet-400 rounded-xl resize-none"
                                            rows={5}
                                        />
                                    </div>

                                    <Button
                                        onClick={handleSubmitComment}
                                        disabled={!newComment.trim()}
                                        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold py-3 text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <TbSend className="w-5 h-5 mr-2" />
                                        კომენტარის გაგზავნა
                                    </Button>
                                </div>
                            )}

                            {/* Comments List */}
                            <div className="space-y-4">
                                {comments.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        ჯერ არ არის კომენტარები. იყავი პირველი!
                                    </p>
                                ) : (
                                    comments.map((comment) => (
                                        <motion.div
                                            key={comment.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 bg-secondary/20 rounded-lg"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                                                    {comment.userAvatar ? (
                                                        <img
                                                            src={comment.userAvatar}
                                                            alt={comment.userName}
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <TbUser className="w-5 h-5" />
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold text-foreground">
                                                            {comment.userName}
                                                        </span>
                                                        {comment.rating && (
                                                            <div className="flex items-center gap-1">
                                                                <TbStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                                <span className="text-sm text-muted-foreground">
                                                                    {comment.rating}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-muted-foreground mb-2">{comment.text}</p>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(comment.createdAt).toLocaleDateString('ka-GE')}
                                                    </span>
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
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h3 className="text-lg font-bold text-foreground mb-4">შემქმნელი</h3>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                                        {bot.creator.avatar ? (
                                            <img
                                                src={bot.creator.avatar}
                                                alt={bot.creator.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <TbUser className="w-6 h-6" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-foreground">{bot.creator.name}</span>
                                            {bot.creator.verified && (
                                                <TbCheck className="w-4 h-4 text-blue-500" />
                                            )}
                                        </div>
                                        {bot.creator.bio && (
                                            <p className="text-xs text-muted-foreground">{bot.creator.bio}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">გაყიდვები:</span>
                                        <span className="font-semibold">{bot.creator.totalSales}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">რეიტინგი:</span>
                                        <span className="font-semibold">{bot.creator.rating} ⭐</span>
                                    </div>
                                    {bot.creator.responseTime && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">პასუხის დრო:</span>
                                            <span className="font-semibold">{bot.creator.responseTime}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Chat with Bot */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${bot.color} flex items-center justify-center`}>
                                    <TbMessage className="w-4 h-4 text-white" />
                                </div>
                                ჩატი ბოტთან
                            </h3>

                            {/* Chat Messages */}
                            <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
                                {chatMessages.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${bot.color} flex items-center justify-center`}>
                                            {iconMap[bot.icon] || <TbRobot className="w-8 h-8 text-white" />}
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4">
                                            გამოსცადე ბოტი უფასოდ!<br />
                                            მაქსიმუმ 5 შეკითხვა
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
                                            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${msg.role === 'user'
                                                ? `bg-gradient-to-br ${bot.color} text-white`
                                                : 'bg-gray-100 text-gray-900'
                                                }`}>
                                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                                {isChatLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 rounded-2xl px-4 py-2.5">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Message limit indicator */}
                            {chatMessages.length > 0 && (
                                <div className="mb-3 text-center">
                                    <span className="text-xs text-gray-500">
                                        {Math.floor(chatMessages.length / 2)}/5 შეკითხვა
                                    </span>
                                </div>
                            )}

                            {/* Suggested Messages */}
                            {chatMessages.length === 0 && (
                                <div className="mb-4 space-y-2">
                                    <p className="text-xs font-semibold text-gray-700 mb-2">სწრაფი შეკითხვები:</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {suggestedMessages.map((msg, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSendMessage(msg)}
                                                disabled={chatMessages.length >= 10}
                                                className="text-left text-sm px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {msg}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Input */}
                            {chatMessages.length < 10 ? (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(chatInput)}
                                        placeholder="დაწერე შეკითხვა..."
                                        disabled={isChatLoading}
                                        className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-violet-400 focus:outline-none text-sm disabled:opacity-50"
                                    />
                                    <Button
                                        onClick={() => handleSendMessage(chatInput)}
                                        disabled={!chatInput.trim() || isChatLoading}
                                        className={`bg-gradient-to-r ${bot.color} text-white px-4 disabled:opacity-50`}
                                    >
                                        <TbSend className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                    <p className="text-sm text-amber-700 font-medium mb-2">
                                        ლიმიტი ამოიწურა (5/5)
                                    </p>
                                    <p className="text-xs text-amber-600 mb-3">
                                        სრული წვდომისთვის შეიძინე ბოტი
                                    </p>
                                    {bot.tier === 'premium' && (
                                        <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                                            <TbShoppingCart className="w-3 h-3 mr-1" />
                                            ყიდვა ₾{bot.price}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </motion.div>

                        {/* Guarantees */}
                        {bot.guarantees && (
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                    <TbShield className="w-5 h-5 text-green-500" />
                                    გარანტიები
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <TbCheck className="w-4 h-4 text-green-500" />
                                        <span>{bot.guarantees.moneyBack} დღიანი თანხის დაბრუნება</span>
                                    </div>
                                    {bot.guarantees.freeUpdates && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <TbCheck className="w-4 h-4 text-green-500" />
                                            <span>უფასო განახლებები</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm">
                                        <TbClock className="w-4 h-4 text-blue-500" />
                                        <span>{bot.guarantees.support.type}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Price & Action */}
                        <div className="bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-xl p-6">
                            <div className="text-center mb-4">
                                {bot.tier === 'free' ? (
                                    <>
                                        <div className="text-3xl font-bold mb-1">უფასო</div>
                                        <div className="text-sm text-white/80">დააკოპირე და გამოიყენე</div>
                                    </>
                                ) : bot.tier === 'private' ? (
                                    <>
                                        <div className="text-3xl font-bold mb-1">პირადი</div>
                                        <div className="text-sm text-white/80">მხოლოდ შერჩეულებისთვის</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-4xl font-bold mb-1">{bot.price} ₾</div>
                                        <div className="text-sm text-white/80">ერთჯერადი გადახდა</div>
                                        {bot.guarantees?.moneyBack && (
                                            <div className="text-xs text-white/70 mt-1">
                                                {bot.guarantees.moneyBack} დღიანი გარანტია
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            {bot.tier === 'private' ? (
                                <Button disabled className="w-full bg-gray-500 text-white cursor-not-allowed font-semibold">
                                    <TbLock className="w-4 h-4 mr-2" />
                                    პირადი ბოტი
                                </Button>
                            ) : bot.tier === 'premium' ? (
                                <Button className="w-full bg-white text-violet-600 hover:bg-white/90 font-semibold">
                                    <TbShoppingCart className="w-4 h-4 mr-2" />
                                    ყიდვა ახლავე
                                </Button>
                            ) : (
                                <Button className="w-full bg-white text-violet-600 hover:bg-white/90 font-semibold">
                                    <TbCopy className="w-4 h-4 mr-2" />
                                    კოპირება
                                </Button>
                            )}

                            {/* Additional Info */}
                            {bot.purchasedToday && bot.purchasedToday > 0 && (
                                <div className="mt-4 pt-4 border-t border-white/20 text-center">
                                    <div className="text-sm text-white/90">
                                        🔥 <span className="font-semibold">{bot.purchasedToday}</span> ადამიანმა იყიდა დღეს
                                    </div>
                                </div>
                            )}

                            {bot.responseTime && (
                                <div className="mt-3 flex items-center justify-center gap-2 text-sm text-white/80">
                                    <TbBolt className="w-4 h-4" />
                                    <span>პასუხი {bot.responseTime}წმ-ში</span>
                                </div>
                            )}
                        </div>

                        {/* Quick Stats */}
                        {(bot.timeSaved || bot.moneySaved) && (
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h3 className="text-lg font-bold text-foreground mb-4">რას დაზოგავ</h3>
                                <div className="space-y-3">
                                    {bot.timeSaved && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">დრო:</span>
                                            <span className="font-semibold text-green-600">{bot.timeSaved} საათი/თვე</span>
                                        </div>
                                    )}
                                    {bot.moneySaved && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">ფული:</span>
                                            <span className="font-semibold text-green-600">₾{bot.moneySaved}/თვე</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
