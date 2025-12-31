'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, MessageCircle, Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface Buddy {
    id: string;
    name: string;
    level: string;
    interests: string[];
    avatar: string;
    matchScore: number;
}

const SAMPLE_BUDDIES: Buddy[] = [
    { id: '1', name: 'ნინო', level: 'საშუალო', interests: ['ChatGPT', 'მარკეტინგი'], avatar: '👩‍💻', matchScore: 95 },
    { id: '2', name: 'გიორგი', level: 'მოწინავე', interests: ['კოდირება', 'ავტომატიზაცია'], avatar: '👨‍💻', matchScore: 87 },
    { id: '3', name: 'მარიამ', level: 'დამწყები', interests: ['დიზაინი', 'DALL-E'], avatar: '👩‍🎨', matchScore: 82 },
    { id: '4', name: 'დავით', level: 'საშუალო', interests: ['ბიზნესი', 'AI სტრატეგია'], avatar: '👨‍💼', matchScore: 78 },
];

export default function AIBuddyMatching() {
    const { user } = useAuth();
    const [matches, setMatches] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleMatch = (id: string) => {
        setLoading(true);
        setTimeout(() => {
            setMatches(prev => [...prev, id]);
            setLoading(false);
        }, 500);
    };

    if (!user) {
        return (
            <div className="text-center p-8 border border-white/10 rounded-2xl bg-white/5">
                <Users className="w-12 h-12 mx-auto mb-4 text-pink-400" />
                <h3 className="text-xl font-bold mb-2">🤝 AI ბადის მეჩინგი</h3>
                <p className="text-gray-400">გაიარე ავტორიზაცია პარტნიორის საპოვნელად</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500/20 rounded-lg">
                    <Users className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">AI ბადი მეჩინგი</h2>
                    <p className="text-gray-400 text-sm">იპოვე სწავლის პარტნიორი</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {SAMPLE_BUDDIES.map((buddy, index) => (
                    <motion.div
                        key={buddy.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                            "p-4 rounded-xl border transition-all",
                            matches.includes(buddy.id)
                                ? "border-green-500/30 bg-green-950/20"
                                : "border-white/10 bg-white/5"
                        )}
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-2xl">
                                {buddy.avatar}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-white">{buddy.name}</h3>
                                    <div className="flex items-center gap-1 text-pink-400 text-sm">
                                        <Heart className="w-4 h-4" />
                                        {buddy.matchScore}%
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm">{buddy.level}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {buddy.interests.map(interest => (
                                        <span key={interest} className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-gray-300">
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => handleMatch(buddy.id)}
                            disabled={matches.includes(buddy.id)}
                            className={cn(
                                "w-full mt-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2",
                                matches.includes(buddy.id)
                                    ? "bg-green-600 text-white"
                                    : "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:opacity-90"
                            )}
                        >
                            {matches.includes(buddy.id) ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    მეჩი გაიგზავნა
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    კონტაქტი
                                </>
                            )}
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
