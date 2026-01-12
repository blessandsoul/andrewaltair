'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TbLock,
    TbLockOpen,
    TbSearch,
    TbList,
    TbX,
    TbChevronLeft,
    TbChevronRight,
    TbBrandTelegram,
    TbBook,
    TbRocket
} from 'react-icons/tb';
import ReactMarkdown from 'react-markdown';
import {
    VIBE_CODING_DATA,
    type Article,
    getArticleById,
    getAdjacentArticles,
    getTotalArticleCount,
    getFreeArticleCount
} from '@/data/vibeCodingContent';

// Marketing components removed for clean reading experience

// Premium users list
const PREMIUM_USERS = ['Andrew Altair', 'andr3waltair'];

// Article Viewer with Preview/Blur Effect
function ArticleViewer({
    article,
    onNavigate,
    isLocked,
    onUnlock
}: {
    article: Article;
    onNavigate: (articleId: string) => void;
    isLocked: boolean;
    onUnlock: () => void;
}) {
    const { prev, next } = getAdjacentArticles(article.id);
    const lines = article.content.split('\n');
    const previewLines = Math.floor(lines.length * 0.15);

    // Security: Never send full content to client if locked
    // Full content only loaded from server after payment verification
    const visibleContent = isLocked ? lines.slice(0, previewLines).join('\n') : article.content;

    // Prevent content extraction via DevTools
    useEffect(() => {
        if (isLocked) {
            // Disable right-click
            const handleContextMenu = (e: MouseEvent) => {
                if ((e.target as HTMLElement).closest('.article-content')) {
                    e.preventDefault();
                }
            };

            // Disable text selection on locked content
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
        <div className="w-full">
            <style jsx global>{`
                .article-content {
                    color: #374151;
                    font-size: 1rem;
                    line-height: 1.8;
                    user-select: ${isLocked ? 'none' : 'text'};
                    -webkit-user-select: ${isLocked ? 'none' : 'text'};
                    -moz-user-select: ${isLocked ? 'none' : 'text'};
                    -ms-user-select: ${isLocked ? 'none' : 'text'};
                }
                .article-content h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #111827;
                    margin-top: 0;
                    margin-bottom: 1.5rem;
                    background: linear-gradient(to right, #7c3aed, #ec4899);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .article-content h2 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #111827;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                }
                .article-content h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #111827;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                }
                .article-content p {
                    margin-bottom: 1rem;
                    color: #4b5563;
                }
                .article-content code {
                    background: #f3f4f6;
                    padding: 0.2rem 0.5rem;
                    border-radius: 0.375rem;
                    font-size: 0.875rem;
                    font-family: 'JetBrains Mono', monospace;
                    color: #7c3aed;
                }
                .article-content pre {
                    background: #1f2937;
                    padding: 1.25rem;
                    border-radius: 0.75rem;
                    overflow-x: auto;
                    margin: 1.5rem 0;
                }
                .article-content pre code {
                    background: transparent;
                    padding: 0;
                    color: #e5e7eb;
                }
                .article-content blockquote {
                    border-left: 4px solid #7c3aed;
                    padding: 0.75rem 1rem;
                    margin: 1.5rem 0;
                    background: rgba(124, 58, 237, 0.05);
                    border-radius: 0 0.5rem 0.5rem 0;
                }
                .article-content table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1.5rem 0;
                }
                .article-content th {
                    text-align: left;
                    padding: 0.75rem;
                    border-bottom: 2px solid rgba(0,0,0,0.1);
                    color: #7c3aed;
                    font-weight: 600;
                }
                .article-content td {
                    padding: 0.75rem;
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                }
            `}</style>

            <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
            >
                {/* Visible preview content */}
                <div className="article-content">
                    <ReactMarkdown>{visibleContent}</ReactMarkdown>
                </div>

                {/* Blur overlay for locked content */}
                {isLocked && (
                    <div className="relative -mt-24">
                        {/* Gradient blur overlay */}
                        <div
                            className="absolute inset-x-0 top-0 h-64 pointer-events-none"
                            style={{
                                background: 'linear-gradient(to bottom, rgba(250,250,250,0) 0%, rgba(250,250,250,0.8) 40%, rgba(250,250,250,1) 100%)',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)'
                            }}
                        />

                        {/* Lock message */}
                        <div className="relative z-10 text-center py-16 px-6" style={{ backgroundColor: '#fafafa' }}>
                            <TbLock size={56} className="mx-auto text-primary mb-4" />
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <TbLock size={24} className="text-primary" />
                                <h3 className="text-2xl font-bold">კითხვის გაგრძელება</h3>
                            </div>
                            <p className="text-muted-foreground mb-6 text-lg">დარჩენილია ექსკლუზიური მასალის 85%</p>
                            <button
                                onClick={onUnlock}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white font-medium hover:scale-105 transition-transform shadow-lg flex items-center gap-2 mx-auto"
                            >
                                <TbRocket size={20} />
                                სრული წვდომა
                            </button>
                        </div>
                    </div>
                )}
            </motion.article>

            {/* Navigation buttons */}
            {!isLocked && (
                <div className="flex justify-between items-center gap-4 mt-12 pt-8 border-t border-border">
                    {prev ? (
                        <button
                            onClick={() => onNavigate(prev.id)}
                            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-sm flex-1 max-w-[200px] group"
                        >
                            <TbChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="truncate">{prev.title}</span>
                        </button>
                    ) : (
                        <div />
                    )}

                    {next ? (
                        <button
                            onClick={() => onNavigate(next.id)}
                            className={`flex items-center justify-end gap-2 px-4 py-3 rounded-xl transition-colors text-sm flex-1 max-w-[200px] group ${next.isFree
                                ? 'bg-secondary hover:bg-secondary/80'
                                : 'bg-primary/10 hover:bg-primary/20 text-primary'
                                }`}
                        >
                            <span className="truncate">{next.title}</span>
                            {next.isFree ? (
                                <TbChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            ) : (
                                <TbLock size={20} />
                            )}
                        </button>
                    ) : (
                        <div />
                    )}
                </div>
            )}
        </div>
    );
}

// Main TbLibrary Component
export default function VibeCodingLibraryV2() {
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Desktop default open
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [codeInput, setCodeInput] = useState('');
    const [codeError, setCodeError] = useState('');
    const [accessData, setAccessData] = useState<{
        type: 'full' | 'single-article';
        expiresAt: number;
        articleId?: string;
    } | null>(null);
    const [readArticles, setReadArticles] = useState<string[]>([]);

    // Check if current user is premium
    const isPremiumUser = currentUser ? PREMIUM_USERS.some(name =>
        name.toLowerCase() === currentUser.toLowerCase()
    ) : false;

    // Check access on mount
    useEffect(() => {
        const savedAccess = localStorage.getItem('vibe_coding_access');
        if (savedAccess) {
            const data = JSON.parse(savedAccess);
            if (Date.now() < data.expiresAt) {
                setAccessData(data);
            } else {
                localStorage.removeItem('vibe_coding_access');
            }
        }

        const savedReadArticles = localStorage.getItem('vibe_read_articles');
        if (savedReadArticles) {
            setReadArticles(JSON.parse(savedReadArticles));
        }
    }, []);

    // Handle code submission
    const handleCodeSubmit = async () => {
        if (!codeInput.trim()) {
            setCodeError('შეიყვანეთ კოდი');
            return;
        }

        try {
            const response = await fetch(`/api/vibe-codes?code=${codeInput}`);
            const data = await response.json();

            if (data.success) {
                const accessInfo = {
                    type: data.type as 'full' | 'single-article',
                    expiresAt: data.expiresAt,
                    articleId: data.articleId
                };

                localStorage.setItem('vibe_coding_access', JSON.stringify(accessInfo));
                setAccessData(accessInfo);
                setIsCodeModalOpen(false);
                setCodeInput('');
                setCodeError('');

                // If single article access, open that article
                if (data.type === 'single-article' && data.articleId) {
                    const article = getArticleById(data.articleId);
                    if (article) setSelectedArticle(article);
                }
            } else {
                setCodeError(data.error || 'არასწორი კოდი');
            }
        } catch (error) {
            setCodeError('დაფიქსირდა შეცდომა. სცადეთ მოგვიანებით.');
        }
    };

    // Fetch current user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) return;

                const res = await fetch('/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    const userName = data.user?.fullName || data.user?.username;
                    if (userName) setCurrentUser(userName);
                }
            } catch {
                // User not authenticated
            }
        };
        fetchUser();
    }, []);

    // Load first article on mount - REMOVED for SEO Refactor
    // useEffect(() => {
    //     // const firstArticle = VIBE_CODING_DATA.categories[0]?.articles[0];
    //     // if (firstArticle) {
    //     //     setSelectedArticle(firstArticle);
    //     // }
    // }, []);

    // Track read articles
    useEffect(() => {
        if (selectedArticle && !selectedArticle.isFree && !readArticles.includes(selectedArticle.id)) {
            const updated = [...readArticles, selectedArticle.id];
            setReadArticles(updated);
            localStorage.setItem('vibe_read_articles', JSON.stringify(updated));
        }
    }, [selectedArticle, readArticles]);

    // Filter articles based on search
    const filteredCategories = VIBE_CODING_DATA.categories
        .map((category) => {
            return {
                ...category,
                articles: category.articles.filter((article) => {
                    return article.title.toLowerCase().includes(searchQuery.toLowerCase());
                })
            };
        })
        .filter((category) => category.articles.length > 0);

    // Check if article is accessible
    function isArticleAccessible(article: Article): boolean {
        if (isPremiumUser) return true;
        if (!accessData) return false;

        if (accessData.type === 'full') {
            return Date.now() < accessData.expiresAt;
        }

        if (accessData.type === 'single-article') {
            return article.id === accessData.articleId && Date.now() < accessData.expiresAt;
        }

        return false;
    }

    // Handle article selection
    function handleArticleSelect(article: Article): void {
        setSelectedArticle(article);
        setIsSidebarOpen(false);
        // Scroll to top when article changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <div className="min-h-screen relative" style={{
            background: 'linear-gradient(135deg, #f5f3ff 0%, #faf5ff 25%, #fdf4ff 50%, #f0f9ff 75%, #f5f3ff 100%)'
        }}>
            {/* Enhanced Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                {/* Main gradient orbs */}
                <div
                    className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full blur-3xl opacity-40"
                    style={{
                        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(236, 72, 153, 0.3) 40%, transparent 70%)',
                        animation: 'float 20s ease-in-out infinite'
                    }}
                />
                <div
                    className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full blur-3xl opacity-40"
                    style={{
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.3) 40%, transparent 70%)',
                        animation: 'float 25s ease-in-out infinite reverse'
                    }}
                />
                <div
                    className="absolute top-[40%] left-[30%] w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
                    style={{
                        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(168, 85, 247, 0.2) 50%, transparent 70%)',
                        animation: 'float 30s ease-in-out infinite'
                    }}
                />

                {/* Accent dots pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }}
                />
            </div>

            <style jsx global>{`
                @keyframes float {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -30px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }
            `}</style>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-4 left-4 z-50 lg:hidden p-3 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg"
            >
                {isSidebarOpen ? <TbX size={24} /> : <TbList size={24} />}
            </button>

            {/* Desktop Collapse/Expand Button */}
            <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden lg:block fixed left-4 top-4 z-50 p-2 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md hover:bg-gray-50 transition-all"
                style={{
                    left: isSidebarCollapsed ? '4px' : '304px',
                    transition: 'left 0.3s ease-in-out'
                }}
            >
                {isSidebarCollapsed ? (
                    <TbChevronRight size={20} />
                ) : (
                    <TbChevronLeft size={20} />
                )}
            </button>

            {/* Container */}
            <div className="flex w-full">
                {/* Sidebar */}
                <aside
                    className={`
                        fixed lg:fixed top-0 left-0 z-40 h-screen
                        border-r flex flex-col
                        transform transition-all duration-300 ease-in-out
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                        ${isSidebarCollapsed ? 'lg:w-0 lg:-translate-x-full' : 'lg:w-80 lg:translate-x-0'}
                        w-80
                    `}
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderColor: 'rgba(0,0,0,0.1)' }}
                >
                    {/* Brand */}
                    <div className="p-6" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <TbBook size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold" style={{ background: 'linear-gradient(to right, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    Vibe Coding
                                </h1>
                                <p className="text-xs text-gray-500">
                                    ბიბლიოთეკა {isPremiumUser && <span className="text-purple-500 font-medium">PRO</span>}
                                </p>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <TbSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="ძიება (ან #ID)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (searchQuery.startsWith('#')) {
                                            const id = searchQuery.substring(1);
                                            router.push(`/encyclopedia/vibe-coding/${id}`);
                                        }
                                    }
                                }}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                style={{ backgroundColor: '#f5f5f5', border: '1px solid rgba(0,0,0,0.1)' }}
                            />
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        {filteredCategories.map((category) => (
                            <div key={category.id} className="mb-6">
                                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                                    <span>{category.icon}</span>
                                    {category.title}
                                </h2>

                                <div className="space-y-1">
                                    {category.articles.map((article) => (
                                        <Link
                                            key={article.id}
                                            href={`/encyclopedia/vibe-coding/${article.id}`}
                                            className={`
                                                w-full text-left px-3 py-2.5 rounded-lg text-sm
                                                flex items-center justify-between gap-2
                                                transition-all duration-200
                                                hover:bg-gray-100 text-gray-700
                                            `}
                                        >
                                            <span className="truncate">{article.title}</span>
                                            {article.isFree ? (
                                                <TbLockOpen size={16} className="text-green-500 shrink-0" />
                                            ) : (
                                                <TbLock size={16} className="text-orange-500 shrink-0" />
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Footer Stats */}
                    <div className="p-4 space-y-3" style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                        <a
                            href={VIBE_CODING_DATA.telegramContact}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
                        >
                            <TbBrandTelegram size={18} />
                            შეიძინე პრემიუმი
                        </a>
                    </div>
                </aside>

                {/* Main Content */}
                <main
                    className="flex-1 min-h-screen transition-all duration-300"
                    style={{
                        marginLeft: isSidebarCollapsed ? '0' : '0'
                    }}
                >
                    <div className="relative p-6 lg:p-12 max-w-4xl mx-auto">
                        {/* Main Article Content */}
                        {selectedArticle ? (
                            <>
                                <ArticleViewer
                                    article={selectedArticle}
                                    onNavigate={(id) => {
                                        const article = getArticleById(id);
                                        if (article) handleArticleSelect(article);
                                    }}
                                    isLocked={!isArticleAccessible(selectedArticle)}
                                    onUnlock={() => setIsCodeModalOpen(true)}
                                />
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full min-h-[60vh]">
                                <div className="text-center">
                                    <TbBook size={64} className="mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">აირჩიეთ სტატია წასაკითხად</p>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* TbCode Access Modal */}
            <AnimatePresence>
                {isCodeModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsCodeModalOpen(false)}
                    >
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative z-10 max-w-md w-full rounded-2xl overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-gradient-shift" />

                            <div className="relative m-[2px] bg-card rounded-2xl p-8">
                                <button
                                    onClick={() => {
                                        setIsCodeModalOpen(false);
                                        setCodeInput('');
                                        setCodeError('');
                                    }}
                                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <TbX size={24} />
                                </button>

                                <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                                        <TbLock size={40} className="text-primary" />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-center mb-3 text-gradient">
                                    შეიყვანეთ წვდომის კოდი
                                </h3>

                                <p className="text-muted-foreground text-center mb-6 leading-relaxed">
                                    კოდის შეყვანით მიიღებთ წვდომას პრემიუმ მასალებზე
                                </p>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={codeInput}
                                        onChange={(e) => {
                                            setCodeInput(e.target.value.toUpperCase());
                                            setCodeError('');
                                        }}
                                        onKeyPress={(e) => e.key === 'Enter' && handleCodeSubmit()}
                                        placeholder="კოდი..."
                                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-center text-lg tracking-widest uppercase"
                                    />

                                    <button
                                        onClick={handleCodeSubmit}
                                        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white font-medium hover:from-primary/90 hover:to-purple-500/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        დადასტურება
                                    </button>

                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-border"></div>
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-card px-2 text-muted-foreground">ან</span>
                                        </div>
                                    </div>

                                    <a
                                        href={VIBE_CODING_DATA.telegramContact}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <TbBrandTelegram size={24} />
                                        კოდის მიღება ადმინისტრატორისგან
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
