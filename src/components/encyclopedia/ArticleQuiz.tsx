'use client';

import { useState } from 'react';
import { TbCheck, TbX, TbTrophy, TbRefresh, TbSparkles } from 'react-icons/tb';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
}

interface ArticleQuizProps {
    questions: QuizQuestion[];
    articleTitle: string;
}

export default function ArticleQuiz({ questions, articleTitle }: ArticleQuizProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState<boolean[]>(new Array(questions.length).fill(false));

    const handleAnswer = (optionIndex: number) => {
        if (answered[currentQuestion]) return;

        setSelectedAnswer(optionIndex);
        const newAnswered = [...answered];
        newAnswered[currentQuestion] = true;
        setAnswered(newAnswered);

        if (optionIndex === questions[currentQuestion].correctIndex) {
            setScore(score + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
        } else {
            setShowResult(true);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setAnswered(new Array(questions.length).fill(false));
    };

    const question = questions[currentQuestion];
    const percentage = Math.round((score / questions.length) * 100);

    if (showResult) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl p-8 border border-purple-200 dark:border-purple-800"
            >
                <div className="text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${percentage >= 80 ? 'bg-green-500/10' : percentage >= 50 ? 'bg-yellow-500/10' : 'bg-red-500/10'
                        }`}>
                        <TbTrophy size={40} className={
                            percentage >= 80 ? 'text-green-500' : percentage >= 50 ? 'text-yellow-500' : 'text-red-500'
                        } />
                    </div>

                    <h3 className="text-2xl font-bold mb-2">
                        {percentage >= 80 ? 'შესანიშნავი!' : percentage >= 50 ? 'კარგია!' : 'სცადე ხელახლა'}
                    </h3>

                    <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        {score}/{questions.length}
                    </p>

                    <p className="text-muted-foreground mb-6">
                        სწორი პასუხი: {percentage}%
                    </p>

                    <button
                        onClick={resetQuiz}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold flex items-center gap-2 mx-auto hover:scale-105 transition-transform"
                    >
                        <TbRefresh size={20} />
                        თავიდან სცადე
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-4">
                <TbSparkles className="text-purple-500" size={20} />
                <span className="text-sm font-medium text-muted-foreground">
                    კვიზი: {articleTitle}
                </span>
            </div>

            {/* Progress */}
            <div className="flex gap-1 mb-6">
                {questions.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1.5 flex-1 rounded-full ${idx < currentQuestion ? 'bg-purple-500' :
                                idx === currentQuestion ? 'bg-purple-300' : 'bg-secondary'
                            }`}
                    />
                ))}
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    <h4 className="text-lg font-semibold mb-4">
                        {currentQuestion + 1}. {question.question}
                    </h4>

                    <div className="space-y-2 mb-4">
                        {question.options.map((option, idx) => {
                            const isCorrect = idx === question.correctIndex;
                            const isSelected = idx === selectedAnswer;
                            const isAnswered = answered[currentQuestion];

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    disabled={isAnswered}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isAnswered
                                            ? isCorrect
                                                ? 'border-green-500 bg-green-500/10'
                                                : isSelected
                                                    ? 'border-red-500 bg-red-500/10'
                                                    : 'border-border opacity-50'
                                            : 'border-border hover:border-purple-300 hover:bg-secondary/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isAnswered && isCorrect ? 'bg-green-500 text-white' :
                                                isAnswered && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                                                    'bg-secondary'
                                            }`}>
                                            {isAnswered && isCorrect ? <TbCheck size={18} /> :
                                                isAnswered && isSelected ? <TbX size={18} /> :
                                                    String.fromCharCode(65 + idx)}
                                        </span>
                                        <span className={isAnswered && isCorrect ? 'font-medium' : ''}>
                                            {option}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Explanation */}
                    {answered[currentQuestion] && question.explanation && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-blue-500/5 border border-blue-200 dark:border-blue-800 mb-4"
                        >
                            <p className="text-sm text-muted-foreground">
                                <strong>ახსნა:</strong> {question.explanation}
                            </p>
                        </motion.div>
                    )}

                    {/* Next button */}
                    {answered[currentQuestion] && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={nextQuestion}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:scale-[1.02] transition-transform"
                        >
                            {currentQuestion < questions.length - 1 ? 'შემდეგი კითხვა' : 'შედეგის ნახვა'}
                        </motion.button>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
