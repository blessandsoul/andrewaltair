'use client';

import { VibeCodingArticleData, ContentSection } from '@/types/vibeCodingArticle';
import HeroIntro from './sections/HeroIntro';
import Timeline from './sections/Timeline';
import StandardSection from './sections/StandardSection';
import ComparisonTable from './sections/ComparisonTable';
import ChecklistSection from './sections/ChecklistSection';
import WarningSection from './sections/WarningSection';
import MythsFacts from './sections/MythsFacts';
import OutroSection from './sections/OutroSection';
import { wrapGlossaryTerms } from './GlossaryTooltip';
import { TbClock, TbChartBar, TbCalendar } from 'react-icons/tb';

interface VibeCodingArticleRendererProps {
    data: VibeCodingArticleData;
}

export default function VibeCodingArticleRenderer({ data }: VibeCodingArticleRendererProps) {
    const { meta, glossary, content } = data;

    // Function to render text with glossary tooltips
    const renderWithGlossary = (text: string) => wrapGlossaryTerms(text, glossary);

    // Render a section based on its type
    const renderSection = (section: ContentSection, index: number) => {
        switch (section.type) {
            case 'section_intro':
                return <HeroIntro key={index} section={section} />;
            case 'timeline':
                return <Timeline key={index} section={section} />;
            case 'section_standard':
                return <StandardSection key={index} section={section} renderWithGlossary={renderWithGlossary} />;
            case 'comparison_table':
                return <ComparisonTable key={index} section={section} />;
            case 'checklist_section':
                return <ChecklistSection key={index} section={section} />;
            case 'warning_section':
                return <WarningSection key={index} section={section} />;
            case 'myths_facts':
                return <MythsFacts key={index} section={section} />;
            case 'section_outro':
                return <OutroSection key={index} section={section} />;
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
        <article className="min-h-screen bg-white text-gray-900">
            {/* Compact Metadata Indicators - Full Width */}
            <div className="w-full bg-gray-50 border-b border-gray-200">
                <div className="px-4 py-2 flex items-center justify-center gap-3 md:gap-6 flex-wrap text-xs md:text-sm">
                    {/* Reading Time */}
                    <span className="flex items-center gap-1.5 text-gray-600">
                        <TbClock className="w-3.5 h-3.5" />
                        {meta.reading_time_minutes} წთ
                    </span>

                    {/* Difficulty Badge */}
                    <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${getDifficultyColor(meta.difficulty)}`}>
                        <TbChartBar className="w-3.5 h-3.5" />
                        {meta.difficulty}
                    </span>

                    {/* Last Updated */}
                    <span className="flex items-center gap-1.5 text-gray-600">
                        <TbCalendar className="w-3.5 h-3.5" />
                        {meta.last_updated}
                    </span>
                </div>
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
