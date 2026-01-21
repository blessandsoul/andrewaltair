'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TbSearch, TbLock, TbBook } from 'react-icons/tb';
import { useAuth } from '@/lib/auth';
import { AI_2026_DATA } from '@/data/ai2026Content';

export default function AI2026ArticleList() {
    const [search, setSearch] = useState('');
    const { user } = useAuth();

    // Flatten all articles from categories
    const allArticles = useMemo(() => {
        return AI_2026_DATA.categories.flatMap(cat => cat.articles);
    }, []);

    // Filter articles by search
    const filteredArticles = useMemo(() => {
        if (!search.trim()) return allArticles;
        return allArticles.filter(article =>
            article.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [allArticles, search]);

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative mb-6">
                <TbSearch size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="ძიება..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm"
                />
            </div>

            <div className="space-y-3">
                {filteredArticles.map((article) => {
                    const isLocked = !article.isFree && user?.email !== 'andrewaltair@icloud.com';

                    return (
                        <Link
                            key={article.id}
                            href={`/encyclopedia/ai-2026/${article.id}`}
                            className="block bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:bg-blue-50 transition-all active:scale-[0.98]"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="font-medium text-gray-900 line-clamp-2 leading-snug">
                                    {article.title}
                                </h3>
                                {isLocked ? (
                                    <TbLock size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
                                ) : (
                                    <TbBook size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>

            {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TbSearch size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500">სტატია ვერ მოიძებნა</p>
                </div>
            )}
        </div>
    );
}
