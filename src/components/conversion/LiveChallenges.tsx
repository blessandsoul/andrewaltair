'use client';

import React, { useState, useEffect } from 'react';

interface Challenge { id: string; title: string; description: string; icon: string; participants: number; timeLeft: string; prize: string; type: 'daily' | 'weekly' | 'special'; difficulty: 'easy' | 'medium' | 'hard'; }

const challenges: Challenge[] = [
    { id: '1', title: 'Промпт-мастер', description: 'Создайте 5 эффективных промптов', icon: '✍️', participants: 234, timeLeft: '2ч 45м', prize: '100 XP', type: 'daily', difficulty: 'easy' },
    { id: '2', title: 'AI Explorer', description: 'Протестируйте 3 новых инструмента', icon: '🔬', participants: 156, timeLeft: '5ч 12м', prize: '150 XP + Бейдж', type: 'daily', difficulty: 'medium' },
    { id: '3', title: 'Учитель недели', description: 'Помогите 10 новичкам в сообществе', icon: '👨‍🏫', participants: 89, timeLeft: '3д 4ч', prize: '500 XP + Premium', type: 'weekly', difficulty: 'hard' },
    { id: '4', title: 'Новогодний марафон', description: 'Пройдите 10 уроков за неделю', icon: '🎄', participants: 512, timeLeft: '6д 18ч', prize: 'Эксклюзивный NFT', type: 'special', difficulty: 'medium' },
];

const difficultyColors = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };
const typeColors = { daily: '#3b82f6', weekly: '#8b5cf6', special: '#ec4899' };

export default function LiveChallenges() {
    const [joined, setJoined] = useState<string[]>([]);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        const saved = localStorage.getItem('joinedChallenges');
        if (saved) setJoined(JSON.parse(saved));
    }, []);

    const joinChallenge = (id: string) => {
        const updated = [...joined, id];
        setJoined(updated);
        localStorage.setItem('joinedChallenges', JSON.stringify(updated));
    };

    const filtered = filter === 'all' ? challenges : challenges.filter(c => c.type === filter);

    return (
        <section style={{ padding: '80px 20px', background: 'linear-gradient(180deg, rgba(17,24,39,0) 0%, rgba(239,68,68,0.08) 50%, rgba(17,24,39,0) 100%)' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <span style={{ fontSize: 48 }}>🏆</span>
                    <h2 style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg, #ef4444, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 16 }}>Live Challenges</h2>
                    <p style={{ fontSize: 18, color: '#9ca3af' }}>Соревнуйтесь с сообществом в реальном времени</p>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
                    {['all', 'daily', 'weekly', 'special'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? 'linear-gradient(135deg, #ef4444, #f59e0b)' : 'transparent', border: filter === f ? 'none' : '1px solid #374151', borderRadius: 20, padding: '8px 20px', color: filter === f ? 'white' : '#9ca3af', cursor: 'pointer' }}>
                            {f === 'all' ? 'Все' : f === 'daily' ? '📅 Дневные' : f === 'weekly' ? '📆 Недельные' : '⭐ Особые'}
                        </button>
                    ))}
                </div>

                {/* Challenges */}
                <div style={{ display: 'grid', gap: 16 }}>
                    {filtered.map(ch => (
                        <div key={ch.id} style={{ background: 'rgba(31,41,55,0.9)', border: '1px solid #374151', borderRadius: 16, padding: 24, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                            <div style={{ width: 60, height: 60, background: `${typeColors[ch.type]}20`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{ch.icon}</div>
                            <div style={{ flex: 1, minWidth: 200 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <span style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>{ch.title}</span>
                                    <span style={{ fontSize: 10, background: `${difficultyColors[ch.difficulty]}20`, color: difficultyColors[ch.difficulty], padding: '2px 8px', borderRadius: 10 }}>{ch.difficulty.toUpperCase()}</span>
                                </div>
                                <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 8 }}>{ch.description}</p>
                                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#6b7280' }}>
                                    <span>👥 {ch.participants}</span>
                                    <span>⏰ {ch.timeLeft}</span>
                                    <span>🎁 {ch.prize}</span>
                                </div>
                            </div>
                            {joined.includes(ch.id) ? (
                                <div style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '10px 20px', borderRadius: 12, fontWeight: 600 }}>✓ Участвуете</div>
                            ) : (
                                <button onClick={() => joinChallenge(ch.id)} style={{ background: 'linear-gradient(135deg, #ef4444, #f59e0b)', border: 'none', borderRadius: 12, padding: '10px 24px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Участвовать</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
