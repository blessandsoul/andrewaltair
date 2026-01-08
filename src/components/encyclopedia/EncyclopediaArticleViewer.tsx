'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { TbChevronLeft, TbChevronRight, TbLock, TbBrandTelegram, TbClock, TbEye, TbUser, TbCalendar } from 'react-icons/tb';
import { useState, useEffect } from 'react';
import PurchaseModal from '@/components/vibe-coding/PurchaseModal';
import Breadcrumbs from '@/components/encyclopedia/Breadcrumbs';
import TableOfContents from '@/components/encyclopedia/TableOfContents';
import ShareButtons from '@/components/encyclopedia/ShareButtons';
import ArticleActions from '@/components/encyclopedia/ArticleActions';
import { ScrollProgressIndicator, useReadingProgress } from '@/components/encyclopedia/ReadingProgress';
import { Comments } from '@/components/interactive/Comments';

interface Article {
    id: string;
    title: string;
    content: string;
    isFree: boolean;
}

interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
}

interface EncyclopediaArticleViewerProps {
    article: Article;
    prevArticle: Article | null;
    nextArticle: Article | null;
    sectionSlug: string;
    sectionTitle: string;
    isLocked?: boolean;
    quiz?: QuizQuestion[];
    relatedArticles?: Article[];
}

// Section name mapping
const sectionNames: Record<string, string> = {
    'prompt-engineering': 'Prompt Engineering',
    'ai-monetization': 'AI მონეტიზაცია',
    'ai-automation': 'AI ავტომატიზაცია',
    'ai-tools': 'AI ინსტრუმენტები',
    'ai-career': 'AI კარიერა',
    'ai-ethics': 'AI ეთიკა',
    'vibe-coding': 'Vibe Coding'
};

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
    const { markAsRead, isRead } = useReadingProgress(sectionSlug);
    const [readingTime, setReadingTime] = useState(0);

    // Calculate reading time and mark as read
    useEffect(() => {
        const words = article.content.split(/\s+/).length;
        setReadingTime(Math.ceil(words / 200)); // 200 words per minute

        // Mark as read after 30 seconds on page
        const timer = setTimeout(() => {
            if (!isLocked) {
                markAsRead(article.id);
            }
        }, 30000);

        return () => clearTimeout(timer);
    }, [article, isLocked, markAsRead]);

    const displaySectionTitle = sectionTitle || sectionNames[sectionSlug] || sectionSlug;

    if (isLocked) {
        return (
            <div className="max-w-3xl mx-auto">
                <ScrollProgressIndicator />

                <Breadcrumbs items={[
                    { label: 'ენციკლოპედია', href: '/encyclopedia' },
                    { label: displaySectionTitle, href: `/encyclopedia/${sectionSlug}/library` },
                    { label: article.title }
                ]} />

                <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">{article.title}</h1>

                <div className="relative">
                    <div className="blur-sm select-none pointer-events-none opacity-50">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {article.content.substring(0, 500) + '...'}
                        </ReactMarkdown>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background via-background/80 to-transparent">
                        <div className="text-center p-8 rounded-2xl bg-background/95 backdrop-blur-sm border border-border shadow-2xl max-w-md">
                            <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-4">
                                <TbLock size={32} className="text-orange-500" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">პრემიუმ კონტენტი</h3>
                            <p className="text-muted-foreground mb-6">
                                ეს სტატია ხელმისაწვდომია მხოლოდ პრემიუმ წევრებისთვის
                            </p>
                            <button
                                onClick={() => setIsPurchaseModalOpen(true)}
                                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2"
                            >
                                <TbBrandTelegram size={20} />
                                მიიღე წვდომა
                            </button>
                        </div>
                    </div>
                </div>

                <PurchaseModal
                    isOpen={isPurchaseModalOpen}
                    onClose={() => setIsPurchaseModalOpen(false)}
                    prefillMessage={`Premium Access Request - ${article.title}`}
                />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <ScrollProgressIndicator />

            {/* Breadcrumbs */}
            <Breadcrumbs items={[
                { label: 'ენციკლოპედია', href: '/encyclopedia' },
                { label: displaySectionTitle, href: `/encyclopedia/${sectionSlug}/library` },
                { label: article.title }
            ]} />

            {/* Article Header */}
            <header className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">{article.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1.5">
                        <TbClock size={16} />
                        {readingTime} წთ კითხვა
                    </span>
                    {isRead(article.id) && (
                        <span className="flex items-center gap-1.5 text-green-600">
                            <TbEye size={16} />
                            წაკითხული
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
                    <ArticleActions articleId={article.id} sectionSlug={sectionSlug} />
                    <ShareButtons title={article.title} />
                </div>
            </header>

            {/* Table of Contents */}
            <TableOfContents content={article.content} />

            {/* Article Content */}
            <article className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ children }) => {
                            const id = String(children).toLowerCase().replace(/[^a-zა-ჰ0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 50);
                            return <h1 id={id} className="text-3xl lg:text-4xl font-bold mb-6 text-foreground scroll-mt-24">{children}</h1>;
                        },
                        h2: ({ children }) => {
                            const id = String(children).toLowerCase().replace(/[^a-zა-ჰ0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 50);
                            return <h2 id={id} className="text-2xl font-bold mt-10 mb-4 text-foreground border-b border-border pb-2 scroll-mt-24">{children}</h2>;
                        },
                        h3: ({ children }) => {
                            const id = String(children).toLowerCase().replace(/[^a-zა-ჰ0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 50);
                            return <h3 id={id} className="text-xl font-semibold mt-6 mb-3 text-foreground scroll-mt-24">{children}</h3>;
                        },
                        p: ({ children }) => (
                            <p className="text-foreground/80 leading-relaxed mb-4">{children}</p>
                        ),
                        ul: ({ children }) => (
                            <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
                        ),
                        ol: ({ children }) => (
                            <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
                        ),
                        li: ({ children }) => (
                            <li className="text-foreground/80">{children}</li>
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-purple-500 pl-4 italic text-foreground/70 my-6 bg-purple-50 dark:bg-purple-900/10 py-4 rounded-r-lg">{children}</blockquote>
                        ),
                        code: ({ className, children }) => {
                            const isBlock = className?.includes('language-');
                            if (isBlock) {
                                return (
                                    <pre className="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 overflow-x-auto my-4">
                                        <code className="text-sm text-gray-100">{children}</code>
                                    </pre>
                                );
                            }
                            return <code className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>;
                        },
                        table: ({ children }) => (
                            <div className="overflow-x-auto my-6 rounded-lg border border-border">
                                <table className="w-full border-collapse">{children}</table>
                            </div>
                        ),
                        th: ({ children }) => (
                            <th className="border-b border-border bg-secondary px-4 py-3 text-left font-semibold">{children}</th>
                        ),
                        td: ({ children }) => (
                            <td className="border-b border-border px-4 py-3">{children}</td>
                        ),
                        a: ({ href, children }) => (
                            <a href={href} className="text-purple-600 hover:text-purple-700 underline decoration-purple-300 underline-offset-2" target="_blank" rel="noopener noreferrer">
                                {children}
                            </a>
                        ),
                        hr: () => <hr className="my-8 border-border" />,
                        strong: ({ children }) => (
                            <strong className="font-bold text-foreground">{children}</strong>
                        ),
                    }}
                >
                    {article.content}
                </ReactMarkdown>
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <div className="mt-12 p-6 rounded-2xl bg-secondary/30 border border-border">
                    <h3 className="text-lg font-semibold mb-4">დაკავშირებული სტატიები</h3>
                    <div className="grid gap-3">
                        {relatedArticles.map((related) => (
                            <Link
                                key={related.id}
                                href={`/encyclopedia/${sectionSlug}/${related.id}`}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors"
                            >
                                <span className="font-medium">{related.title}</span>
                                <TbChevronRight size={18} className="text-muted-foreground" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
                {prevArticle ? (
                    <Link
                        href={`/encyclopedia/${sectionSlug}/${prevArticle.id}`}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-secondary transition-colors group"
                    >
                        <TbChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <div className="text-left">
                            <p className="text-xs text-muted-foreground">წინა</p>
                            <p className="text-sm font-medium truncate max-w-[150px]">{prevArticle.title}</p>
                        </div>
                    </Link>
                ) : <div />}

                {nextArticle ? (
                    <Link
                        href={`/encyclopedia/${sectionSlug}/${nextArticle.id}`}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-secondary transition-colors group"
                    >
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">შემდეგი</p>
                            <p className="text-sm font-medium truncate max-w-[150px]">{nextArticle.title}</p>
                        </div>
                        <TbChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                ) : <div />}
            </div>

            {/* Comments Section */}
            <div className="mt-12">
                <Comments
                    postId={`encyclopedia-${sectionSlug}-${article.id}`}
                    postTitle={article.title}
                />
            </div>
        </div>
    );
}
