'use client';

import { LoopsArticleData, LoopsContentSection } from '@/types/loopsArticle';
import HeroIntro from '@/components/vibe-coding/sections/HeroIntro';
import StandardSection from '@/components/vibe-coding/sections/StandardSection';
import WarningSection from '@/components/vibe-coding/sections/WarningSection';
import OutroSection from '@/components/vibe-coding/sections/OutroSection';
import ChecklistSection from '@/components/vibe-coding/sections/ChecklistSection';
import ResourcesSection from '@/components/vibe-coding/sections/ResourcesSection';
import { wrapGlossaryTerms } from '@/components/vibe-coding/GlossaryTooltip';
import { TbClock, TbChartBar, TbCalendar } from 'react-icons/tb';

import LoopCycleDiagram from './infographics/LoopCycleDiagram';
import LoopInfoCards from './infographics/LoopInfoCards';
import LoopCompare from './infographics/LoopCompare';
import LoopStepFlow from './infographics/LoopStepFlow';

// Mirrors encyclopedia/ArticleRenderer: standard sections delegate to the shared
// vibe-coding/sections components; the 4 loop_* infographic types are ours.
// The shared ArticleRenderer is left untouched so vibe-coding / ai-2026 keep working.
export default function LoopsArticleRenderer({ data }: { data: LoopsArticleData }) {
    const { meta, glossary, content } = data;
    const renderWithGlossary = (text: string) => wrapGlossaryTerms(text, glossary || {});

    const renderSection = (section: LoopsContentSection, index: number) => {
        switch (section.type) {
            // our infographics
            case 'loop_cycle':
                return <LoopCycleDiagram key={index} section={section} />;
            case 'loop_cards':
                return <LoopInfoCards key={index} section={section} />;
            case 'loop_compare':
                return <LoopCompare key={index} section={section} />;
            case 'loop_steps':
                return <LoopStepFlow key={index} section={section} />;

            // standard sections (reused as-is)
            case 'section_intro':
                // @ts-ignore - compatible shape, separate type import
                return <HeroIntro key={index} section={section} />;
            case 'section_standard':
                // @ts-ignore
                return <StandardSection key={index} section={section} renderWithGlossary={renderWithGlossary} />;
            case 'warning_section':
                // @ts-ignore
                return <WarningSection key={index} section={section} />;
            case 'checklist_section':
                // @ts-ignore
                return <ChecklistSection key={index} section={section} />;
            case 'section_outro':
                // @ts-ignore
                return <OutroSection key={index} section={section} />;
            case 'resources':
                // @ts-ignore
                return <ResourcesSection key={index} section={section} />;
            case 'callout':
                // @ts-ignore - reuse warning visual for a generic callout
                return <WarningSection key={index} section={{ type: 'warning_section', heading: 'მთავარი იდეა', body: '', warnings: [{ title: section.variant || 'Info', desc: section.content }] }} />;

            default:
                console.warn('Unknown loops section type:', (section as LoopsContentSection).type);
                return null;
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'beginner':
                return 'text-green-700 bg-green-50 border-green-200';
            case 'intermediate':
                return 'text-indigo-700 bg-indigo-50 border-indigo-200';
            case 'advanced':
                return 'text-red-700 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <article className="min-h-screen bg-white text-gray-900 overflow-x-hidden w-full max-w-[100vw]">
            {/* Compact metadata bar */}
            <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center justify-center gap-3 md:gap-6 flex-wrap text-xs md:text-sm">
                {meta.reading_time_minutes && (
                    <span className="flex items-center gap-1.5 text-gray-600">
                        <TbClock className="w-3.5 h-3.5" />
                        {meta.reading_time_minutes} წთ
                    </span>
                )}
                <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${getDifficultyColor(meta.difficulty)}`}>
                    <TbChartBar className="w-3.5 h-3.5" />
                    {meta.difficulty}
                </span>
                {meta.last_updated && (
                    <span className="flex items-center gap-1.5 text-gray-600">
                        <TbCalendar className="w-3.5 h-3.5" />
                        {meta.last_updated}
                    </span>
                )}
            </div>

            {/* Sections */}
            <div>
                {content.map((section, index) => renderSection(section, index))}
            </div>

            {/* Tags */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex flex-wrap gap-2">
                    {meta.tags.map((tag, idx) => (
                        <span key={idx}
                            className="px-3 py-1 text-sm rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
        </article>
    );
}
