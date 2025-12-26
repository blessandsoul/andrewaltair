'use client';

import React, { useState } from 'react';

interface Step { id: string; title: string; duration: string; description: string; tasks: string[]; status: 'pending' | 'current' | 'completed'; }

const roadmapSteps: Step[] = [
    { id: '1', title: 'Аудит и анализ', duration: 'Неделя 1-2', description: 'Анализ текущих процессов и выявление возможностей', tasks: ['Интервью с командой', 'Аудит процессов', 'Анализ данных', 'Определение KPI'], status: 'completed' },
    { id: '2', title: 'Выбор инструментов', duration: 'Неделя 3-4', description: 'Подбор оптимальных AI-решений', tasks: ['Демо инструментов', 'Пилотные тесты', 'Сравнение стоимости', 'Выбор стека'], status: 'current' },
    { id: '3', title: 'Обучение команды', duration: 'Неделя 5-6', description: 'Подготовка сотрудников к работе с AI', tasks: ['Базовые курсы', 'Практические воркшопы', 'Документация', 'FAQ и поддержка'], status: 'pending' },
    { id: '4', title: 'Внедрение', duration: 'Неделя 7-10', description: 'Интеграция AI в рабочие процессы', tasks: ['Настройка инструментов', 'Интеграция с системами', 'Тестирование', 'Запуск пилота'], status: 'pending' },
    { id: '5', title: 'Масштабирование', duration: 'Неделя 11-12', description: 'Расширение использования и оптимизация', tasks: ['Анализ результатов', 'Оптимизация процессов', 'Расширение на отделы', 'Документирование'], status: 'pending' },
];

export default function ImplementationRoadmap() {
    const [steps, setSteps] = useState<Step[]>(roadmapSteps);
    const [selectedStep, setSelectedStep] = useState<Step | null>(null);

    const toggleStep = (stepId: string) => {
        const updated = steps.map(s => {
            if (s.id === stepId) {
                const newStatus = s.status === 'completed' ? 'pending' : 'completed';
                return { ...s, status: newStatus as Step['status'] };
            }
            return s;
        });
        setSteps(updated);
    };

    const progress = (steps.filter(s => s.status === 'completed').length / steps.length) * 100;

    return (
        <section style={{ padding: '80px 20px', background: 'linear-gradient(180deg, rgba(17,24,39,0) 0%, rgba(245,158,11,0.08) 50%, rgba(17,24,39,0) 100%)' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <span style={{ fontSize: 48 }}>🗺️</span>
                    <h2 style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg, #f59e0b, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 16 }}>Implementation Roadmap</h2>
                    <p style={{ fontSize: 18, color: '#9ca3af' }}>Ваш персональный план внедрения AI</p>
                </div>

                {/* Progress */}
                <div style={{ background: 'rgba(31,41,55,0.8)', borderRadius: 16, padding: 20, marginBottom: 32 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ color: 'white', fontWeight: 600 }}>Прогресс внедрения</span>
                        <span style={{ color: '#f59e0b', fontWeight: 700 }}>{Math.round(progress)}%</span>
                    </div>
                    <div style={{ height: 10, background: '#374151', borderRadius: 5 }}>
                        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #f59e0b, #10b981)', borderRadius: 5, transition: 'width 0.5s' }} />
                    </div>
                </div>

                {/* Timeline */}
                <div style={{ position: 'relative' }}>
                    {/* Line */}
                    <div style={{ position: 'absolute', left: 24, top: 0, bottom: 0, width: 2, background: '#374151' }} />

                    {steps.map((step, i) => (
                        <div key={step.id} onClick={() => setSelectedStep(step)} style={{ display: 'flex', gap: 24, marginBottom: 24, cursor: 'pointer' }}>
                            {/* Node */}
                            <div style={{ width: 50, height: 50, borderRadius: '50%', background: step.status === 'completed' ? '#10b981' : step.status === 'current' ? 'linear-gradient(135deg, #f59e0b, #10b981)' : '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, zIndex: 1, border: step.status === 'current' ? '3px solid #f59e0b' : 'none' }}>
                                {step.status === 'completed' ? '✓' : i + 1}
                            </div>
                            {/* Card */}
                            <div style={{ flex: 1, background: 'rgba(31,41,55,0.9)', border: `1px solid ${step.status === 'current' ? '#f59e0b' : '#374151'}`, borderRadius: 16, padding: 20, transition: 'all 0.3s' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                                    <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>{step.title}</h3>
                                    <span style={{ fontSize: 12, color: '#6b7280', background: '#374151', padding: '4px 10px', borderRadius: 8 }}>{step.duration}</span>
                                </div>
                                <p style={{ fontSize: 14, color: '#9ca3af' }}>{step.description}</p>
                                {step.status === 'current' && <div style={{ marginTop: 12, fontSize: 12, color: '#f59e0b' }}>🔄 В процессе</div>}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                {selectedStep && (
                    <div onClick={() => setSelectedStep(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 20 }}>
                        <div onClick={e => e.stopPropagation()} style={{ background: '#1f2937', borderRadius: 24, padding: 40, maxWidth: 500, width: '100%' }}>
                            <h3 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 8 }}>{selectedStep.title}</h3>
                            <p style={{ color: '#9ca3af', marginBottom: 24 }}>{selectedStep.description}</p>
                            <h4 style={{ color: '#f59e0b', marginBottom: 12 }}>Задачи:</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                                {selectedStep.tasks.map((task, i) => (
                                    <div key={i} style={{ background: '#374151', borderRadius: 8, padding: 12, color: 'white', display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span style={{ color: selectedStep.status === 'completed' ? '#10b981' : '#6b7280' }}>{selectedStep.status === 'completed' ? '✓' : '○'}</span> {task}
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => { toggleStep(selectedStep.id); setSelectedStep(null); }} style={{ width: '100%', background: selectedStep.status === 'completed' ? '#374151' : 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 12, padding: 14, color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                                {selectedStep.status === 'completed' ? 'Отменить' : 'Отметить выполненным'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
