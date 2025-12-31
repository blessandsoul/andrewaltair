'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, Tag, Check, AlertCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface Deal {
    _id: string;
    title: string;
    description: string;
    discount: number;
    originalPrice?: number;
    discountedPrice?: number;
    expiresAt: string;
    totalSlots: number;
    claimedSlots: number;
    category: string;
    code?: string;
}

function CountdownTimer({ expiresAt }: { expiresAt: string }) {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const diff = new Date(expiresAt).getTime() - Date.now();
            if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

            return {
                hours: Math.floor(diff / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            };
        };

        setTimeLeft(calculateTimeLeft());
        const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearInterval(interval);
    }, [expiresAt]);

    return (
        <div className="flex items-center gap-1 text-sm font-mono">
            <Clock className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300">
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
            </span>
        </div>
    );
}

function DealCard({ deal, onClaim, claiming, claimed }: {
    deal: Deal;
    onClaim: (id: string) => void;
    claiming: boolean;
    claimed: boolean;
}) {
    const slotsLeft = deal.totalSlots - deal.claimedSlots;
    const urgency = slotsLeft <= 5;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "relative overflow-hidden rounded-2xl border p-5",
                urgency
                    ? "border-red-500/50 bg-gradient-to-br from-red-950/30 to-orange-950/30"
                    : "border-white/10 bg-white/5"
            )}
        >
            {/* Discount Badge */}
            <div className="absolute -top-1 -right-1">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                    -{deal.discount}%
                </div>
            </div>

            {/* Category */}
            <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-purple-300 uppercase tracking-wide">
                    {deal.category}
                </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">{deal.title}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{deal.description}</p>

            {/* Price */}
            {deal.originalPrice && (
                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-green-400">
                        ₾{deal.discountedPrice}
                    </span>
                    <span className="text-gray-500 line-through text-sm">
                        ₾{deal.originalPrice}
                    </span>
                </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between mb-4 text-sm">
                <CountdownTimer expiresAt={deal.expiresAt} />
                <div className={cn(
                    "flex items-center gap-1",
                    urgency ? "text-red-400" : "text-gray-400"
                )}>
                    <Users className="w-4 h-4" />
                    <span>{slotsLeft} დარჩენილია</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-gray-700 rounded-full mb-4 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(deal.claimedSlots / deal.totalSlots) * 100}%` }}
                    className={cn(
                        "h-full rounded-full",
                        urgency ? "bg-red-500" : "bg-purple-500"
                    )}
                />
            </div>

            {/* Action Button */}
            <button
                onClick={() => onClaim(deal._id)}
                disabled={claiming || claimed || slotsLeft === 0}
                className={cn(
                    "w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2",
                    claimed
                        ? "bg-green-600 text-white cursor-default"
                        : slotsLeft === 0
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500"
                )}
            >
                {claimed ? (
                    <>
                        <Check className="w-4 h-4" />
                        მიღებულია
                    </>
                ) : slotsLeft === 0 ? (
                    <>
                        <AlertCircle className="w-4 h-4" />
                        ამოიწურა
                    </>
                ) : claiming ? (
                    <span className="animate-pulse">იტვირთება...</span>
                ) : (
                    <>
                        <Zap className="w-4 h-4" />
                        მიიღე შეთავაზება
                    </>
                )}
            </button>
        </motion.div>
    );
}

export default function LimitedTimeDeals() {
    const { user, isLoading: authLoading } = useAuth();
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState<string | null>(null);
    const [claimedDeals, setClaimedDeals] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        try {
            const res = await fetch('/api/conversion/deals');
            const data = await res.json();
            setDeals(data.deals || []);
        } catch (e) {
            console.error('Failed to fetch deals', e);
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = async (dealId: string) => {
        if (!user) return;

        setClaiming(dealId);
        try {
            const res = await fetch('/api/conversion/deals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dealId,
                    userId: user.id || (user as any)._id
                })
            });

            const data = await res.json();
            if (data.success) {
                setClaimedDeals(prev => new Set([...prev, dealId]));
                // Refresh deals to update slots
                fetchDeals();
            } else {
                console.error(data.error);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setClaiming(null);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="space-y-4">
                {[1, 2].map(i => (
                    <div key={i} className="animate-pulse bg-white/5 h-64 rounded-2xl" />
                ))}
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center p-8 border border-white/10 rounded-2xl bg-white/5">
                <Zap className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h3 className="text-xl font-bold mb-2">🔥 შეზღუდული შეთავაზებები</h3>
                <p className="text-gray-400">გაიარე ავტორიზაცია შეთავაზებების სანახავად</p>
            </div>
        );
    }

    if (deals.length === 0) {
        return (
            <div className="text-center p-8 border border-white/10 rounded-2xl bg-white/5">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-bold mb-2">მალე!</h3>
                <p className="text-gray-400">ახალი შეთავაზებები მალე გამოჩნდება</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Zap className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">შეზღუდული შეთავაზებები</h2>
                    <p className="text-gray-400 text-sm">ნუ გამოტოვებ ექსკლუზიურ ფასდაკლებებს</p>
                </div>
            </div>

            <AnimatePresence>
                <div className="grid gap-4 md:grid-cols-2">
                    {deals.map(deal => (
                        <DealCard
                            key={deal._id}
                            deal={deal}
                            onClaim={handleClaim}
                            claiming={claiming === deal._id}
                            claimed={claimedDeals.has(deal._id)}
                        />
                    ))}
                </div>
            </AnimatePresence>
        </div>
    );
}
