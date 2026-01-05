'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { TbRobot, TbCrown, TbLock, TbSparkles, TbSearch, TbEye, TbCopy, TbShoppingCart, TbStar, TbMessage, TbBolt, TbPencil, TbBrain, TbPalette, TbTrendingUp, TbShare, TbHeart, TbCheck, TbX, TbClock, TbShield, TbRocket, TbUsers, TbDownload, TbChevronDown, TbChevronUp, TbQuote, TbArrowRight, TbFlame, TbPlayerPlay, TbTrendingDown, TbCalculator, TbGift, TbBuilding, TbUserPlus, TbCreditCard, TbPercentage, TbTarget, TbChartBar, TbClick, TbMail, TbAward, TbStack2, TbCircleCheck, TbCircleX, TbInfoCircle, TbExternalLink, TbBolt as ZapIcon, TbPlus, TbSend } from "react-icons/tb";
import { DemoChatModal } from '@/components/bots/DemoChatModal';

// ═══════════════════════════════════════════════════════════════════════════
// NEURO-DESIGN SYSTEM — Types & Interfaces
// ═══════════════════════════════════════════════════════════════════════════

type BotCategory = 'all' | 'content' | 'mystic' | 'business' | 'creative' | 'translation';
type BotTier = 'all' | 'free' | 'premium' | 'private';

interface AIBot {
    id: string;
    name: string;
    codename: string;
    version: string;
    description: string;
    shortDescription: string;
    category: BotCategory;
    tier: BotTier;
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
    reviewCount?: number;
    lastUpdated?: string;
    verified?: boolean;
    timeSaved?: number;
    moneySaved?: number;
    targetAudience?: string[];
    languages?: string[];
    purchasedToday?: number;
    responseTime?: string;
    moneyBackGuarantee?: number;
    // New fields for sales optimization
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
    stats?: {
        avgRating: number;
        totalReviews: number;
        successRate: number;
        completionRate: number;
        repeatPurchase: number;
    };
    updates?: {
        lastUpdated: string;
        changelog: Array<{
            version: string;
            date: string;
            changes: string[];
        }>;
        roadmap: string[];
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// NEURO-DESIGN — Icon Mapping
// ═══════════════════════════════════════════════════════════════════════════

const iconMap: Record<string, React.ReactNode> = {
    Bot: <TbRobot className="w-6 h-6" />,
    MessageCircle: <TbMessage className="w-6 h-6" />,
    TbSparkles: <TbSparkles className="w-6 h-6" />,
    TbTrendingUp: <TbTrendingUp className="w-6 h-6" />,
    TbPencil: <TbPencil className="w-6 h-6" />,
    TbPalette: <TbPalette className="w-6 h-6" />,
    Share2: <TbShare className="w-6 h-6" />,
    Brain: <TbBrain className="w-6 h-6" />,
    TbBolt: <TbBolt className="w-6 h-6" />,
    Crown: <TbCrown className="w-6 h-6" />,
    Heart: <TbHeart className="w-6 h-6" />,
    Star: <TbStar className="w-6 h-6" />,
    Rocket: <TbRocket className="w-6 h-6" />,
    Target: <TbTarget className="w-6 h-6" />,
    Gift: <TbGift className="w-6 h-6" />,
};

// ═══════════════════════════════════════════════════════════════════════════
// NEURO-DESIGN — Filter Data
// ═══════════════════════════════════════════════════════════════════════════

const categories: { id: BotCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'ყველა', icon: <TbRobot className="w-4 h-4" /> },
    { id: 'content', label: 'კონტენტი', icon: <TbMessage className="w-4 h-4" /> },
    { id: 'mystic', label: 'მისტიკა', icon: <TbSparkles className="w-4 h-4" /> },
    { id: 'business', label: 'ბიზნესი', icon: <TbTrendingUp className="w-4 h-4" /> },
    { id: 'creative', label: 'კრეატივი', icon: <TbPencil className="w-4 h-4" /> },
    { id: 'translation', label: 'თარგმნა', icon: <TbShare className="w-4 h-4" /> },
];

const tiers: { id: BotTier; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'ყველა', icon: <TbRobot className="w-4 h-4" /> },
    { id: 'free', label: 'უფასო', icon: <TbBolt className="w-4 h-4" /> },
    { id: 'premium', label: 'Premium', icon: <TbCrown className="w-4 h-4" /> },
    { id: 'private', label: 'პირადი', icon: <TbLock className="w-4 h-4" /> },
];

// ═══════════════════════════════════════════════════════════════════════════
// TESTIMONIALS DATA
// ═══════════════════════════════════════════════════════════════════════════

const testimonials = [
    {
        name: "გიორგი მ.",
        role: "მარკეტოლოგი",
        avatar: "👨‍💼",
        text: "ამ ბოტების გამოყენებით კონტენტის შექმნა 5-ჯერ დავაჩქარე. საოცარი შედეგია!",
        rating: 5
    },
    {
        name: "ანა კ.",
        role: "ფრილანსერი",
        avatar: "👩‍💻",
        text: "Premium ბოტებმა ჩემი ბიზნესი სრულიად შეცვალა. რეკომენდებულია ყველასთვის!",
        rating: 5
    },
    {
        name: "დავით ზ.",
        role: "სტარტაპერი",
        avatar: "🧑‍🚀",
        text: "ყველაზე კარგი AI ინსტრუმენტები ქართულად. მადლობა Andrew-ს!",
        rating: 5
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// FAQ DATA
// ═══════════════════════════════════════════════════════════════════════════

const faqs = [
    {
        question: "როგორ გამოვიყენო AI ბოტი?",
        answer: "მარტივია! დააჭირეთ 'კოპირება' ღილაკს, შემდეგ ჩასვით პრომპტი ChatGPT-ში, Claude-ში ან Gemini-ში და მიიღეთ პროფესიონალური შედეგი."
    },
    {
        question: "რა ხდება, თუ ბოტი არ მომეწონება?",
        answer: "უფასო ბოტების გამოცდა შეგიძლიათ ნებისმიერ დროს. Premium ბოტებზე გვაქვს 7-დღიანი თანხის დაბრუნების გარანტია."
    },
    {
        question: "როგორ მივიღო მხარდაჭერა?",
        answer: "დაგვიკავშირდით ელ-ფოსტით ან Telegram-ით. ვპასუხობთ 24 საათის განმავლობაში."
    },
    {
        question: "შემიძლია ბოტების მოდიფიცირება?",
        answer: "დიახ! ყველა პრომპტი სრულად რედაქტირებადია. მოარგეთ თქვენს საჭიროებებს."
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// SKELETON LOADER
// ═══════════════════════════════════════════════════════════════════════════

function BotCardSkeleton() {
    return (
        <div className="rounded-2xl bg-card border border-border overflow-hidden animate-pulse shadow-sm">
            <div className="h-24 bg-muted/50" />
            <div className="p-5 space-y-4">
                <div className="flex justify-between">
                    <div className="space-y-2">
                        <div className="h-5 w-24 bg-muted/50 rounded" />
                        <div className="h-3 w-32 bg-muted/30 rounded" />
                    </div>
                    <div className="h-5 w-12 bg-muted/50 rounded" />
                </div>
                <div className="h-4 w-full bg-muted/30 rounded" />
                <div className="space-y-2">
                    <div className="h-3 w-3/4 bg-muted/30 rounded" />
                    <div className="h-3 w-2/3 bg-muted/30 rounded" />
                </div>
                <div className="flex gap-2 pt-2">
                    <div className="h-10 flex-1 bg-muted/50 rounded-lg" />
                    <div className="h-10 w-10 bg-muted/50 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// BOT CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface BotCardProps {
    bot: AIBot;
    onView: (bot: AIBot) => void;
    onLike: (id: string) => void;
    onCopy: (id: string) => void;
    onDemo: (bot: AIBot) => void;
    copiedId: string | null;
    likedIds: Set<string>;
    onCompare?: (id: string) => void;
    isComparing?: boolean;
    onShare?: (bot: AIBot) => void;
}

function BotCard({ bot, onView, onLike, onCopy, onDemo, copiedId, likedIds, onCompare, isComparing, onShare }: BotCardProps) {
    const isLiked = likedIds.has(bot.id);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group relative h-full"
        >
            <div className={`
                relative rounded-2xl h-full overflow-visible
                bg-gradient-to-br from-white to-gray-50/50
                border-2 transition-all duration-300
                shadow-lg shadow-black/5
                group-hover:shadow-2xl group-hover:shadow-violet-500/20
                ${bot.isFeatured
                    ? 'border-amber-400/60 bg-gradient-to-br from-amber-50 to-orange-50/30'
                    : 'border-border group-hover:border-violet-300'
                }
            `}>
                {/* Gradient Header - Redesigned */}
                <div className={`h-20 bg-gradient-to-br ${bot.color} relative overflow-hidden rounded-t-2xl`}>
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-black/5" />

                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl" />


                    {/* Tier Badge - Top Right */}
                    <div className="absolute top-3 right-3">
                        {bot.tier === 'private' && (
                            <span className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-black/80 backdrop-blur-xl rounded-full text-white shadow-xl border border-white/20">
                                <TbLock className="w-3.5 h-3.5" />
                                პირადი
                            </span>
                        )}
                        {bot.tier === 'premium' && (
                            <span className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-white shadow-2xl shadow-amber-500/50 border border-amber-300/50">
                                <TbCrown className="w-3.5 h-3.5" />
                                ₾{bot.price}
                            </span>
                        )}
                        {bot.tier === 'free' && (
                            <span className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-emerald-500 to-green-500 rounded-full text-white shadow-xl shadow-emerald-500/50 border border-emerald-300/50">
                                <TbBolt className="w-3.5 h-3.5" />
                                უფასო
                            </span>
                        )}
                    </div>

                    {/* Hot/New Badge */}
                    {bot.isRecentlyAdded && (
                        <motion.span
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute top-4 left-4 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white uppercase tracking-wide shadow-xl shadow-pink-500/50 flex items-center gap-1.5 border border-pink-300/50"
                        >
                            <TbFlame className="w-3.5 h-3.5" />
                            ახალი
                        </motion.span>
                    )}

                    {/* Featured Badge */}
                    {bot.isFeatured && !bot.isRecentlyAdded && (
                        <span className="absolute top-4 left-4 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full text-white uppercase tracking-wide shadow-xl shadow-amber-500/50 flex items-center gap-1.5 border border-amber-300/50">
                            <TbStar className="w-3.5 h-3.5 fill-current" />
                            ტოპ
                        </span>
                    )}
                </div>

                {/* Content - More spacing */}
                <div className="p-6 pt-6">
                    {/* Title & Trust Badges */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                        {/* Icon & Title - Left */}
                        <div className="flex items-start gap-2 flex-1">
                            {/* Icon */}
                            <div className="p-2.5 bg-white rounded-xl shadow-lg border-2 border-border flex-shrink-0">
                                {iconMap[bot.icon] || <TbRobot className="w-5 h-5 text-muted-foreground" />}
                            </div>

                            {/* Title Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h3 className="font-semibold text-foreground text-sm leading-tight">
                                        {bot.name}
                                    </h3>
                                    <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-1 rounded font-mono">
                                        {bot.version}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-1 rounded font-mono flex items-center gap-1">
                                        <TbStar className="w-3 h-3 text-amber-400 fill-amber-400" />
                                        {bot.rating.toFixed(1)}
                                    </span>
                                    {bot.verified && (
                                        <TbShield className="w-3.5 h-3.5 text-blue-500" />
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">{bot.codename}</p>
                            </div>
                        </div>

                        {/* Stats - Downloads & Likes - Right */}
                        <div className="flex flex-col gap-1.5 flex-shrink-0">
                            {bot.tier !== 'private' && (
                                <div className="flex items-center gap-1.5 text-xs text-foreground/60">
                                    <TbShoppingCart className="w-3.5 h-3.5" />
                                    <span className="font-medium">{(bot.downloads / 1000).toFixed(1)}k</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 text-xs text-foreground/60">
                                <TbHeart className={`w-3.5 h-3.5 ${isLiked ? 'fill-pink-400 text-pink-400' : ''}`} />
                                <span className="font-medium">{bot.likes}</span>
                            </div>
                        </div>
                    </div>

                    {/* Review Count & Last Updated */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                            {bot.reviewCount && (
                                <span className="text-xs text-muted-foreground">({bot.reviewCount} მიმოხილვა)</span>
                            )}
                        </div>
                        {bot.lastUpdated && (
                            <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                                <TbClock className="w-3 h-3" />
                                {(() => {
                                    const days = Math.floor((new Date().getTime() - new Date(bot.lastUpdated).getTime()) / (1000 * 60 * 60 * 24));
                                    return days === 0 ? 'დღეს' : days === 1 ? 'გუშინ' : `${days} დღის წინ`;
                                })()}
                            </span>
                        )}
                    </div>

                    {/* Value Indicators */}
                    {(bot.timeSaved || bot.moneySaved) && (
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            {bot.timeSaved && (
                                <div className="bg-violet-50 border border-violet-200 rounded-lg p-2">
                                    <div className="flex items-center gap-1 mb-0.5">
                                        <TbClock className="w-3 h-3 text-violet-600" />
                                        <span className="text-[10px] text-violet-600 font-medium">დრო</span>
                                    </div>
                                    <p className="text-xs font-bold text-violet-700">{bot.timeSaved}სთ/თვე</p>
                                </div>
                            )}
                            {bot.moneySaved && bot.moneySaved > 0 && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                                    <div className="flex items-center gap-1 mb-0.5">
                                        <TbTrendingDown className="w-3 h-3 text-emerald-600" />
                                        <span className="text-[10px] text-emerald-600 font-medium">ფული</span>
                                    </div>
                                    <p className="text-xs font-bold text-emerald-700">₾{bot.moneySaved}/თვე</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Creator Info */}
                    {bot.creator && (
                        <div className="mb-3 p-2.5 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                {bot.creator.avatar && (
                                    <img src={bot.creator.avatar} alt={bot.creator.name} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-semibold text-foreground">{bot.creator.name}</span>
                                        {bot.creator.verified && (
                                            <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-500 rounded-full">
                                                <TbCheck className="w-2.5 h-2.5 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    {bot.creator.bio && (
                                        <p className="text-[10px] text-muted-foreground line-clamp-1">{bot.creator.bio}</p>
                                    )}
                                </div>
                                {bot.creator.rating && (
                                    <div className="flex items-center gap-0.5 text-xs">
                                        <TbStar className="w-3 h-3 text-amber-400 fill-amber-400" />
                                        <span className="font-semibold text-foreground">{bot.creator.rating.toFixed(1)}</span>
                                    </div>
                                )}
                            </div>
                            {bot.creator.totalSales > 0 && (
                                <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <TbShoppingCart className="w-3 h-3" />
                                        {bot.creator.totalSales.toLocaleString()} გაყიდვა
                                    </span>
                                    {bot.creator.responseTime && (
                                        <span className="flex items-center gap-1">
                                            <TbClock className="w-3 h-3" />
                                            {bot.creator.responseTime}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Guarantees */}
                    {bot.guarantees && (
                        <div className="mb-3 p-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-1.5">
                                <TbShield className="w-3.5 h-3.5 text-blue-600" />
                                <span className="text-xs font-semibold text-blue-900">გარანტიები</span>
                            </div>
                            <div className="space-y-1">
                                {bot.guarantees.moneyBack > 0 && (
                                    <div className="flex items-center gap-1.5 text-[10px] text-blue-700">
                                        <TbCheck className="w-2.5 h-2.5 text-emerald-500" />
                                        <span>{bot.guarantees.moneyBack}-დღიანი თანხის დაბრუნება</span>
                                    </div>
                                )}
                                {bot.guarantees.freeUpdates && (
                                    <div className="flex items-center gap-1.5 text-[10px] text-blue-700">
                                        <TbCheck className="w-2.5 h-2.5 text-emerald-500" />
                                        <span>უფასო განახლებები</span>
                                    </div>
                                )}
                                {bot.guarantees.support && (
                                    <div className="flex items-center gap-1.5 text-[10px] text-blue-700">
                                        <TbCheck className="w-2.5 h-2.5 text-emerald-500" />
                                        <span>{bot.guarantees.support.type}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Updates */}
                    {bot.updates && bot.updates.lastUpdated && (
                        <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <TbClock className="w-3 h-3 text-amber-600" />
                                    <span className="text-[10px] text-amber-700 font-medium">განახლდა: {bot.updates.lastUpdated}</span>
                                </div>
                                {bot.updates.roadmap && bot.updates.roadmap.length > 0 && (
                                    <span className="text-[9px] text-amber-600 px-1.5 py-0.5 bg-amber-100 rounded">
                                        {bot.updates.roadmap.length} მომავალი ფიჩა
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <p className="text-xs text-foreground/70 mb-3 line-clamp-2 leading-relaxed">
                        {bot.shortDescription}
                    </p>

                    {/* Features */}
                    <div className="space-y-1 mb-3">
                        {bot.features.slice(0, 3).map((feature, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-foreground/60">
                                <TbCheck className="w-2.5 h-2.5 text-emerald-500" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* Target Audience & TbLanguage */}
                    <div className="space-y-2 mb-3">
                        {bot.targetAudience && bot.targetAudience.length > 0 && (
                            <div className="flex items-start gap-1.5">
                                <TbUsers className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div className="flex flex-wrap gap-1">
                                    {bot.targetAudience.slice(0, 2).map((audience, i) => (
                                        <span key={i} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-foreground/70">
                                            {audience}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {bot.languages && bot.languages.length > 0 && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-muted-foreground">🌐</span>
                                <span className="text-[10px] text-foreground/60">{bot.languages.join(', ')}</span>
                            </div>
                        )}
                    </div>

                    {/* Social Proof & Speed */}
                    <div className="flex items-center justify-between mb-3 text-[10px]">
                        {bot.purchasedToday && bot.purchasedToday > 0 && (
                            <span className="text-orange-600 font-medium flex items-center gap-1">
                                <TbFlame className="w-3 h-3" />
                                {bot.purchasedToday} დღეს
                            </span>
                        )}
                        {bot.responseTime && (
                            <span className="text-emerald-600 flex items-center gap-1">
                                <TbBolt className="w-3 h-3" />
                                {bot.responseTime}წმ
                            </span>
                        )}
                    </div>

                    {/* Money Back Guarantee */}
                    {bot.moneyBackGuarantee && bot.moneyBackGuarantee > 0 && (
                        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-[10px] text-blue-700 font-medium flex items-center gap-1">
                                <TbShield className="w-3 h-3" />
                                {bot.moneyBackGuarantee} დღიანი გარანტია
                            </p>
                        </div>
                    )}

                    {/* Who Bought This - Social Proof */}
                    {bot.tier !== 'private' && bot.downloads > 50 && (
                        <div className="mb-3 p-3 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex -space-x-2">
                                    {['👨‍💼', '👩‍💻', '👨‍🎨', '👩‍💼'].slice(0, 3).map((emoji, i) => (
                                        <div key={i} className="w-6 h-6 rounded-full bg-white border-2 border-violet-200 flex items-center justify-center text-xs">
                                            {emoji}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[10px] text-violet-700 font-medium">
                                    {bot.downloads > 1000 ? `${(bot.downloads / 1000).toFixed(1)}k+` : bot.downloads}+ ადამიანი იყენებს
                                </span>
                            </div>
                            {bot.rating >= 4.5 && (
                                <div className="flex items-start gap-1.5">
                                    <TbQuote className="w-3 h-3 text-violet-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-violet-600 italic leading-relaxed">
                                        {bot.rating >= 4.9 ? '"საუკეთესო ინვესტიცია! ყოველდღე ვიყენებ"' :
                                            bot.rating >= 4.7 ? '"ძალიან კარგი ბოტი, რეკომენდებულია"' :
                                                '"ღირს თავისი ფასი, კმაყოფილი ვარ"'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions - 2 rows layout */}
                    <div className="space-y-2">
                        {/* Primary Action Button - Full Width */}
                        {bot.tier === 'private' ? (
                            <button
                                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-secondary text-muted-foreground cursor-not-allowed text-xs font-medium"
                                disabled
                            >
                                <TbLock className="w-3.5 h-3.5" />
                                პირადი
                            </button>
                        ) : bot.tier === 'premium' ? (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium text-xs shadow-lg shadow-amber-500/20"
                            >
                                <TbShoppingCart className="w-3.5 h-3.5" />
                                ყიდვა ₾{bot.price}
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onCopy(bot.id)}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium text-xs transition-colors shadow-lg shadow-violet-500/20"
                            >
                                {copiedId === bot.id ? (
                                    <>
                                        <TbCheck className="w-3.5 h-3.5" />
                                        <span>დაკოპირდა!</span>
                                    </>
                                ) : (
                                    <>
                                        <TbCopy className="w-3.5 h-3.5" />
                                        კოპირება
                                    </>
                                )}
                            </motion.button>
                        )}

                        {/* Secondary Actions - 2 rows of 3 buttons */}
                        <div className="grid grid-cols-3 gap-1.5">
                            {/* Row 1 */}
                            <Link href={`/bots/${bot.id}`} className="block">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground/60 hover:text-foreground transition-colors border border-border flex items-center justify-center"
                                    title="დეტალები"
                                >
                                    <TbEye className="w-3.5 h-3.5" />
                                </motion.button>
                            </Link>

                            {bot.tier !== 'private' && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onDemo(bot)}
                                    className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors border border-emerald-200 flex items-center justify-center"
                                    title="დემო"
                                >
                                    <TbPlayerPlay className="w-3.5 h-3.5" />
                                </motion.button>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onLike(bot.id)}
                                className={`p-2 rounded-lg transition-colors flex items-center justify-center ${isLiked
                                    ? 'bg-pink-50 text-pink-500 border border-pink-100'
                                    : 'bg-secondary hover:bg-secondary/80 text-foreground/60 hover:text-pink-400 border border-border'
                                    }`}
                                title="მოწონება"
                            >
                                <TbHeart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                            </motion.button>

                            {/* Row 2 */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    window.open(`https://t.me/andr3waltairchannel`, '_blank');
                                }}
                                className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors border border-blue-200 flex items-center justify-center"
                                title="შესთავაზე რედაქტირება"
                            >
                                <TbMessage className="w-3.5 h-3.5" />
                            </motion.button>

                            {onCompare && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onCompare(bot.id);
                                    }}
                                    className={`p-2 rounded-lg transition-colors flex items-center justify-center ${isComparing
                                        ? 'bg-violet-600 text-white border border-violet-400 shadow-lg shadow-violet-500/50'
                                        : 'bg-secondary hover:bg-secondary/80 text-foreground/60 hover:text-violet-400 border border-border'
                                        }`}
                                    title="შედარება"
                                >
                                    {isComparing ? (
                                        <TbCircleCheck className="w-3.5 h-3.5" />
                                    ) : (
                                        <TbStack2 className="w-3.5 h-3.5" />
                                    )}
                                </motion.button>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onShare && onShare(bot)}
                                className="p-2 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-600 transition-colors border border-cyan-200 flex items-center justify-center"
                                title="გაზიარება"
                            >
                                <TbShare className="w-3.5 h-3.5" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// FAQ ITEM COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            className="border border-border rounded-xl overflow-hidden bg-card"
            initial={false}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/50 transition-colors"
            >
                <span className="font-medium text-foreground">{question}</span>
                {isOpen ? (
                    <TbChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                    <TbChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-4 pb-4 text-muted-foreground">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function BotsPage() {
    // State
    const [bots, setBots] = useState<AIBot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<BotCategory>('all');
    const [selectedTier, setSelectedTier] = useState<BotTier>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBot, setSelectedBot] = useState<AIBot | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
    const [demoBot, setDemoBot] = useState<AIBot | null>(null);

    // New Sales Features State
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 12 });
    const [showExitIntent, setShowExitIntent] = useState(false);
    const [comparisonBots, setComparisonBots] = useState<Set<string>>(new Set());
    const [roiHours, setRoiHours] = useState(10);
    const [telegramCode, setTelegramCode] = useState('');
    const [showTelegramPopup, setShowTelegramPopup] = useState(false);
    const [codeVerified, setCodeVerified] = useState(false);
    const [verificationError, setVerificationError] = useState('');
    const [showComparisonModal, setShowComparisonModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [sharingBot, setSharingBot] = useState<AIBot | null>(null);
    const [showSubmitPrompt, setShowSubmitPrompt] = useState(false);
    const [promptSubmission, setPromptSubmission] = useState({
        promptName: '',
        category: 'all' as BotCategory,
        description: '',
        masterPrompt: '',
        price: 0,
        isForTrading: false,
        isForBusiness: false,
        isForMarketing: false,
        isForCoding: false,
        isForWriting: false
    });
    const toast = useToast();

    // Stats
    const totalBots = bots.length;
    const totalDownloads = bots.reduce((sum, b) => sum + b.downloads, 0);
    const averageRating = bots.length > 0 ? bots.reduce((sum, b) => sum + b.rating, 0) / bots.length : 0;

    // Fetch bots from API
    const fetchBots = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (selectedCategory !== 'all') params.set('category', selectedCategory);
            if (selectedTier !== 'all') params.set('tier', selectedTier);
            if (searchQuery) params.set('search', searchQuery);

            const res = await fetch(`/api/bots?${params.toString()}`);
            const data = await res.json();

            if (data.bots) {
                setBots(data.bots);
            }
        } catch (error) {
            console.error('Failed to fetch bots:', error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedCategory, selectedTier, searchQuery]);

    useEffect(() => {
        fetchBots();
    }, [fetchBots]);

    // Load liked IDs from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('likedBots');
        if (saved) {
            setLikedIds(new Set(JSON.parse(saved)));
        }
    }, []);

    // Countdown TbClock Effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;
                seconds--;
                if (seconds < 0) {
                    seconds = 59;
                    minutes--;
                }
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                }
                if (hours < 0) {
                    hours = 23;
                    minutes = 59;
                    seconds = 59;
                }
                return { hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Exit Intent Detection
    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !showExitIntent) {
                setShowExitIntent(true);
            }
        };
        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [showExitIntent]);


    // Telegram Popup TbClock (after 30 seconds)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!localStorage.getItem('telegramJoined')) {
                setShowTelegramPopup(true);
            }
        }, 30000);
        return () => clearTimeout(timer);
    }, []);

    // Handlers
    const handleCopy = async (botId: string) => {
        try {
            const res = await fetch(`/api/bots/${botId}`);
            const bot = await res.json();

            if (bot.masterPrompt) {
                await navigator.clipboard.writeText(bot.masterPrompt);
                setCopiedId(botId);
                setTimeout(() => setCopiedId(null), 2000);
            }
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const handleLike = async (botId: string) => {
        const newLiked = new Set(likedIds);
        const isCurrentlyLiked = newLiked.has(botId);

        if (isCurrentlyLiked) {
            newLiked.delete(botId);
        } else {
            newLiked.add(botId);
        }

        setLikedIds(newLiked);
        localStorage.setItem('likedBots', JSON.stringify([...newLiked]));

        setBots(prev => prev.map(bot =>
            bot.id === botId
                ? { ...bot, likes: bot.likes + (isCurrentlyLiked ? -1 : 1) }
                : bot
        ));

        if (!isCurrentlyLiked) {
            fetch(`/api/bots/${botId}`, { method: 'POST' }).catch(console.error);
        }
    };

    const handleView = (bot: AIBot) => {
        setSelectedBot(bot);
    };

    const handleCategoryChange = (category: BotCategory) => {
        setIsLoading(true);
        setSelectedCategory(category);
    };

    const handleTierChange = (tier: BotTier) => {
        setIsLoading(true);
        setSelectedTier(tier);
    };

    const toggleComparison = (botId: string) => {
        const newSet = new Set(comparisonBots);
        if (newSet.has(botId)) {
            newSet.delete(botId);
        } else if (newSet.size < 3) {
            newSet.add(botId);
        }
        setComparisonBots(newSet);
    };

    const handleTelegramCodeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerificationError('');

        // Verify code with backend
        try {
            const response = await fetch('/api/verify-telegram-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: telegramCode })
            });

            const data = await response.json();

            if (data.success) {
                setCodeVerified(true);
                localStorage.setItem('telegramJoined', 'true');
                localStorage.setItem('freeBots', JSON.stringify(data.freeBots || ['bot1', 'bot2', 'bot3']));
                setTimeout(() => {
                    setShowTelegramPopup(false);
                    toast.success('გილოცავთ!', 'თქვენ მიიღეთ 3 Premium ბოტი უფასოდ!');
                }, 1500);
            } else {
                setVerificationError(data.message || 'არასწორი კოდი. სცადეთ ხელახლა.');
            }
        } catch (error) {
            setVerificationError('კავშირის შეცდომა. სცადეთ ხელახლა.');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Noise Texture Overlay */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.015] z-50 mix-blend-multiply"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* ═══════════════════════════════════════════════════════════════════
                HERO + STATS WRAPPER — Fills exactly viewport height
            ═══════════════════════════════════════════════════════════════════ */}
            <div className="min-h-[calc(100vh-64px)] flex flex-col">
                {/* HERO SECTION — Value Proposition */}
                <section className="relative overflow-hidden pt-8 pb-4 px-4 flex-1 flex items-center">
                    {/* Background */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-200/50 rounded-full blur-[150px]" />
                        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-200/50 rounded-full blur-[120px]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-200/30 rounded-full blur-[100px]" />
                    </div>

                    <div className="container mx-auto max-w-6xl relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                            className="text-center"
                        >
                            {/* Urgency TbClock Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500 border-2 border-red-300 mb-6 shadow-lg shadow-red-500/30"
                            >
                                <TbClock className="w-5 h-5 text-white animate-pulse" />
                                <div className="text-white">
                                    <div className="text-xs font-medium opacity-90">შეზღუდული შეთავაზება: 50% ფასდაკლება</div>
                                    <div className="text-lg font-bold tracking-wider" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                        {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Title */}
                            <h1
                                className="text-3xl md:text-5xl font-bold mb-4 text-foreground tracking-tight"
                                style={{ textWrap: 'balance' } as React.CSSProperties}
                            >
                                გაზარდეთ პროდუქტიულობა{' '}
                                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                                    10x
                                </span>
                                <br />
                                AI ბოტებით
                            </h1>

                            {/* Subtitle */}
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed">
                                პროფესიონალური პრომპტების კოლექცია, რომელიც დაზოგავს თქვენს დროს
                                და გააუმჯობესებს მუშაობის ხარისხს. შექმნილია Andrew Altair-ის მიერ.
                            </p>

                            {/* Before/After Comparison */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="max-w-md mx-auto mb-6 p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200"
                            >
                                <div className="flex items-center justify-center gap-4">
                                    <div className="text-center">
                                        <div className="text-red-500 text-xs font-medium mb-1">ბოტების გარეშე</div>
                                        <div className="text-3xl font-bold text-foreground flex items-center gap-2">
                                            <TbClock className="w-6 h-6 text-red-500" />
                                            5 საათი
                                        </div>
                                    </div>
                                    <TbArrowRight className="w-6 h-6 text-violet-600" />
                                    <div className="text-center">
                                        <div className="text-emerald-500 text-xs font-medium mb-1">ბოტებით</div>
                                        <div className="text-3xl font-bold text-foreground flex items-center gap-2">
                                            <TbBolt className="w-6 h-6 text-emerald-500" />
                                            30 წუთი
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 text-center text-xs text-muted-foreground">
                                    <TbTrendingDown className="w-3 h-3 inline text-emerald-500" /> დაზოგეთ დროის 90%
                                </div>
                            </motion.div>

                            {/* Trust Badges */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-wrap justify-center gap-3 mb-6"
                            >
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
                                    <TbCheck className="w-3 h-3" />
                                    <span>500+ კმაყოფილი მომხმარებელი</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs">
                                    <TbShield className="w-3 h-3" />
                                    <span>100% თანხის დაბრუნება</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs">
                                    <TbBolt className="w-3 h-3" />
                                    <span>უფასო ბოტები ხელმისაწვდომია</span>
                                </div>
                            </motion.div>

                            {/* Enhanced CTA with Pulsing Animation */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-8">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => window.scrollTo({ top: document.querySelector('.bots-grid')?.getBoundingClientRect().top || 800, behavior: 'smooth' })}
                                    className="relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 text-white font-bold text-lg shadow-2xl shadow-violet-500/50 overflow-hidden group"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <motion.span
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="absolute inset-0 rounded-2xl border-4 border-white/30"
                                    />
                                    <TbRocket className="w-6 h-6 relative z-10" />
                                    <span className="relative z-10">დაიწყეთ უფასოდ ახლავე</span>
                                    <TbArrowRight className="w-6 h-6 relative z-10" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowSubmitPrompt(true)}
                                    className="relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-amber-500/50 overflow-hidden"
                                >
                                    <TbPlus className="w-6 h-6 relative z-10" />
                                    <span className="relative z-10">დაამატე შენი ბოტი</span>
                                    <TbShoppingCart className="w-6 h-6 relative z-10" />
                                </motion.button>
                            </div>

                            {/* TbSearch */}
                            <div className="max-w-lg mx-auto relative">
                                <TbSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="მოძებნეთ თქვენთვის იდეალური ბოტი..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setIsLoading(true);
                                    }}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-border text-foreground placeholder:text-muted-foreground focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all shadow-lg shadow-black/5"
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
                PRICING COMPARISON TABLE
            ═══════════════════════════════════════════════════════════════ */}
            <section className="py-12 px-4 bg-gradient-to-br from-violet-50 via-purple-50 to-cyan-50">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                            აირჩიეთ თქვენთვის შესაფერისი გეგმა
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            ყველა გეგმა მოიცავს ხარისხიან AI ბოტებს. განსხვავება მხოლოდ ფუნქციებშია
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {/* FREE TIER */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border-2 border-border shadow-lg hover:shadow-xl transition-all"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <TbBolt className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">უფასო</h3>
                            </div>
                            <div className="mb-6">
                                <div className="text-3xl font-bold text-foreground">₾0</div>
                                <div className="text-sm text-muted-foreground">სამუდამოდ უფასო</div>
                            </div>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-foreground">30+ უფასო ბოტი</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-foreground">ძირითადი ფუნქციები</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-foreground">მხარდაჭერა ჯგუფში</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TbCircleX className="w-5 h-5 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-muted-foreground">პრიორიტეტული მხარდაჭერა</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TbCircleX className="w-5 h-5 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-muted-foreground">ყოველთვიური განახლებები</span>
                                </li>
                            </ul>
                            <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors">
                                დაწყება უფასოდ
                            </button>
                        </motion.div>

                        {/* PREMIUM TIER */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl p-6 border-2 border-violet-400 shadow-2xl shadow-violet-500/50 relative transform scale-105"
                        >
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 rounded-full text-white text-xs font-bold">
                                ყველაზე პოპულარული
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <TbCrown className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Premium</h3>
                            </div>
                            <div className="mb-6">
                                <div className="text-3xl font-bold text-white">₾29-99</div>
                                <div className="text-sm text-white/80">თითო ბოტი</div>
                            </div>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-white">ყველა უფასო ბოტი</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-white">50+ Premium ბოტი</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-white">პრიორიტეტული მხარდაჭერა</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-white">ყოველთვიური განახლებები</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-white">7-დღიანი გარანტია</span>
                                </li>
                            </ul>
                            <button className="w-full py-3 bg-white text-violet-600 rounded-xl font-bold hover:bg-violet-50 transition-colors">
                                შეიძინეთ ახლავე
                            </button>
                        </motion.div>

                        {/* PRIVATE TIER */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border-2 border-gray-700 shadow-lg"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <TbLock className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white">პირადი</h3>
                            </div>
                            <div className="mb-6">
                                <div className="text-3xl font-bold text-white">შეთანხმებით</div>
                                <div className="text-sm text-white/70">ინდივიდუალური</div>
                            </div>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-white">ყველა Premium ბოტი</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-white">ექსკლუზიური ბოტები</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-white">პირადი მხარდაჭერა 24/7</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-white">კასტომიზაცია</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-white">უპირველესი წვდომა</span>
                                </li>
                            </ul>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors border border-white/20">
                                დაგვიკავშირდით
                            </button>
                        </motion.div>
                    </div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
                    >
                        <div className="flex items-center gap-2">
                            <TbShield className="w-4 h-4 text-emerald-600" />
                            <span>7-დღიანი გარანტია</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TbUsers className="w-4 h-4 text-violet-600" />
                            <span>5000+ კმაყოფილი მომხმარებელი</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TbAward className="w-4 h-4 text-amber-600" />
                            <span>4.8★ საშუალო რეიტინგი</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                BENEFITS SECTION
            ═══════════════════════════════════════════════════════════════ */}
            <section className="py-16 px-4 bg-secondary/30">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            რატომ აირჩიოთ ჩვენი ბოტები?
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            თითოეული ბოტი შექმნილია ექსპერტების მიერ და ოპტიმიზირებულია საუკეთესო შედეგისთვის
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: TbClock, title: "დროის დაზოგვა", desc: "ავტომატიზირეთ რუტინული დავალებები და დაზოგეთ საათები ყოველდღიურად", color: "text-blue-600 bg-blue-100" },
                            { icon: TbRocket, title: "პროფესიონალური შედეგი", desc: "მიიღეთ ექსპერტის დონის კონტენტი რამდენიმე წამში", color: "text-purple-600 bg-purple-100" },
                            { icon: TbShield, title: "100% უსაფრთხო", desc: "თქვენი მონაცემები არასოდეს გადაეცემა მესამე მხარეს", color: "text-emerald-600 bg-emerald-100" },
                            { icon: TbSparkles, title: "მუდმივი განახლებები", desc: "ბოტები რეგულარულად ახლდება უახლესი AI მიღწევებით", color: "text-amber-600 bg-amber-100" }
                        ].map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
                            >
                                <div className={`w-14 h-14 rounded-xl ${benefit.color} flex items-center justify-center mx-auto mb-4`}>
                                    <benefit.icon className="w-7 h-7" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                FILTERS SECTION - REDESIGNED
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="border-b border-border bg-gradient-to-b from-background to-background/50">
                <div className="container mx-auto max-w-6xl px-4">
                    {/* Categories - Tab Style */}
                    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3">
                        {categories.map((cat) => {
                            const isActive = selectedCategory === cat.id;
                            return (
                                <motion.button
                                    key={cat.id}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={`relative flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all whitespace-nowrap ${isActive
                                        ? 'text-violet-600'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {cat.icon}
                                    <span>{cat.label}</span>

                                    {/* Active indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeCategory"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-purple-600"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Tier Filters - Compact Pills */}
                    <div className="flex items-center justify-between pb-4 pt-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-medium">ფილტრი:</span>
                            <div className="flex gap-1.5">
                                {tiers.map((tier) => {
                                    const isActive = selectedTier === tier.id;
                                    return (
                                        <motion.button
                                            key={tier.id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleTierChange(tier.id)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isActive
                                                ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30'
                                                : 'bg-secondary/50 text-foreground/60 hover:bg-secondary hover:text-foreground'
                                                }`}
                                        >
                                            {tier.icon}
                                            <span>{tier.label}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Results count */}
                        <div className="text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">{bots.length}</span> ბოტი
                        </div>
                    </div>
                </div>
            </section>
            {/* ═══════════════════════════════════════════════════════════════════
                COMPARISON BAR
            ═══════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {comparisonBots.size > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-violet-500/30 border border-violet-400"
                    >
                        <div className="flex items-center gap-4">
                            <TbStack2 className="w-6 h-6" />
                            <div>
                                <p className="font-bold">{comparisonBots.size} ბოტი არჩეულია შედარებისთვის</p>
                                <p className="text-xs text-white/80">მაქსიმუმ 3 ბოტი</p>
                            </div>
                            <button
                                onClick={() => {
                                    if (comparisonBots.size === 0) {
                                        toast.warning('აირჩიეთ ბოტები', 'გთხოვთ აირჩიეთ მინიმუმ 2 ბოტი შესადარებლად');
                                    } else if (comparisonBots.size === 1) {
                                        toast.warning('არასაკმარისია', 'გთხოვთ აირჩიეთ მინიმუმ 2 ბოტი შესადარებლად');
                                    } else {
                                        setShowComparisonModal(true);
                                    }
                                }}
                                className="px-4 py-2 bg-white text-violet-600 rounded-xl font-semibold hover:bg-violet-50 transition-colors"
                            >
                                შედარება
                            </button>
                            <button
                                onClick={() => setComparisonBots(new Set())}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <TbX className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════════════════════════
                BOTS GRID - IMMEDIATELY AFTER FILTERS
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="container mx-auto max-w-6xl px-4 py-12 bots-grid">
                <AnimatePresence mode="popLayout">
                    {isLoading ? (
                        <motion.div
                            key="skeleton"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {[...Array(6)].map((_, i) => (
                                <BotCardSkeleton key={i} />
                            ))}
                        </motion.div>
                    ) : bots.length > 0 ? (
                        <motion.div
                            key="grid"
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {bots.map((bot) => (
                                <BotCard
                                    key={bot.id}
                                    bot={bot}
                                    onView={handleView}
                                    onLike={handleLike}
                                    onCopy={handleCopy}
                                    onDemo={setDemoBot}
                                    copiedId={copiedId}
                                    likedIds={likedIds}
                                    onCompare={toggleComparison}
                                    isComparing={comparisonBots.has(bot.id)}
                                    onShare={(bot) => {
                                        setSharingBot(bot);
                                        setShowShareModal(true);
                                    }}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <TbRobot className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">ბოტები ვერ მოიძებნა</h3>
                            <p className="text-muted-foreground">სცადეთ შეცვალოთ ფილტრები</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                PRICING COMPARISON TABLE - MOVED AFTER BOTS
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="py-12 px-4 bg-gradient-to-b from-background to-violet-50/30">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            აირჩიეთ თქვენი გეგმა
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            ყველა გეგმა მოიცავს 7-დღიან უფასო ტესტირებას
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Free Tier */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-card border-2 border-border rounded-3xl p-8 hover:shadow-xl transition-all"
                        >
                            <div className="text-center mb-6">
                                <TbBolt className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
                                <h3 className="text-2xl font-bold text-foreground mb-2">უფასო</h3>
                                <div className="text-4xl font-bold text-foreground mb-2">$0</div>
                                <p className="text-muted-foreground text-sm">სამუდამოდ უფასო</p>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">5 ძირითადი ბოტი</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">ძირითადი ფუნქციები</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">მხარდაჭერა ჯგუფში</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TbCircleX className="w-5 h-5 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-muted-foreground">პრემიუმ ბოტები</span>
                                </li>
                            </ul>
                            <button className="w-full py-3 rounded-xl bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors">
                                დაიწყეთ უფასოდ
                            </button>
                        </motion.div>

                        {/* Premium Tier - Featured */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-violet-600 to-purple-600 border-2 border-violet-400 rounded-3xl p-8 relative transform md:scale-105 shadow-2xl shadow-violet-500/30"
                        >
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">
                                ყველაზე პოპულარული
                            </div>
                            <div className="text-center mb-6">
                                <TbCrown className="w-12 h-12 mx-auto mb-4 text-amber-300" />
                                <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
                                <div className="text-4xl font-bold text-white mb-2">₾10<span className="text-lg">/თვე</span></div>
                                <p className="text-white/80 text-sm">ან ₾100/წელი (დაზოგე ₾20)</p>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-white">ყველა უფასო ბოტი</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-white">20+ პრემიუმ ბოტი</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-white">პრიორიტეტული მხარდაჭერა</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-white">ყოველთვიური განახლებები</span>
                                </li>
                            </ul>
                            <button className="w-full py-3 rounded-xl bg-white text-violet-600 font-bold hover:bg-amber-50 transition-colors shadow-lg">
                                დაიწყეთ 7-დღიანი ტესტი
                            </button>
                        </motion.div>

                        {/* Private Tier */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-card border-2 border-amber-500/50 rounded-3xl p-8 hover:shadow-xl transition-all"
                        >
                            <div className="text-center mb-6">
                                <TbLock className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                                <h3 className="text-2xl font-bold text-foreground mb-2">პირადი</h3>
                                <div className="text-4xl font-bold text-foreground mb-2">₾30<span className="text-lg">/თვე</span></div>
                                <p className="text-muted-foreground text-sm">მხოლოდ 12 ადგილი</p>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">ყველა Premium ბოტი</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">ექსკლუზიური ბოტები</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">1-on-1 კონსულტაცია</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">Custom ბოტების შექმნა</span>
                                </li>
                            </ul>
                            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg">
                                მოითხოვეთ წვდომა
                            </button>
                        </motion.div>
                    </div>

                    {/* Limited Slots Warning */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mt-12 max-w-2xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-100 rounded-xl">
                                <TbFlame className="w-8 h-8 text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-foreground mb-1">შეზღუდული ადგილები!</h4>
                                <p className="text-sm text-muted-foreground">მხოლოდ <span className="font-bold text-amber-600">12 ადგილი</span> დარჩა Private tier-ში. არ გამოტოვოთ ექსკლუზიური წვდომა!</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-amber-600">12</div>
                                <div className="text-xs text-muted-foreground">დარჩენილი</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                ROI CALCULATOR - ENHANCED
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="py-6 px-4 bg-gradient-to-b from-background via-cyan-50/20 to-violet-50/30 relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl" />

                <div className="container mx-auto max-w-5xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-8"
                    >
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            className="inline-block"
                        >
                            <TbCalculator className="w-16 h-16 mx-auto mb-4 text-cyan-600" />
                        </motion.div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                            ROI კალკულატორი
                        </h2>
                        <p className="text-muted-foreground">გამოთვალეთ რამდენს დაზოგავთ AI ბოტებით</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-card/80 backdrop-blur-sm border-2 border-border rounded-3xl p-6 md:p-8 shadow-2xl"
                    >
                        {/* Hourly Rate Input */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium text-foreground">
                                    რამდენ საათს ხარჯავთ კონტენტის შექმნაზე თვეში?
                                </label>
                                <motion.div
                                    key={roiHours}
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: 1 }}
                                    className="px-4 py-2 bg-violet-100 rounded-xl"
                                >
                                    <span className="font-bold text-violet-600 text-xl">{roiHours} სთ</span>
                                </motion.div>
                            </div>
                            <input
                                type="range"
                                min="5"
                                max="100"
                                value={roiHours}
                                onChange={(e) => setRoiHours(Number(e.target.value))}
                                className="w-full h-3 bg-gradient-to-r from-violet-200 via-purple-200 to-cyan-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                                style={{
                                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((roiHours - 5) / 95) * 100}%, #e9d5ff ${((roiHours - 5) / 95) * 100}%, #e9d5ff 100%)`
                                }}
                            />
                            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                <span>5 სთ</span>
                                <span>50 სთ</span>
                                <span>100 სთ</span>
                            </div>
                        </div>

                        {/* Stats Grid with animations */}
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <motion.div
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="text-center p-5 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-red-200 relative overflow-hidden group cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-red-400/0 to-orange-400/0 group-hover:from-red-400/10 group-hover:to-orange-400/10 transition-all" />
                                <TbClock className="w-8 h-8 mx-auto mb-2 text-red-500" />
                                <div className="text-xs text-muted-foreground mb-1">დახარჯული დრო</div>
                                <motion.div
                                    key={roiHours}
                                    initial={{ scale: 1.2, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-3xl font-bold text-red-600"
                                >
                                    {roiHours}სთ
                                </motion.div>
                                <div className="text-xs text-muted-foreground mt-1">თვეში</div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="text-center p-5 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-200 relative overflow-hidden group cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-green-400/0 group-hover:from-emerald-400/10 group-hover:to-green-400/10 transition-all" />
                                <TbTrendingDown className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                                <div className="text-xs text-muted-foreground mb-1">დაზოგვა (90%)</div>
                                <motion.div
                                    key={roiHours}
                                    initial={{ scale: 1.2, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-3xl font-bold text-emerald-600"
                                >
                                    {Math.round(roiHours * 0.9)}სთ
                                </motion.div>
                                <div className="text-xs text-emerald-600 font-medium mt-1">↑ {Math.round((roiHours * 0.9 / roiHours) * 100)}% ეფექტურობა</div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="text-center p-5 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border-2 border-violet-200 relative overflow-hidden group cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-400/0 to-purple-400/0 group-hover:from-violet-400/10 group-hover:to-purple-400/10 transition-all" />
                                <TbChartBar className="w-8 h-8 mx-auto mb-2 text-violet-500" />
                                <div className="text-xs text-muted-foreground mb-1">ფულადი დაზოგვა</div>
                                <motion.div
                                    key={roiHours}
                                    initial={{ scale: 1.2, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-3xl font-bold text-violet-600"
                                >
                                    ₾{Math.round(roiHours * 0.9 * 50)}
                                </motion.div>
                                <div className="text-xs text-muted-foreground mt-1">თვეში</div>
                            </motion.div>
                        </div>

                        {/* Comparison Before/After */}
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <TbX className="w-4 h-4 text-red-600" />
                                    </div>
                                    <span className="font-semibold text-red-900">ბოტების გარეშე</span>
                                </div>
                                <div className="space-y-1 text-sm text-red-700">
                                    <div className="flex justify-between">
                                        <span>დრო:</span>
                                        <span className="font-bold">{roiHours}სთ/თვე</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>ხარჯი:</span>
                                        <span className="font-bold">₾{Math.round(roiHours * 50)}/თვე</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <TbCheck className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <span className="font-semibold text-emerald-900">ბოტებით</span>
                                </div>
                                <div className="space-y-1 text-sm text-emerald-700">
                                    <div className="flex justify-between">
                                        <span>დრო:</span>
                                        <span className="font-bold">{Math.round(roiHours * 0.1)}სთ/თვე</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>ხარჯი:</span>
                                        <span className="font-bold">₾10/თვე</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Annual Savings - Big Result */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="p-6 bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 rounded-2xl text-white text-center relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
                            <div className="relative z-10">
                                <TbSparkles className="w-8 h-8 mx-auto mb-2 text-amber-300" />
                                <p className="text-sm mb-1 text-white/80">თქვენი წლიური დაზოგვა</p>
                                <motion.p
                                    key={roiHours}
                                    initial={{ scale: 1.3, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="text-5xl md:text-6xl font-bold mb-2"
                                >
                                    ₾{Math.round(roiHours * 0.9 * 50 * 12).toLocaleString()}
                                </motion.p>
                                <div className="flex items-center justify-center gap-2 text-sm">
                                    <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                                        Premium: ₾100/წელი
                                    </div>
                                    <TbArrowRight className="w-4 h-4" />
                                    <div className="px-3 py-1 bg-emerald-400 text-emerald-900 rounded-full font-bold">
                                        ROI: {Math.round((roiHours * 0.9 * 50 * 12) / 100)}x
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                REFERRAL PROGRAM & ENTERPRISE
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="py-6 px-4 bg-secondary/30">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Referral Program */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-8 text-white relative overflow-hidden"
                        >
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
                            <TbUserPlus className="w-12 h-12 mb-4" />
                            <h3 className="text-3xl font-bold mb-3">მოიწვიეთ მეგობრები</h3>
                            <p className="text-white/90 mb-6 text-lg">მოიწვიეთ მეგობარი და მიიღეთ 30% ფასდაკლება შემდეგ შესყიდვაზე!</p>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-2">
                                    <TbCheck className="w-5 h-5" />
                                    <span>უნიკალური მოსაწვევი ბმული</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <TbCheck className="w-5 h-5" />
                                    <span>30% ფასდაკლება თითოეულ მეგობარზე</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <TbCheck className="w-5 h-5" />
                                    <span>შეუზღუდავი მოწვევები</span>
                                </li>
                            </ul>
                            <button className="w-full py-3 rounded-xl bg-white text-pink-600 font-bold hover:bg-pink-50 transition-colors">
                                მიიღე მოსაწვევი ბმული
                            </button>
                        </motion.div>

                        {/* Enterprise */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-card border-2 border-border rounded-3xl p-8"
                        >
                            <TbBuilding className="w-12 h-12 mb-4 text-violet-600" />
                            <h3 className="text-3xl font-bold text-foreground mb-3">კორპორატიული გეგმა</h3>
                            <p className="text-muted-foreground mb-6 text-lg">10+ თანამშრომელი? მოითხოვეთ ინდივიდუალური შეთავაზება და მიიღეთ სპეციალური პირობები</p>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-violet-600" />
                                    <span className="text-foreground">ინდივიდუალური ბოტების შექმნა</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-violet-600" />
                                    <span className="text-foreground">პირადი მენეჯერი</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-violet-600" />
                                    <span className="text-foreground">API წვდომა</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <TbCircleCheck className="w-5 h-5 text-violet-600" />
                                    <span className="text-foreground">SLA გარანტია</span>
                                </li>
                            </ul>
                            <button className="w-full py-3 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition-colors">
                                მოითხოვეთ შეთავაზება
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                TESTIMONIALS SECTION - REDESIGNED
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="py-6 px-4 bg-gradient-to-b from-violet-50/50 via-purple-50/30 to-background relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-200/20 rounded-full blur-3xl" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-4">
                            <TbMessage className="w-4 h-4 text-violet-600" />
                            <span className="text-sm font-medium text-violet-600">რას ამბობენ მომხმარებლები</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                            რეალური ადამიანები, რეალური შედეგები
                        </h2>
                        <p className="text-muted-foreground">
                            500+ კმაყოფილი მომხმარებელი იყენებს ჩვენს ბოტებს ყოველდღე
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group relative"
                            >
                                {/* Card */}
                                <div className="relative bg-card/80 backdrop-blur-sm border-2 border-border rounded-2xl p-6 h-full hover:border-violet-200 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10">
                                    {/* TbStars - Top Right */}
                                    <div className="absolute top-4 right-4 flex items-center gap-0.5 px-2 py-1 bg-amber-50 rounded-lg border border-amber-200">
                                        {[...Array(testimonial.rating)].map((_, j) => (
                                            <TbStar key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>

                                    {/* TbQuote Icon */}
                                    <div className="mb-4">
                                        <div className="inline-flex p-3 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl">
                                            <TbQuote className="w-6 h-6 text-violet-600" />
                                        </div>
                                    </div>

                                    {/* Testimonial Text */}
                                    <p className="text-foreground/80 mb-6 leading-relaxed text-sm italic">
                                        "{testimonial.text}"
                                    </p>

                                    {/* Author Info */}
                                    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-2xl">
                                            {testimonial.avatar}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-foreground text-sm truncate">{testimonial.name}</div>
                                            <div className="text-xs text-muted-foreground truncate">{testimonial.role}</div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <TbCheck className="w-4 h-4 text-emerald-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-purple-500/0 group-hover:from-violet-500/5 group-hover:to-purple-500/5 rounded-2xl transition-all duration-300 pointer-events-none" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                FAQ SECTION
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="py-6 px-4">
                <div className="container mx-auto max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                            ხშირად დასმული კითხვები
                        </h2>
                        <p className="text-muted-foreground">
                            გაქვთ კითხვა? ჩვენ გვაქვს პასუხი
                        </p>
                    </motion.div>

                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <FAQItem question={faq.question} answer={faq.answer} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                BOTTOM CTA SECTION
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="py-8 px-4 bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600">
                <div className="container mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                            მზად ხართ დასაწყებად?
                        </h2>
                        <p className="text-lg text-white/80 mb-6 max-w-2xl mx-auto">
                            გამოსცადეთ უფასო ბოტები დღესვე და ნახეთ განსხვავება თავად
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-violet-600 font-semibold text-lg shadow-xl shadow-black/20 hover:shadow-2xl transition-shadow"
                        >
                            დაიწყეთ უფასოდ
                            <TbArrowRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                DEMO CHAT MODAL
            ═══════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {demoBot && (
                    <DemoChatModal
                        bot={demoBot}
                        onClose={() => setDemoBot(null)}
                        iconMap={iconMap}
                    />
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════════════════════════
                BOT DETAIL MODAL
            ═══════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {selectedBot && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedBot(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                            className="relative w-full max-w-2xl max-h-[85vh] overflow-auto bg-background rounded-2xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={`h-32 bg-gradient-to-br ${selectedBot.color} relative`}>
                                <div className="absolute inset-0 bg-black/10" />
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setSelectedBot(null)}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
                                >
                                    <TbX className="w-5 h-5" />
                                </motion.button>
                                <div className="absolute bottom-4 left-6 flex items-center gap-4">
                                    <div className="p-3 bg-white/30 backdrop-blur-md rounded-xl text-white shadow-sm">
                                        {iconMap[selectedBot.icon] || <TbRobot className="w-6 h-6" />}
                                    </div>
                                    <div className="text-white">
                                        <h2 className="text-2xl font-bold drop-shadow-sm">{selectedBot.name}</h2>
                                        <p className="text-white/90 text-sm">{selectedBot.codename}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    {selectedBot.description}
                                </p>

                                <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">შესაძლებლობები</h3>
                                <div className="grid grid-cols-2 gap-2 mb-6">
                                    {selectedBot.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <TbCheck className="w-4 h-4 text-emerald-500" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-6 py-4 border-y border-border mb-6" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                    <div className="flex items-center gap-2">
                                        <TbStar className="w-5 h-5 text-amber-400 fill-amber-400" />
                                        <span className="font-semibold text-foreground">{selectedBot.rating.toFixed(1)}</span>
                                    </div>
                                    {selectedBot.tier !== 'private' && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <TbDownload className="w-5 h-5" />
                                            <span>{selectedBot.downloads.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <TbHeart className="w-5 h-5" />
                                        <span>{selectedBot.likes}</span>
                                    </div>
                                    <div className="text-muted-foreground/70 text-sm">
                                        {selectedBot.version}
                                    </div>
                                </div>

                                {selectedBot.tier === 'private' ? (
                                    <div className="text-center py-4 px-6 rounded-xl bg-secondary border border-border">
                                        <TbLock className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                                        <p className="text-muted-foreground text-sm">ეს ბოტი პირადია და არ არის ხელმისაწვდომი</p>
                                    </div>
                                ) : selectedBot.tier === 'premium' ? (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/25"
                                    >
                                        <TbShoppingCart className="w-5 h-5" />
                                        ყიდვა ${selectedBot.price}
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleCopy(selectedBot.id)}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-colors shadow-lg shadow-violet-500/20"
                                    >
                                        {copiedId === selectedBot.id ? (
                                            <>
                                                <TbCheck className="w-5 h-5" />
                                                პრომპტი დაკოპირდა!
                                            </>
                                        ) : (
                                            <>
                                                <TbCopy className="w-5 h-5" />
                                                პრომპტის კოპირება
                                            </>
                                        )}
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* EXIT INTENT POPUP */}
            <AnimatePresence>
                {showExitIntent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        onClick={() => setShowExitIntent(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative max-w-lg w-full bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={() => setShowExitIntent(false)} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors">
                                <TbX className="w-5 h-5" />
                            </button>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <TbPercentage className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-bold mb-2">ერთი წამით!</h3>
                                <p className="text-xl text-white/90">მიიღეთ 20% ფასდაკლება პირველ შესყიდვაზე</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2"><TbCircleCheck className="w-5 h-5 text-emerald-300" /><span>7-დღიანი უფასო ტესტი</span></li>
                                    <li className="flex items-center gap-2"><TbCircleCheck className="w-5 h-5 text-emerald-300" /><span>100% თანხის დაბრუნება</span></li>
                                    <li className="flex items-center gap-2"><TbCircleCheck className="w-5 h-5 text-emerald-300" /><span>ყველა Premium ბოტი</span></li>
                                </ul>
                            </div>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setShowExitIntent(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full py-4 bg-white text-violet-600 rounded-xl font-bold text-lg shadow-xl hover:bg-violet-50 transition-colors">
                                მიიღეთ 20% ფასდაკლება
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TELEGRAM GROUP JOIN POPUP */}
            <AnimatePresence>
                {showTelegramPopup && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowTelegramPopup(false)}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative max-w-md w-full bg-card rounded-3xl p-8 shadow-2xl border border-border" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setShowTelegramPopup(false)} className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full transition-colors"><TbX className="w-5 h-5" /></button>

                            {!codeVerified ? (
                                <>
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <TbMessage className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground mb-2">მიიღე 3 Premium ბოტი უფასოდ!</h3>
                                        <p className="text-muted-foreground mb-4">გაწევრიანდი ჩვენს Telegram ჯგუფში და მიიღე ექსკლუზიური წვდომა</p>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-foreground mb-2">გაწევრიანდი Telegram ჯგუფში</p>
                                                <a href="https://t.me/andr3waltairchannel" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                                    <TbMessage className="w-4 h-4" />
                                                    გახსენი Telegram
                                                    <TbExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-4 bg-violet-50 rounded-xl border border-violet-200">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold">2</div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-foreground">მიიღეთ კოდი ბოტისგან და შეიყვანეთ ქვემოთ</p>
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleTelegramCodeSubmit} className="space-y-4">
                                        <div>
                                            <input
                                                type="text"
                                                value={telegramCode}
                                                onChange={(e) => setTelegramCode(e.target.value.toUpperCase())}
                                                placeholder="შეიყვანეთ კოდი (მაგ: ABC123)"
                                                required
                                                maxLength={10}
                                                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-center text-lg font-mono tracking-wider"
                                            />
                                            {verificationError && (
                                                <p className="text-red-500 text-sm mt-2 text-center">{verificationError}</p>
                                            )}
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                                        >
                                            დაადასტურეთ კოდი
                                        </motion.button>
                                        <p className="text-xs text-muted-foreground text-center">კოდი მოქმედია 24 საათის განმავლობაში</p>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <TbCircleCheck className="w-10 h-10 text-emerald-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">წარმატებულია!</h3>
                                    <p className="text-muted-foreground">თქვენ მიიღეთ 3 Premium ბოტი უფასოდ</p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* BOT COMPARISON MODAL */}
            <AnimatePresence>
                {showComparisonModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        onClick={() => setShowComparisonModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative max-w-6xl w-full bg-card rounded-3xl p-8 shadow-2xl border border-border max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowComparisonModal(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full transition-colors z-10"
                            >
                                <TbX className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-foreground mb-2">ბოტების შედარება</h2>
                                <p className="text-muted-foreground">შეადარეთ არჩეული ბოტების ფუნქციები და მახასიათებლები</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from(comparisonBots).map(botId => {
                                    const bot = bots.find(b => b.id === botId);
                                    if (!bot) return null;

                                    return (
                                        <motion.div
                                            key={bot.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-gradient-to-br from-background to-secondary rounded-2xl border-2 border-border p-6 space-y-6"
                                        >
                                            {/* Header */}
                                            <div className="text-center">
                                                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${bot.color} flex items-center justify-center`}>
                                                    {iconMap[bot.icon] || <TbRobot className="w-8 h-8 text-white" />}
                                                </div>
                                                <h3 className="text-xl font-bold text-foreground mb-1">{bot.name}</h3>
                                                <p className="text-sm text-muted-foreground">{bot.codename}</p>

                                                {/* Tier Badge */}
                                                <div className="mt-3">
                                                    {bot.tier === 'private' && (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-black/10 rounded-full">
                                                            <TbLock className="w-3 h-3" />
                                                            პირადი
                                                        </span>
                                                    )}
                                                    {bot.tier === 'premium' && (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-white">
                                                            <TbCrown className="w-3 h-3" />
                                                            ₾{bot.price}/თვე
                                                        </span>
                                                    )}
                                                    {bot.tier === 'free' && (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-500 rounded-full text-white">
                                                            <TbBolt className="w-3 h-3" />
                                                            უფასო
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-semibold text-foreground">აღწერა</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{bot.shortDescription}</p>
                                            </div>

                                            {/* Features */}
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-semibold text-foreground">ფუნქციები</h4>
                                                <div className="space-y-2">
                                                    {bot.features.map((feature, i) => (
                                                        <div key={i} className="flex items-start gap-2 text-sm">
                                                            <TbCircleCheck className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                            <span className="text-foreground/80">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                                                <div className="text-center">
                                                    <div className="flex items-center justify-center gap-1 mb-1">
                                                        <TbStar className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                        <span className="text-lg font-bold text-foreground">{bot.rating.toFixed(1)}</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">რეიტინგი</p>
                                                </div>
                                                {bot.tier !== 'private' && (
                                                    <div className="text-center">
                                                        <div className="flex items-center justify-center gap-1 mb-1">
                                                            <TbDownload className="w-4 h-4 text-muted-foreground" />
                                                            <span className="text-lg font-bold text-foreground">{(bot.downloads / 1000).toFixed(1)}k</span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">ჩამოტვირთვა</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Button */}
                                            <div className="pt-4">
                                                {bot.tier === 'private' ? (
                                                    <button
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary text-muted-foreground cursor-not-allowed text-sm font-medium"
                                                        disabled
                                                    >
                                                        <TbLock className="w-4 h-4" />
                                                        პირადი ბოტი
                                                    </button>
                                                ) : bot.tier === 'premium' ? (
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium text-sm shadow-lg"
                                                    >
                                                        <TbShoppingCart className="w-4 h-4" />
                                                        ყიდვა ₾{bot.price}
                                                    </motion.button>
                                                ) : (
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => handleCopy(bot.id)}
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm transition-colors"
                                                    >
                                                        <TbCopy className="w-4 h-4" />
                                                        კოპირება
                                                    </motion.button>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Close Button */}
                            <div className="mt-8 text-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowComparisonModal(false)}
                                    className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-colors"
                                >
                                    დახურვა
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════════════════════════
                SHARE MODAL
            ═══════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {showShareModal && sharingBot && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowShareModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold">გააზიარე ბოტი</h3>
                                    <button
                                        onClick={() => setShowShareModal(false)}
                                        className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <TbX className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-cyan-50 text-sm">{sharingBot.name}</p>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                {/* Social Share Buttons */}
                                <div className="grid grid-cols-4 gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            const url = `${window.location.origin}/bots?bot=${sharingBot.id}`;
                                            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                        <span className="text-xs font-medium">Facebook</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            const url = `${window.location.origin}/bots?bot=${sharingBot.id}`;
                                            const text = `${sharingBot.name} - ${sharingBot.shortDescription}`;
                                            window.open(`viber://forward?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-600 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.177.693 6.698.623 9.82c-.06 3.11-.13 8.95 5.5 10.541v2.42s-.038.97.602 1.17c.79.25 1.24-.499 1.99-1.299l1.4-1.58c3.85.32 6.8-.419 7.14-.529.78-.25 5.181-.811 5.901-6.652.74-6.031-.36-9.831-2.34-11.551l-.01-.002c-.6-.55-3-2.3-8.37-2.32 0 0-.396-.025-1.038-.016zm.067 1.697c.545-.003.88.02.88.02 4.54.01 6.711 1.38 7.221 1.84 1.67 1.429 2.528 4.856 1.9 9.892-.6 4.88-4.17 5.19-4.83 5.4-.28.09-2.88.73-6.152.52 0 0-2.439 2.941-3.199 3.701-.12.13-.26.17-.35.15-.13-.03-.17-.19-.16-.41l.02-4.019c-4.771-1.32-4.491-6.302-4.441-8.902.06-2.6.55-4.732 2-6.172 1.957-1.77 5.475-2.01 7.11-2.02zm.36 2.6a.299.299 0 0 0-.3.299.3.3 0 0 0 .3.3 5.631 5.631 0 0 1 4.03 1.59c1.09 1.06 1.621 2.48 1.641 4.34a.3.3 0 0 0 .3.3v-.009a.3.3 0 0 0 .3-.3 6.451 6.451 0 0 0-1.81-4.76 6.13 6.13 0 0 0-4.46-1.76zm-3.954.69a.955.955 0 0 0-.615.12h-.012c-.41.24-.788.54-1.148.93-.27.29-.426.65-.426 1.01 0 .14.05.469.93 1.53.57.69 1.29 1.41 2.14 2.14 1.869 1.6 3.5 2.49 4.58 2.97.25.11.5.22.74.3.41.17.78.27 1.14.27.45 0 .83-.14 1.16-.43.33-.29.65-.56.96-.83.15-.13.3-.26.44-.39.38-.38.38-1.01 0-1.39-.59-.59-1.53-1.07-2.23-1.45a.87.87 0 0 0-.99.18l-.74.74a.349.349 0 0 1-.41.08c-.5-.17-1.63-.68-2.68-1.73-1.05-1.05-1.56-2.18-1.73-2.68a.35.35 0 0 1 .08-.41l.74-.74c.24-.24.33-.59.24-.93-.17-.63-.5-1.46-.93-2.17a.87.87 0 0 0-.7-.35zm4.473 1.939a.3.3 0 0 0-.3.3.3.3 0 0 0 .3.299 3.732 3.732 0 0 1 2.68 1.05c.74.74 1.05 1.63 1.05 2.681a.3.3 0 0 0 .3.3.3.3 0 0 0 .3-.3c0-1.23-.37-2.33-1.26-3.22a4.332 4.332 0 0 0-3.07-1.11zm.043 1.578v.01a.3.3 0 0 0-.3.3.3.3 0 0 0 .3.3c.5 0 .98.19 1.31.52.33.33.52.81.52 1.31a.3.3 0 0 0 .3.3.3.3 0 0 0 .3-.3c0-.68-.26-1.31-.73-1.78a2.488 2.488 0 0 0-1.7-.66z" /></svg>
                                        <span className="text-xs font-medium">Viber</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            const url = `${window.location.origin}/bots?bot=${sharingBot.id}`;
                                            const text = `${sharingBot.name} - ${sharingBot.shortDescription}`;
                                            window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-500 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                                        <span className="text-xs font-medium">Telegram</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            const url = `${window.location.origin}/bots?bot=${sharingBot.id}`;
                                            const text = `${sharingBot.name} - ${sharingBot.shortDescription}`;
                                            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                        <span className="text-xs font-medium">WhatsApp</span>
                                    </motion.button>
                                </div>

                                {/* Copy Link */}
                                <div className="pt-2">
                                    <label className="text-sm font-medium text-foreground mb-2 block">ბმული</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={`${window.location.origin}/bots?bot=${sharingBot.id}`}
                                            className="flex-1 px-4 py-2.5 bg-secondary rounded-lg text-sm text-foreground/80 border border-border"
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.origin}/bots?bot=${sharingBot.id}`);
                                                toast.success('დაკოპირდა!', 'ბმული დაკოპირდა');
                                            }}
                                            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                                        >
                                            <TbCopy className="w-4 h-4" />
                                            კოპირება
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════════════════════════
                BOT DETAILS MODAL (Improved)
            ═══════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {selectedBot && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                        onClick={() => setSelectedBot(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 overflow-hidden"
                        >
                            {/* Header with gradient */}
                            <div className={`relative bg-gradient-to-br ${selectedBot.color} p-8 text-white overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/10" />
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                                {iconMap[selectedBot.icon] || <TbRobot className="w-8 h-8" />}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold mb-1">{selectedBot.name}</h2>
                                                <p className="text-white/80 text-sm">{selectedBot.codename}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedBot(null)}
                                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                        >
                                            <TbX className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-lg">
                                            <TbStar className="w-4 h-4 fill-current" />
                                            <span className="font-semibold">{selectedBot.rating}</span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-lg">
                                            <TbDownload className="w-4 h-4" />
                                            <span>{(selectedBot.downloads / 1000).toFixed(1)}k</span>
                                        </div>
                                        {selectedBot.tier === 'premium' && (
                                            <div className="flex items-center gap-1 bg-amber-500/30 px-3 py-1.5 rounded-lg">
                                                <TbCrown className="w-4 h-4" />
                                                <span>₾{selectedBot.price}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                                {/* Description */}
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-3">აღწერა</h3>
                                    <p className="text-foreground/70 leading-relaxed">{selectedBot.description}</p>
                                </div>

                                {/* Features */}
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-3">ფუნქციები</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {selectedBot.features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                                                <TbCheck className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-foreground/80">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Master Prompt */}
                                {selectedBot.masterPrompt && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-3">მთავარი პრომპტი</h3>
                                        <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-6">
                                            <pre className="text-sm text-foreground/80 whitespace-pre-wrap font-mono leading-relaxed">
                                                {selectedBot.masterPrompt}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 bg-secondary/30 border-t border-border flex gap-3">
                                {selectedBot.tier === 'private' ? (
                                    <button
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary text-muted-foreground cursor-not-allowed font-medium"
                                        disabled
                                    >
                                        <TbLock className="w-5 h-5" />
                                        პირადი ბოტი
                                    </button>
                                ) : selectedBot.tier === 'premium' ? (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/30"
                                    >
                                        <TbShoppingCart className="w-5 h-5" />
                                        ყიდვა ₾{selectedBot.price}
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            if (selectedBot.masterPrompt) {
                                                navigator.clipboard.writeText(selectedBot.masterPrompt);
                                                toast.success('დაკოპირდა!', 'პრომპტი დაკოპირდა');
                                            }
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-colors shadow-lg shadow-violet-500/30"
                                    >
                                        <TbCopy className="w-5 h-5" />
                                        პრომპტის კოპირება
                                    </motion.button>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedBot(null)}
                                    className="px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-medium transition-colors"
                                >
                                    დახურვა
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════════════════════════
                USER PROMPT SUBMISSION MODAL
            ═══════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {showSubmitPrompt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowSubmitPrompt(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-2xl font-bold">შენი პრომპტის გაზიარება</h3>
                                    <button
                                        onClick={() => setShowSubmitPrompt(false)}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <TbX className="w-6 h-6" />
                                    </button>
                                </div>
                                <p className="text-violet-100 text-sm">გააზიარე შენი საუკეთესო AI პრომპტი და დაეხმარე სხვებს!</p>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">პრომპტის სახელი *</label>
                                        <input
                                            type="text"
                                            value={promptSubmission.promptName}
                                            onChange={(e) => setPromptSubmission({ ...promptSubmission, promptName: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                                            placeholder="მაგ: SEO სტატიის გენერატორი"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">ფასი (₾) *</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={promptSubmission.price}
                                            onChange={(e) => setPromptSubmission({ ...promptSubmission, price: Number(e.target.value) })}
                                            className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                                            placeholder="29"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">კატეგორია *</label>
                                    <Select value={promptSubmission.category} onValueChange={(value) => setPromptSubmission({ ...promptSubmission, category: value as BotCategory })}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="აირჩიეთ კატეგორია" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">ყველა</SelectItem>
                                            <SelectItem value="writing">წერა</SelectItem>
                                            <SelectItem value="coding">კოდირება</SelectItem>
                                            <SelectItem value="design">დიზაინი</SelectItem>
                                            <SelectItem value="business">ბიზნესი</SelectItem>
                                            <SelectItem value="marketing">მარკეტინგი</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">აღწერა *</label>
                                    <textarea
                                        value={promptSubmission.description}
                                        onChange={(e) => setPromptSubmission({ ...promptSubmission, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                                        placeholder="მოკლედ აღწერე რას აკეთებს შენი პრომპტი..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">პრომპტი *</label>
                                    <textarea
                                        value={promptSubmission.masterPrompt}
                                        onChange={(e) => setPromptSubmission({ ...promptSubmission, masterPrompt: e.target.value })}
                                        rows={8}
                                        className="w-full px-4 py-2.5 bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono text-sm"
                                        placeholder="შეიყვანე შენი AI პრომპტი აქ..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-3">პრომპტის გამოყენება:</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className="flex items-center gap-2 p-3 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors">
                                            <Checkbox
                                                checked={promptSubmission.isForTrading}
                                                onCheckedChange={(checked) => setPromptSubmission({ ...promptSubmission, isForTrading: checked as boolean })}
                                            />
                                            <span className="text-sm text-foreground">ტრეიდინგი</span>
                                        </label>
                                        <label className="flex items-center gap-2 p-3 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors">
                                            <Checkbox
                                                checked={promptSubmission.isForBusiness}
                                                onCheckedChange={(checked) => setPromptSubmission({ ...promptSubmission, isForBusiness: checked as boolean })}
                                            />
                                            <span className="text-sm text-foreground">ბიზნესი</span>
                                        </label>
                                        <label className="flex items-center gap-2 p-3 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors">
                                            <Checkbox
                                                checked={promptSubmission.isForMarketing}
                                                onCheckedChange={(checked) => setPromptSubmission({ ...promptSubmission, isForMarketing: checked as boolean })}
                                            />
                                            <span className="text-sm text-foreground">მარკეტინგი</span>
                                        </label>
                                        <label className="flex items-center gap-2 p-3 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors">
                                            <Checkbox
                                                checked={promptSubmission.isForCoding}
                                                onCheckedChange={(checked) => setPromptSubmission({ ...promptSubmission, isForCoding: checked as boolean })}
                                            />
                                            <span className="text-sm text-foreground">კოდირება</span>
                                        </label>
                                        <label className="flex items-center gap-2 p-3 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors">
                                            <Checkbox
                                                checked={promptSubmission.isForWriting}
                                                onCheckedChange={(checked) => setPromptSubmission({ ...promptSubmission, isForWriting: checked as boolean })}
                                            />
                                            <span className="text-sm text-foreground">წერა</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex gap-3">
                                        <TbInfoCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-blue-900">
                                            <p className="font-medium mb-1">შენახვის წესები:</p>
                                            <ul className="space-y-1 text-blue-800">
                                                <li>• პრომპტი უნდა იყოს ორიგინალური და გამოსადეგი</li>
                                                <li>• ადმინისტრაცია გადაამოწმებს და დაამატებს პლატფორმაზე</li>
                                                <li>• შენ მიიღებ შეტყობინებას დამტკიცების შემთხვევაში</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-secondary/30 border-t border-border flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={async () => {
                                        if (!promptSubmission.promptName || !promptSubmission.description || !promptSubmission.masterPrompt || promptSubmission.price <= 0) {
                                            toast.error('შეცდომა', 'გთხოვთ შეავსოთ ყველა სავალდებულო ველი და მიუთითოთ ფასი');
                                            return;
                                        }

                                        try {
                                            const response = await fetch('/api/bots/submit', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify(promptSubmission)
                                            });

                                            if (response.ok) {
                                                toast.success('წარმატებით გაიგზავნა!', 'შენი პრომპტი გადამოწმების რეჟიმშია');
                                                setShowSubmitPrompt(false);
                                                setPromptSubmission({
                                                    promptName: '',
                                                    category: 'all',
                                                    description: '',
                                                    masterPrompt: '',
                                                    price: 0,
                                                    isForTrading: false,
                                                    isForBusiness: false,
                                                    isForMarketing: false,
                                                    isForCoding: false,
                                                    isForWriting: false
                                                });
                                            } else {
                                                toast.error('შეცდომა', 'დაფიქსირდა შეცდომა, სცადეთ თავიდან');
                                            }
                                        } catch (error) {
                                            toast.error('შეცდომა', 'დაფიქსირდა შეცდომა, სცადეთ თავიდან');
                                        }
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-colors"
                                >
                                    <TbSend className="w-5 h-5" />
                                    გაგზავნა
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowSubmitPrompt(false)}
                                    className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl font-medium transition-colors"
                                >
                                    გაუქმება
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SUBMIT PROMPT BUTTON */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSubmitPrompt(true)}
                className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-full shadow-2xl shadow-violet-500/30 flex items-center justify-center hover:shadow-violet-500/50 transition-all"
                aria-label="Submit Prompt"
            >
                <TbPlus className="w-6 h-6" />
            </motion.button>

            {/* LIVE CHAT WIDGET */}
            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => toast.info('Live Chat მალე დაემატება!', 'დაგვიკავშირდით: support@andrewaltair.ge')} className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-full shadow-2xl shadow-emerald-500/30 flex items-center justify-center hover:shadow-emerald-500/50 transition-all" aria-label="Live Chat">
                <TbMessage className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </motion.button>

            {/* ANALYTICS TRACKING */}
            <div className="hidden" data-analytics-page="bots" data-total-bots={totalBots} data-conversion-features="enabled" />
        </div>
    );
}
