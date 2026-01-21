'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TbSearch, TbLock, TbSparkles, TbArrowRight, TbBook, TbRocket } from 'react-icons/tb';
import { useAuth } from '@/lib/auth';
import { AI_2026_DATA } from '@/data/ai2026Content';
import { motion } from 'framer-motion';

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

    // Count free vs premium
    const freeCount = allArticles.filter(a => a.isFree).length;
    const premiumCount = allArticles.length - freeCount;

    return (
        <div className="space-y-6">
            {/* Stats Banner */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 rounded-2xl p-4 text-center">
                    <div className="text-3xl font-bold text-cyan-600">{freeCount}</div>
                    <div className="text-sm text-cyan-700 font-medium flex items-center justify-center gap-1">
                        <TbBook size={14} /> უფასო
                    </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-4 text-center">
                    <div className="text-3xl font-bold text-indigo-600">{premiumCount}</div>
                    <div className="text-sm text-indigo-700 font-medium flex items-center justify-center gap-1">
                        <TbRocket size={14} /> პრემიუმ
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <TbSearch size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="მოძებნე სტატია..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all shadow-sm"
                />
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArticles.map((article, index) => {
                    const isLocked = !article.isFree && user?.email !== 'andrewaltair@icloud.com';

                    return (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                href={`/encyclopedia/ai-2026/${article.id}`}
                                className={`
                                    group block relative overflow-hidden rounded-2xl p-5 h-full
                                    transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                                    ${article.isFree
                                        ? 'bg-gradient-to-br from-white to-cyan-50/50 border-2 border-cyan-100 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-100'
                                        : 'bg-gradient-to-br from-white to-indigo-50/50 border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100'
                                    }
                                `}
                            >
                                {/* Badge */}
                                <div className={`
                                    inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mb-3
                                    ${article.isFree
                                        ? 'bg-cyan-100 text-cyan-700'
                                        : 'bg-indigo-100 text-indigo-700'
                                    }
                                `}>
                                    {article.isFree ? (
                                        <>
                                            <TbBook size={12} />
                                            უფასო
                                        </>
                                    ) : (
                                        <>
                                            {isLocked ? <TbLock size={12} /> : <TbRocket size={12} />}
                                            პრემიუმ
                                        </>
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                                    {article.title}
                                </h3>

                                {/* Arrow */}
                                <div className={`
                                    flex items-center gap-1 text-sm font-medium mt-auto pt-2
                                    ${article.isFree ? 'text-cyan-600' : 'text-indigo-600'}
                                `}>
                                    წაკითხვა
                                    <TbArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>

                                {/* Decorative gradient orb */}
                                <div className={`
                                    absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-30
                                    ${article.isFree ? 'bg-cyan-400' : 'bg-indigo-400'}
                                `} />
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {filteredArticles.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TbSearch size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">სტატია ვერ მოიძებნა</p>
                    <p className="text-gray-400 text-sm mt-1">სცადე სხვა საძიებო სიტყვა</p>
                </div>
            )}
        </div>
    );
}
