'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizSection as QuizSectionType } from '@/types/ai2026Article';

interface QuizSectionProps {
    section: QuizSectionType;
}

export default function QuizSection({ section }: QuizSectionProps) {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const calculateScore = () => {
        let total = 0;
        section.questions.forEach((q, index) => {
            if (answers[index] !== undefined) {
                total += q.scores[answers[index]];
            }
        });
        return total;
    };

    const getResult = (score: number) => {
        // Parse result ranges like "0-3", "4-6", "7+"
        for (const [range, result] of Object.entries(section.results)) {
            if (range.includes('+')) {
                const min = parseInt(range.replace('+', ''));
                if (score >= min) return result;
            } else if (range.includes('-')) {
                const [min, max] = range.split('-').map(Number);
                if (score >= min && score <= max) return result;
            }
        }
        // Default to last result
        return Object.values(section.results)[Object.values(section.results).length - 1];
    };

    const handleSubmit = () => {
        setSubmitted(true);
        setTimeout(() => setShowResult(true), 500);
    };

    const allAnswered = Object.keys(answers).length === section.questions.length;
    const score = calculateScore();
    const result = getResult(score);

    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="py-12 px-4 md:px-8"
        >
            <div className="max-w-4xl mx-auto">
                {/* Quiz Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                        🎯 {section.title}
                    </h3>
                    <div className="h-1 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full" />
                </motion.div>

                {/* Questions */}
                <div className="space-y-8">
                    {section.questions.map((question, qIndex) => (
                        <motion.div
                            key={qIndex}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: qIndex * 0.1 }}
                            className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm"
                        >
                            <p className="text-gray-900 font-medium text-lg mb-4">
                                {qIndex + 1}. {question.q}
                            </p>
                            <div className="space-y-3">
                                {question.options.map((option, oIndex) => (
                                    <label
                                        key={oIndex}
                                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${answers[qIndex] === oIndex
                                            ? 'bg-blue-50 border border-blue-200 shadow-sm'
                                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                                            } ${submitted ? 'pointer-events-none opacity-70' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${qIndex}`}
                                            checked={answers[qIndex] === oIndex}
                                            onChange={() => setAnswers({ ...answers, [qIndex]: oIndex })}
                                            disabled={submitted}
                                            className="w-4 h-4 accent-blue-600"
                                        />
                                        <span className="text-gray-700">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Submit Button */}
                {!submitted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-8 text-center"
                    >
                        <button
                            onClick={handleSubmit}
                            disabled={!allAnswered}
                            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${allAnswered
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105 cursor-pointer'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            შეამოწმე შედეგი
                        </button>
                    </motion.div>
                )}

                {/* Result */}
                <AnimatePresence>
                    {showResult && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="mt-10"
                        >
                            <div
                                className="text-center p-8 rounded-2xl border-2"
                                style={{
                                    borderColor: result.color,
                                    background: `linear-gradient(135deg, ${result.color}10 0%, transparent 100%)`,
                                }}
                            >
                                {/* Animated Score Counter */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                                    className="text-6xl font-bold mb-4"
                                    style={{ color: result.color }}
                                >
                                    {score}
                                </motion.div>

                                <h4
                                    className="text-3xl font-bold mb-3"
                                    style={{ color: result.color }}
                                >
                                    {result.title}
                                </h4>
                                <p className="text-gray-600 text-lg">
                                    {result.desc}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.section>
    );
}
