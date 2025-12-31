'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Trophy, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface Challenge {
    _id: string;
    title: string;
    description: string;
    xpReward: number;
    endsAt: string;
    participants: { userId: string; completedAt?: string }[];
    type: 'daily' | 'weekly' | 'special';
}

const FALLBACK_CHALLENGES = [
    { _id: '1', title: '5 გაკვეთილის დასრულება', description: 'დაასრულე 5 მიკრო-გაკვეთილი დღეს', xpReward: 100, endsAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), participants: [], type: 'daily' as const },
    { _id: '2', title: 'კვესტ მასტერი', description: 'დაასრულე 3 კვესტი ამ კვირაში', xpReward: 250, endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), participants: [], type: 'weekly' as const },
    { _id: '3', title: 'ახალი წლის სპეშალი', description: 'მოაგროვე 500 XP დეკემბერში', xpReward: 500, endsAt: new Date('2025-01-31').toISOString(), participants: [], type: 'special' as const },
];

function ChallengeCard({ challenge, onJoin, joined, userId }: {
    challenge: Challenge;
    onJoin: () => void;
    joined: boolean;
    userId: string;
}) {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const diff = new Date(challenge.endsAt).getTime() - Date.now();
            if (diff <= 0) { setTimeLeft('დასრულდა'); return; }
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            setTimeLeft(hours >= 24 ? `${Math.floor(hours / 24)}დ ${hours % 24}სთ` : `${hours}სთ ${minutes}წთ`);
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, [challenge.endsAt]);

    const typeConfig = {
        daily: { label: 'დღიური', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/20' },
        weekly: { label: 'კვირეული', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/20' },
        special: { label: 'სპეციალური', color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-500/20' },
    };
    const config = typeConfig[challenge.type];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-4">
            <div className="flex items-start justify-between">
                <div>
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", config.bg)}>{config.label}</span>
                    <h3 className="font-semibold text-white mt-2">{challenge.title}</h3>
                    <p className="text-gray-400 text-sm">{challenge.description}</p>
                </div>
                <div className="flex items-center gap-1 text-yellow-400 font-bold">
                    <Zap className="w-4 h-4" />+{challenge.xpReward}
                </div>
            </div>
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-gray-400">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{timeLeft}</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" />{challenge.participants.length}</span>
                </div>
                <button onClick={onJoin} disabled={joined} className={cn("px-4 py-1.5 rounded-lg font-medium text-sm transition-all", joined ? "bg-green-600 text-white cursor-default" : `bg-gradient-to-r ${config.color} text-white hover:opacity-90`)}>
                    {joined ? '✓ მონაწილე' : 'შეუერთდი'}
                </button>
            </div>
        </motion.div>
    );
}

export default function LiveChallenges() {
    const { user } = useAuth();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const res = await fetch('/api/conversion/challenges');
                if (res.ok) {
                    const data = await res.json();
                    setChallenges(data.challenges?.length > 0 ? data.challenges : FALLBACK_CHALLENGES);
                } else {
                    setChallenges(FALLBACK_CHALLENGES);
                }
            } catch { setChallenges(FALLBACK_CHALLENGES); }
            setLoading(false);
        };
        fetchChallenges();
    }, []);

    const handleJoin = async (id: string) => {
        if (!user) return;
        try {
            const res = await fetch('/api/conversion/challenges', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-user-id': (user as any)._id || '' },
                body: JSON.stringify({ challengeId: id, action: 'join' }),
            });
            if (res.ok) {
                setChallenges(prev => prev.map(c =>
                    c._id === id ? { ...c, participants: [...c.participants, { userId: (user as any)._id }] } : c
                ));
            }
        } catch (e) { console.error(e); }
    };

    if (!user) {
        return (
            <div className="text-center p-8 border border-white/10 rounded-2xl bg-white/5">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-xl font-bold mb-2">🏆 ლაივ ჩელენჯები</h3>
                <p className="text-gray-400">გაიარე ავტორიზაცია მონაწილეობისთვის</p>
            </div>
        );
    }

    if (loading) return <div className="animate-pulse bg-white/5 h-64 rounded-2xl" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg"><Trophy className="w-6 h-6 text-yellow-400" /></div>
                <div>
                    <h2 className="text-2xl font-bold text-white">ლაივ ჩელენჯები</h2>
                    <p className="text-gray-400 text-sm">შეჯიბრე და მოაგროვე XP</p>
                </div>
            </div>
            <div className="space-y-4">
                {challenges.map(challenge => (
                    <ChallengeCard
                        key={challenge._id}
                        challenge={challenge}
                        userId={(user as any)._id || ''}
                        joined={challenge.participants.some(p => p.userId === (user as any)._id)}
                        onJoin={() => handleJoin(challenge._id)}
                    />
                ))}
            </div>
        </div>
    );
}
