"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TbCheck, TbX, TbReload, TbTrophy } from 'react-icons/tb';
import { QuizSection as QuizSectionType } from '@/types/article';

interface QuizSectionProps {
    section: QuizSectionType;
}

export default function QuizSection({ section }: QuizSectionProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const handleAnswer = (optionIndex: number, points: number) => {
        setSelectedOption(optionIndex);

        setTimeout(() => {
            const newScore = score + points;
            setScore(newScore);

            if (currentQuestion < section.questions.length - 1) {
                setCurrentQuestion(curr => curr + 1);
                setSelectedOption(null);
            } else {
                setShowResult(true);
            }
        }, 500);
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowResult(false);
        setSelectedOption(null);
    };

    // Determine result based on score
    const getResult = () => {
        // Find the matching range in results
        // Assumption: results keys are like "0-3", "4-6", "7+"
        const entry = Object.entries(section.results).find(([range]) => {
            if (range.includes('+')) {
                const min = parseInt(range.replace('+', ''));
                return score >= min;
            }
            const [min, max] = range.split('-').map(Number);
            return score >= min && score <= max;
        });

        return entry ? entry[1] : Object.values(section.results)[0];
    };

    const resultData = getResult();

    return (
        <section className="py-12 md:py-20 px-4 md:px-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
                {/* Header */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 md:p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-fullblur-3xl -translate-y-1/2 translate-x-1/2" />
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 relative z-10">{section.title}</h2>
                    {!showResult && (
                        <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                            <span>Question {currentQuestion + 1} of {section.questions.length}</span>
                            <div className="flex-1 h-1.5 bg-white/20 rounded-full max-w-[100px]">
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-300"
                                    style={{ width: `${((currentQuestion + 1) / section.questions.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 md:p-8">
                    <AnimatePresence mode="wait">
                        {!showResult ? (
                            <motion.div
                                key="question"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 className="text-xl font-bold text-gray-900 mb-6">
                                    {section.questions[currentQuestion].q}
                                </h3>
                                <div className="space-y-3">
                                    {section.questions[currentQuestion].options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(idx, section.questions[currentQuestion].scores[idx])}
                                            disabled={selectedOption !== null}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                                                ${selectedOption === idx
                                                    ? 'border-violet-600 bg-violet-50 text-violet-900'
                                                    : 'border-gray-100 hover:border-violet-200 hover:bg-gray-50 text-gray-700'
                                                }
                                            `}
                                        >
                                            <span className="font-medium">{option}</span>
                                            {selectedOption === idx && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                >
                                                    <TbCheck className="text-violet-600 w-5 h-5" />
                                                </motion.div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <div
                                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                                    style={{ backgroundColor: resultData.color }}
                                >
                                    <TbTrophy className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                                    {resultData.title}
                                </h3>
                                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                                    {resultData.desc}
                                </p>
                                <button
                                    onClick={resetQuiz}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
                                >
                                    <TbReload className="w-5 h-5" />
                                    თავიდან დაწყება
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
