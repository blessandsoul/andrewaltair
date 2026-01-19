'use client';

import { AI2026ArticleData, AI2026ContentSection } from '@/types/ai2026Article';
import IntroSection from './sections/IntroSection';
import ContentSection from './sections/ContentSection';
import CalloutBlock from './sections/CalloutBlock';
import QuizSection from './sections/QuizSection';
import ResourcesSection from './sections/ResourcesSection';
import FactClosing from './sections/FactClosing';
import FAQAccordion from './sections/FAQAccordion';
import { TbClock, TbChartBar, TbCalendar, TbArrowUp } from 'react-icons/tb';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface AI2026ArticleRendererProps {
    data: AI2026ArticleData;
    prev?: { slug: string; title: string } | null;
    next?: { slug: string; title: string } | null;
}

export default function AI2026ArticleRenderer({ data, prev, next }: AI2026ArticleRendererProps) {
    const { meta, seo, content } = data;
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);

    // Handle scroll events
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            setReadingProgress(progress);
            setShowBackToTop(scrollTop > 500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Get difficulty color
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'beginner':
                return 'text-green-400 bg-green-400/10 border-green-400/30';
            case 'intermediate':
                return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
            case 'advanced':
                return 'text-red-500 bg-red-50 border-red-200';
            default:
                return 'text-gray-500 bg-gray-50 border-gray-200';
        }
    };

    // Render section based on type
    const renderSection = (section: AI2026ContentSection, index: number) => {
        switch (section.type) {
            case 'intro':
                return <IntroSection key={index} section={section} />;
            case 'section':
                return <ContentSection key={index} section={section} />;
            case 'callout':
                return <CalloutBlock key={index} section={section} />;
            case 'quiz':
                return <QuizSection key={index} section={section} />;
            case 'resources':
                return <ResourcesSection key={index} section={section} />;
            case 'fact':
                return <FactClosing key={index} section={section} />;
            default:
                console.warn('Unknown section type:', (section as AI2026ContentSection).type);
                return null;
        }
    };

    return (
        <article className="min-h-screen bg-white text-gray-900">
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-black/50">
                <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                    style={{ width: `${readingProgress}%` }}
                />
            </div>

            {/* Metadata Bar */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-1 z-40 backdrop-blur-md bg-[#0a0a0f]/80 border-b border-white/5"
            >
                <div className="max-w-5xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
                    {/* Reading Time */}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <TbClock className="w-4 h-4 text-[#ff2d2d]" />
                        <span>{meta.reading_time}</span>
                    </div>

                    {/* Difficulty Badge */}
                    <div className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full border ${getDifficultyColor(meta.difficulty)}`}>
                        <TbChartBar className="w-4 h-4" />
                        <span>{meta.difficulty}</span>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-2 text-sm text-[#ffd700]">
                        <span className="font-semibold">{meta.author.name}</span>
                        <span className="text-gray-500">|</span>
                        <span className="text-gray-400">{meta.author.role}</span>
                    </div>
                </div>
            </motion.div>

            {/* Hero Title */}
            <motion.header
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative py-16 px-4 md:px-8 overflow-hidden bg-gray-50 border-b border-gray-200"
            >
                <div className="relative max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-full">
                            {meta.category}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
                    >
                        {meta.title}
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
                    >
                        {seo.excerpt}
                    </motion.p>

                    {/* Tags */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap justify-center gap-2 mt-8"
                    >
                        {meta.tags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 text-sm rounded-full bg-white text-gray-600 border border-gray-200 shadow-sm"
                            >
                                #{tag}
                            </span>
                        ))}
                    </motion.div>
                </div>
            </motion.header>

            {/* Content Sections */}
            <div className="divide-y divide-gray-100">
                {content.map((section, index) => renderSection(section, index))}
            </div>

            {/* FAQ Section */}
            {seo.faq && seo.faq.length > 0 && (
                <FAQAccordion items={seo.faq} />
            )}

            {/* Footer Divider */}
            <div className="h-px bg-gray-200" />

            {/* Key Points Footer */}
            <footer className="py-12 px-4 md:px-8 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                        📌 ძირითადი პუნქტები
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {seo.key_points.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-600">
                                <span className="text-blue-500 mt-1">▸</span>
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>
            </footer>

            {/* Navigation Links */}
            {(prev || next) && (
                <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 flex justify-between gap-4">
                    {prev ? (
                        <a href={`/encyclopedia/ai-basics/${prev.slug}`} className="flex-1 p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group text-left">
                            <span className="block text-gray-500 text-sm mb-2 group-hover:text-[#ffd700] transition-colors">← წინა</span>
                            <span className="text-lg font-semibold text-white group-hover:text-[#ffd700] transition-colors">{prev.title}</span>
                        </a>
                    ) : <div className="flex-1" />}

                    {next && (
                        <a href={`/encyclopedia/ai-basics/${next.slug}`} className="flex-1 p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group text-right">
                            <span className="block text-gray-500 text-sm mb-2 group-hover:text-[#ffd700] transition-colors">შემდეგი →</span>
                            <span className="text-lg font-semibold text-white group-hover:text-[#ffd700] transition-colors">{next.title}</span>
                        </a>
                    )}
                </div>
            )}

            {/* Back to Top Button */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-[#ff2d2d] text-white flex items-center justify-center shadow-lg hover:bg-[#ff4040] transition-colors"
                    >
                        <TbArrowUp className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>
        </article>
    );
}
