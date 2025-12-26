'use client';

import React, { useState } from 'react';
import {
    MysteryBox, LimitedTimeDeals, MicroLessons, AICompanionMascot,
    SavingsCalculator, AIHealthScore, PromptPlayground, CaseStudyBuilder,
    AIQuestJourney, SkillTree, SeasonPass, LiveChallenges,
    AIBuddyMatching, ExpertOfficeHours, ProofWall, SmartRecommendations,
    AIReadinessAssessment, ImplementationRoadmap, AINewsCurator, ProgressSnapshot
} from '@/components/conversion';

const features = [
    { id: 'mystery-box', name: 'Mystery Box', icon: '🎁', phase: 1, component: MysteryBox },
    { id: 'limited-deals', name: 'Limited Time Deals', icon: '🔥', phase: 1, component: LimitedTimeDeals },
    { id: 'micro-lessons', name: 'Micro Lessons', icon: '⚡', phase: 1, component: MicroLessons },
    { id: 'savings-calc', name: 'Savings Calculator', icon: '💰', phase: 2, component: SavingsCalculator },
    { id: 'ai-health', name: 'AI Health Score', icon: '🏥', phase: 2, component: AIHealthScore },
    { id: 'prompt-play', name: 'Prompt Playground', icon: '🎮', phase: 2, component: PromptPlayground },
    { id: 'case-study', name: 'Case Study Builder', icon: '📋', phase: 2, component: CaseStudyBuilder },
    { id: 'ai-quest', name: 'AI Quest Journey', icon: '⚔️', phase: 3, component: AIQuestJourney },
    { id: 'skill-tree', name: 'Skill Tree', icon: '🌳', phase: 3, component: SkillTree },
    { id: 'season-pass', name: 'Season Pass', icon: '🎫', phase: 3, component: SeasonPass },
    { id: 'live-challenges', name: 'Live Challenges', icon: '🏆', phase: 3, component: LiveChallenges },
    { id: 'buddy-match', name: 'AI Buddy Matching', icon: '🤝', phase: 4, component: AIBuddyMatching },
    { id: 'office-hours', name: 'Expert Office Hours', icon: '📅', phase: 4, component: ExpertOfficeHours },
    { id: 'proof-wall', name: 'Proof Wall', icon: '🏆', phase: 4, component: ProofWall },
    { id: 'smart-recs', name: 'Smart Recommendations', icon: '🎯', phase: 4, component: SmartRecommendations },
    { id: 'ai-readiness', name: 'AI Readiness Assessment', icon: '📊', phase: 5, component: AIReadinessAssessment },
    { id: 'roadmap', name: 'Implementation Roadmap', icon: '🗺️', phase: 5, component: ImplementationRoadmap },
    { id: 'news-curator', name: 'AI News Curator', icon: '📰', phase: 5, component: AINewsCurator },
    { id: 'progress-snap', name: 'Progress Snapshot', icon: '📸', phase: 5, component: ProgressSnapshot },
];

const phaseNames: Record<number, string> = {
    1: 'Quick Wins',
    2: 'Calculators & Tools',
    3: 'Gamification',
    4: 'Social & Community',
    5: 'Retention',
};

export default function NewFeaturesPage() {
    const [activeFeature, setActiveFeature] = useState<string | null>(null);
    const [phase, setPhase] = useState<number>(0);

    const filtered = phase === 0 ? features : features.filter(f => f.phase === phase);
    const ActiveComponent = activeFeature ? features.find(f => f.id === activeFeature)?.component : null;

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(180deg, rgba(139,92,246,0.2), transparent)', padding: '60px 20px', textAlign: 'center' }}>
                <h1 style={{ fontSize: 48, fontWeight: 800, background: 'linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>20 New Features</h1>
                <p style={{ fontSize: 20, color: '#9ca3af', marginTop: 16 }}>Новые функции для удержания и конверсии пользователей</p>
            </div>

            {/* Phase Filter */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '0 20px 40px', flexWrap: 'wrap' }}>
                <button onClick={() => { setPhase(0); setActiveFeature(null); }} style={{ background: phase === 0 ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : 'rgba(55,65,81,0.5)', border: 'none', borderRadius: 20, padding: '10px 24px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Все ({features.length})</button>
                {[1, 2, 3, 4, 5].map(p => (
                    <button key={p} onClick={() => { setPhase(p); setActiveFeature(null); }} style={{ background: phase === p ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : 'rgba(55,65,81,0.5)', border: 'none', borderRadius: 20, padding: '10px 24px', color: 'white', cursor: 'pointer' }}>
                        Phase {p}: {phaseNames[p]} ({features.filter(f => f.phase === p).length})
                    </button>
                ))}
            </div>

            {/* Feature Grid */}
            {!activeFeature && (
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
                    {filtered.map(f => (
                        <button key={f.id} onClick={() => setActiveFeature(f.id)} style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid #374151', borderRadius: 16, padding: 24, textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#374151'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>{f.icon}</div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 4 }}>{f.name}</div>
                            <div style={{ fontSize: 12, color: '#6b7280' }}>Phase {f.phase} • {phaseNames[f.phase]}</div>
                        </button>
                    ))}
                </div>
            )}

            {/* Active Feature */}
            {activeFeature && ActiveComponent && (
                <div>
                    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 20px' }}>
                        <button onClick={() => setActiveFeature(null)} style={{ background: 'transparent', border: '1px solid #374151', borderRadius: 12, padding: '10px 20px', color: '#9ca3af', cursor: 'pointer' }}>← Назад к списку</button>
                    </div>
                    <ActiveComponent />
                </div>
            )}

            {/* Floating components */}
            <MysteryBox />
            <AICompanionMascot />
        </div>
    );
}
