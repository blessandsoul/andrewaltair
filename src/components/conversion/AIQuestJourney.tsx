'use client';

import React, { useState, useEffect } from 'react';

interface Quest { id: string; title: string; description: string; icon: string; xp: number; steps: { id: string; text: string; completed: boolean }[]; reward: string; unlocked: boolean; }

const initialQuests: Quest[] = [
    { id: '1', title: 'Первые шаги с AI', description: 'Изучите основы искусственного интеллекта', icon: '🌱', xp: 100, steps: [{ id: '1-1', text: 'Прочитайте введение', completed: false }, { id: '1-2', text: 'Пройдите первый урок', completed: false }, { id: '1-3', text: 'Создайте первый промпт', completed: false }], reward: 'Бейдж "Новичок AI"', unlocked: true },
    { id: '2', title: 'Мастер промптов', description: 'Освойте искусство создания промптов', icon: '✨', xp: 200, steps: [{ id: '2-1', text: 'Изучите структуру промптов', completed: false }, { id: '2-2', text: 'Создайте 5 промптов', completed: false }, { id: '2-3', text: 'Получите позитивную оценку', completed: false }], reward: '50 AI кредитов', unlocked: false },
    { id: '3', title: 'AI Исследователь', description: 'Попробуйте разные AI инструменты', icon: '🔬', xp: 300, steps: [{ id: '3-1', text: 'Изучите 3 инструмента', completed: false }, { id: '3-2', text: 'Добавьте в избранное', completed: false }, { id: '3-3', text: 'Напишите отзыв', completed: false }], reward: 'Доступ к премиум курсу', unlocked: false },
    { id: '4', title: 'Эксперт автоматизации', description: 'Создайте свой первый AI воркфлоу', icon: '⚙️', xp: 500, steps: [{ id: '4-1', text: 'Изучите автоматизацию', completed: false }, { id: '4-2', text: 'Создайте воркфлоу', completed: false }, { id: '4-3', text: 'Запустите и протестируйте', completed: false }], reward: 'Сертификат + Консультация', unlocked: false },
];

export default function AIQuestJourney() {
    const [quests, setQuests] = useState<Quest[]>(initialQuests);
    const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
    const [totalXP, setTotalXP] = useState(0);

    useEffect(() => {
        const saved = localStorage.getItem('aiQuestProgress');
        if (saved) {
            const data = JSON.parse(saved);
            setQuests(data.quests);
            setTotalXP(data.totalXP);
        }
    }, []);

    const saveProgress = (q: Quest[], xp: number) => {
        localStorage.setItem('aiQuestProgress', JSON.stringify({ quests: q, totalXP: xp }));
    };

    const completeStep = (questId: string, stepId: string) => {
        const updated = quests.map(q => {
            if (q.id === questId) {
                const steps = q.steps.map(s => s.id === stepId ? { ...s, completed: true } : s);
                return { ...q, steps };
            }
            return q;
        });

        const quest = updated.find(q => q.id === questId);
        if (quest && quest.steps.every(s => s.completed)) {
            const newXP = totalXP + quest.xp;
            setTotalXP(newXP);
            const nextIdx = updated.findIndex(q => q.id === questId) + 1;
            if (nextIdx < updated.length) updated[nextIdx].unlocked = true;
            saveProgress(updated, newXP);
        } else {
            saveProgress(updated, totalXP);
        }
        setQuests(updated);
        if (selectedQuest) setSelectedQuest(updated.find(q => q.id === selectedQuest.id) || null);
    };

    const getProgress = (quest: Quest) => (quest.steps.filter(s => s.completed).length / quest.steps.length) * 100;

    return (
        <section style={{ padding: '80px 20px', background: 'linear-gradient(180deg, rgba(17,24,39,0) 0%, rgba(139,92,246,0.08) 50%, rgba(17,24,39,0) 100%)' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <span style={{ fontSize: 48 }}>⚔️</span>
                    <h2 style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 16 }}>AI Quest Journey</h2>
                    <p style={{ fontSize: 18, color: '#9ca3af' }}>Пройдите квесты и станьте экспертом AI</p>
                    <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.2)', padding: '8px 20px', borderRadius: 20 }}>
                        <span style={{ fontSize: 20 }}>⭐</span>
                        <span style={{ color: 'white', fontWeight: 700 }}>{totalXP} XP</span>
                    </div>
                </div>

                {/* Quest Cards */}
                <div style={{ display: 'grid', gap: 16 }}>
                    {quests.map((quest, i) => (
                        <div key={quest.id} onClick={() => quest.unlocked && setSelectedQuest(quest)} style={{ background: quest.unlocked ? 'rgba(31,41,55,0.9)' : 'rgba(31,41,55,0.5)', border: `1px solid ${quest.unlocked ? '#374151' : '#1f2937'}`, borderRadius: 16, padding: 24, cursor: quest.unlocked ? 'pointer' : 'not-allowed', opacity: quest.unlocked ? 1 : 0.6, transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: 20 }}>
                            <div style={{ width: 60, height: 60, background: quest.unlocked ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : '#374151', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{quest.unlocked ? quest.icon : '🔒'}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                                    <span style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>{quest.title}</span>
                                    <span style={{ fontSize: 12, background: 'rgba(139,92,246,0.2)', color: '#a78bfa', padding: '2px 8px', borderRadius: 10 }}>+{quest.xp} XP</span>
                                </div>
                                <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 8 }}>{quest.description}</p>
                                <div style={{ height: 6, background: '#374151', borderRadius: 3, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${getProgress(quest)}%`, background: 'linear-gradient(90deg, #8b5cf6, #ec4899)', borderRadius: 3 }} />
                                </div>
                            </div>
                            <div style={{ fontSize: 14, color: '#6b7280' }}>{quest.steps.filter(s => s.completed).length}/{quest.steps.length}</div>
                        </div>
                    ))}
                </div>

                {/* Quest Modal */}
                {selectedQuest && (
                    <div onClick={() => setSelectedQuest(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 20 }}>
                        <div onClick={e => e.stopPropagation()} style={{ background: '#1f2937', borderRadius: 24, padding: 40, maxWidth: 500, width: '100%' }}>
                            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                <span style={{ fontSize: 64 }}>{selectedQuest.icon}</span>
                                <h3 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginTop: 16 }}>{selectedQuest.title}</h3>
                                <p style={{ color: '#9ca3af' }}>{selectedQuest.description}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                                {selectedQuest.steps.map(step => (
                                    <div key={step.id} onClick={() => !step.completed && completeStep(selectedQuest.id, step.id)} style={{ background: step.completed ? 'rgba(16,185,129,0.1)' : '#374151', border: `1px solid ${step.completed ? '#10b981' : '#4b5563'}`, borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12, cursor: step.completed ? 'default' : 'pointer' }}>
                                        <span style={{ fontSize: 20 }}>{step.completed ? '✅' : '⬜'}</span>
                                        <span style={{ color: step.completed ? '#10b981' : 'white' }}>{step.text}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ background: 'rgba(139,92,246,0.1)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                                <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>🎁 Награда</div>
                                <div style={{ color: '#a78bfa', fontWeight: 600 }}>{selectedQuest.reward}</div>
                            </div>
                            <button onClick={() => setSelectedQuest(null)} style={{ marginTop: 24, width: '100%', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', border: 'none', borderRadius: 12, padding: 14, color: 'white', fontWeight: 600, cursor: 'pointer' }}>Закрыть</button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
