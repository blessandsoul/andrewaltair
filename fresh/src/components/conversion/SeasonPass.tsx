'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Lock, Check, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface Tier {
    level: number;
    xpRequired: number;
    reward: string;
    icon: string;
    isFree: boolean;
}

const TIERS: Tier[] = [
    { level: 1, xpRequired: 0, reward: 'ბეისიქ ბეჯი', icon: '🎖️', isFree: true },
    { level: 2, xpRequired: 100, reward: 'ლეგალიზებული პრომპტები', icon: '📜', isFree: true },
    { level: 3, xpRequired: 250, reward: 'ექსკლუზიური ავატარი', icon: '👤', isFree: false },
    { level: 4, xpRequired: 500, reward: '50 კრედიტი', icon: '💎', isFree: true },
    { level: 5, xpRequired: 750, reward: 'VIP ბეჯი', icon: '👑', isFree: false },
    { level: 6, xpRequired: 1000, reward: 'პრემიუმ თემა', icon: '🎨', isFree: false },
    { level: 7, xpRequired: 1500, reward: '100 კრედიტი', icon: '💰', isFree: true },
    { level: 8, xpRequired: 2000, reward: 'ექსპერტ სერტიფიკატი', icon: '🏆', isFree: false },
];

export default function SeasonPass() {
    const { user } = useAuth();
    const [userXp, setUserXp] = useState(0);
    const [isPremium] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchUserXp = async () => {
                try {
                    const res = await fetch('/api/conversion/stats', {
                        headers: { 'x-user-id': (user as any)._id || '' }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUserXp(data.stats?.totalXp || (user as any).gamification?.xp || 0);
                    } else {
                        setUserXp((user as any).gamification?.xp || 0);
                    }
                } catch {
                    setUserXp((user as any).gamification?.xp || 0);
                }
                setLoading(false);
            };
            fetchUserXp();
        } else {
            setLoading(false);
        }
    }, [user]);

    const currentTier = TIERS.reduce((acc, tier) =>
        userXp >= tier.xpRequired ? tier.level : acc, 1
    );

    const nextTier = TIERS.find(t => t.xpRequired > userXp);
    const progressToNext = nextTier
        ? ((userXp - (TIERS[nextTier.level - 2]?.xpRequired || 0)) /
            (nextTier.xpRequired - (TIERS[nextTier.level - 2]?.xpRequired || 0))) * 100
        : 100;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg">
                        <Trophy className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">სეზონის პასპორტი</h2>
                        <p className="text-gray-400 text-sm">სეზონი 1 • დარჩენილია 45 დღე</p>
                    </div>
                </div>

                {!isPremium && (
                    <button className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        პრემიუმ
                    </button>
                )}
            </div>

            {/* Current Progress */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-400" />
                        <span className="text-white font-medium">დონე {currentTier}</span>
                    </div>
                    <span className="text-gray-300 text-sm">{userXp} / {nextTier?.xpRequired || 'MAX'} XP</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressToNext}%` }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    />
                </div>
                {nextTier && (
                    <p className="text-xs text-gray-400 mt-2">
                        შემდეგ რევარდამდე დარჩა: {nextTier.xpRequired - userXp} XP
                    </p>
                )}
            </div>

            {/* Tiers */}
            <div className="space-y-3">
                {TIERS.map((tier, index) => {
                    const isUnlocked = userXp >= tier.xpRequired;
                    const canClaim = isUnlocked && (tier.isFree || isPremium);

                    return (
                        <motion.div
                            key={tier.level}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-xl border transition-all",
                                isUnlocked
                                    ? "border-green-500/30 bg-green-950/20"
                                    : "border-white/10 bg-white/5"
                            )}
                        >
                            {/* Level Badge */}
                            <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0",
                                isUnlocked
                                    ? "bg-gradient-to-br from-green-500 to-emerald-600"
                                    : "bg-gray-700"
                            )}>
                                {isUnlocked ? tier.icon : <Lock className="w-5 h-5 text-gray-400" />}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white">დონე {tier.level}</span>
                                    {!tier.isFree && (
                                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                                            პრემიუმ
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-400 text-sm">{tier.reward}</p>
                            </div>

                            {/* XP & Status */}
                            <div className="text-right shrink-0">
                                {isUnlocked ? (
                                    canClaim ? (
                                        <div className="flex items-center gap-1 text-green-400">
                                            <Check className="w-4 h-4" />
                                            <span className="text-sm">მიღებული</span>
                                        </div>
                                    ) : (
                                        <button className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-lg">
                                            პრემიუმ საჭირო
                                        </button>
                                    )
                                ) : (
                                    <span className="text-gray-500 text-sm">{tier.xpRequired} XP</span>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
