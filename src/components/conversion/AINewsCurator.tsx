'use client';

import React, { useState, useEffect } from 'react';

interface NewsItem { id: string; title: string; summary: string; source: string; time: string; category: string; icon: string; isNew: boolean; }

const news: NewsItem[] = [
    { id: '1', title: 'GPT-5 ожидается в 2025', summary: 'OpenAI подтвердила работу над следующей версией языковой модели с улучшенным мультимодальным пониманием.', source: 'TechCrunch', time: '2ч назад', category: 'Модели', icon: '🤖', isNew: true },
    { id: '2', title: 'Google DeepMind представил Gemini 2.0', summary: 'Новая модель демонстрирует прорыв в мультимодальных возможностях и агентных системах.', source: 'Google Blog', time: '5ч назад', category: 'Модели', icon: '🌟', isNew: true },
    { id: '3', title: 'AI в бизнесе: исследование 2024', summary: '73% компаний планируют увеличить инвестиции в AI в следующем году.', source: 'McKinsey', time: '1д назад', category: 'Бизнес', icon: '📊', isNew: false },
    { id: '4', title: 'Midjourney V7 в разработке', summary: 'Команда обещает революционные улучшения в качестве и консистентности генерации.', source: 'Midjourney', time: '2д назад', category: 'Изображения', icon: '🎨', isNew: false },
    { id: '5', title: 'Новые правила EU AI Act', summary: 'Европа вводит строгие требования к прозрачности AI систем.', source: 'EU Commission', time: '3д назад', category: 'Регулирование', icon: '⚖️', isNew: false },
];

const categories = ['Все', 'Модели', 'Бизнес', 'Изображения', 'Регулирование', 'Инструменты'];

export default function AINewsCurator() {
    const [filter, setFilter] = useState('Все');
    const [savedNews, setSavedNews] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('savedAINews');
        if (saved) setSavedNews(JSON.parse(saved));
    }, []);

    const toggleSave = (id: string) => {
        const updated = savedNews.includes(id) ? savedNews.filter(n => n !== id) : [...savedNews, id];
        setSavedNews(updated);
        localStorage.setItem('savedAINews', JSON.stringify(updated));
    };

    const filtered = filter === 'Все' ? news : news.filter(n => n.category === filter);

    return (
        <section style={{ padding: '80px 20px', background: 'linear-gradient(180deg, rgba(17,24,39,0) 0%, rgba(59,130,246,0.08) 50%, rgba(17,24,39,0) 100%)' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <span style={{ fontSize: 48 }}>📰</span>
                    <h2 style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 16 }}>AI News Curator</h2>
                    <p style={{ fontSize: 18, color: '#9ca3af' }}>Персонализированные AI-новости для вас</p>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 32 }}>
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setFilter(cat)} style={{ background: filter === cat ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'transparent', border: filter === cat ? 'none' : '1px solid #374151', borderRadius: 20, padding: '8px 16px', color: filter === cat ? 'white' : '#9ca3af', fontSize: 14, cursor: 'pointer' }}>{cat}</button>
                    ))}
                </div>

                {/* News List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {filtered.map(item => (
                        <div key={item.id} style={{ background: 'rgba(31,41,55,0.9)', border: '1px solid #374151', borderRadius: 16, padding: 24, transition: 'all 0.3s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ fontSize: 32 }}>{item.icon}</span>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>{item.title}</h3>
                                            {item.isNew && <span style={{ background: '#ef4444', color: 'white', fontSize: 10, padding: '2px 6px', borderRadius: 8, fontWeight: 700 }}>NEW</span>}
                                        </div>
                                        <div style={{ fontSize: 12, color: '#6b7280' }}>{item.source} • {item.time}</div>
                                    </div>
                                </div>
                                <button onClick={() => toggleSave(item.id)} style={{ background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer' }}>
                                    {savedNews.includes(item.id) ? '⭐' : '☆'}
                                </button>
                            </div>
                            <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 12 }}>{item.summary}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 12, color: '#6b7280', background: '#374151', padding: '4px 10px', borderRadius: 8 }}>{item.category}</span>
                                <button style={{ background: 'transparent', border: '1px solid #374151', borderRadius: 8, padding: '6px 12px', color: '#9ca3af', fontSize: 12, cursor: 'pointer' }}>Читать →</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: 32 }}>
                    <button style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: 12, padding: '14px 32px', color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>🔔 Подписаться на рассылку</button>
                </div>
            </div>
        </section>
    );
}
