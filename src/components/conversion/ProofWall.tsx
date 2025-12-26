'use client';

import React, { useState, useEffect } from 'react';

interface Proof { id: string; name: string; avatar: string; result: string; metric: string; time: string; industry: string; }

const proofs: Proof[] = [
    { id: '1', name: 'Алексей М.', avatar: '👨‍💼', result: '+340%', metric: 'рост продуктивности', time: '2 мин назад', industry: 'IT' },
    { id: '2', name: 'Мария К.', avatar: '👩‍🎨', result: '₽180K', metric: 'экономия в месяц', time: '5 мин назад', industry: 'Маркетинг' },
    { id: '3', name: 'Дмитрий С.', avatar: '👨‍🔧', result: '50ч/мес', metric: 'сэкономлено времени', time: '8 мин назад', industry: 'Операции' },
    { id: '4', name: 'Елена В.', avatar: '👩‍💻', result: '10x', metric: 'скорость контента', time: '12 мин назад', industry: 'Контент' },
    { id: '5', name: 'Сергей П.', avatar: '👨‍🏫', result: '+89%', metric: 'конверсия лидов', time: '15 мин назад', industry: 'Продажи' },
    { id: '6', name: 'Анна Л.', avatar: '👩‍⚕️', result: '₽2.5M', metric: 'доп. выручка/год', time: '20 мин назад', industry: 'Финансы' },
];

export default function ProofWall() {
    const [visibleProofs, setVisibleProofs] = useState<Proof[]>([]);
    const [newProof, setNewProof] = useState<Proof | null>(null);

    useEffect(() => {
        setVisibleProofs(proofs.slice(0, 4));
        const interval = setInterval(() => {
            const randomProof = proofs[Math.floor(Math.random() * proofs.length)];
            setNewProof({ ...randomProof, id: Date.now().toString(), time: 'только что' });
            setTimeout(() => setNewProof(null), 5000);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section style={{ padding: '80px 20px', background: 'linear-gradient(180deg, rgba(17,24,39,0) 0%, rgba(16,185,129,0.08) 50%, rgba(17,24,39,0) 100%)' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <span style={{ fontSize: 48 }}>🏆</span>
                    <h2 style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 16 }}>Proof Wall</h2>
                    <p style={{ fontSize: 18, color: '#9ca3af' }}>Результаты наших клиентов в реальном времени</p>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 40 }}>
                    {[{ value: '500+', label: 'клиентов' }, { value: '₽50M+', label: 'экономии' }, { value: '2500ч', label: 'сэкономлено/мес' }, { value: '4.9★', label: 'рейтинг' }].map((stat, i) => (
                        <div key={i} style={{ background: 'rgba(31,41,55,0.8)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
                            <div style={{ fontSize: 28, fontWeight: 800, color: '#10b981' }}>{stat.value}</div>
                            <div style={{ fontSize: 14, color: '#9ca3af' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Proof Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                    {visibleProofs.map((proof, i) => (
                        <div key={proof.id} style={{ background: 'rgba(31,41,55,0.9)', border: '1px solid #374151', borderRadius: 16, padding: 24, animation: `fadeIn 0.5s ease ${i * 0.1}s both` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #10b981, #3b82f6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{proof.avatar}</div>
                                <div>
                                    <div style={{ fontWeight: 600, color: 'white' }}>{proof.name}</div>
                                    <div style={{ fontSize: 12, color: '#6b7280' }}>{proof.industry}</div>
                                </div>
                            </div>
                            <div style={{ fontSize: 36, fontWeight: 800, color: '#10b981', marginBottom: 4 }}>{proof.result}</div>
                            <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 12 }}>{proof.metric}</div>
                            <div style={{ fontSize: 12, color: '#6b7280' }}>🕐 {proof.time}</div>
                        </div>
                    ))}
                </div>

                {/* New Proof Notification */}
                {newProof && (
                    <div style={{ position: 'fixed', bottom: 100, left: 24, background: 'rgba(16,185,129,0.9)', borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, animation: 'slideIn 0.3s ease', zIndex: 1000 }}>
                        <span style={{ fontSize: 24 }}>{newProof.avatar}</span>
                        <div>
                            <div style={{ color: 'white', fontWeight: 600 }}>{newProof.name} достиг {newProof.result}</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{newProof.metric}</div>
                        </div>
                    </div>
                )}

                <style jsx global>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideIn { from { opacity: 0; transform: translateX(-100px); } to { opacity: 1; transform: translateX(0); } }
        `}</style>
            </div>
        </section>
    );
}
