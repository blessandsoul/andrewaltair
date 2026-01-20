'use client';

import { motion } from 'framer-motion';
import { TbLock, TbClock, TbChartBar, TbArrowUp, TbExternalLink, TbPlus, TbMinus } from 'react-icons/tb';
import ReactMarkdown from 'react-markdown';
import { Article } from '@/data/aiBasicsContent';
import Link from 'next/link';
import { useState } from 'react';
import PurchaseModal from '@/components/vibe-coding/PurchaseModal';

interface EncyclopediaArticleViewerProps {
    article: Article;
    prevArticle?: Article | null;
    nextArticle?: Article | null;
    sectionSlug: string;
    sectionTitle: string;
    isLocked?: boolean;
    relatedArticles?: Article[];
}

export default function EncyclopediaArticleViewer({
    article,
    prevArticle,
    nextArticle,
    sectionSlug,
    sectionTitle,
    isLocked = false,
    relatedArticles = []
}: EncyclopediaArticleViewerProps) {
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

    // Calculate reading time (approx. 200 words per minute)
    const readingTime = Math.ceil(article.content.split(/\s+/).length / 200);

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <PurchaseModal
                isOpen={isPurchaseModalOpen}
                onClose={() => setIsPurchaseModalOpen(false)}
            />

            {/* Breadcrumb - Clean & Minimal */}
            <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-gray-500 mb-8"
            >
                <Link href="/encyclopedia" className="hover:text-blue-600 transition-colors">
                    ენციკლოპედია
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">{sectionTitle}</span>
            </motion.nav>

            {/* Header Section */}
            <motion.header
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-12"
            >
                <div className="flex flex-wrap gap-4 items-center mb-6">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border border-blue-100">
                        {sectionTitle}
                    </span>
                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5">
                            <TbClock className="w-4 h-4" />
                            {readingTime} წუთი
                        </div>
                        <div className="flex items-center gap-1.5">
                            <TbChartBar className="w-4 h-4" />
                            Beginner
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {article.title}
                </h1>
            </motion.header>

            {/* Main Content Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-gray-100 relative overflow-hidden"
            >
                <div className={`prose prose-lg max-w-none 
                    prose-headings:text-gray-900 prose-headings:font-bold 
                    prose-p:text-gray-600 prose-p:leading-relaxed
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700
                    prose-strong:text-gray-900 prose-strong:font-semibold
                    prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-[''] prose-code:after:content-['']
                    prose-pre:bg-gray-900 prose-pre:text-gray-50 prose-pre:rounded-xl
                    prose-li:text-gray-600
                    prose-img:rounded-2xl prose-img:shadow-md
                    ${isLocked ? 'blur-sm select-none opacity-50' : ''}`}
                >
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>

                {/* Locked Content Overlay */}
                {isLocked && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-white/60 backdrop-blur-[2px]">
                        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center transform hover:scale-[1.02] transition-transform duration-300">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                                <TbLock className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                წვდომა შეზღუდულია
                            </h3>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                ეს სტატია ხელმისაწვდომია მხოლოდ პრემიუმ გამომწერებისთვის. შეიძინეთ წვდომა სრული ბიბლიოთეკის სანახავად.
                            </p>
                            <button
                                onClick={() => setIsPurchaseModalOpen(true)}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-blue-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <span className="text-lg">შეიძინე 49₾ - ად</span>
                                <TbArrowUp className="w-5 h-5 rotate-45" />
                            </button>
                            <p className="text-xs text-gray-400 mt-4">
                                ერთჯერადი გადახდა • მუდმივი წვდომა
                            </p>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Navigation & Interactions */}
            {!isLocked && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {/* Previous Article */}
                    {prevArticle ? (
                        <Link href={`/encyclopedia/${sectionSlug}/${prevArticle.id}`}>
                            <div className="group h-full p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-md hover:shadow-blue-500/5 transition-all text-left">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block group-hover:text-blue-500 transition-colors">
                                    წინა სტატია
                                </span>
                                <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                                    {prevArticle.title}
                                </h4>
                            </div>
                        </Link>
                    ) : <div />}

                    {/* Next Article */}
                    {nextArticle && (
                        <Link href={`/encyclopedia/${sectionSlug}/${nextArticle.id}`}>
                            <div className="group h-full p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-md hover:shadow-blue-500/5 transition-all text-right">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block group-hover:text-blue-500 transition-colors">
                                    შემდეგი სტატია
                                </span>
                                <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                                    {nextArticle.title}
                                </h4>
                            </div>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
