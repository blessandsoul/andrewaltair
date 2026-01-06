'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TbBook, TbClock, TbBolt, TbCheck, TbChevronRight, TbStar, TbTrophy } from "react-icons/tb";
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface Lesson {
    _id: string;
    title: string;
    description: string;
    content: string;
    duration: number;
    xpReward: number;
    category: string;
    difficulty: string;
    completed: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
    prompt: 'from-blue-500 to-cyan-500',
    tool: 'from-purple-500 to-pink-500',
    concept: 'from-green-500 to-emerald-500',
    workflow: 'from-orange-500 to-yellow-500',
};

const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
    beginner: { label: 'დამწყები', color: 'text-green-400' },
    intermediate: { label: 'საშუალო', color: 'text-yellow-400' },
    advanced: { label: 'მოწინავე', color: 'text-red-400' },
};

function LessonCard({
    lesson,
    onStart,
    isActive
}: {
    lesson: Lesson;
    onStart: () => void;
    isActive: boolean;
}) {
    const gradientClass = CATEGORY_COLORS[lesson.category] || CATEGORY_COLORS.concept;
    const difficulty = DIFFICULTY_LABELS[lesson.difficulty] || DIFFICULTY_LABELS.beginner;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
                "relative p-4 rounded-xl border transition-all cursor-pointer",
                lesson.completed
                    ? "border-green-500/30 bg-green-950/20"
                    : isActive
                        ? "border-purple-500 bg-purple-950/30 ring-2 ring-purple-500/50"
                        : "border-white/10 bg-white/5 hover:border-white/20"
            )}
            onClick={onStart}
        >
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    lesson.completed ? "bg-green-600" : `bg-gradient-to-br ${gradientClass}`
                )}>
                    {lesson.completed ? (
                        <TbCheck className="w-6 h-6 text-white" />
                    ) : (
                        <TbBook className="w-6 h-6 text-white" />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white truncate">{lesson.title}</h3>
                        <span className={cn("text-xs", difficulty.color)}>
                            {difficulty.label}
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-2">{lesson.description}</p>

                    <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1 text-gray-500">
                            <TbClock className="w-3 h-3" />
                            {Math.floor(lesson.duration / 60)} წთ
                        </span>
                        <span className="flex items-center gap-1 text-yellow-400">
                            <TbBolt className="w-3 h-3" />
                            +{lesson.xpReward} XP
                        </span>
                    </div>
                </div>

                {/* Arrow */}
                <TbChevronRight className={cn(
                    "w-5 h-5 shrink-0 transition-transform",
                    isActive ? "text-purple-400 translate-x-1" : "text-gray-600"
                )} />
            </div>
        </motion.div>
    );
}

function LessonViewer({
    lesson,
    onComplete,
    onClose
}: {
    lesson: Lesson;
    onComplete: () => void;
    onClose: () => void;
}) {
    const [progress, setProgress] = useState(0);
    const [canComplete, setCanComplete] = useState(false);

    useEffect(() => {
        // Progress bar animation
        const duration = lesson.duration * 1000;
        const interval = 100;
        const increment = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress(prev => {
                const next = prev + increment;
                if (next >= 100) {
                    setCanComplete(true);
                    clearInterval(timer);
                    return 100;
                }
                return next;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [lesson.duration]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
            <div className="w-full max-w-2xl bg-[#12121a] border border-white/10 rounded-2xl overflow-hidden">
                {/* Progress Bar */}
                <div className="h-1 bg-gray-800">
                    <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>

                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <TbBook className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-white">{lesson.title}</h2>
                                <p className="text-xs text-gray-400">
                                    {Math.floor(lesson.duration / 60)} წუთიანი გაკვეთილი
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[400px] overflow-y-auto">
                    <div className="prose prose-invert prose-sm max-w-none">
                        {lesson.content.split('\n').map((paragraph, i) => (
                            <p key={i} className="text-gray-300 mb-4">{paragraph}</p>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-white/5">
                    <button
                        onClick={onComplete}
                        disabled={!canComplete}
                        className={cn(
                            "w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all",
                            canComplete
                                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500"
                                : "bg-gray-700 text-gray-400 cursor-not-allowed"
                        )}
                    >
                        {canComplete ? (
                            <>
                                <TbTrophy className="w-5 h-5" />
                                დასრულება (+{lesson.xpReward} XP)
                            </>
                        ) : (
                            <>
                                <TbClock className="w-5 h-5 animate-pulse" />
                                წაიკითხე გაკვეთილი...
                            </>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default function MicroLessons() {
    const { user, isLoading: authLoading } = useAuth();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [totalXp, setTotalXp] = useState(0);

    useEffect(() => {
        if (user) fetchLessons();
        else setLoading(false);
    }, [user]);

    const fetchLessons = async () => {
        try {
            const userId = user?.id || (user as any)?._id;
            const res = await fetch(`/api/conversion/lessons?userId=${userId}`);
            const data = await res.json();
            setLessons(data.lessons || []);

            // Calculate total XP from completed lessons
            const completedXp = (data.lessons || [])
                .filter((l: Lesson) => l.completed)
                .reduce((sum: number, l: Lesson) => sum + l.xpReward, 0);
            setTotalXp(completedXp);
        } catch (e) {
            console.error('Failed to fetch lessons', e);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async () => {
        if (!activeLesson || !user) return;

        try {
            const res = await fetch('/api/conversion/lessons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lessonId: activeLesson._id,
                    userId: user.id || (user as any)._id
                })
            });

            const data = await res.json();
            if (data.success && !data.alreadyCompleted) {
                setTotalXp(prev => prev + activeLesson.xpReward);
            }

            setActiveLesson(null);
            fetchLessons();
        } catch (e) {
            console.error(e);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse bg-white/5 h-24 rounded-xl" />
                ))}
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center p-8 border border-white/10 rounded-2xl bg-white/5">
                <TbBook className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h3 className="text-xl font-bold mb-2">⚡ მიკრო-გაკვეთილები</h3>
                <p className="text-gray-400">გაიარე ავტორიზაცია სწავლის დასაწყებად</p>
            </div>
        );
    }

    const completedCount = lessons.filter(l => l.completed).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <TbBook className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">მიკრო-გაკვეთილები</h2>
                        <p className="text-gray-400 text-sm">2-წუთიანი AI გაკვეთილები</p>
                    </div>
                </div>


                {/* XP Badge */}
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full">
                    <TbStar className="w-5 h-5 text-yellow-400" />
                    <span className="font-bold text-yellow-400">{totalXp} XP</span>
                </div>
            </div>

            {/* Progress */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="text-gray-400">პროგრესი</span>
                    <span className="text-white font-medium">{completedCount}/{lessons.length}</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                        style={{ width: `${(completedCount / Math.max(lessons.length, 1)) * 100}%` }}
                    />
                </div>
            </div>

            {/* Lessons List */}
            {lessons.length === 0 ? (
                <div className="text-center p-8 border border-white/10 rounded-2xl bg-white/5">
                    <TbBook className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                    <p className="text-gray-400">გაკვეთილები მალე გამოჩნდება</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {lessons.map((lesson, index) => (
                        <LessonCard
                            key={lesson._id}
                            lesson={lesson}
                            isActive={activeLesson?._id === lesson._id}
                            onStart={() => setActiveLesson(lesson)}
                        />
                    ))}
                </div>
            )}

            {/* Lesson Viewer Modal */}
            <AnimatePresence>
                {activeLesson && (
                    <LessonViewer
                        lesson={activeLesson}
                        onComplete={handleComplete}
                        onClose={() => setActiveLesson(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
