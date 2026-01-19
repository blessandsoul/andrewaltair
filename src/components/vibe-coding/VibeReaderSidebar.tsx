'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    TbBook,
    TbSearch,
    TbBrandTelegram,
    TbLock,
    TbLockOpen,
    TbX,
    TbList,
    TbChevronRight,
    TbChevronLeft,
    TbTarget,
    TbTrophy
} from 'react-icons/tb';
import { VIBE_CODING_DATA, Article } from '@/data/vibeCodingContent';
import PurchaseModal from './PurchaseModal';

interface VibeReaderSidebarProps {
    isParamsPremium?: boolean;
}

export default function VibeReaderSidebar({ isParamsPremium }: VibeReaderSidebarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile default closed
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop toggle
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const router = useRouter();

    // In a real app, you might fetch this from a context or prop
    // For now we'll assume passed via props or client-side check if needed
    // But since this is a layout component, we might need a Client Component wrapper
    // that checks auth status.
    // For now, let's keep it simple and just render links.

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

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-20 left-4 z-50 lg:hidden p-3 rounded-xl bg-[#0a0a1a]/90 backdrop-blur-sm border border-white/10 shadow-lg text-white"
            >
                {isSidebarOpen ? <TbX size={24} /> : <TbList size={24} />}
            </button>

            {/* Desktop Collapse/Expand Button */}
            <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden lg:block fixed left-4 top-20 z-50 p-2 rounded-lg bg-[#0a0a1a]/90 backdrop-blur-sm border border-white/10 shadow-md hover:bg-[#1a1a2e] transition-all text-white"
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


            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:fixed top-16 left-0 z-40 h-[calc(100vh-4rem)]
                    border-r flex flex-col bg-[#0a0a1a] text-white
                    transform transition-all duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    ${isSidebarCollapsed ? 'lg:w-0 lg:-translate-x-full' : 'lg:w-80 lg:translate-x-0'}
                    w-80
                `}
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            >
                {/* Brand */}
                <div className="p-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <TbBook size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                                Vibe Coding
                            </h1>
                            <p className="text-xs text-gray-400">
                                ბიბლიოთეკა
                            </p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <TbSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ძიება..."
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
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-[#1a1a2e] border border-white/10 text-white placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {filteredCategories.map((category) => (
                        <div key={category.id} className="mb-6">
                            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                                <span className="text-purple-500">
                                    {category.id === 'intro' && <TbTarget className="w-4 h-4" />}
                                    {category.id === 'basic-guide' && <TbBook className="w-4 h-4" />}
                                    {category.id === 'tools-ranking' && <TbTrophy className="w-4 h-4" />}
                                </span>
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
                                            hover:bg-[#1a1a2e] text-gray-300 hover:text-white
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
                </div>

                {/* Footer Stats */}
                <div className="p-4 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                        onClick={() => setIsPurchaseModalOpen(true)}
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
                    >
                        <TbBrandTelegram size={18} />
                        შეიძინე პრემიუმი
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <PurchaseModal
                isOpen={isPurchaseModalOpen}
                onClose={() => setIsPurchaseModalOpen(false)}
            />
        </>
    );
}
