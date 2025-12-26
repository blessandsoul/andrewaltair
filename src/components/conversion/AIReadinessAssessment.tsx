'use client';

import React, { useState } from 'react';

interface Question { id: number; text: string; options: { text: string; score: number }[]; category: string; }

const questions: Question[] = [
    { id: 1, text: 'Сколько сотрудников в вашей компании?', category: 'Масштаб', options: [{ text: '1-10', score: 20 }, { text: '11-50', score: 40 }, { text: '51-200', score: 60 }, { text: '200+', score: 80 }] },
    { id: 2, text: 'Какой бюджет планируете на AI в год?', category: 'Бюджет', options: [{ text: 'До ₽100K', score: 20 }, { text: '₽100-500K', score: 40 }, { text: '₽500K-2M', score: 60 }, { text: '₽2M+', score: 80 }] },
    { id: 3, text: 'Есть ли у вас IT-специалист?', category: 'Команда', options: [{ text: 'Нет', score: 20 }, { text: 'Аутсорс', score: 40 }, { text: '1 специалист', score: 60 }, { text: 'IT-отдел', score: 80 }] },
    { id: 4, text: 'Как хранятся данные компании?', category: 'Данные', options: [{ text: 'Excel/бумага', score: 20 }, { text: 'CRM базовая', score: 40 }, { text: 'Облако', score: 60 }, { text: 'Data Warehouse', score: 80 }] },
    { id: 5, text: 'Опыт использования AI?', category: 'Опыт', options: [{ text: 'Никакого', score: 20 }, { text: 'ChatGPT лично', score: 40 }, { text: 'Несколько инструментов', score: 60 }, { text: 'Интегрирован в процессы', score: 80 }] },
];

export default function AIReadinessAssessment() {
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<{ category: string; score: number }[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [email, setEmail] = useState('');

    const handleAnswer = (score: number, category: string) => {
        const newAns = [...answers, { category, score }];
        setAnswers(newAns);
        if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
        else setShowResults(true);
    };

    const avgScore = Math.round(answers.reduce((a, b) => a + b.score, 0) / answers.length) || 0;
    const getReadiness = () => {
        if (avgScore < 30) return { level: 'Начальный', color: '#ef4444', recommendation: 'Начните с базового обучения команды и выбора первых инструментов.' };
        if (avgScore < 50) return { level: 'Базовый', color: '#f59e0b', recommendation: 'Пора формировать AI-стратегию и выделять бюджет.' };
        if (avgScore < 70) return { level: 'Развивающийся', color: '#3b82f6', recommendation: 'Готовы к системному внедрению AI в процессы.' };
        return { level: 'Продвинутый', color: '#10b981', recommendation: 'Масштабируйте успехи и оптимизируйте существующие решения.' };
    };
    const readiness = getReadiness();

    return (
        <section style={{ padding: '80px 20px', background: 'linear-gradient(180deg, rgba(17,24,39,0) 0%, rgba(59,130,246,0.08) 50%, rgba(17,24,39,0) 100%)' }}>
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <span style={{ fontSize: 48 }}>📊</span>
                    <h2 style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 16 }}>AI Readiness Assessment</h2>
                    <p style={{ fontSize: 18, color: '#9ca3af' }}>Оцените готовность вашей компании к AI</p>
                </div>

                <div style={{ background: 'rgba(31,41,55,0.9)', borderRadius: 24, padding: 40, border: '1px solid #374151' }}>
                    {!showResults ? (
                        <>
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280', marginBottom: 8 }}>
                                    <span>{questions[currentQ].category}</span>
                                    <span>{currentQ + 1}/{questions.length}</span>
                                </div>
                                <div style={{ height: 6, background: '#374151', borderRadius: 3 }}>
                                    <div style={{ height: '100%', width: `${((currentQ + 1) / questions.length) * 100}%`, background: 'linear-gradient(90deg, #3b82f6, #10b981)', borderRadius: 3 }} />
                                </div>
                            </div>
                            <h3 style={{ fontSize: 20, color: 'white', marginBottom: 24, textAlign: 'center' }}>{questions[currentQ].text}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {questions[currentQ].options.map((opt, i) => (
                                    <button key={i} onClick={() => handleAnswer(opt.score, questions[currentQ].category)} style={{ background: '#374151', border: '1px solid #4b5563', borderRadius: 12, padding: '16px', color: 'white', fontSize: 16, cursor: 'pointer', textAlign: 'left' }}>{opt.text}</button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 80, fontWeight: 800, color: readiness.color, marginBottom: 8 }}>{avgScore}%</div>
                            <div style={{ display: 'inline-block', background: `${readiness.color}20`, color: readiness.color, padding: '8px 24px', borderRadius: 20, fontWeight: 700, fontSize: 18, marginBottom: 24 }}>{readiness.level}</div>

                            <div style={{ background: 'rgba(55,65,81,0.5)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
                                <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 8 }}>Рекомендация</div>
                                <div style={{ color: 'white' }}>{readiness.recommendation}</div>
                            </div>

                            {/* Category breakdown */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12, marginBottom: 24 }}>
                                {answers.map((a, i) => (
                                    <div key={i} style={{ background: '#374151', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                                        <div style={{ fontSize: 24, fontWeight: 700, color: a.score >= 60 ? '#10b981' : a.score >= 40 ? '#f59e0b' : '#ef4444' }}>{a.score}%</div>
                                        <div style={{ fontSize: 11, color: '#9ca3af' }}>{a.category}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ background: '#1f2937', borderRadius: 12, padding: 20. }}>
                                <div style={{ color: '#9ca3af', fontSize: 14, marginBottom: 12 }}>Получите детальный отчёт на email:</div>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@company.com" style={{ flex: 1, background: '#374151', border: 'none', borderRadius: 10, padding: '12px', color: 'white' }} />
                                    <button style={{ background: 'linear-gradient(135deg, #3b82f6, #10b981)', border: 'none', borderRadius: 10, padding: '12px 24px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Отправить</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
