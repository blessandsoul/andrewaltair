'use client';

import React, { useState, useEffect } from 'react';

interface Skill { id: string; name: string; icon: string; tier: number; unlocked: boolean; requires?: string[]; }

const skillsData: Skill[] = [
    { id: 'basics', name: 'AI Основы', icon: '📚', tier: 0, unlocked: true },
    { id: 'prompts', name: 'Промптинг', icon: '✍️', tier: 1, unlocked: false, requires: ['basics'] },
    { id: 'tools', name: 'AI Инструменты', icon: '🔧', tier: 1, unlocked: false, requires: ['basics'] },
    { id: 'advanced-prompts', name: 'Продвинутые промпты', icon: '🎯', tier: 2, unlocked: false, requires: ['prompts'] },
    { id: 'automation', name: 'Автоматизация', icon: '⚙️', tier: 2, unlocked: false, requires: ['tools'] },
    { id: 'images', name: 'Генерация изображений', icon: '🎨', tier: 2, unlocked: false, requires: ['prompts'] },
    { id: 'expert', name: 'AI Эксперт', icon: '👑', tier: 3, unlocked: false, requires: ['advanced-prompts', 'automation'] },
    { id: 'creator', name: 'AI Создатель', icon: '🚀', tier: 3, unlocked: false, requires: ['images', 'automation'] },
];

export default function SkillTree() {
    const [skills, setSkills] = useState<Skill[]>(skillsData);
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('aiSkillTree');
        if (saved) setSkills(JSON.parse(saved));
    }, []);

    const canUnlock = (skill: Skill) => {
        if (skill.unlocked) return false;
        if (!skill.requires) return true;
        return skill.requires.every(reqId => skills.find(s => s.id === reqId)?.unlocked);
    };

    const unlockSkill = (skillId: string) => {
        const updated = skills.map(s => s.id === skillId ? { ...s, unlocked: true } : s);
        setSkills(updated);
        localStorage.setItem('aiSkillTree', JSON.stringify(updated));
        setSelectedSkill(null);
    };

    const tiers = [0, 1, 2, 3];
    const unlockedCount = skills.filter(s => s.unlocked).length;

    return (
        <section style={{ padding: '80px 20px', background: 'linear-gradient(180deg, rgba(17,24,39,0) 0%, rgba(16,185,129,0.08) 50%, rgba(17,24,39,0) 100%)' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <span style={{ fontSize: 48 }}>🌳</span>
                    <h2 style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 16 }}>Skill Tree</h2>
                    <p style={{ fontSize: 18, color: '#9ca3af' }}>Развивайте AI навыки пошагово</p>
                    <div style={{ marginTop: 16, background: 'rgba(16,185,129,0.2)', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 20 }}>
                        <span style={{ color: '#10b981', fontWeight: 700 }}>{unlockedCount}/{skills.length} навыков</span>
                    </div>
                </div>

                {/* Tree */}
                <div style={{ background: 'rgba(31,41,55,0.9)', borderRadius: 24, padding: 40, border: '1px solid #374151' }}>
                    {tiers.map(tier => (
                        <div key={tier} style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: tier < 3 ? 32 : 0, flexWrap: 'wrap' }}>
                            {skills.filter(s => s.tier === tier).map(skill => (
                                <div key={skill.id} onClick={() => (skill.unlocked || canUnlock(skill)) && setSelectedSkill(skill)} style={{ width: 100, textAlign: 'center', cursor: skill.unlocked || canUnlock(skill) ? 'pointer' : 'not-allowed', opacity: skill.unlocked || canUnlock(skill) ? 1 : 0.4, transition: 'all 0.3s' }}>
                                    <div style={{ width: 70, height: 70, margin: '0 auto 8px', borderRadius: '50%', background: skill.unlocked ? 'linear-gradient(135deg, #10b981, #3b82f6)' : canUnlock(skill) ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, boxShadow: skill.unlocked ? '0 0 20px rgba(16,185,129,0.4)' : 'none' }}>
                                        {skill.unlocked ? skill.icon : canUnlock(skill) ? '🔓' : '🔒'}
                                    </div>
                                    <div style={{ fontSize: 12, color: skill.unlocked ? 'white' : '#6b7280', fontWeight: 600 }}>{skill.name}</div>
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* Lines would be SVG in production */}
                    <div style={{ textAlign: 'center', marginTop: 24, color: '#6b7280', fontSize: 12 }}>Нажмите на навык для разблокировки</div>
                </div>

                {/* Modal */}
                {selectedSkill && (
                    <div onClick={() => setSelectedSkill(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 20 }}>
                        <div onClick={e => e.stopPropagation()} style={{ background: '#1f2937', borderRadius: 24, padding: 40, maxWidth: 400, width: '100%', textAlign: 'center' }}>
                            <div style={{ fontSize: 64, marginBottom: 16 }}>{selectedSkill.icon}</div>
                            <h3 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 8 }}>{selectedSkill.name}</h3>
                            {selectedSkill.unlocked ? (
                                <>
                                    <div style={{ color: '#10b981', marginBottom: 24 }}>✓ Навык разблокирован!</div>
                                    <button onClick={() => setSelectedSkill(null)} style={{ background: '#374151', border: 'none', borderRadius: 12, padding: '12px 32px', color: 'white', cursor: 'pointer' }}>Закрыть</button>
                                </>
                            ) : (
                                <>
                                    <p style={{ color: '#9ca3af', marginBottom: 24 }}>Готовы изучить этот навык?</p>
                                    <button onClick={() => unlockSkill(selectedSkill.id)} style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', border: 'none', borderRadius: 12, padding: '14px 32px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Разблокировать 🔓</button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
