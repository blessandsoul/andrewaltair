'use client';

import React, { useState } from 'react';

interface FormData {
    industry: string;
    employees: string;
    hoursOnTasks: number;
    hourlyRate: number;
    currentTools: number;
}

const industries = [
    { value: 'marketing', label: 'Маркетинг', multiplier: 1.2 },
    { value: 'sales', label: 'Продажи', multiplier: 1.3 },
    { value: 'hr', label: 'HR', multiplier: 1.1 },
    { value: 'finance', label: 'Финансы', multiplier: 1.15 },
    { value: 'operations', label: 'Операции', multiplier: 1.25 },
    { value: 'other', label: 'Другое', multiplier: 1.0 },
];

export default function SavingsCalculator() {
    const [formData, setFormData] = useState<FormData>({ industry: 'marketing', employees: '5-10', hoursOnTasks: 20, hourlyRate: 2000, currentTools: 3 });
    const [showResults, setShowResults] = useState(false);

    const calculateSavings = () => {
        const employeeCount = { '1-5': 3, '5-10': 7, '10-25': 15, '25-50': 35, '50+': 75 }[formData.employees] || 5;
        const industryMult = industries.find(i => i.value === formData.industry)?.multiplier || 1;
        const timeSaved = formData.hoursOnTasks * 0.6;
        const monthlySavings = timeSaved * 4 * formData.hourlyRate * employeeCount * industryMult;
        const yearlySavings = monthlySavings * 12;
        const roi = ((yearlySavings - 120000) / 120000) * 100;
        return { timeSaved: Math.round(timeSaved), monthlySavings: Math.round(monthlySavings), yearlySavings: Math.round(yearlySavings), roi: Math.round(roi) };
    };

    const results = calculateSavings();

    return (
        <section style={{ padding: '80px 20px', background: 'linear-gradient(180deg, rgba(17,24,39,0) 0%, rgba(16,185,129,0.08) 50%, rgba(17,24,39,0) 100%)' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <span style={{ fontSize: 48 }}>💰</span>
                    <h2 style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 16 }}>Калькулятор экономии</h2>
                    <p style={{ fontSize: 18, color: '#9ca3af' }}>Узнайте, сколько сэкономит AI для вашего бизнеса</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
                    {/* Form */}
                    <div style={{ background: 'rgba(31,41,55,0.8)', borderRadius: 20, padding: 32, border: '1px solid #374151' }}>
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', fontSize: 14, color: '#9ca3af', marginBottom: 8 }}>Отрасль</label>
                            <select value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })} style={{ width: '100%', background: '#374151', border: 'none', borderRadius: 12, padding: '14px 16px', color: 'white', fontSize: 16 }}>
                                {industries.map(ind => <option key={ind.value} value={ind.value}>{ind.label}</option>)}
                            </select>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', fontSize: 14, color: '#9ca3af', marginBottom: 8 }}>Количество сотрудников</label>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {['1-5', '5-10', '10-25', '25-50', '50+'].map(opt => (
                                    <button key={opt} onClick={() => setFormData({ ...formData, employees: opt })} style={{ background: formData.employees === opt ? 'linear-gradient(135deg, #10b981, #3b82f6)' : '#374151', border: 'none', borderRadius: 8, padding: '10px 16px', color: 'white', fontSize: 14, cursor: 'pointer' }}>{opt}</button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', fontSize: 14, color: '#9ca3af', marginBottom: 8 }}>Часов в неделю на рутину: {formData.hoursOnTasks}ч</label>
                            <input type="range" min={5} max={40} value={formData.hoursOnTasks} onChange={e => setFormData({ ...formData, hoursOnTasks: +e.target.value })} style={{ width: '100%', accentColor: '#10b981' }} />
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', fontSize: 14, color: '#9ca3af', marginBottom: 8 }}>Средняя ставка сотрудника (₽/час)</label>
                            <input type="number" value={formData.hourlyRate} onChange={e => setFormData({ ...formData, hourlyRate: +e.target.value })} style={{ width: '100%', background: '#374151', border: 'none', borderRadius: 12, padding: '14px 16px', color: 'white', fontSize: 16 }} />
                        </div>

                        <button onClick={() => setShowResults(true)} style={{ width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 12, padding: '16px', color: 'white', fontSize: 18, fontWeight: 700, cursor: 'pointer' }}>Рассчитать экономию 📊</button>
                    </div>

                    {/* Results */}
                    <div style={{ background: showResults ? 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(59,130,246,0.1))' : 'rgba(31,41,55,0.5)', borderRadius: 20, padding: 32, border: `1px solid ${showResults ? '#10b981' : '#374151'}`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {showResults ? (
                            <>
                                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                                    <div style={{ fontSize: 16, color: '#10b981', marginBottom: 8 }}>Ваша экономия в год</div>
                                    <div style={{ fontSize: 48, fontWeight: 800, color: 'white' }}>{results.yearlySavings.toLocaleString()}₽</div>
                                </div>
                                <div style={{ display: 'grid', gap: 16 }}>
                                    <div style={{ background: 'rgba(31,41,55,0.8)', borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#9ca3af' }}>⏰ Время экономии/неделю</span>
                                        <span style={{ color: 'white', fontWeight: 700 }}>{results.timeSaved} часов</span>
                                    </div>
                                    <div style={{ background: 'rgba(31,41,55,0.8)', borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#9ca3af' }}>💵 Экономия/месяц</span>
                                        <span style={{ color: 'white', fontWeight: 700 }}>{results.monthlySavings.toLocaleString()}₽</span>
                                    </div>
                                    <div style={{ background: 'rgba(31,41,55,0.8)', borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#9ca3af' }}>📈 ROI</span>
                                        <span style={{ color: '#10b981', fontWeight: 700 }}>{results.roi}%</span>
                                    </div>
                                </div>
                                <button style={{ marginTop: 24, width: '100%', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', border: 'none', borderRadius: 12, padding: '14px', color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Получить детальный отчёт →</button>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#6b7280' }}>
                                <div style={{ fontSize: 64, marginBottom: 16 }}>📊</div>
                                <p>Заполните форму и нажмите "Рассчитать"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
