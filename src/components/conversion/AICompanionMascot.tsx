'use client';

import React, { useState, useEffect } from 'react';

interface Message { text: string; isBot: boolean; }

const tips = [
    'Хотите узнать, как AI может ускорить ваш бизнес в 10 раз? 🚀',
    'Попробуйте наш бесплатный ROI калькулятор! 📊',
    'Новые AI инструменты добавляются каждую неделю! 🔧',
    'Присоединяйтесь к нашему сообществу экспертов! 👥',
    'Получите персональную консультацию от Andrew Altair! 💎',
];

export default function AICompanionMascot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentTip, setCurrentTip] = useState(0);
    const [showTip, setShowTip] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isOpen && isVisible) {
            const tipTimer = setInterval(() => {
                setShowTip(true);
                setTimeout(() => setShowTip(false), 5000);
                setCurrentTip(prev => (prev + 1) % tips.length);
            }, 15000);
            return () => clearInterval(tipTimer);
        }
    }, [isOpen, isVisible]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ text: 'Привет! 👋 Я Альтаир, ваш AI-помощник! Чем могу помочь?', isBot: true }]);
        }
    }, [isOpen, messages.length]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        const userMsg = inputValue.trim();
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const responses = [
                'Отличный вопрос! Рекомендую начать с наших бесплатных микро-уроков. 📚',
                'Для этого у нас есть специальный инструмент! Посмотрите раздел Tools. 🔧',
                'Советую записаться на консультацию с Andrew для детального разбора! 💎',
                'Это можно решить с помощью AI автоматизации. Хотите узнать больше? 🤖',
            ];
            setMessages(prev => [...prev, { text: responses[Math.floor(Math.random() * responses.length)], isBot: true }]);
        }, 1500);
    };

    if (!isVisible) return null;

    return (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
            {/* Tip Bubble */}
            {showTip && !isOpen && (
                <div style={{ position: 'absolute', bottom: 80, right: 0, background: '#1f2937', border: '1px solid #374151', borderRadius: 16, padding: '12px 16px', maxWidth: 250, animation: 'fadeIn 0.3s ease' }}>
                    <button onClick={() => setShowTip(false)} style={{ position: 'absolute', top: 4, right: 8, background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>×</button>
                    <p style={{ fontSize: 14, color: '#d1d5db', margin: 0 }}>{tips[currentTip]}</p>
                </div>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={{ position: 'absolute', bottom: 80, right: 0, width: 350, height: 450, background: '#1f2937', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}>
                    {/* Header */}
                    <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🤖</div>
                        <div>
                            <div style={{ fontWeight: 700, color: 'white' }}>Альтаир</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>AI Помощник • Онлайн</div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer' }}>×</button>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: msg.isBot ? 'flex-start' : 'flex-end' }}>
                                <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: 16, background: msg.isBot ? '#374151' : 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: 'white', fontSize: 14 }}>{msg.text}</div>
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ display: 'flex', gap: 4, padding: '10px 14px', background: '#374151', borderRadius: 16, width: 'fit-content' }}>
                                <span style={{ width: 8, height: 8, background: '#6b7280', borderRadius: '50%', animation: 'bounce 1s infinite' }} />
                                <span style={{ width: 8, height: 8, background: '#6b7280', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }} />
                                <span style={{ width: 8, height: 8, background: '#6b7280', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }} />
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div style={{ padding: 16, borderTop: '1px solid #374151', display: 'flex', gap: 12 }}>
                        <input value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Напишите сообщение..." style={{ flex: 1, background: '#374151', border: 'none', borderRadius: 12, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' }} />
                        <button onClick={handleSend} style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', border: 'none', borderRadius: 12, width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📤</button>
                    </div>
                </div>
            )}

            {/* Mascot Button */}
            <button onClick={() => setIsOpen(!isOpen)} style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, boxShadow: '0 8px 24px rgba(139,92,246,0.4)', transition: 'all 0.3s ease' }}>
                {isOpen ? '✕' : '🤖'}
            </button>

            <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      `}</style>
        </div>
    );
}
