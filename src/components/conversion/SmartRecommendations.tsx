'use client';

import React, { useState, useEffect } from 'react';

interface Tool { id: string; name: string; icon: string; category: string; match: number; description: string; }

const allTools: Tool[] = [
    { id: '1', name: 'ChatGPT', icon: '💬', category: 'Текст', match: 95, description: 'Универсальный AI-ассистент' },
    { id: '2', name: 'Midjourney', icon: '🎨', category: 'Изображения', match: 88, description: 'Генерация изображений' },
    { id: '3', name: 'Claude', icon: '🧠', category: 'Текст', match: 92, description: 'Продвинутый анализ' },
    { id: '4', name: 'DALL-E 3', icon: '🖼️', category: 'Изображения', match: 85, description: 'Создание артов' },
    { id: '5', name: 'Runway', icon: '🎬', category: 'Видео', match: 78, description: 'AI видеогенерация' },
    { id: '6', name: 'Jasper', icon: '✍️', category: 'Маркетинг', match: 82, description: 'Маркетинговый контент' },
];

export default function SmartRecommendations() {
    const [interests, setInterests] = useState<string[]>([]);
    const [recommendations, setRecommendations] = useState<Tool[]>([]);
    const categories = ['Текст', 'Изображения', 'Видео', 'Маркетинг', 'Код', 'Аналитика'];

    useEffect(() => {
        const saved = localStorage.getItem('userInterests');
        if (saved) setInterests(JSON.parse(saved));
    }, []);

    useEffect(() => {
        if (interests.length > 0) {
            const filtered = allTools.filter(t => interests.includes(t.category)).slice(0, 4);
            if (filtered.length < 4) {
                const remaining = allTools.filter(t => !interests.includes(t.category)).slice(0, 4 - filtered.length);
                setRecommendations([...filtered, ...remaining]);
            } else {
                setRecommendations(filtered);
            }
        } else {
            setRecommendations(allTools.slice(0, 4));
        }
    }, [interests]);

    const toggleInterest = (cat: string) => {
        const updated = interests.includes(cat) ? interests.filter(i => i !== cat) : [...interests, cat];
        setInterests(updated);
        localStorage.setItem('userInterests', JSON.stringify(updated));
    };

    return (
        <section style={{ padding: '80px 20px', background: 'linear-gradient(180deg, rgba(17,24,39,0) 0%, rgba(139,92,246,0.08) 50%, rgba(17,24,39,0) 100%)' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <span style={{ fontSize: 48 }}>🎯</span>
                    <h2 style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 16 }}>Smart Recommendations</h2>
                    <p style={{ fontSize: 18, color: '#9ca3af' }}>AI подбирает инструменты под ваши задачи</p>
                </div>

                {/* Interest Tags */}
                <div style={{ background: 'rgba(31,41,55,0.8)', borderRadius: 16, padding: 24, marginBottom: 32 }}>
                    <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 12 }}>Выберите интересы для персонализации:</div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {categories.map(cat => (
                            <button key={cat} onClick={() => toggleInterest(cat)} style={{ background: interests.includes(cat) ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' : '#374151', border: 'none', borderRadius: 20, padding: '8px 16px', color: 'white', fontSize: 14, cursor: 'pointer', transition: 'all 0.3s' }}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recommendations */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                    {recommendations.map((tool, i) => (
                        <div key={tool.id} style={{ background: 'rgba(31,41,55,0.9)', border: '1px solid #374151', borderRadius: 16, padding: 24, cursor: 'pointer', transition: 'all 0.3s', animation: `fadeIn 0.3s ease ${i * 0.1}s both` }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#374151'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                                <span style={{ fontSize: 36 }}>{tool.icon}</span>
                                <span style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa', padding: '4px 8px', borderRadius: 8, fontSize: 12 }}>{tool.match}% match</span>
                            </div>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 4 }}>{tool.name}</h3>
                            <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8 }}>{tool.description}</p>
                            <span style={{ fontSize: 11, color: '#6b7280', background: '#374151', padding: '2px 8px', borderRadius: 10 }}>{tool.category}</span>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: 32 }}>
                    <button style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', border: 'none', borderRadius: 12, padding: '14px 32px', color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Посмотреть все инструменты →</button>
                </div>

                <style jsx global>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            </div>
        </section>
    );
}
