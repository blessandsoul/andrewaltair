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

// Universal Sections Imports
import { HeroModernComponent, TextColumnsComponent, HighlightBoxComponent, QuoteMinimalComponent, AuthorBioInlineComponent } from '../universal/UniversalText';
import { StatGridComponent, ComparisonTableProComponent, ProsConsCardsComponent, TimelineVerticalComponent, ProcessStepsComponent } from '../universal/UniversalData';
import { GalleryMasonryComponent, ImageSliderComponent, VideoEmbedCustomComponent, AudioPodcastComponent, CodeTerminalComponent } from '../universal/UniversalMedia';
import { FAQAccordionComponent, CTABannerWideComponent, ProductCardMiniComponent, QuizWidgetComponent, DownloadBoxComponent } from '../universal/UniversalInteraction';

interface VibeCodingArticleRendererProps {
    data: VibeCodingArticleData;
}

export default function VibeCodingArticleRenderer({ data }: VibeCodingArticleRendererProps) {
    const { meta, glossary, content } = data;

    const renderWithGlossary = (text: string) => wrapGlossaryTerms(text, glossary);

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

            // Universal Sections (2026 Design System)
            case 'hero_modern': return <HeroModernComponent key={index} data={section} />;
            case 'text_columns': return <TextColumnsComponent key={index} data={section} />;
            case 'highlight_box': return <HighlightBoxComponent key={index} data={section} />;
            case 'quote_minimal': return <QuoteMinimalComponent key={index} data={section} />;
            case 'author_bio_inline': return <AuthorBioInlineComponent key={index} data={section} />;

            case 'stat_grid': return <StatGridComponent key={index} data={section} />;
            case 'comparison_table_pro': return <ComparisonTableProComponent key={index} data={section} />;
            case 'pros_cons_cards': return <ProsConsCardsComponent key={index} data={section} />;
            case 'timeline_vertical': return <TimelineVerticalComponent key={index} data={section} />;
            case 'process_steps': return <ProcessStepsComponent key={index} data={section} />;

            case 'gallery_masonry': return <GalleryMasonryComponent key={index} data={section} />;
            case 'image_slider': return <ImageSliderComponent key={index} data={section} />;
            case 'video_embed_custom': return <VideoEmbedCustomComponent key={index} data={section} />;
            case 'audio_podcast': return <AudioPodcastComponent key={index} data={section} />;
            case 'code_terminal': return <CodeTerminalComponent key={index} data={section} />;

            case 'faq_accordion': return <FAQAccordionComponent key={index} data={section} />;
            case 'cta_banner_wide': return <CTABannerWideComponent key={index} data={section} />;
            case 'product_card_mini': return <ProductCardMiniComponent key={index} data={section} />;
            case 'quiz_widget': return <QuizWidgetComponent key={index} data={section} />;
            case 'download_box': return <DownloadBoxComponent key={index} data={section} />;

            default:
                console.warn('Unknown section type:', (section as any).type);
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
