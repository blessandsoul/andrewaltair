'use client';

import React, { useState, useEffect } from 'react';

interface Reward { level: number; name: string; icon: string; isPremium: boolean; claimed: boolean; }

const seasonRewards: Reward[] = [
    { level: 1, name: '10 AI кредитов', icon: '💎', isPremium: false, claimed: false },
    { level: 2, name: 'Эксклюзивный аватар', icon: '👤', isPremium: true, claimed: false },
    { level: 3, name: 'PDF Гайд', icon: '📄', isPremium: false, claimed: false },
    { level: 4, name: 'Промпт-пак', icon: '📝', isPremium: true, claimed: false },
    { level: 5, name: '25 AI кредитов', icon: '💎', isPremium: false, claimed: false },
    { level: 6, name: 'Видео-курс', icon: '🎬', isPremium: true, claimed: false },
    { level: 7, name: 'Бейдж "Сезон 1"', icon: '🏅', isPremium: false, claimed: false },
    { level: 8, name: 'VIP консультация', icon: '👑', isPremium: true, claimed: false },
    { level: 9, name: '50 AI кредитов', icon: '💎', isPremium: false, claimed: false },
    { level: 10, name: 'Эксклюзивный доступ', icon: '🚀', isPremium: true, claimed: false },
];

export default function SeasonPass() {
    const [currentLevel, setCurrentLevel] = useState(1);
    const [currentXP, setCurrentXP] = useState(250);
    const [rewards, setRewards] = useState<Reward[]>(seasonRewards);
    const [hasPremium, setHasPremium] = useState(false);
    const xpPerLevel = 500;
    const seasonEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    useEffect(() => {
        const saved = localStorage.getItem('seasonPass');
        if (saved) {
            const data = JSON.parse(saved);
            setCurrentLevel(data.level);
            setCurrentXP(data.xp);
            setRewards(data.rewards);
            setHasPremium(data.hasPremium);
        }
    }, []);

    const claimReward = (level: number) => {
        if (level > currentLevel) return;
        const reward = rewards.find(r => r.level === level);
        if (!reward || reward.claimed || (reward.isPremium && !hasPremium)) return;
        const updated = rewards.map(r => r.level === level ? { ...r, claimed: true } : r);
        setRewards(updated);
        localStorage.setItem('seasonPass', JSON.stringify({ level: currentLevel, xp: currentXP, rewards: updated, hasPremium }));
    };

    const getDaysLeft = () => Math.ceil((seasonEnd.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

    return (
        <section style={{ padding: '80px 20px', background: 'linear-gradient(180deg, rgba(17,24,39,0) 0%, rgba(245,158,11,0.08) 50%, rgba(17,24,39,0) 100%)' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <span style={{ fontSize: 48 }}>🎫</span>
                    <h2 style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg, #f59e0b, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 16 }}>Season Pass</h2>
                    <p style={{ fontSize: 18, color: '#9ca3af' }}>Сезон 1 • {getDaysLeft()} дней осталось</p>
                </div>

                {/* Level Progress */}
                <div style={{ background: 'rgba(31,41,55,0.9)', borderRadius: 20, padding: 24, marginBottom: 32, border: '1px solid #374151' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ color: 'white', fontWeight: 700 }}>Уровень {currentLevel}</span>
                        <span style={{ color: '#f59e0b', fontWeight: 600 }}>{currentXP}/{xpPerLevel} XP</span>
                    </div>
                    <div style={{ height: 12, background: '#374151', borderRadius: 6, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(currentXP / xpPerLevel) * 100}%`, background: 'linear-gradient(90deg, #f59e0b, #ec4899)', borderRadius: 6 }} />
                    </div>
                </div>

                {/* Premium Banner */}
                {!hasPremium && (
                    <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(236,72,153,0.2))', border: '1px solid #f59e0b', borderRadius: 16, padding: 24, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 4 }}>👑 Premium Pass</div>
                            <div style={{ color: '#9ca3af' }}>Разблокируйте все эксклюзивные награды!</div>
                        </div>
                        <button onClick={() => setHasPremium(true)} style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)', border: 'none', borderRadius: 12, padding: '12px 24px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Получить за 990₽</button>
                    </div>
                )}

                {/* Rewards Track */}
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16 }}>
                    {rewards.map(reward => (
                        <div key={reward.level} onClick={() => claimReward(reward.level)} style={{ minWidth: 110, background: reward.claimed ? 'rgba(16,185,129,0.2)' : reward.level <= currentLevel ? 'rgba(31,41,55,0.9)' : 'rgba(31,41,55,0.5)', border: `2px solid ${reward.claimed ? '#10b981' : reward.isPremium ? '#f59e0b' : '#374151'}`, borderRadius: 16, padding: 16, textAlign: 'center', cursor: reward.level <= currentLevel && !reward.claimed && (!reward.isPremium || hasPremium) ? 'pointer' : 'default', opacity: reward.level > currentLevel ? 0.5 : 1 }}>
                            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Ур. {reward.level}</div>
                            <div style={{ fontSize: 32, marginBottom: 8 }}>{reward.claimed ? '✅' : reward.icon}</div>
                            <div style={{ fontSize: 11, color: 'white', marginBottom: 4 }}>{reward.name}</div>
                            {reward.isPremium && !hasPremium && <span style={{ fontSize: 10, color: '#f59e0b' }}>👑 Premium</span>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
