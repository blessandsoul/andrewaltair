'use client';

import React, { useState } from 'react';

interface Template { id: string; name: string; prompt: string; icon: string; }

const templates: Template[] = [
    { id: '1', name: 'Маркетинг', icon: '📣', prompt: 'Напиши рекламный пост для Instagram о [продукт]. Целевая аудитория: [аудитория]. Тон: дружелюбный.' },
    { id: '2', name: 'Продажи', icon: '💼', prompt: 'Создай холодное письмо для [компания]. Цель: назначить встречу. Добавь персонализацию.' },
    { id: '3', name: 'Контент', icon: '✍️', prompt: 'Напиши статью на тему [тема] для блога. Объём: 1000 слов. Стиль: экспертный.' },
    { id: '4', name: 'Код', icon: '💻', prompt: 'Напиши функцию на [язык] которая [задача]. Добавь комментарии и обработку ошибок.' },
    { id: '5', name: 'Анализ', icon: '📊', prompt: 'Проанализируй [данные/текст] и выдели ключевые инсайты. Формат: буллет-поинты.' },
];

const examples = [
    { input: 'Напиши слоган для кофейни', output: '"Каждое утро начинается с правильного зерна" ☕\n\nАльтернативы:\n• "Ваш ежедневный ритуал совершенства"\n• "Кофе, который будит не только тело"' },
    { input: 'Объясни квантовые компьютеры просто', output: 'Представь обычный компьютер как выключатель: он либо ВКЛ, либо ВЫКЛ (0 или 1).\n\nКвантовый компьютер — это как монетка в воздухе: она одновременно и орёл, и решка, пока не упадёт.\n\nЭто позволяет решать сложные задачи в миллионы раз быстрее! 🚀' },
];

export default function PromptPlayground() {
    const [prompt, setPrompt] = useState('');
    const [output, setOutput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    const handleGenerate = () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        setTimeout(() => {
            setOutput(`✨ Результат для: "${prompt}"\n\n${examples[Math.floor(Math.random() * examples.length)].output}\n\n---\n💡 Совет: добавьте больше контекста для лучшего результата!`);
            setIsGenerating(false);
        }, 2000);
    };

    const applyTemplate = (template: Template) => {
        setPrompt(template.prompt);
        setSelectedTemplate(template.id);
    };

    return (
        <section style={{ padding: '80px 20px', background: 'linear-gradient(180deg, rgba(17,24,39,0) 0%, rgba(59,130,246,0.08) 50%, rgba(17,24,39,0) 100%)' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <span style={{ fontSize: 48 }}>🎮</span>
                    <h2 style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 16 }}>Prompt Playground</h2>
                    <p style={{ fontSize: 18, color: '#9ca3af' }}>Тестируйте промпты в интерактивной песочнице</p>
                </div>

                {/* Templates */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 32 }}>
                    {templates.map(t => (
                        <button key={t.id} onClick={() => applyTemplate(t)} style={{ background: selectedTemplate === t.id ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(55,65,81,0.5)', border: `1px solid ${selectedTemplate === t.id ? 'transparent' : '#374151'}`, borderRadius: 12, padding: '10px 20px', color: 'white', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span>{t.icon}</span> {t.name}
                        </button>
                    ))}
                </div>

                {/* Playground */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
                    {/* Input */}
                    <div style={{ background: 'rgba(31,41,55,0.9)', borderRadius: 20, padding: 24, border: '1px solid #374151' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <span style={{ color: '#9ca3af', fontSize: 14, fontWeight: 600 }}>📝 ВВОД</span>
                            <span style={{ color: '#6b7280', fontSize: 12 }}>{prompt.length} символов</span>
                        </div>
                        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Введите ваш промпт здесь..." style={{ width: '100%', height: 200, background: '#1f2937', border: '1px solid #374151', borderRadius: 12, padding: 16, color: 'white', fontSize: 15, resize: 'none', outline: 'none', fontFamily: 'inherit' }} />
                        <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} style={{ marginTop: 16, width: '100%', background: isGenerating ? '#374151' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: 12, padding: '14px', color: 'white', fontSize: 16, fontWeight: 600, cursor: isGenerating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            {isGenerating ? <><span style={{ animation: 'spin 1s linear infinite' }}>⚙️</span> Генерация...</> : <>✨ Сгенерировать</>}
                        </button>
                    </div>

                    {/* Output */}
                    <div style={{ background: 'rgba(31,41,55,0.9)', borderRadius: 20, padding: 24, border: '1px solid #374151' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <span style={{ color: '#9ca3af', fontSize: 14, fontWeight: 600 }}>🎯 РЕЗУЛЬТАТ</span>
                            {output && <button onClick={() => navigator.clipboard.writeText(output)} style={{ background: 'transparent', border: '1px solid #374151', borderRadius: 8, padding: '4px 12px', color: '#9ca3af', fontSize: 12, cursor: 'pointer' }}>📋 Копировать</button>}
                        </div>
                        <div style={{ height: 200, background: '#1f2937', border: '1px solid #374151', borderRadius: 12, padding: 16, color: output ? '#d1d5db' : '#6b7280', fontSize: 15, overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                            {output || 'Результат появится здесь...'}
                        </div>
                        {output && (
                            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                                <button style={{ flex: 1, background: 'transparent', border: '1px solid #374151', borderRadius: 12, padding: '10px', color: '#9ca3af', fontSize: 14, cursor: 'pointer' }}>👍 Хорошо</button>
                                <button style={{ flex: 1, background: 'transparent', border: '1px solid #374151', borderRadius: 12, padding: '10px', color: '#9ca3af', fontSize: 14, cursor: 'pointer' }}>👎 Плохо</button>
                                <button style={{ flex: 1, background: 'transparent', border: '1px solid #374151', borderRadius: 12, padding: '10px', color: '#9ca3af', fontSize: 14, cursor: 'pointer' }}>🔄 Ещё</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* CTA */}
                <div style={{ marginTop: 40, textAlign: 'center', padding: 24, background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', borderRadius: 16, border: '1px solid rgba(59,130,246,0.3)' }}>
                    <p style={{ color: '#d1d5db', marginBottom: 16 }}>🚀 Хотите использовать настоящий AI? Получите доступ к полной версии!</p>
                    <button style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: 12, padding: '14px 32px', color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Попробовать бесплатно →</button>
                </div>
            </div>

            <style jsx global>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </section>
    );
}
