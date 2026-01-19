'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TbMenu2, TbX, TbBook, TbLock, TbSearch } from 'react-icons/tb';
import { VIBE_CODING_DATA } from '@/data/vibeCodingContent';

export default function VibeReaderSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const pathname = usePathname();

    // Flatten all articles from categories
    const allArticles = useMemo(() => {
        return VIBE_CODING_DATA.categories.flatMap(cat => cat.articles);
    }, []);

    // Filter articles by search
    const filteredArticles = useMemo(() => {
        if (!search.trim()) return allArticles;
        return allArticles.filter(article =>
            article.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [allArticles, search]);

    // Get current article slug
    const currentSlug = pathname.split('/').pop();

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed z-[70] p-3 bg-white rounded-xl shadow-lg border border-gray-200"
                style={{ top: '8px', left: '8px' }}
                aria-label="Toggle menu"
            >
                {isOpen ? <TbX size={22} className="text-gray-900" /> : <TbMenu2 size={22} className="text-gray-900" />}
            </button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-[68]"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-[69] w-[85vw] max-w-80
                    bg-white border-r border-gray-200 flex flex-col
                    transform transition-transform duration-300 ease-in-out
                    lg:translate-x-0 lg:static lg:w-80 lg:max-w-none lg:z-auto
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                            <TbBook size={22} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Vibe Coding</h2>
                            <p className="text-xs text-gray-500">ბიბლიოთეკა</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <TbSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ძიება..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                        />
                    </div>
                </div>

                {/* Navigation - scrollable */}
                <nav className="flex-1 overflow-y-auto p-4">
                    <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        სტატიები
                    </p>
                    <ul className="space-y-1">
                        {filteredArticles.map((article) => {
                            const isActive = currentSlug === article.id;
                            const isLocked = !article.isFree;

                            return (
                                <li key={article.id}>
                                    <Link
                                        href={`/encyclopedia/vibe-coding/${article.id}`}
                                        onClick={() => setIsOpen(false)}
                                        className={`
                                            flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm
                                            transition-all duration-200
                                            ${isActive
                                                ? 'bg-purple-100 text-purple-700 font-medium'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }
                                        `}
                                    >
                                        <span className="truncate">{article.title}</span>
                                        {isLocked && (
                                            <TbLock size={14} className="text-gray-400 flex-shrink-0" />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {filteredArticles.length === 0 && (
                        <p className="px-3 py-4 text-sm text-gray-500 text-center">
                            სტატია ვერ მოიძებნა
                        </p>
                    )}
                </nav>
            </aside>
        </>
    );
}
