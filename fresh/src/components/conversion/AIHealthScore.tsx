'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Check, ChevronRight, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Question {
    id: string;
    text: string;
    options: { value: number; label: string }[];
}

const QUESTIONS: Question[] = [
    {
        id: 'q1',
        text: 'რამდენად იცნობთ AI ხელსაწყოებს (ChatGPT, Claude და ა.შ.)?',
        options: [
            { value: 0, label: 'არ მსმენია მათ შესახებ' },
            { value: 1, label: 'გამიგია, მაგრამ არ გამომიყენებია' },
            { value: 2, label: 'რამდენჯერმე გამომიცდია' },
            { value: 3, label: 'რეგულარულად ვიყენებ' },
        ],
    },
    {
        id: 'q2',
        text: 'რამდენად კარგად იცით პრომპტების წერა?',
        options: [
            { value: 0, label: 'არ ვიცი რა არის პრომპტი' },
            { value: 1, label: 'მარტივ კითხვებს ვწერ' },
            { value: 2, label: 'ვიყენებ კონტექსტს და მაგალითებს' },
            { value: 3, label: 'ვქმნი რთულ, სტრუქტურირებულ პრომპტებს' },
        ],
    },
    {
        id: 'q3',
        text: 'AI-ს რამდენად ხშირად იყენებთ სამუშაოში?',
        options: [
            { value: 0, label: 'არასდროს' },
            { value: 1, label: 'თვეში რამდენჯერმე' },
            { value: 2, label: 'კვირაში რამდენჯერმე' },
            { value: 3, label: 'ყოველდღე' },
        ],
    },
    {
        id: 'q4',
        text: 'რამდენად კარგად იცნობთ AI ავტომატიზაციას?',
        options: [
            { value: 0, label: 'არ ვიცი რა არის' },
            { value: 1, label: 'გამიგია, მაგრამ არ გამომიყენებია' },
            { value: 2, label: 'გამომიცდია მარტივი ავტომატიზაციები' },
            { value: 3, label: 'ვაშენებ კომპლექსურ workflow-ებს' },
        ],
    },
    {
        id: 'q5',
        text: 'რამდენად მზად ხართ AI ინვესტიციისთვის?',
        options: [
            { value: 0, label: 'მხოლოდ უფასო ხელსაწყოებს ვიყენებ' },
            { value: 1, label: 'მზად ვარ $20/თვემდე' },
            { value: 2, label: 'მზად ვარ $100/თვემდე' },
            { value: 3, label: 'ბიუჯეტი უთითებს თანხას' },
        ],
    },
];

const SCORE_LEVELS = [
    { min: 0, max: 4, label: 'დამწყები', color: 'from-red-500 to-orange-500', emoji: '🌱', description: 'AI მოგზაურობა ახლა იწყება! დაიწყე ჩვენი მიკრო-გაკვეთილებით.' },
    { min: 5, max: 8, label: 'მოსწავლე', color: 'from-yellow-500 to-amber-500', emoji: '📚', description: 'კარგი საფუძველი გაქვს! დროა გააღრმავო ცოდნა.' },
    { min: 9, max: 12, label: 'პრაქტიკოსი', color: 'from-blue-500 to-cyan-500', emoji: '⚡', description: 'AI აქტიურად იყენებ! შეისწავლე მოწინავე ტექნიკები.' },
    { min: 13, max: 15, label: 'ექსპერტი', color: 'from-purple-500 to-pink-500', emoji: '🚀', description: 'შესანიშნავი! მზად ხარ AI ლიდერობისთვის!' },
];

export default function AIHealthScore() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (value: number) => {
        const question = QUESTIONS[currentQuestion];
        setAnswers(prev => ({ ...prev, [question.id]: value }));

        if (currentQuestion < QUESTIONS.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setShowResult(true);
        }
    };

    const handleReset = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setShowResult(false);
    };

    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const maxScore = QUESTIONS.length * 3;
    const scorePercent = (totalScore / maxScore) * 100;
    const level = SCORE_LEVELS.find(l => totalScore >= l.min && totalScore <= l.max) || SCORE_LEVELS[0];

    if (showResult) {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Activity className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">AI ჯანმრთელობის ქულა</h2>
                        <p className="text-gray-400 text-sm">შენი შედეგი</p>
                    </div>
                </div>

                {/* Score */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                >
                    <div className="text-6xl mb-4">{level.emoji}</div>
                    <div className={cn(
                        "inline-block px-6 py-2 rounded-full text-lg font-bold mb-4",
                        `bg-gradient-to-r ${level.color} text-white`
                    )}>
                        {level.label}
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">{totalScore}/{maxScore}</div>

                    {/* Progress Bar */}
                    <div className="max-w-xs mx-auto h-3 bg-gray-700 rounded-full overflow-hidden mb-4">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${scorePercent}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={cn("h-full rounded-full", `bg-gradient-to-r ${level.color}`)}
                        />
                    </div>

                    <p className="text-gray-300 max-w-md mx-auto">{level.description}</p>
                </motion.div>

                {/* Reset */}
                <button
                    onClick={handleReset}
                    className="w-full py-3 border border-white/10 rounded-xl text-gray-300 hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    თავიდან გავლა
                </button>
            </div>
        );
    }

    const question = QUESTIONS[currentQuestion];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Activity className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">AI ჯანმრთელობის ტესტი</h2>
                        <p className="text-gray-400 text-sm">შეაფასე შენი AI მზადყოფნა</p>
                    </div>
                </div>
                <span className="text-sm text-gray-400">
                    {currentQuestion + 1}/{QUESTIONS.length}
                </span>
            </div>

            {/* Progress */}
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
                />
            </div>

            {/* Question */}
            <motion.div
                key={question.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
            >
                <h3 className="text-lg font-medium text-white">{question.text}</h3>

                <div className="space-y-2">
                    {question.options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleAnswer(option.value)}
                            className="w-full p-4 text-left rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/50 transition-all group"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-gray-200">{option.label}</span>
                                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                            </div>
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
