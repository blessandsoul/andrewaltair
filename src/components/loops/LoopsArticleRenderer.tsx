'use client';

import Link from 'next/link';
import { TbClock, TbChartBar, TbArrowLeft, TbArrowRight, TbList } from 'react-icons/tb';
import { ReadingProgress } from '@/components/interactive/ReadingProgress';
import Breadcrumbs from '@/components/encyclopedia/Breadcrumbs';
import { LoopsArticleData, LoopsContentSection } from '@/types/loopsArticle';
import { SectionIntro } from '@/types/article';

import LoopCycleDiagram from './infographics/LoopCycleDiagram';
import LoopInfoCards from './infographics/LoopInfoCards';
import LoopCompare from './infographics/LoopCompare';
import LoopStepFlow from './infographics/LoopStepFlow';
import LoopText from './sections/LoopText';
import LoopCallout from './sections/LoopCallout';
import LoopWarning from './sections/LoopWarning';
import LoopOutro from './sections/LoopOutro';

type NavItem = { id: string; title: string } | null;

interface Props {
    data: LoopsArticleData;
    position: { index: number; total: number };
    prev: NavItem;
    next: NavItem;
}

const DIFFICULTY_KA: Record<string, string> = {
    beginner: 'დამწყები',
    intermediate: 'საშუალო',
    advanced: 'რთული',
};

// Structured course-lesson shell: top progress bar, breadcrumb, "lesson N / M"
// header with the title and a lead, a single readable column of sections, and
// prev / next navigation. Indigo brand, no neon, no full-viewport hero.
export default function LoopsArticleRenderer({ data, position, prev, next }: Props) {
    const { meta, content } = data;
    const intro = content.find((s) => s.type === 'section_intro') as SectionIntro | undefined;
    const bodySections = content.filter((s) => s.type !== 'section_intro');
    const lessonNo = position.index >= 0 ? position.index + 1 : 1;

    const renderSection = (section: LoopsContentSection, i: number) => {
        switch (section.type) {
            case 'loop_cycle':
                return <LoopCycleDiagram key={i} section={section} />;
            case 'loop_cards':
                return <LoopInfoCards key={i} section={section} />;
            case 'loop_compare':
                return <LoopCompare key={i} section={section} />;
            case 'loop_steps':
                return <LoopStepFlow key={i} section={section} />;
            case 'section_standard':
                return <LoopText key={i} section={section} />;
            case 'warning_section':
                return <LoopWarning key={i} section={section} />;
            case 'section_outro':
                return <LoopOutro key={i} section={section} />;
            case 'callout':
            case 'fact':
                return <LoopCallout key={i} content={section.content} />;
            default:
                if (section.type !== 'section_intro') {
                    console.warn('Unknown loops section type:', (section as LoopsContentSection).type);
                }
                return null;
        }
    };

    return (
        <>
            <ReadingProgress color="from-indigo-500 via-violet-500 to-indigo-500" />

            <div className="px-4 lg:px-8 py-8 lg:py-12 max-w-3xl mx-auto">
                <Breadcrumbs
                    items={[
                        { label: 'ენციკლოპედია', href: '/encyclopedia' },
                        { label: 'ციკლები', href: '/encyclopedia/loops' },
                        { label: meta.title },
                    ]}
                />

                {/* Lesson header */}
                <header className="mb-10">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
                            გაკვეთილი {lessonNo} / {position.total}
                        </span>
                        <span className="flex items-center gap-1.5" aria-hidden>
                            {Array.from({ length: position.total }).map((_, i) => (
                                <span
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${i < lessonNo ? 'bg-indigo-500' : 'bg-indigo-200'}`}
                                />
                            ))}
                        </span>
                        {meta.reading_time_minutes && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                <TbClock className="w-4 h-4" /> {meta.reading_time_minutes} წთ
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600">
                            <TbChartBar className="w-3.5 h-3.5" /> {DIFFICULTY_KA[meta.difficulty.toLowerCase()] || meta.difficulty}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5">{meta.title}</h1>

                    {intro?.body && (
                        <div className="space-y-3 text-lg text-gray-600 leading-relaxed">
                            {intro.body.split('\n\n').map((p, i) => (
                                <p key={i}>{p.trim()}</p>
                            ))}
                        </div>
                    )}
                </header>

                {/* Lesson body */}
                <div className="space-y-12">
                    {bodySections.map((section, i) => renderSection(section, i))}
                </div>

                {/* Back to library */}
                <div className="mt-12">
                    <Link
                        href="/encyclopedia/loops/library"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                        <TbList className="w-4 h-4" /> ყველა გაკვეთილი
                    </Link>
                </div>

                {/* Prev / Next */}
                <nav className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                    {prev ? (
                        <Link
                            href={`/encyclopedia/loops/${prev.id}`}
                            className="group h-full p-5 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all"
                        >
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 group-hover:text-indigo-600 transition-colors">
                                <TbArrowLeft className="w-3.5 h-3.5" /> წინა გაკვეთილი
                            </span>
                            <h4 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-2">{prev.title}</h4>
                        </Link>
                    ) : (
                        <div />
                    )}
                    {next && (
                        <Link
                            href={`/encyclopedia/loops/${next.id}`}
                            className="group h-full p-5 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all md:text-right"
                        >
                            <span className="flex items-center gap-1.5 md:justify-end text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 group-hover:text-indigo-600 transition-colors">
                                შემდეგი გაკვეთილი <TbArrowRight className="w-3.5 h-3.5" />
                            </span>
                            <h4 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-2">{next.title}</h4>
                        </Link>
                    )}
                </nav>

                {/* Tags */}
                <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                    {meta.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </>
    );
}
