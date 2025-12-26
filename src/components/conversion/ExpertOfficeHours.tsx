'use client';

import React, { useState } from 'react';

interface TimeSlot { id: string; date: string; time: string; available: boolean; topic?: string; }
interface Booking { slot: TimeSlot; name: string; question: string; }

const generateSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const now = new Date();
    for (let d = 1; d <= 7; d++) {
        const date = new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
        const dateStr = date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });
        ['10:00', '14:00', '17:00'].forEach((time, i) => {
            slots.push({ id: `${d}-${i}`, date: dateStr, time, available: Math.random() > 0.3 });
        });
    }
    return slots;
};

const topics = ['Стратегия AI', 'Технический разбор', 'Автоматизация', 'Контент с AI', 'Выбор инструментов'];

export default function ExpertOfficeHours() {
    const [slots] = useState<TimeSlot[]>(generateSlots());
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [booking, setBooking] = useState<Booking | null>(null);
    const [form, setForm] = useState({ name: '', question: '', topic: topics[0] });

    const handleBook = () => {
        if (!selectedSlot || !form.name || !form.question) return;
        setBooking({ slot: selectedSlot, name: form.name, question: form.question });
        setSelectedSlot(null);
    };

    const groupedSlots = slots.reduce((acc, slot) => {
        if (!acc[slot.date]) acc[slot.date] = [];
        acc[slot.date].push(slot);
        return acc;
    }, {} as Record<string, TimeSlot[]>);

    return (
        <section style={{ padding: '80px 20px', background: 'linear-gradient(180deg, rgba(17,24,39,0) 0%, rgba(236,72,153,0.08) 50%, rgba(17,24,39,0) 100%)' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <span style={{ fontSize: 48 }}>📅</span>
                    <h2 style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 16 }}>Expert Office Hours</h2>
                    <p style={{ fontSize: 18, color: '#9ca3af' }}>Бесплатная 15-минутная консультация с Andrew Altair</p>
                </div>

                {booking ? (
                    <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', borderRadius: 24, padding: 40, textAlign: 'center' }}>
                        <span style={{ fontSize: 64 }}>✅</span>
                        <h3 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginTop: 16 }}>Консультация забронирована!</h3>
                        <p style={{ color: '#9ca3af', marginTop: 8 }}>{booking.slot.date} в {booking.slot.time}</p>
                        <p style={{ color: '#10b981', marginTop: 16 }}>Ссылка на Zoom придёт на email</p>
                    </div>
                ) : (
                    <div style={{ background: 'rgba(31,41,55,0.9)', borderRadius: 24, padding: 32, border: '1px solid #374151' }}>
                        {/* Expert Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid #374151' }}>
                            <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🧑‍💼</div>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>Andrew Altair</div>
                                <div style={{ color: '#9ca3af', fontSize: 14 }}>AI Эксперт • 500+ консультаций</div>
                            </div>
                            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>{'⭐⭐⭐⭐⭐'.split('').map((s, i) => <span key={i} style={{ color: '#f59e0b' }}>{s}</span>)}</div>
                        </div>

                        {/* Slots Grid */}
                        <div style={{ marginBottom: 24 }}>
                            <h4 style={{ color: 'white', marginBottom: 16 }}>Выберите время:</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
                                {Object.entries(groupedSlots).slice(0, 5).map(([date, daySlots]) => (
                                    <div key={date}>
                                        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8, textAlign: 'center' }}>{date}</div>
                                        {daySlots.map(slot => (
                                            <button key={slot.id} onClick={() => slot.available && setSelectedSlot(slot)} disabled={!slot.available} style={{ width: '100%', marginBottom: 6, padding: '8px', borderRadius: 8, border: selectedSlot?.id === slot.id ? '2px solid #ec4899' : '1px solid #374151', background: slot.available ? (selectedSlot?.id === slot.id ? 'rgba(236,72,153,0.2)' : '#374151') : 'rgba(55,65,81,0.3)', color: slot.available ? 'white' : '#6b7280', cursor: slot.available ? 'pointer' : 'not-allowed', fontSize: 13 }}>
                                                {slot.time}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {selectedSlot && (
                            <div style={{ background: '#1f2937', borderRadius: 16, padding: 24, marginTop: 24 }}>
                                <h4 style={{ color: 'white', marginBottom: 16 }}>Детали консультации</h4>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, marginBottom: 4 }}>Ваше имя</label>
                                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%', background: '#374151', border: 'none', borderRadius: 8, padding: '12px', color: 'white' }} />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, marginBottom: 4 }}>Тема</label>
                                    <select value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} style={{ width: '100%', background: '#374151', border: 'none', borderRadius: 8, padding: '12px', color: 'white' }}>
                                        {topics.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, marginBottom: 4 }}>Ваш вопрос</label>
                                    <textarea value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} rows={3} style={{ width: '100%', background: '#374151', border: 'none', borderRadius: 8, padding: '12px', color: 'white', resize: 'none' }} />
                                </div>
                                <button onClick={handleBook} style={{ width: '100%', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', border: 'none', borderRadius: 12, padding: '14px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Забронировать {selectedSlot.date} в {selectedSlot.time}</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
