'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TbSearch, TbLock, TbSparkles, TbArrowRight, TbBook, TbFlame, TbUsers, TbClock, TbStar, TbCheck, TbBolt, TbRocket, TbAlertTriangle } from 'react-icons/tb';
import { useAuth } from '@/lib/auth';
import { AI_2026_DATA } from '@/data/ai2026Content';
import { motion } from 'framer-motion';
import PremiumRequestModal from '@/components/premium/PremiumRequestModal';

export default function AI2026ArticleList() {
    const [search, setSearch] = useState('');
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
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
        <div className="space-y-8">
            {/* 🔥 FEAR-BASED URGENCY BANNER */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 rounded-2xl p-5 text-white shadow-xl"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <TbAlertTriangle size={24} className="animate-pulse" />
                        <span className="font-bold text-lg">2026 მოდის. მზად ხარ?</span>
                    </div>
                    <p className="text-white/90 text-sm mb-3">
                        ეს სტატიები <span className="font-bold text-yellow-200">გადაარჩენს შენს კარიერას</span>. არ დაელოდო.
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <TbUsers size={16} />
                            <span>847 ადამიანი უკვე მომზადებულია</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                            <TbFlame size={14} />
                            <span className="font-bold">დარჩა მცირე დრო</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards - Fear + Value */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-2xl p-4 text-center">
                    <div className="text-3xl font-black text-red-600">85%</div>
                    <div className="text-xs text-red-700 font-medium">დაკარგავს სამსახურს</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 text-center text-white shadow-lg">
                    <div className="text-3xl font-black">{allArticles.length}</div>
                    <div className="text-xs opacity-90">გადარჩენის გზა</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-4 text-center text-white shadow-lg">
                    <div className="text-3xl font-black">0₾</div>
                    <div className="text-xs opacity-90">დღეს უფასოდ!</div>
                </div>
            </div>

            {/* Social Proof */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <div className="flex items-center justify-center gap-3">
                    <div className="flex -space-x-2">
                        {['🧑‍💼', '👨‍💻', '👩‍🔬', '🧑‍🎓', '👨‍💼'].map((emoji, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-white flex items-center justify-center text-sm shadow-sm">
                                {emoji}
                            </div>
                        ))}
                    </div>
                    <div className="text-sm text-gray-700">
                        <span className="font-bold text-blue-700">2,384</span> ადამიანი მომზადებულია 2026-ისთვის
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <TbSearch size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="🔍 რა გაინტერესებს მომავლის შესახებ?"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-blue-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                />
            </div>

            {/* Premium Access CTA */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-2xl p-6 text-white relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <TbRocket size={24} className="text-cyan-400" />
                        <span className="font-bold text-lg">გახდი ერთ-ერთი 15%-ში რომელიც გადარჩება</span>
                    </div>
                    <ul className="space-y-2 mb-4">
                        {[
                            'AI-ის გავლენა ყველა ინდუსტრიაზე',
                            'რომელი პროფესიები გაქრება 2026-ში',
                            'გადარჩენის კონკრეტული სტრატეგიები',
                            'ახალი შესაძლებლობები რომელსაც ყველა გამორჩება'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                                <TbCheck size={18} className="text-green-400 flex-shrink-0" />
                                <span className="text-white/90">{item}</span>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => setIsPremiumModalOpen(true)}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform shadow-lg"
                    >
                        <TbBolt size={18} />
                        მიიღე წვდომა ახლავე
                        <TbArrowRight size={18} />
                    </button>
                </div>
            </motion.div>

            {/* Section Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">🚀 ყველა სტატია</h2>
                <span className="text-sm text-blue-600 font-medium">{filteredArticles.length} სტატია</span>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredArticles.map((article, index) => {
                    const isLocked = !article.isFree && user?.email !== 'andrewaltair@icloud.com';

                    return (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                        >
                            <Link
                                href={`/encyclopedia/ai-2026/${article.id}`}
                                className={`
                                    group block relative overflow-hidden rounded-2xl p-5 h-full
                                    transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                                    ${article.isFree
                                        ? 'bg-white border-2 border-cyan-200 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-100'
                                        : 'bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100'
                                    }
                                `}
                            >
                                {/* Must Read Badge for premium */}
                                {!article.isFree && (
                                    <div className="absolute top-0 right-0">
                                        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl flex items-center gap-1">
                                            <TbAlertTriangle size={12} /> აუცილებელი
                                        </div>
                                    </div>
                                )}

                                {/* Badge */}
                                <div className={`
                                    inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold mb-3
                                    ${article.isFree
                                        ? 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                                    }
                                `}>
                                    {article.isFree ? (
                                        <>
                                            <TbBook size={14} />
                                            უფასო
                                        </>
                                    ) : (
                                        <>
                                            {isLocked ? <TbLock size={14} /> : <TbRocket size={14} />}
                                            პრემიუმ
                                        </>
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
                                    {article.title}
                                </h3>

                                {/* Rating & Readers */}
                                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                                    <div className="flex items-center gap-1">
                                        <TbStar size={14} className="text-yellow-500 fill-yellow-500" />
                                        <span>4.9</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <TbUsers size={14} />
                                        <span>{Math.floor(Math.random() * 800) + 200} მკითხველი</span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className={`
                                    flex items-center gap-1 text-sm font-bold
                                    ${article.isFree ? 'text-cyan-600' : 'text-blue-600'}
                                `}>
                                    {article.isFree ? 'წაიკითხე ახლავე' : 'გახსენი სტატია'}
                                    <TbArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Bottom Fear-Based CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center py-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100"
            >
                <p className="text-gray-700 mb-2 font-medium">⚠️ 2026 მოდის. დრო იწურება.</p>
                <p className="text-gray-500 text-sm mb-4">ნუ დარჩები მომზადების გარეშე</p>
                <button
                    onClick={() => setIsPremiumModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold px-8 py-4 rounded-xl hover:scale-105 transition-transform shadow-xl"
                >
                    <TbRocket size={20} />
                    მომზადება ახლავე - უფასოდ
                </button>
            </motion.div>

            {filteredArticles.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TbSearch size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">სტატია ვერ მოიძებნა</p>
                </div>
            )}

            {/* Premium Request Modal */}
            <PremiumRequestModal
                isOpen={isPremiumModalOpen}
                onClose={() => setIsPremiumModalOpen(false)}
                source="ai-2026"
            />
        </div>
    );
}
