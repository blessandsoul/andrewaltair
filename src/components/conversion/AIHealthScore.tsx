'use client';

import React, { useState } from 'react';

interface Question { id: number; text: string; options: { text: string; score: number }[]; }

const questions: Question[] = [
    { id: 1, text: 'Как часто ваша команда использует AI инструменты?', options: [{ text: 'Никогда', score: 0 }, { text: 'Иногда', score: 25 }, { text: 'Регулярно', score: 50 }, { text: 'Ежедневно', score: 100 }] },
    { id: 2, text: 'Есть ли у вас стратегия внедрения AI?', options: [{ text: 'Нет', score: 0 }, { text: 'Думаем об этом', score: 30 }, { text: 'В разработке', score: 60 }, { text: 'Да, реализуем', score: 100 }] },
    { id: 3, text: 'Какой % процессов можно автоматизировать?', options: [{ text: 'Не знаю', score: 10 }, { text: 'Менее 20%', score: 30 }, { text: '20-50%', score: 60 }, { text: 'Более 50%', score: 100 }] },
    { id: 4, text: 'Есть ли специалист по AI в команде?', options: [{ text: 'Нет', score: 0 }, { text: 'Планируем нанять', score: 40 }, { text: 'Да, один', score: 70 }, { text: 'Да, команда', score: 100 }] },
    { id: 5, text: 'Готовы ли данные для обучения AI?', options: [{ text: 'Данных нет', score: 0 }, { text: 'Не структурированы', score: 25 }, { text: 'Частично готовы', score: 60 }, { text: 'Полностью готовы', score: 100 }] },
];

export default function AIHealthScore() {
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);

    const handleAnswer = (score: number) => {
        const newAnswers = [...answers, score];
        setAnswers(newAnswers);
        if (currentQ < questions.length - 1) {
            setCurrentQ(currentQ + 1);
        } else {
            setShowResults(true);
        }
    };

    const totalScore = Math.round(answers.reduce((a, b) => a + b, 0) / questions.length);
    const getLevel = () => {
        if (totalScore < 25) return { name: 'Начинающий', color: '#ef4444', icon: '🌱', advice: 'Начните с базовых AI инструментов.' };
        if (totalScore < 50) return { name: 'Развивающийся', color: '#f59e0b', icon: '🌿', advice: 'Формализуйте AI стратегию.' };
        if (totalScore < 75) return { name: 'Продвинутый', color: '#3b82f6', icon: '🌳', advice: 'Масштабируйте успешные кейсы.' };
        return { name: 'Эксперт', color: '#10b981', icon: '🚀', advice: 'Оптимизируйте и внедряйте новые решения.' };
    };

    const level = getLevel();

    const restart = () => { setCurrentQ(0); setAnswers([]); setShowResults(false); };

    return (
        <section style={{ padding: '80px 20px', background: 'linear-gradient(180deg, rgba(17,24,39,0) 0%, rgba(139,92,246,0.08) 50%, rgba(17,24,39,0) 100%)' }}>
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <span style={{ fontSize: 48 }}>🏥</span>
                    <h2 style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 16 }}>AI Health Score</h2>
                    <p style={{ fontSize: 18, color: '#9ca3af' }}>Оцените AI-зрелость вашего бизнеса</p>
                </div>

                <div style={{ background: 'rgba(31,41,55,0.9)', borderRadius: 24, padding: 40, border: '1px solid #374151' }}>
                    {!showResults ? (
                        <>
                            {/* Progress */}
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280', marginBottom: 8 }}>
                                    <span>Вопрос {currentQ + 1} из {questions.length}</span>
                                    <span>{Math.round((currentQ / questions.length) * 100)}%</span>
                                </div>
                                <div style={{ height: 6, background: '#374151', borderRadius: 3, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${(currentQ / questions.length) * 100}%`, background: 'linear-gradient(90deg, #8b5cf6, #ec4899)', borderRadius: 3, transition: 'width 0.3s' }} />
                                </div>
                            </div>

                            {/* Question */}
                            <h3 style={{ fontSize: 22, fontWeight: 600, color: 'white', marginBottom: 24, textAlign: 'center' }}>{questions[currentQ].text}</h3>

                            {/* Options */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {questions[currentQ].options.map((opt, i) => (
                                    <button key={i} onClick={() => handleAnswer(opt.score)} style={{ background: '#374151', border: '1px solid #4b5563', borderRadius: 12, padding: '16px 20px', color: 'white', fontSize: 16, textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.background = 'rgba(139,92,246,0.1)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#4b5563'; e.currentTarget.style.background = '#374151'; }}>
                                        {opt.text}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Results */}
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 80, marginBottom: 16 }}>{level.icon}</div>
                                <div style={{ fontSize: 64, fontWeight: 800, color: level.color, marginBottom: 8 }}>{totalScore}</div>
                                <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>из 100</div>
                                <div style={{ display: 'inline-block', background: `${level.color}20`, color: level.color, padding: '8px 24px', borderRadius: 20, fontWeight: 700, fontSize: 18, marginBottom: 24 }}>{level.name}</div>

                                <div style={{ background: 'rgba(55,65,81,0.5)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
                                    <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 8 }}>Рекомендация</div>
                                    <div style={{ fontSize: 16, color: 'white' }}>{level.advice}</div>
                                </div>

                                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <button onClick={restart} style={{ background: 'transparent', border: '1px solid #374151', color: '#9ca3af', padding: '12px 24px', borderRadius: 12, cursor: 'pointer' }}>Пройти снова</button>
                                    <button style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', border: 'none', color: 'white', padding: '12px 24px', borderRadius: 12, fontWeight: 600, cursor: 'pointer' }}>Получить план улучшения →</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
