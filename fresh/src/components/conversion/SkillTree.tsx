'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TbTree, TbBolt, TbLock, TbCheck, TbStar } from "react-icons/tb";
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface Skill {
    id: string;
    name: string;
    description: string;
    xpRequired: number;
    icon: string;
    dependencies: string[];
    category: 'basics' | 'advanced' | 'expert';
}

const SKILLS: Skill[] = [
    { id: 'prompt-basics', name: 'პრომპტის საფუძვლები', description: 'AI-სთან კომუნიკაციის ბაზა', xpRequired: 0, icon: '💬', dependencies: [], category: 'basics' },
    { id: 'context-window', name: 'კონტექსტის ფანჯარა', description: 'AI მეხსიერების გაგება', xpRequired: 50, icon: '🪟', dependencies: ['prompt-basics'], category: 'basics' },
    { id: 'chain-of-thought', name: 'აზროვნების ჯაჭვი', description: 'ეტაპობრივი მსჯელობა', xpRequired: 100, icon: '🔗', dependencies: ['context-window'], category: 'basics' },
    { id: 'few-shot', name: 'Few-Shot Learning', description: 'მაგალითებით სწავლება', xpRequired: 150, icon: '🎯', dependencies: ['chain-of-thought'], category: 'advanced' },
    { id: 'system-prompts', name: 'სისტემური პრომპტები', description: 'AI პიროვნების კონფიგურაცია', xpRequired: 200, icon: '⚙️', dependencies: ['few-shot'], category: 'advanced' },
    { id: 'agents', name: 'AI აგენტები', description: 'ავტონომიური AI სისტემები', xpRequired: 300, icon: '🤖', dependencies: ['system-prompts'], category: 'expert' },
    { id: 'rag', name: 'RAG პატერნი', description: 'ცოდნის ბაზასთან ინტეგრაცია', xpRequired: 350, icon: '📚', dependencies: ['agents'], category: 'expert' },
    { id: 'fine-tuning', name: 'Fine-Tuning', description: 'მოდელის პერსონალიზაცია', xpRequired: 500, icon: '🎓', dependencies: ['rag'], category: 'expert' },
];

const CATEGORY_COLORS = {
    basics: 'from-green-500 to-emerald-600',
    advanced: 'from-blue-500 to-cyan-600',
    expert: 'from-purple-500 to-violet-600',
};

function SkillNode({
    skill,
    unlocked,
    completed,
    userXp,
    onClick
}: {
    skill: Skill;
    unlocked: boolean;
    completed: boolean;
    userXp: number;
    onClick: () => void;
}) {
    const canUnlock = unlocked && userXp >= skill.xpRequired && !completed;
    const progress = unlocked ? Math.min(100, (userXp / skill.xpRequired) * 100) : 0;

    return (
        <motion.div
            whileHover={unlocked ? { scale: 1.05 } : {}}
            whileTap={canUnlock ? { scale: 0.95 } : {}}
            onClick={canUnlock ? onClick : undefined}
            className={cn(
                "relative p-4 rounded-xl border transition-all cursor-pointer",
                completed
                    ? "border-green-500/50 bg-green-950/30"
                    : canUnlock
                        ? "border-purple-500 bg-purple-950/30 hover:border-purple-400"
                        : unlocked
                            ? "border-yellow-500/30 bg-yellow-950/20"
                            : "border-gray-700 bg-gray-900/50 opacity-50 cursor-not-allowed"
            )}
        >
            {/* Icon */}
            <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 mx-auto",
                completed
                    ? "bg-green-600"
                    : unlocked
                        ? `bg-gradient-to-br ${CATEGORY_COLORS[skill.category]}`
                        : "bg-gray-700"
            )}>
                {completed ? <TbCheck className="w-6 h-6 text-white" /> :
                    !unlocked ? <TbLock className="w-5 h-5 text-gray-400" /> : skill.icon}
            </div>

            {/* Name */}
            <h4 className="font-semibold text-white text-center text-sm mb-1">{skill.name}</h4>
            <p className="text-gray-400 text-xs text-center line-clamp-2 mb-2">{skill.description}</p>

            {/* XP Requirement */}
            {!completed && (
                <div className="text-center">
                    <span className={cn(
                        "text-xs font-medium",
                        userXp >= skill.xpRequired ? "text-green-400" : "text-yellow-400"
                    )}>
                        {skill.xpRequired} XP
                    </span>
                    {unlocked && !completed && (
                        <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Unlock Button */}
            {canUnlock && (
                <div className="mt-3">
                    <button className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded-lg transition-colors">
                        განბლოკვა
                    </button>
                </div>
            )}
        </motion.div>
    );
}

export default function SkillTree() {
    const { user, isLoading: authLoading } = useAuth();
    const [userXp, setUserXp] = useState(0);
    const [unlockedSkills, setUnlockedSkills] = useState<Set<string>>(new Set(['prompt-basics']));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            // Load from user's gamification data via API
            const loadUserProgress = async () => {
                try {
                    const res = await fetch('/api/conversion/skills', {
                        headers: { 'x-user-id': (user as any)._id || '' }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUnlockedSkills(new Set(data.unlockedSkills || ['prompt-basics']));
                        setUserXp(data.xp || 0);
                    } else {
                        // Fallback to user object data
                        setUserXp((user as any).gamification?.xp || 100);
                        setUnlockedSkills(new Set((user as any).gamification?.unlockedSkills || ['prompt-basics']));
                    }
                } catch (e) {
                    console.error(e);
                    setUserXp((user as any).gamification?.xp || 100);
                }
                setLoading(false);
            };
            loadUserProgress();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleUnlock = async (skillId: string) => {
        const skill = SKILLS.find(s => s.id === skillId);
        if (!skill || userXp < skill.xpRequired) return;

        try {
            const res = await fetch('/api/conversion/skills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': (user as any)._id || '',
                },
                body: JSON.stringify({ skillId }),
            });

            if (res.ok) {
                const data = await res.json();
                setUnlockedSkills(new Set(data.unlockedSkills));
            } else {
                // Fallback to local update
                const newUnlocked = new Set(unlockedSkills);
                newUnlocked.add(skillId);
                setUnlockedSkills(newUnlocked);
            }
        } catch (e) {
            console.error(e);
            // Fallback to local update
            const newUnlocked = new Set(unlockedSkills);
            newUnlocked.add(skillId);
            setUnlockedSkills(newUnlocked);
        }
    };

    const isUnlocked = (skill: Skill) => {
        if (skill.dependencies.length === 0) return true;
        return skill.dependencies.every(dep => unlockedSkills.has(dep));
    };

    if (authLoading || loading) {
        return <div className="animate-pulse bg-white/5 h-96 rounded-2xl" />;
    }

    if (!user) {
        return (
            <div className="text-center p-8 border border-white/10 rounded-2xl bg-white/5">
                <TbTree className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h3 className="text-xl font-bold mb-2">🌳 უნარების ხე</h3>
                <p className="text-gray-400">გაიარე ავტორიზაცია პროგრესის სანახავად</p>
            </div>
        );
    }

    const completedCount = unlockedSkills.size;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                        <TbTree className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">უნარების ხე</h2>
                        <p className="text-gray-400 text-sm">განბლოკე უნარები XP-ით</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 rounded-full">
                        <TbStar className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-bold text-yellow-400">{userXp} XP</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-full">
                        <TbBolt className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-bold text-green-400">{completedCount}/{SKILLS.length}</span>
                    </div>
                </div>
            </div>

            {/* Skill Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SKILLS.map(skill => (
                    <SkillNode
                        key={skill.id}
                        skill={skill}
                        unlocked={isUnlocked(skill)}
                        completed={unlockedSkills.has(skill.id)}
                        userXp={userXp}
                        onClick={() => handleUnlock(skill.id)}
                    />
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-xs text-gray-400 pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-600" />
                    <span>განბლოკილი</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-purple-600" />
                    <span>ხელმისაწვდომი</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gray-700" />
                    <span>ჩაკეტილი</span>
                </div>
            </div>
        </div>
    );
}
