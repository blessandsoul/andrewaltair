'use client';

import React, { useState, useEffect } from 'react';

interface Achievement { id: string; name: string; icon: string; date: string; }
interface Stats { lessonsCompleted: number; toolsTried: number; xpEarned: number; streakDays: number; rank: string; }

export default function ProgressSnapshot() {
    const [stats, setStats] = useState<Stats>({ lessonsCompleted: 12, toolsTried: 8, xpEarned: 1560, streakDays: 7, rank: 'AI Энтузиаст' });
    const [achievements, setAchievements] = useState<Achievement[]>([
        { id: '1', name: 'Первые шаги', icon: '🌱', date: '20 дек' },
        { id: '2', name: '7 дней подряд', icon: '🔥', date: '25 дек' },
        { id: '3', name: '10 уроков', icon: '📚', date: '26 дек' },
    ]);
    const [weeklyProgress, setWeeklyProgress] = useState([60, 80, 45, 90, 70, 85, 100]);

    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    return (
        <section style={{ padding: '80px 20px', background: 'linear-gradient(180deg, rgba(17,24,39,0) 0%, rgba(16,185,129,0.08) 50%, rgba(17,24,39,0) 100%)' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <span style={{ fontSize: 48 }}>📸</span>
                    <h2 style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 16 }}>Progress Snapshot</h2>
                    <p style={{ fontSize: 18, color: '#9ca3af' }}>Ваш недельный прогресс в AI</p>
                </div>

                {/* Main Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 32 }}>
                    {[
                        { value: stats.lessonsCompleted, label: 'Уроков', icon: '📚', color: '#3b82f6' },
                        { value: stats.toolsTried, label: 'Инструментов', icon: '🔧', color: '#8b5cf6' },
                        { value: stats.xpEarned, label: 'XP', icon: '⭐', color: '#f59e0b' },
                        { value: `${stats.streakDays}д`, label: 'Streak', icon: '🔥', color: '#ef4444' },
                    ].map((stat, i) => (
                        <div key={i} style={{ background: 'rgba(31,41,55,0.9)', borderRadius: 16, padding: 20, textAlign: 'center', border: '1px solid #374151' }}>
                            <div style={{ fontSize: 28 }}>{stat.icon}</div>
                            <div style={{ fontSize: 32, fontWeight: 800, color: stat.color, marginTop: 8 }}>{stat.value}</div>
                            <div style={{ fontSize: 14, color: '#9ca3af' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Rank */}
                <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(59,130,246,0.2))', borderRadius: 16, padding: 24, marginBottom: 32, textAlign: 'center', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 4 }}>Ваш ранг</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#10b981' }}>🏅 {stats.rank}</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>До следующего ранга: 440 XP</div>
                    <div style={{ height: 8, background: '#374151', borderRadius: 4, marginTop: 12 }}>
                        <div style={{ height: '100%', width: '78%', background: 'linear-gradient(90deg, #10b981, #3b82f6)', borderRadius: 4 }} />
                    </div>
                </div>

                {/* Weekly Chart */}
                <div style={{ background: 'rgba(31,41,55,0.9)', borderRadius: 16, padding: 24, marginBottom: 32, border: '1px solid #374151' }}>
                    <h3 style={{ color: 'white', marginBottom: 20, fontWeight: 600 }}>📊 Активность за неделю</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 120, gap: 8 }}>
                        {weeklyProgress.map((val, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: '100%', background: 'linear-gradient(180deg, #10b981, #3b82f6)', borderRadius: 4, height: `${val}%`, minHeight: 8, transition: 'height 0.5s' }} />
                                <span style={{ fontSize: 12, color: '#6b7280' }}>{days[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Achievements */}
                <div style={{ background: 'rgba(31,41,55,0.9)', borderRadius: 16, padding: 24, border: '1px solid #374151' }}>
                    <h3 style={{ color: 'white', marginBottom: 20, fontWeight: 600 }}>🏆 Новые достижения</h3>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {achievements.map(ach => (
                            <div key={ach.id} style={{ background: '#374151', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 24 }}>{ach.icon}</span>
                                <div>
                                    <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{ach.name}</div>
                                    <div style={{ color: '#6b7280', fontSize: 11 }}>{ach.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: 32 }}>
                    <button style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', border: 'none', borderRadius: 12, padding: '14px 32px', color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>📧 Получать еженедельный отчёт</button>
                </div>
            </div>
        </section>
    );
}
