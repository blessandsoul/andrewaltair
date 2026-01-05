'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lock,
    LockOpen,
    MagnifyingGlass,
    List,
    X,
    CaretLeft,
    CaretRight,
    TelegramLogo,
    Sparkle,
    Book
} from '@phosphor-icons/react';
import ReactMarkdown from 'react-markdown';
import {
    VIBE_CODING_DATA,
    type Article,
    type Category,
    getArticleById,
    getAdjacentArticles,
    getTotalArticleCount,
    getFreeArticleCount
} from '@/data/vibeCodingContent';

// Paywall Modal Component
function PaywallModal({
    isOpen,
    onClose,
    telegramLink
}: {
    isOpen: boolean;
    onClose: () => void;
    telegramLink: string;
}) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative z-10 max-w-md w-full rounded-2xl overflow-hidden"
                >
                    {/* Gradient border effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-gradient-shift" />

                    <div className="relative m-[2px] bg-card rounded-2xl p-8">
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X size={24} weight="bold" />
                        </button>

                        {/* Lock Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                                <Lock size={40} className="text-primary" weight="duotone" />
                            </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-2xl font-bold text-center mb-3 text-gradient">
                            პრემიუმ კონტენტი
                        </h3>

                        <p className="text-muted-foreground text-center mb-6 leading-relaxed">
                            ეს სტატია ხელმისაწვდომია მხოლოდ პრემიუმ მომხმარებლებისთვის.
                            მიიღეთ სრული წვდომა Vibe Coding ბიბლიოთეკაზე!
                        </p>

                        {/* Benefits */}
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-sm">
                                <Sparkle size={20} className="text-primary" />
                                <span>სრული წვდომა 20+ სტატიაზე</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Sparkle size={20} className="text-primary" />
                                <span>ექსკლუზიური მეთოდოლოგიები</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Sparkle size={20} className="text-primary" />
                                <span>პირადი მხარდაჭერა ადმინისგან</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <a
                            href={telegramLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <TelegramLogo size={24} weight="fill" />
                            დაუკავშირდი ადმინს
                        </a>

                        <p className="text-xs text-muted-foreground text-center mt-4">
                            პრემიუმ წვდომის მისაღებად
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// Article Viewer Component
function ArticleViewer({
    article,
    onNavigate
}: {
    article: Article;
    onNavigate: (articleId: string) => void;
}) {
    const { prev, next } = getAdjacentArticles(article.id);

    return (
        <div className="w-full">
            {/* Custom styles for markdown content */}
            <style jsx global>{`
                .article-content {
                    color: #374151;
                    font-size: 1rem;
                    line-height: 1.8;
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
                .article-content a {
                    color: #7c3aed;
                    text-decoration: none;
                    border-bottom: 1px dotted #7c3aed;
                }
                .article-content a:hover {
                    border-bottom-style: solid;
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
                    border: 1px solid rgba(0,0,0,0.1);
                }
                .article-content pre code {
                    background: transparent;
                    padding: 0;
                    font-size: 0.875rem;
                    color: #e5e7eb;
                }
                .article-content blockquote {
                    border-left: 4px solid #7c3aed;
                    padding: 0.75rem 1rem;
                    margin: 1.5rem 0;
                    background: rgba(124, 58, 237, 0.05);
                    border-radius: 0 0.5rem 0.5rem 0;
                    color: #6b7280;
                }
                .article-content blockquote p {
                    margin: 0;
                }
                .article-content ul, .article-content ol {
                    margin: 1rem 0 1rem 1.5rem;
                    color: #4b5563;
                }
                .article-content li {
                    margin-bottom: 0.5rem;
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
                    color: #4b5563;
                }
                .article-content strong {
                    color: #111827;
                    font-weight: 600;
                }
                .article-content hr {
                    border: none;
                    border-top: 1px solid rgba(0,0,0,0.1);
                    margin: 2rem 0;
                }
            `}</style>

            {/* Article Content */}
            <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="article-content"
            >
                <ReactMarkdown>{article.content}</ReactMarkdown>
            </motion.article>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center gap-4 mt-12 pt-8 border-t border-border">
                {prev ? (
                    <button
                        onClick={() => onNavigate(prev.id)}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-sm flex-1 max-w-[200px] group"
                    >
                        <CaretLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
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
                            <CaretRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        ) : (
                            <Lock size={20} />
                        )}
                    </button>
                ) : (
                    <div />
                )}
            </div>
        </div>
    );
}

// Premium users list (have access to all content)
const PREMIUM_USERS = ['Andrew Altair', 'andrewaltair'];

// Access code for 1-hour premium access
const ACCESS_CODE = '1212';
const ACCESS_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Main TbLibrary Component
export default function VibeCodingLibrary() {
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isPaywallOpen, setIsPaywallOpen] = useState(false);
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [codeInput, setCodeInput] = useState('');
    const [codeError, setCodeError] = useState('');
    const [hasCodeAccess, setHasCodeAccess] = useState(false);

    // Check if current user is premium
    const isPremiumUser = currentUser ? PREMIUM_USERS.some(name =>
        name.toLowerCase() === currentUser.toLowerCase()
    ) : false;

    // Check code access on mount
    useEffect(() => {
        const accessData = localStorage.getItem('vibe_coding_access');
        if (accessData) {
            const { expiresAt } = JSON.parse(accessData);
            if (Date.now() < expiresAt) {
                setHasCodeAccess(true);
            } else {
                localStorage.removeItem('vibe_coding_access');
            }
        }
    }, []);

    // Handle code submission
    const handleCodeSubmit = () => {
        if (codeInput === ACCESS_CODE) {
            const expiresAt = Date.now() + ACCESS_DURATION;
            localStorage.setItem('vibe_coding_access', JSON.stringify({ expiresAt }));
            setHasCodeAccess(true);
            setIsCodeModalOpen(false);
            setCodeInput('');
            setCodeError('');
        } else {
            setCodeError('არასწორი კოდი. სცადეთ თავიდან.');
        }
    };

    // Fetch current user on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    return;
                }

                const res = await fetch('/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    const userName = data.user?.fullName || data.user?.username;
                    if (userName) {
                        setCurrentUser(userName);
                    }
                }
            } catch {
                // User not authenticated
            }
        };
        fetchUser();
    }, []);

    // Load first article on mount
    useEffect(() => {
        const firstArticle = VIBE_CODING_DATA.categories[0]?.articles[0];
        if (firstArticle) {
            setSelectedArticle(firstArticle);
        }
    }, []);

    // Filter articles based on search
    const filteredCategories = VIBE_CODING_DATA.categories.map(category => ({
        ...category,
        articles: category.articles.filter(article =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.articles.length > 0);

    // Handle article selection
    const handleArticleSelect = (article: Article) => {
        // Premium users or code access can view all content
        if (article.isFree || isPremiumUser || hasCodeAccess) {
            setSelectedArticle(article);
            setIsSidebarOpen(false);
        } else {
            setIsCodeModalOpen(true);
        }
    };

    // Check if article is accessible (for UI display)
    const isArticleAccessible = (article: Article) => article.isFree || isPremiumUser || hasCodeAccess;

    const totalArticles = getTotalArticleCount();
    const freeArticles = getFreeArticleCount();

    return (
        <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#fafafa' }}>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-4 right-4 z-50 lg:hidden p-3 rounded-xl bg-white border border-gray-200 shadow-lg text-gray-700"
            >
                {isSidebarOpen ? <X size={24} /> : <List size={24} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:relative inset-y-0 left-0 z-40
          w-80 border-r flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
                style={{ backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)' }}
            >
                {/* Brand */}
                <div className="p-6" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Book size={24} className="text-white" weight="fill" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold" style={{ background: 'linear-gradient(to right, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Vibe Coding</h1>
                            <p className="text-xs text-gray-500">ბიბლიოთეკა {isPremiumUser && <span className="text-purple-500 font-medium">PRO</span>}</p>
                        </div>
                    </div>

                    {/* TbSearch */}
                    <div className="relative">
                        <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ძიება..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
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
                                    <button
                                        key={article.id}
                                        onClick={() => handleArticleSelect(article)}
                                        className={`
                      w-full text-left px-3 py-2.5 rounded-lg text-sm
                      flex items-center justify-between gap-2
                      transition-all duration-200
                      ${selectedArticle?.id === article.id
                                                ? 'bg-purple-100 text-purple-700 font-medium'
                                                : 'hover:bg-gray-100 text-gray-700'
                                            }
                    `}
                                        style={selectedArticle?.id === article.id ? { borderLeft: '3px solid #7c3aed' } : {}}
                                    >
                                        <span className="truncate">{article.title}</span>
                                        {isArticleAccessible(article) ? (
                                            <LockOpen size={16} className="text-green-500 shrink-0" />
                                        ) : (
                                            <Lock size={16} className="text-gray-400 shrink-0" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Footer Stats */}
                <div className="p-4" style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>ხელმისაწვდომია</span>
                        <span className="text-green-600 font-medium">{isPremiumUser ? totalArticles : freeArticles} / {totalArticles}</span>
                    </div>
                    <a
                        href={VIBE_CODING_DATA.telegramContact}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
                    >
                        <TelegramLogo size={18} weight="fill" />
                        პრემიუმის მიღება
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-1/2 h-96 bg-gradient-to-bl from-primary/5 via-purple-500/5 to-transparent pointer-events-none" />

                <div className="relative p-6 lg:p-12">
                    {selectedArticle ? (
                        <ArticleViewer
                            article={selectedArticle}
                            onNavigate={(id) => {
                                const article = getArticleById(id);
                                if (article) handleArticleSelect(article);
                            }}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full min-h-[60vh]">
                            <div className="text-center">
                                <Book size={64} className="mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">აირჩიეთ სტატია სანახავად</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Paywall Modal */}
            <PaywallModal
                isOpen={isPaywallOpen}
                onClose={() => setIsPaywallOpen(false)}
                telegramLink={VIBE_CODING_DATA.telegramContact}
            />

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
                                    <X size={24} weight="bold" />
                                </button>

                                <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                                        <Lock size={40} className="text-primary" weight="duotone" />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-center mb-3 text-gradient">
                                    შეიყვანეთ წვდომის კოდი
                                </h3>

                                <p className="text-muted-foreground text-center mb-6 leading-relaxed">
                                    კოდის შეყვანით მიიღებთ 1 საათიან წვდომას პრემიუმ კონტენტზე
                                </p>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={codeInput}
                                        onChange={(e) => {
                                            setCodeInput(e.target.value);
                                            setCodeError('');
                                        }}
                                        onKeyPress={(e) => e.key === 'Enter' && handleCodeSubmit()}
                                        placeholder="კოდი..."
                                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-center text-lg tracking-widest"
                                    />

                                    {codeError && (
                                        <p className="text-red-500 text-sm text-center">{codeError}</p>
                                    )}

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
                                        <TelegramLogo size={24} weight="fill" />
                                        მიიღე კოდი ადმინისგან
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
