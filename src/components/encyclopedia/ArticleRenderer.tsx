'use client';

import { ArticleData, ContentSection } from '@/types/article';
import HeroIntro from '@/components/vibe-coding/sections/HeroIntro';
import Timeline from '@/components/vibe-coding/sections/Timeline';
import StandardSection from '@/components/vibe-coding/sections/StandardSection';
import ComparisonTable from '@/components/vibe-coding/sections/ComparisonTable';
import ChecklistSection from '@/components/vibe-coding/sections/ChecklistSection';
import WarningSection from '@/components/vibe-coding/sections/WarningSection';
import MythsFacts from '@/components/vibe-coding/sections/MythsFacts';
import OutroSection from '@/components/vibe-coding/sections/OutroSection';
import { wrapGlossaryTerms } from '@/components/vibe-coding/GlossaryTooltip';
import { TbClock, TbChartBar, TbCalendar } from 'react-icons/tb';

interface ArticleRendererProps {
    data: ArticleData;
}

export default function ArticleRenderer({ data }: ArticleRendererProps) {
    const { meta, glossary, content } = data;

    const renderWithGlossary = (text: string) => wrapGlossaryTerms(text, glossary);

    const renderSection = (section: ContentSection, index: number) => {
        switch (section.type) {
            case 'section_intro':
                // @ts-ignore - types are compatible but imports are different
                return <HeroIntro key={index} section={section} />;
            case 'timeline':
                // @ts-ignore
                return <Timeline key={index} section={section} />;
            case 'section_standard':
                // @ts-ignore
                return <StandardSection key={index} section={section} renderWithGlossary={renderWithGlossary} />;
            case 'comparison_table':
                // @ts-ignore
                return <ComparisonTable key={index} section={section} />;
            case 'checklist_section':
                // @ts-ignore
                return <ChecklistSection key={index} section={section} />;
            case 'warning_section':
                // @ts-ignore
                return <WarningSection key={index} section={section} />;
            case 'myths_facts':
                // @ts-ignore
                return <MythsFacts key={index} section={section} />;
            case 'section_outro':
                // @ts-ignore
                return <OutroSection key={index} section={section} />;
            // New types
            // New types
            case 'intro':
                // @ts-ignore
                return <HeroIntro key={index} section={{ type: 'section_intro', heading: 'შესავალი', body: section.content }} />;
            case 'section':
                // @ts-ignore
                return <StandardSection key={index} section={{ type: 'section_standard', heading: '', body: section.content }} renderWithGlossary={renderWithGlossary} />;
            case 'callout':
                // @ts-ignore
                return <WarningSection key={index} section={{ type: 'warning_section', heading: 'ყურადღება', warnings: [{ title: section.variant || 'Info', desc: section.content }] }} />;
            case 'fact':
                // @ts-ignore
                return <WarningSection key={index} section={{ type: 'warning_section', heading: 'ფაქტი', warnings: [{ title: 'ფაქტი', desc: section.content }] }} />;
            case 'quiz':
                // @ts-ignore
                return <QuizSection key={index} section={section} />;
            case 'resources':
                // @ts-ignore
                return <ResourcesSection key={index} section={section} />;

            default:
                console.warn('Unknown section type:', (section as ContentSection).type);
                return null;
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'beginner':
                return 'text-green-700 bg-green-50 border-green-200';
            case 'intermediate':
                return 'text-orange-700 bg-orange-50 border-orange-200';
            case 'advanced':
                return 'text-red-700 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <article className="min-h-screen bg-white text-gray-900 overflow-x-hidden w-full max-w-[100vw]">
            {/* Compact Metadata Indicators - Full Width */}
            <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center justify-center gap-3 md:gap-6 flex-wrap text-xs md:text-sm">
                <span className="flex items-center gap-1.5 text-gray-600">
                    <TbClock className="w-3.5 h-3.5" />
                    {meta.reading_time_minutes} წთ
                </span>
                <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${getDifficultyColor(meta.difficulty)}`}>
                    <TbChartBar className="w-3.5 h-3.5" />
                    {meta.difficulty}
                </span>
                <span className="flex items-center gap-1.5 text-gray-600">
                    <TbCalendar className="w-3.5 h-3.5" />
                    {meta.last_updated}
                </span>
            </div>

            {/* Content Sections */}
            <div>
                {content.map((section, index) => renderSection(section, index))}
            </div>

            {/* Tags */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex flex-wrap gap-2">
                    {meta.tags.map((tag, idx) => (
                        <span
                            key={idx}
                            className="px-3 py-1 text-sm rounded-full bg-purple-50 text-purple-700 border border-purple-200"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Footer Gradient */}
            <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
        </article>
    );
}
