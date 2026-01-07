'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TbClipboardCheck, TbChevronRight, TbChartBar, TbAlertTriangle, TbCheck } from "react-icons/tb";
import { cn } from '@/lib/utils';

interface AssessmentQuestion {
    id: string;
    category: string;
    question: string;
    options: { value: number; label: string }[];
}

const QUESTIONS: AssessmentQuestion[] = [
    { id: '1', category: 'ინფრასტრუქტურა', question: 'რამდენად ციფრულია თქვენი ბიზნეს პროცესები?', options: [{ value: 0, label: 'მეტწილად მექანიკური' }, { value: 1, label: 'ნახევრად ციფრული' }, { value: 2, label: 'სრულად ციფრული' }] },
    { id: '2', category: 'მონაცემები', question: 'გაქვთ სტრუქტურირებული მონაცემთა ბაზა?', options: [{ value: 0, label: 'არა' }, { value: 1, label: 'ნაწილობრივ' }, { value: 2, label: 'დიახ, სრულად' }] },
    { id: '3', category: 'გუნდი', question: 'გუნდის AI ცოდნის დონე?', options: [{ value: 0, label: 'დამწყები' }, { value: 1, label: 'საშუალო' }, { value: 2, label: 'მოწინავე' }] },
    { id: '4', category: 'ბიუჯეტი', question: 'AI ინვესტიციისთვის ბიუჯეტი?', options: [{ value: 0, label: 'არ არის' }, { value: 1, label: 'შეზღუდული' }, { value: 2, label: 'საკმარისი' }] },
];

export default function AIReadinessAssessment() {
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (value: number) => {
        const q = QUESTIONS[currentQ];
        setAnswers(prev => ({ ...prev, [q.id]: value }));
        if (currentQ < QUESTIONS.length - 1) setCurrentQ(prev => prev + 1);
        else setShowResult(true);
    };

    const score = Object.values(answers).reduce((sum, v) => sum + v, 0);
    const maxScore = QUESTIONS.length * 2;
    const percent = Math.round((score / maxScore) * 100);

    const getLevel = () => {
        if (percent >= 80) return { label: 'მაღალი მზადყოფნა', color: 'text-green-400', bg: 'bg-green-500/20' };
        if (percent >= 50) return { label: 'საშუალო მზადყოფნა', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
        return { label: 'საჭიროა მომზადება', color: 'text-red-400', bg: 'bg-red-500/20' };
    };

    if (showResult) {
        const level = getLevel();
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <TbClipboardCheck className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">შეფასების შედეგი</h2>
                </div>

                <div className="p-6 rounded-2xl border border-white/10 bg-white/5 text-center">
                    <div className={cn("inline-block px-4 py-2 rounded-full text-sm font-medium mb-4", level.bg, level.color)}>
                        {level.label}
                    </div>
                    <div className="text-5xl font-bold text-white mb-2">{percent}%</div>
                    <p className="text-gray-400">AI მზადყოფნის ინდექსი</p>

                    <div className="mt-6 h-3 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                    </div>
                </div>

                <button onClick={() => { setShowResult(false); setCurrentQ(0); setAnswers({}); }} className="w-full py-3 border border-border rounded-xl text-muted-foreground hover:bg-muted/50 transition-colors">
                    თავიდან გავლა
                </button>
            </motion.div>
        );
    }

    const q = QUESTIONS[currentQ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <TbClipboardCheck className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">AI მზადყოფნის ტესტი</h2>
                        <p className="text-muted-foreground text-sm">კომპანიის შეფასება</p>
                    </div>
                </div>
                <span className="text-sm text-muted-foreground">{currentQ + 1}/{QUESTIONS.length}</span>
            </div>

            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }} />
            </div>

            <motion.div key={q.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="text-xs text-blue-400 uppercase tracking-wide">{q.category}</div>
                <h3 className="text-lg font-medium text-foreground">{q.question}</h3>
                <div className="space-y-2">
                    {q.options.map(opt => (
                        <button key={opt.value} onClick={() => handleAnswer(opt.value)} className="w-full p-4 text-left rounded-xl border border-border bg-card/50 hover:bg-muted/50 hover:border-blue-500/50 transition-all group">
                            <div className="flex items-center justify-between">
                                <span className="text-foreground">{opt.label}</span>
                                <TbChevronRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                            </div>
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
