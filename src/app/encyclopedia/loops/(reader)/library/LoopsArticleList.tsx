'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TbSearch, TbArrowRight } from 'react-icons/tb';
import { LOOPS_DATA } from '@/data/loopsContent';

// Plain table of contents for the LOOPS course. No fake urgency, counters or
// prices, the lessons are free and educational.
export default function LoopsArticleList() {
    const [search, setSearch] = useState('');

    const allArticles = useMemo(
        () => LOOPS_DATA.categories.flatMap(cat => cat.articles),
        []
    );

    const filtered = useMemo(() => {
        if (!search.trim()) return allArticles;
        return allArticles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));
    }, [allArticles, search]);

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="relative mb-8">
                <TbSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="მოძებნე გაკვეთილი..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                />
            </div>

            <div className="space-y-3">
                {filtered.map((article, idx) => (
                    <Link
                        key={article.id}
                        href={`/encyclopedia/loops/${article.id}`}
                        className="flex items-center gap-4 p-4 md:p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group"
                    >
                        <span className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold">
                            {idx + 1}
                        </span>
                        <span className="flex-1 font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {article.title}
                        </span>
                        <TbArrowRight className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" size={20} />
                    </Link>
                ))}
            </div>

            {filtered.length === 0 && (
                <p className="text-center text-gray-500 py-10">გაკვეთილი ვერ მოიძებნა</p>
            )}
        </div>
    );
}
