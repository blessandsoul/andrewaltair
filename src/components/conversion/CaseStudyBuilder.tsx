'use client';

import React, { useState } from 'react';

interface Industry { id: string; name: string; icon: string; challenges: string[]; solutions: string[]; results: { metric: string; value: string }[]; }

const industries: Industry[] = [
    { id: 'retail', name: 'Ритейл', icon: '🛒', challenges: ['Низкая конверсия', 'Высокие затраты на поддержку', 'Персонализация'], solutions: ['AI-чатбот для клиентов', 'Рекомендательная система', 'Автоматизация ответов'], results: [{ metric: 'Конверсия', value: '+45%' }, { metric: 'Время ответа', value: '-80%' }, { metric: 'ROI', value: '320%' }] },
    { id: 'finance', name: 'Финансы', icon: '🏦', challenges: ['Оценка рисков', 'Мошенничество', 'Отчётность'], solutions: ['AI-скоринг', 'Детекция фрода', 'Автоматические отчёты'], results: [{ metric: 'Точность оценки', value: '+60%' }, { metric: 'Потери от фрода', value: '-75%' }, { metric: 'Время отчётов', value: '-90%' }] },
    { id: 'healthcare', name: 'Медицина', icon: '🏥', challenges: ['Диагностика', 'Нагрузка на персонал', 'Документация'], solutions: ['AI-ассистент диагностики', 'Автоматизация записей', 'Чат-бот для пациентов'], results: [{ metric: 'Скорость диагностики', value: '+40%' }, { metric: 'Время на документы', value: '-60%' }, { metric: 'Удовлетворённость', value: '+35%' }] },
    { id: 'marketing', name: 'Маркетинг', icon: '📣', challenges: ['Создание контента', 'Таргетинг', 'A/B тесты'], solutions: ['AI-генерация контента', 'Предиктивная аналитика', 'Автооптимизация'], results: [{ metric: 'Производительность', value: '+500%' }, { metric: 'CTR', value: '+85%' }, { metric: 'Стоимость лида', value: '-40%' }] },
];

export default function CaseStudyBuilder() {
    const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
    const [step, setStep] = useState(0);

    const handleSelect = (industry: Industry) => { setSelectedIndustry(industry); setStep(1); };
    const nextStep = () => setStep(s => Math.min(s + 1, 3));
    const reset = () => { setSelectedIndustry(null); setStep(0); };

    return (
        <section style={{ padding: '80px 20px', background: 'linear-gradient(180deg, rgba(17,24,39,0) 0%, rgba(245,158,11,0.08) 50%, rgba(17,24,39,0) 100%)' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <span style={{ fontSize: 48 }}>📋</span>
                    <h2 style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 16 }}>Case Study Builder</h2>
                    <p style={{ fontSize: 18, color: '#9ca3af' }}>Создайте персональный кейс для вашей отрасли</p>
                </div>

                {!selectedIndustry ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                        {industries.map(ind => (
                            <button key={ind.id} onClick={() => handleSelect(ind)} style={{ background: 'rgba(31,41,55,0.9)', border: '1px solid #374151', borderRadius: 16, padding: 24, cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#374151'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                <div style={{ fontSize: 48, marginBottom: 12 }}>{ind.icon}</div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>{ind.name}</div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div style={{ background: 'rgba(31,41,55,0.9)', borderRadius: 24, padding: 40, border: '1px solid #374151' }}>
                        {/* Progress */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 40 }}>
                            {['Проблемы', 'Решения', 'Результаты'].map((s, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: step > i ? '#10b981' : step === i + 1 ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, margin: '0 auto 8px' }}>{step > i ? '✓' : i + 1}</div>
                                    <div style={{ fontSize: 12, color: step >= i + 1 ? 'white' : '#6b7280' }}>{s}</div>
                                </div>
                            ))}
                        </div>

                        {/* Content */}
                        <div style={{ textAlign: 'center', marginBottom: 32 }}>
                            <span style={{ fontSize: 64 }}>{selectedIndustry.icon}</span>
                            <h3 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginTop: 16 }}>{selectedIndustry.name}</h3>
                        </div>

                        {step === 1 && (
                            <div>
                                <h4 style={{ color: '#f59e0b', marginBottom: 16 }}>🎯 Типичные проблемы</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {selectedIndustry.challenges.map((ch, i) => (
                                        <div key={i} style={{ background: '#374151', borderRadius: 12, padding: 16, color: 'white', display: 'flex', alignItems: 'center', gap: 12 }}><span>❌</span> {ch}</div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <h4 style={{ color: '#3b82f6', marginBottom: 16 }}>💡 AI Решения</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {selectedIndustry.solutions.map((sol, i) => (
                                        <div key={i} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 12, padding: 16, color: 'white', display: 'flex', alignItems: 'center', gap: 12 }}><span>🔧</span> {sol}</div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div>
                                <h4 style={{ color: '#10b981', marginBottom: 16 }}>📈 Результаты</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
                                    {selectedIndustry.results.map((res, i) => (
                                        <div key={i} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
                                            <div style={{ fontSize: 32, fontWeight: 800, color: '#10b981' }}>{res.value}</div>
                                            <div style={{ fontSize: 14, color: '#9ca3af' }}>{res.metric}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
                            <button onClick={reset} style={{ background: 'transparent', border: '1px solid #374151', borderRadius: 12, padding: '12px 24px', color: '#9ca3af', cursor: 'pointer' }}>← Выбрать отрасль</button>
                            {step < 3 ? (
                                <button onClick={nextStep} style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', border: 'none', borderRadius: 12, padding: '12px 24px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Далее →</button>
                            ) : (
                                <button style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 12, padding: '12px 24px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>📥 Скачать PDF</button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
