'use client';

import React, { useState, useEffect } from 'react';

interface Lesson {
    id: string;
    title: string;
    duration: string;
    icon: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    content: string[];
}

const lessons: Lesson[] = [
    {
        id: '1', title: 'Что такое промпт?', duration: '2 мин', icon: '💬', category: 'Основы', difficulty: 'beginner',
        content: ['Промпт — это текстовая инструкция для AI.', 'Чем точнее промпт, тем лучше результат.', 'Хороший промпт содержит контекст, задачу и формат.']
    },
    {
        id: '2', title: 'ChatGPT за 2 минуты', duration: '2 мин', icon: '🤖', category: 'Инструменты', difficulty: 'beginner',
        content: ['ChatGPT — это AI-ассистент от OpenAI.', 'Умеет писать тексты, код, отвечать на вопросы.', 'Бесплатная версия на chat.openai.com']
    },
    {
        id: '3', title: 'AI для текстов', duration: '2 мин', icon: '✍️', category: 'Применение', difficulty: 'beginner',
        content: ['AI помогает писать посты, статьи, письма.', 'Можно задать тон: формальный или дружелюбный.', 'Всегда проверяйте результат AI.']
    },
    {
        id: '4', title: 'Генерация изображений', duration: '2 мин', icon: '🎨', category: 'Инструменты', difficulty: 'intermediate',
        content: ['DALL-E, Midjourney — топ инструменты.', 'Описывайте детально стиль и композицию.', 'Проверяйте лицензию для коммерции.']
    },
    {
        id: '5', title: 'AI в бизнесе', duration: '2 мин', icon: '💼', category: 'Применение', difficulty: 'advanced',
        content: ['Автоматизация рутины: отчёты, письма.', 'Ускорение создания контента в 5-10 раз.', 'ROI от AI может достигать 300-500%.']
    },
];

const difficultyColors = { beginner: '#10b981', intermediate: '#f59e0b', advanced: '#ef4444' };
const difficultyNames = { beginner: 'Начинающий', intermediate: 'Средний', advanced: 'Продвинутый' };

export default function MicroLessons() {
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        const saved = localStorage.getItem('completedMicroLessons');
        if (saved) setCompletedLessons(JSON.parse(saved));
    }, []);

    const completeLesson = (lessonId: string) => {
        if (!completedLessons.includes(lessonId)) {
            const updated = [...completedLessons, lessonId];
            setCompletedLessons(updated);
            localStorage.setItem('completedMicroLessons', JSON.stringify(updated));
        }
    };

    const handleNext = () => {
        if (selectedLesson) {
            if (currentSlide < selectedLesson.content.length - 1) {
                setCurrentSlide(currentSlide + 1);
            } else {
                completeLesson(selectedLesson.id);
                setSelectedLesson(null);
                setCurrentSlide(0);
            }
        }
    };

    const categories = ['all', ...new Set(lessons.map(l => l.category))];
    const filteredLessons = filter === 'all' ? lessons : lessons.filter(l => l.category === filter);

    return (
        <section style={{ padding: '80px 20px', background: 'linear-gradient(180deg, rgba(17,24,39,0) 0%, rgba(16,185,129,0.05) 50%, rgba(17,24,39,0) 100%)' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{ fontSize: 48 }}>⚡</div>
                <h2 style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Микро-уроки AI</h2>
                <p style={{ fontSize: 18, color: '#9ca3af' }}>Изучите AI за 2 минуты • Без регистрации</p>
            </div>

            <div style={{ maxWidth: 400, margin: '24px auto', textAlign: 'center' }}>
                <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>Пройдено {completedLessons.length} из {lessons.length}</div>
                <div style={{ height: 8, background: '#374151', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(completedLessons.length / lessons.length) * 100}%`, background: 'linear-gradient(90deg, #10b981, #3b82f6)', borderRadius: 4, transition: 'width 0.5s' }} />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
                {categories.map(cat => (
                    <button key={cat} onClick={() => setFilter(cat)} style={{ background: filter === cat ? 'linear-gradient(135deg, #10b981, #3b82f6)' : 'transparent', border: filter === cat ? 'none' : '1px solid #374151', color: filter === cat ? 'white' : '#9ca3af', padding: '8px 20px', borderRadius: 20, fontSize: 14, cursor: 'pointer' }}>
                        {cat === 'all' ? 'Все' : cat}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: 1200, margin: '0 auto' }}>
                {filteredLessons.map(lesson => (
                    <div key={lesson.id} onClick={() => setSelectedLesson(lesson)} style={{ background: completedLessons.includes(lesson.id) ? 'rgba(16,185,129,0.1)' : 'rgba(31,41,55,0.8)', border: `1px solid ${completedLessons.includes(lesson.id) ? '#10b981' : '#374151'}`, borderRadius: 16, padding: 24, cursor: 'pointer', position: 'relative', transition: 'all 0.3s' }}>
                        {completedLessons.includes(lesson.id) && <span style={{ position: 'absolute', top: 12, right: 12, background: '#10b981', color: 'white', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✓</span>}
                        <div style={{ fontSize: 40, marginBottom: 12 }}>{lesson.icon}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                            <span style={{ fontSize: 12, color: '#6b7280' }}>⏱️ {lesson.duration}</span>
                            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, fontWeight: 600, background: `${difficultyColors[lesson.difficulty]}20`, color: difficultyColors[lesson.difficulty] }}>{difficultyNames[lesson.difficulty]}</span>
                        </div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 8 }}>{lesson.title}</h3>
                        <span style={{ fontSize: 13, color: '#6b7280' }}>{lesson.category}</span>
                    </div>
                ))}
            </div>

            {selectedLesson && (
                <div onClick={() => { setSelectedLesson(null); setCurrentSlide(0); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 20 }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: '#1f2937', borderRadius: 24, padding: 40, maxWidth: 600, width: '100%', position: 'relative', textAlign: 'center' }}>
                        <button onClick={() => { setSelectedLesson(null); setCurrentSlide(0); }} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: '#6b7280', fontSize: 24, cursor: 'pointer' }}>×</button>
                        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 24 }}>{currentSlide + 1} / {selectedLesson.content.length}</div>
                        <div style={{ fontSize: 64, marginBottom: 24 }}>{selectedLesson.icon}</div>
                        <h3 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 24 }}>{selectedLesson.title}</h3>
                        <div style={{ fontSize: 18, color: '#d1d5db', lineHeight: 1.6, padding: '40px 20px', background: 'rgba(55,65,81,0.5)', borderRadius: 16 }}>{selectedLesson.content[currentSlide]}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
                            <button onClick={() => currentSlide > 0 && setCurrentSlide(currentSlide - 1)} disabled={currentSlide === 0} style={{ background: 'transparent', border: '1px solid #374151', color: '#9ca3af', padding: '12px 24px', borderRadius: 12, fontSize: 14, cursor: currentSlide === 0 ? 'not-allowed' : 'pointer', opacity: currentSlide === 0 ? 0.5 : 1 }}>← Назад</button>
                            <button onClick={handleNext} style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', border: 'none', color: 'white', padding: '12px 24px', borderRadius: 12, fontSize: 14, cursor: 'pointer' }}>{currentSlide === selectedLesson.content.length - 1 ? 'Завершить ✓' : 'Далее →'}</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
