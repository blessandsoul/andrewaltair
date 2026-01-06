'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TbGift, TbSparkles, TbClock, TbCoins } from "react-icons/tb";
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface Reward {
    type: 'credits' | 'badge' | 'discount';
    value: string;
    label: string;
    icon: React.ReactNode;
}

const REWARDS: Reward[] = [
    { type: 'credits', value: '50', label: 'AI კრედიტი', icon: <TbCoins className="w-6 h-6 text-yellow-500" /> },
    { type: 'credits', value: '100', label: 'AI კრედიტი', icon: <TbCoins className="w-6 h-6 text-yellow-500" /> },
    { type: 'discount', value: '10%', label: 'ფასდაკლების კუპონი', icon: <TbGift className="w-6 h-6 text-pink-500" /> },
];

export default function MysteryBox() {
    const { user, token, isLoading: authLoading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [canClaim, setCanClaim] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');
    const [reward, setReward] = useState<Reward | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && token) {
            checkAvailability();
        } else {
            setLoading(false);
        }
    }, [user, token]);

    // Periodically update time left if user is logged in
    useEffect(() => {
        if (!user || !token) return;
        const interval = setInterval(() => {
            checkAvailability();
        }, 60000);
        return () => clearInterval(interval);
    }, [user, token]);

    const checkAvailability = async () => {
        if (!user || !token) return;
        try {
            const res = await fetch('/api/conversion/mystery-box', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (data.canClaim) {
                setCanClaim(true);
                setTimeLeft('');
            } else {
                setCanClaim(false);
                if (data.lastClaimedAt) {
                    const lastDate = new Date(data.lastClaimedAt);
                    const now = new Date();
                    const diff = now.getTime() - lastDate.getTime();
                    const cooldown = 24 * 60 * 60 * 1000;
                    const remaining = cooldown - diff;

                    if (remaining > 0) {
                        const hours = Math.floor(remaining / (1000 * 60 * 60));
                        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
                        setTimeLeft(`${hours}სთ ${minutes}წთ`);
                    } else {
                        setCanClaim(true);
                    }
                }
            }
        } catch (e) {
            console.error("Failed to check mystery box", e);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = async () => {
        if (!canClaim || isOpen || !user || !token) return;

        try {
            const res = await fetch('/api/conversion/mystery-box', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({}) // Body no longer needs userId
            });

            const data = await res.json();

            if (data.success) {
                // Animation start
                setTimeout(() => {
                    setReward({
                        type: 'credits',
                        value: data.reward.value.toString(),
                        label: 'AI კრედიტი',
                        icon: <TbCoins className="w-6 h-6 text-yellow-500" />
                    });
                    setIsOpen(true);
                    setCanClaim(false);
                }, 1000);
            } else {
                console.error(data.error);
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (authLoading || loading) {
        return <div className="animate-pulse bg-white/5 h-64 rounded-2xl"></div>;
    }

    if (!user) {
        return (
            <div className="w-full max-w-sm mx-auto p-6 relative border border-white/10 rounded-2xl bg-white/5 text-center">
                <h3 className="text-xl font-bold mb-2">🎁 Mystery TbBox</h3>
                <p className="text-gray-400 mb-4">გაიარე ავტორიზაცია საჩუქრის მისაღებად</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-sm mx-auto p-6 relative">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    დღიური საჩუქარი
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                    გახსენი ყუთი ყოველ 24 საათში და მიიღე პრიზები
                </p>
            </div>

            <div className="relative h-64 flex items-center justify-center cursor-pointer" onClick={handleOpen}>
                <AnimatePresence>
                    {!isOpen ? (
                        <motion.div
                            whileHover={canClaim ? { scale: 1.05, rotate: [0, -5, 5, 0] } : {}}
                            whileTap={canClaim ? { scale: 0.95 } : {}}
                            animate={canClaim ? { y: [0, -10, 0] } : { opacity: 0.5 }}
                            transition={{
                                y: { repeat: Infinity, duration: 2 },
                                rotate: { duration: 0.5 }
                            }}
                            className={cn(
                                "relative z-10 w-40 h-40 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-2xl flex items-center justify-center border-4 border-white/10",
                                !canClaim && "grayscale cursor-not-allowed"
                            )}
                        >
                            <TbGift className="w-20 h-20 text-white" />

                            {canClaim && (
                                <motion.div
                                    className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl -z-10 blur-xl opacity-50"
                                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="relative z-10 w-full bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg"
                            >
                                {reward?.icon}
                            </motion.div>

                            <h4 className="text-xl font-bold text-white mb-1">{reward?.value}</h4>
                            <p className="text-purple-300 text-sm mb-4">{reward?.label}</p>

                            <button
                                onClick={(e) => { e.stopPropagation(); setIsOpen(false); checkAvailability(); }}
                                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm transition-colors"
                            >
                                დახურვა
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Particles */}
                {canClaim && !isOpen && (
                    <>
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute text-yellow-400"
                                initial={{ opacity: 0, y: 0, x: 0 }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    y: -100,
                                    x: (Math.random() - 0.5) * 100
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.4,
                                    ease: "easeOut"
                                }}
                            >
                                <TbSparkles className="w-4 h-4" />
                            </motion.div>
                        ))}
                    </>
                )}
            </div>

            {!canClaim && !isOpen && (
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                        <TbClock className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-mono text-white">{timeLeft}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
