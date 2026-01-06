'use client';

import React, { useState } from 'react';
import {
    MysteryBox,
    LimitedTimeDeals,
    MicroLessons,
    AIQuestJourney,
    SkillTree,
    ProgressSnapshot,
    SavingsCalculator,
    PromptPlayground,
    AIHealthScore,
    CaseStudyBuilder,
    SeasonPass,
    LiveChallenges,
    AIBuddyMatching,
    ExpertOfficeHours,
    ProofWall,
    SmartRecommendations,
    AINewsCurator,
    ImplementationRoadmap,
    AIReadinessAssessment,
    AICompanionMascot,
} from '@/components/conversion';

const COMPONENTS = [
    { id: 'mystery-box', name: 'Mystery TbBox', Component: MysteryBox },
    { id: 'deals', name: 'Limited Time Deals', Component: LimitedTimeDeals },
    { id: 'lessons', name: 'Micro Lessons', Component: MicroLessons },
    { id: 'quests', name: 'AI Quest Journey', Component: AIQuestJourney },
    { id: 'skills', name: 'Skill Tree', Component: SkillTree },
    { id: 'snapshot', name: 'Progress Snapshot', Component: ProgressSnapshot },
    { id: 'calculator', name: 'Savings TbCalculator', Component: SavingsCalculator },
    { id: 'playground', name: 'Prompt Playground', Component: PromptPlayground },
    { id: 'health', name: 'AI Health Score', Component: AIHealthScore },
    { id: 'casestudy', name: 'Case Study Builder', Component: CaseStudyBuilder },
    { id: 'season', name: 'Season Pass', Component: SeasonPass },
    { id: 'challenges', name: 'Live Challenges', Component: LiveChallenges },
    { id: 'buddy', name: 'AI Buddy Matching', Component: AIBuddyMatching },
    { id: 'office', name: 'Expert Office Hours', Component: ExpertOfficeHours },
    { id: 'proof', name: 'Proof Wall', Component: ProofWall },
    { id: 'recommendations', name: 'Smart Recommendations', Component: SmartRecommendations },
    { id: 'news', name: 'AI News Curator', Component: AINewsCurator },
    { id: 'roadmap', name: 'Implementation Roadmap', Component: ImplementationRoadmap },
    { id: 'readiness', name: 'AI Readiness Assessment', Component: AIReadinessAssessment },
];

export default function NewFeaturesPage() {
    const [activeComponent, setActiveComponent] = useState(COMPONENTS[0].id);
    const ActiveComp = COMPONENTS.find(c => c.id === activeComponent)?.Component || MysteryBox;

    return (
        <div className="min-h-screen bg-[#0a0a12] text-white pt-24 pb-12">
            {/* Floating Mascot */}
            <AICompanionMascot />

            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 mb-4">
                        ახალი ფუნქციები
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        20 კონვერსიის კომპონენტი - გეიმიფიკაცია, სწავლება, და ჩართულობა
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-64 shrink-0">
                        <div className="sticky top-24 space-y-1 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
                            {COMPONENTS.map(comp => (
                                <button
                                    key={comp.id}
                                    onClick={() => setActiveComponent(comp.id)}
                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${activeComponent === comp.id
                                            ? 'bg-purple-600 text-white font-medium'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {comp.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                            <ActiveComp />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
