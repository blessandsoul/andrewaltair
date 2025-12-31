'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Shield, Trophy, Star, Check, ChevronRight, Lock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface QuestStep {
    id: string;
    title: string;
    description: string;
    xpReward: number;
}

interface Quest {
    _id: string;
    title: string;
    description: string;
    steps: QuestStep[];
    totalXp: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
    category: string;
    userProgress: {
        started: boolean;
        completedSteps: string[];
        isComplete: boolean;
    };
}

const DIFFICULTY_CONFIG = {
    easy: { label: 'იოლი', color: 'from-green-500 to-emerald-600', icon: '🌱' },
    medium: { label: 'საშუალო', color: 'from-yellow-500 to-orange-500', icon: '⚔️' },
    hard: { label: 'რთული', color: 'from-red-500 to-pink-500', icon: '🔥' },
    legendary: { label: 'ლეგენდარული', color: 'from-purple-500 to-violet-600', icon: '👑' },
};

function QuestCard({
    quest,
    onStart,
    onCompleteStep,
    expanded,
    onToggle,
}: {
    quest: Quest;
    onStart: () => void;
    onCompleteStep: (stepId: string) => void;
    expanded: boolean;
    onToggle: () => void;
}) {
    const config = DIFFICULTY_CONFIG[quest.difficulty];
    const completedCount = quest.userProgress.completedSteps.length;
    const progress = (completedCount / quest.steps.length) * 100;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "rounded-2xl border overflow-hidden transition-all",
                quest.userProgress.isComplete
                    ? "border-green-500/30 bg-green-950/20"
                    : expanded
                        ? "border-purple-500/50 bg-purple-950/20"
                        : "border-white/10 bg-white/5"
            )}
        >
            {/* Header */}
            <div
                className="p-5 cursor-pointer"
                onClick={onToggle}
            >
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0",
                        `bg-gradient-to-br ${config.color}`
                    )}>
                        {quest.userProgress.isComplete ? '✅' : config.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-white">{quest.title}</h3>
                            <span className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-medium",
                                `bg-gradient-to-r ${config.color} text-white`
                            )}>
                                {config.label}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2">{quest.description}</p>

                        {/* Progress */}
                        <div className="mt-3 flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    className={cn("h-full rounded-full", `bg-gradient-to-r ${config.color}`)}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-400 font-medium">
                                {completedCount}/{quest.steps.length}
                            </span>
                        </div>
                    </div>

                    {/* XP Badge */}
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500/20 rounded-full shrink-0">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-bold text-yellow-400">{quest.totalXp}</span>
                    </div>
                </div>
            </div>

            {/* Expanded Steps */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/10"
                    >
                        <div className="p-5 space-y-3">
                            {!quest.userProgress.started ? (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onStart(); }}
                                    className={cn(
                                        "w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2",
                                        `bg-gradient-to-r ${config.color} text-white hover:opacity-90 transition-opacity`
                                    )}
                                >
                                    <Sword className="w-5 h-5" />
                                    დაიწყე კვესტი
                                </button>
                            ) : (
                                quest.steps.map((step, index) => {
                                    const isCompleted = quest.userProgress.completedSteps.includes(step.id);
                                    const prevCompleted = index === 0 ||
                                        quest.userProgress.completedSteps.includes(quest.steps[index - 1].id);
                                    const isLocked = !prevCompleted && !isCompleted;

                                    return (
                                        <motion.div
                                            key={step.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={cn(
                                                "p-4 rounded-xl border transition-all",
                                                isCompleted
                                                    ? "border-green-500/30 bg-green-950/20"
                                                    : isLocked
                                                        ? "border-gray-700 bg-gray-900/50 opacity-50"
                                                        : "border-white/10 bg-white/5"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                                                    isCompleted
                                                        ? "bg-green-600 text-white"
                                                        : isLocked
                                                            ? "bg-gray-700 text-gray-400"
                                                            : "bg-purple-600 text-white"
                                                )}>
                                                    {isCompleted ? <Check className="w-4 h-4" /> :
                                                        isLocked ? <Lock className="w-4 h-4" /> : index + 1}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-white text-sm">{step.title}</h4>
                                                    <p className="text-gray-400 text-xs">{step.description}</p>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="text-xs text-yellow-400 font-medium">
                                                        +{step.xpReward} XP
                                                    </span>

                                                    {!isCompleted && !isLocked && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onCompleteStep(step.id);
                                                            }}
                                                            className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded-lg transition-colors"
                                                        >
                                                            დასრულება
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function AIQuestJourney() {
    const { user, isLoading: authLoading } = useAuth();
    const [quests, setQuests] = useState<Quest[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedQuest, setExpandedQuest] = useState<string | null>(null);

    useEffect(() => {
        if (user) fetchQuests();
        else setLoading(false);
    }, [user]);

    const fetchQuests = async () => {
        try {
            const userId = user?.id || (user as any)?._id;
            const res = await fetch(`/api/conversion/quests?userId=${userId}`);
            const data = await res.json();
            setQuests(data.quests || []);
        } catch (e) {
            console.error('Failed to fetch quests', e);
        } finally {
            setLoading(false);
        }
    };

    const handleStart = async (questId: string) => {
        if (!user) return;

        try {
            await fetch('/api/conversion/quests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questId,
                    userId: user.id || (user as any)._id,
                    action: 'start'
                })
            });
            fetchQuests();
        } catch (e) {
            console.error(e);
        }
    };

    const handleCompleteStep = async (questId: string, stepId: string) => {
        if (!user) return;

        try {
            await fetch('/api/conversion/quests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questId,
                    userId: user.id || (user as any)._id,
                    stepId,
                    action: 'complete_step'
                })
            });
            fetchQuests();
        } catch (e) {
            console.error(e);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="space-y-4">
                {[1, 2].map(i => (
                    <div key={i} className="animate-pulse bg-white/5 h-32 rounded-2xl" />
                ))}
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center p-8 border border-white/10 rounded-2xl bg-white/5">
                <Sword className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h3 className="text-xl font-bold mb-2">⚔️ AI კვესტები</h3>
                <p className="text-gray-400">გაიარე ავტორიზაცია კვესტების დასაწყებად</p>
            </div>
        );
    }

    const completedQuests = quests.filter(q => q.userProgress.isComplete).length;
    const totalXpEarned = quests.reduce((sum, q) => {
        if (q.userProgress.isComplete) return sum + q.totalXp;
        return sum + q.steps
            .filter(s => q.userProgress.completedSteps.includes(s.id))
            .reduce((stepSum, s) => stepSum + s.xpReward, 0);
    }, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Sword className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">AI კვესტები</h2>
                        <p className="text-gray-400 text-sm">შეასრულე მისიები და მიიღე XP</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-full">
                        <Trophy className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-bold text-green-400">{completedQuests}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 rounded-full">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-bold text-yellow-400">{totalXpEarned} XP</span>
                    </div>
                </div>
            </div>

            {/* Quests */}
            {quests.length === 0 ? (
                <div className="text-center p-8 border border-white/10 rounded-2xl bg-white/5">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                    <p className="text-gray-400">კვესტები მალე გამოჩნდება</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {quests.map(quest => (
                        <QuestCard
                            key={quest._id}
                            quest={quest}
                            expanded={expandedQuest === quest._id}
                            onToggle={() => setExpandedQuest(
                                expandedQuest === quest._id ? null : quest._id
                            )}
                            onStart={() => handleStart(quest._id)}
                            onCompleteStep={(stepId) => handleCompleteStep(quest._id, stepId)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
