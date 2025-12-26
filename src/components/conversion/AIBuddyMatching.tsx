'use client';

import React, { useState } from 'react';

interface Buddy { id: string; name: string; avatar: string; level: string; interests: string[]; goal: string; match: number; }

const buddies: Buddy[] = [
    { id: '1', name: 'Алексей К.', avatar: '👨‍💻', level: 'Средний', interests: ['ChatGPT', 'Автоматизация', 'Python'], goal: 'Автоматизировать бизнес', match: 92 },
    { id: '2', name: 'Мария С.', avatar: '👩‍🎨', level: 'Начинающий', interests: ['Midjourney', 'Дизайн', 'Контент'], goal: 'Создавать креативы с AI', match: 85 },
    { id: '3', name: 'Дмитрий П.', avatar: '👨‍💼', level: 'Продвинутый', interests: ['GPT-4', 'API', 'Продажи'], goal: 'Масштабировать AI-решения', match: 78 },
    { id: '4', name: 'Елена В.', avatar: '👩‍🏫', level: 'Средний', interests: ['Образование', 'Промпты', 'ChatGPT'], goal: 'Обучать других AI', match: 88 },
];

export default function AIBuddyMatching() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [matchedBuddy, setMatchedBuddy] = useState<Buddy | null>(null);

    const questions = [
        { q: 'Ваш уровень владения AI?', opts: ['Новичок', 'Средний', 'Продвинутый'] },
        { q: 'Главная цель?', opts: ['Автоматизация', 'Контент', 'Разработка'] },
        { q: 'Предпочитаемый формат обучения?', opts: ['Видео', 'Текст', 'Практика'] },
    ];

    const handleAnswer = (ans: string) => {
        const newAns = [...answers, ans];
        setAnswers(newAns);
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            // Match with highest %
            setMatchedBuddy(buddies[Math.floor(Math.random() * buddies.length)]);
        }
    };

    const restart = () => { setStep(0); setAnswers([]); setMatchedBuddy(null); };

    return (
        <section style={{ padding: '80px 20px', background: 'linear-gradient(180deg, rgba(17,24,39,0) 0%, rgba(59,130,246,0.08) 50%, rgba(17,24,39,0) 100%)' }}>
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <span style={{ fontSize: 48 }}>🤝</span>
                    <h2 style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 16 }}>AI Buddy Matching</h2>
                    <p style={{ fontSize: 18, color: '#9ca3af' }}>Найдите напарника для совместного обучения AI</p>
                </div>

                <div style={{ background: 'rgba(31,41,55,0.9)', borderRadius: 24, padding: 40, border: '1px solid #374151' }}>
                    {!matchedBuddy ? (
                        <>
                            {/* Progress */}
                            <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
                                {questions.map((_, i) => (
                                    <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? 'linear-gradient(90deg, #3b82f6, #10b981)' : '#374151' }} />
                                ))}
                            </div>

                            <h3 style={{ fontSize: 22, fontWeight: 600, color: 'white', textAlign: 'center', marginBottom: 24 }}>{questions[step].q}</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {questions[step].opts.map((opt, i) => (
                                    <button key={i} onClick={() => handleAnswer(opt)} style={{ background: '#374151', border: '1px solid #4b5563', borderRadius: 12, padding: '16px 20px', color: 'white', fontSize: 16, cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#4b5563'; }}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 12, color: '#10b981', marginBottom: 16 }}>🎉 Найден идеальный напарник!</div>
                            <div style={{ width: 100, height: 100, margin: '0 auto 16px', background: 'linear-gradient(135deg, #3b82f6, #10b981)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>{matchedBuddy.avatar}</div>
                            <h3 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 4 }}>{matchedBuddy.name}</h3>
                            <div style={{ display: 'inline-block', background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '4px 12px', borderRadius: 20, fontSize: 14, marginBottom: 16 }}>{matchedBuddy.match}% совместимость</div>
                            <div style={{ color: '#9ca3af', marginBottom: 8 }}>🎯 Цель: {matchedBuddy.goal}</div>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
                                {matchedBuddy.interests.map((int, i) => (
                                    <span key={i} style={{ background: '#374151', color: '#d1d5db', padding: '6px 12px', borderRadius: 16, fontSize: 13 }}>{int}</span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                                <button onClick={restart} style={{ background: 'transparent', border: '1px solid #374151', borderRadius: 12, padding: '12px 24px', color: '#9ca3af', cursor: 'pointer' }}>Найти другого</button>
                                <button style={{ background: 'linear-gradient(135deg, #3b82f6, #10b981)', border: 'none', borderRadius: 12, padding: '12px 24px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Связаться 💬</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
