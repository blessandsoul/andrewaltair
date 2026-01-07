'use client';

import { motion } from 'framer-motion';
import {
    TbLock,
    TbRocket,
    TbChevronLeft,
    TbChevronRight
} from 'react-icons/tb';
import ReactMarkdown from 'react-markdown';
import { Article } from '@/data/vibeCodingContent';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PurchaseModal from './PurchaseModal';

interface VibeArticleViewerProps {
    article: Article;
    prevArticle?: Article | null;
    nextArticle?: Article | null;
    isLocked: boolean;
    onUnlock: () => void;
}

export default function VibeArticleViewer({
    article,
    prevArticle,
    nextArticle,
    isLocked,
    onUnlock
}: VibeArticleViewerProps) {
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const lines = article.content.split('\n');
    const previewLines = Math.floor(lines.length * 0.15);
    const visibleContent = isLocked ? lines.slice(0, previewLines).join('\n') : article.content;

    // Prevent content extraction via DevTools when locked
    useEffect(() => {
        if (isLocked) {
            const handleContextMenu = (e: MouseEvent) => {
                if ((e.target as HTMLElement).closest('.article-content')) {
                    e.preventDefault();
                }
            };
            const handleSelectStart = (e: Event) => {
                if ((e.target as HTMLElement).closest('.article-content') && isLocked) {
                    e.preventDefault();
                }
            };
            document.addEventListener('contextmenu', handleContextMenu);
            document.addEventListener('selectstart', handleSelectStart);
            return () => {
                document.removeEventListener('contextmenu', handleContextMenu);
                document.removeEventListener('selectstart', handleSelectStart);
            };
        }
    }, [isLocked]);

    return (
        <div className="w-full max-w-4xl mx-auto pb-20">
            <style jsx global>{`
                .article-content {
                    color: #374151;
                    font-size: 1rem;
                    line-height: 1.8;
                    user-select: ${isLocked ? 'none' : 'text'};
                    -webkit-user-select: ${isLocked ? 'none' : 'text'};
                }
                .dark .article-content {
                    color: #d1d5db;
                }
                .article-content h1 {
                    font-size: 2.25rem;
                    font-weight: 800;
                    color: #111827;
                    margin-top: 0;
                    margin-bottom: 2rem;
                    line-height: 1.2;
                    background: linear-gradient(to right, #7c3aed, #ec4899);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .article-content h2 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #111827;
                    margin-top: 2.5rem;
                    margin-bottom: 1.25rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                }
                .dark .article-content h2 { color: #f3f4f6; border-color: rgba(255,255,255,0.1); }
                .article-content h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #111827;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                }
                .dark .article-content h3 { color: #f3f4f6; }
                .article-content p {
                    margin-bottom: 1.25rem;
                }
                .article-content ul, .article-content ol {
                    margin-bottom: 1.25rem;
                    padding-left: 1.5rem;
                }
                .article-content li {
                   margin-bottom: 0.5rem;
                }
                .article-content code {
                    background: #f3f4f6;
                    padding: 0.2rem 0.4rem;
                    border-radius: 0.25rem;
                    font-size: 0.875rem;
                    font-family: 'JetBrains Mono', monospace;
                    color: #7c3aed;
                }
                .dark .article-content code { background: #1f2937; color: #a78bfa; }
                .article-content pre {
                    background: #1f2937;
                    padding: 1.5rem;
                    border-radius: 0.75rem;
                    overflow-x: auto;
                    margin: 2rem 0;
                    color: #e5e7eb;
                }
                .article-content pre code {
                    background: transparent;
                    padding: 0;
                    color: inherit;
                }
                .article-content blockquote {
                    border-left: 4px solid #7c3aed;
                    padding: 1rem 1.5rem;
                    margin: 2rem 0;
                    background: rgba(124, 58, 237, 0.05);
                    border-radius: 0 0.5rem 0.5rem 0;
                    font-style: italic;
                }
                .dark .article-content blockquote { background: rgba(124, 58, 237, 0.1); }
                .article-content table {
                   width: 100%;
                   border-collapse: collapse;
                   margin: 2rem 0;
                }
                .article-content th {
                   text-align: left;
                   padding: 0.75rem;
                   border-bottom: 2px solid rgba(0,0,0,0.1);
                   color: #7c3aed;
                   font-weight: 600;
                }
                .dark .article-content th { border-color: rgba(255,255,255,0.1); }
                .article-content td {
                   padding: 0.75rem;
                   border-bottom: 1px solid rgba(0,0,0,0.1);
                }
                .dark .article-content td { border-color: rgba(255,255,255,0.1); }
            `}</style>

            <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative bg-white dark:bg-zinc-900 rounded-3xl p-8 lg:p-12 shadow-sm border border-border"
            >
                {/* Visible preview content */}
                <div className="article-content">
                    <ReactMarkdown>{visibleContent}</ReactMarkdown>
                </div>

                {/* Blur overlay for locked content */}
                {isLocked && (
                    <div className="relative -mt-32 z-10">
                        {/* Gradient blur overlay */}
                        <div
                            className="absolute inset-x-0 top-0 h-48 pointer-events-none"
                            style={{
                                background: 'linear-gradient(to bottom, transparent 0%, var(--background, #fff) 100%)',
                                backdropFilter: 'blur(4px)',
                            }}
                        />
                        {/* "Solid" content hider below the gradient */}
                        <div className="h-48 bg-background opacity-90 backdrop-blur-md" />

                        {/* Lock message */}
                        <div className="absolute top-12 left-0 right-0 text-center px-6">
                            <div className="inline-flex items-center justify-center p-4 rounded-full bg-secondary mb-4">
                                <TbLock size={32} className="text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">კითხვის გაგრძელება</h3>
                            <p className="text-muted-foreground mb-6 text-lg">დარჩენილია ექსკლუზიური მასალის 85%</p>
                            <button
                                onClick={() => setIsPurchaseModalOpen(true)}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white font-medium hover:scale-105 transition-transform shadow-lg flex items-center gap-2 mx-auto"
                            >
                                <TbRocket size={20} />
                                სრული წვდომა - 49₾
                            </button>
                        </div>
                    </div>
                )}
            </motion.article>

            <PurchaseModal
                isOpen={isPurchaseModalOpen}
                onClose={() => setIsPurchaseModalOpen(false)}
                prefillMessage={`მსურს წვდომა სტატიაზე: "${article.title}"`}
            />

            {/* Navigation buttons */}
            <div className="flex justify-between items-center gap-4 mt-8">
                {prevArticle ? (
                    <Link
                        href={`/encyclopedia/vibe-coding/${prevArticle.id}`}
                        className="flex items-center gap-2 px-6 py-4 rounded-xl bg-white dark:bg-zinc-900 border border-border hover:bg-secondary transition-colors text-sm group shadow-sm"
                    >
                        <TbChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <div className="text-left">
                            <div className="text-xs text-muted-foreground">წინა სტატია</div>
                            <div className="font-medium truncate max-w-[150px] md:max-w-[200px]">{prevArticle.title}</div>
                        </div>
                    </Link>
                ) : (
                    <div />
                )}

                {nextArticle ? (
                    <Link
                        href={`/encyclopedia/vibe-coding/${nextArticle.id}`}
                        className={`flex items-center justify-end gap-2 px-6 py-4 rounded-xl border border-border transition-colors text-sm group shadow-sm text-right ${nextArticle.isFree
                            ? 'bg-white dark:bg-zinc-900 hover:bg-secondary'
                            : 'bg-primary/5 hover:bg-primary/10 border-primary/20'
                            }`}
                    >
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground">შემდეგი სტატია</div>
                            <div className={`font-medium truncate max-w-[150px] md:max-w-[200px] ${!nextArticle.isFree && 'text-primary'}`}>
                                {nextArticle.title}
                            </div>
                        </div>
                        {nextArticle.isFree ? (
                            <TbChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        ) : (
                            <TbLock size={20} className="text-primary" />
                        )}
                    </Link>
                ) : (
                    <div />
                )}
            </div>
        </div>
    );
}
