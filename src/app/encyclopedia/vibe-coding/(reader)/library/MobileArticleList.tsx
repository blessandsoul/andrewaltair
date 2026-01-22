'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TbSearch, TbLock, TbSparkles, TbArrowRight, TbBook, TbFlame, TbUsers, TbClock, TbStar, TbCheck, TbBolt } from 'react-icons/tb';
import { useAuth } from '@/lib/auth';
import { VIBE_CODING_DATA } from '@/data/vibeCodingContent';
import { motion } from 'framer-motion';
import PremiumRequestModal from '@/components/premium/PremiumRequestModal';

export default function MobileArticleList() {
    const [search, setSearch] = useState('');
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
    const { user } = useAuth();

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

    // Count free vs premium
    const freeCount = allArticles.filter(a => a.isFree).length;
    const premiumCount = allArticles.length - freeCount;

    return (
        <div className="space-y-8">
            {/* 🔥 URGENCY BANNER - Limited Time */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl p-5 text-white shadow-xl"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <TbFlame size={24} className="animate-pulse" />
                        <span className="font-bold text-lg">შეზღუდული შეთავაზება!</span>
                    </div>
                    <p className="text-white/90 text-sm mb-3">
                        პრემიუმ სტატიებზე <span className="font-bold text-yellow-300">უფასო წვდომა</span> მხოლოდ დღეს
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <TbUsers size={16} />
                            <span>342 ადამიანი კითხულობს</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                            <TbClock size={14} />
                            <span className="font-mono font-bold">23:59:59</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards - Value Proposition */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
                    <div className="text-3xl font-black text-gray-900">{allArticles.length}</div>
                    <div className="text-xs text-gray-500 font-medium">სტატია</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 text-center text-white shadow-lg">
                    <div className="text-3xl font-black">180₾</div>
                    <div className="text-xs opacity-90 line-through">ღირებულება</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-4 text-center text-white shadow-lg">
                    <div className="text-3xl font-black">0₾</div>
                    <div className="text-xs opacity-90">დღეს!</div>
                </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-2 py-3">
                <div className="flex -space-x-2">
                    {['😀', '🧑‍💻', '👨‍🎓', '👩‍💻', '🧑'].map((emoji, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-white flex items-center justify-center text-sm">
                            {emoji}
                        </div>
                    ))}
                </div>
                <div className="text-sm text-gray-600">
                    <span className="font-bold text-gray-900">1,247</span> ადამიანმა უკვე წაიკითხა
                </div>
            </div>

            {/* Search with Sales Copy */}
            <div className="space-y-2">
                <div className="relative">
                    <TbSearch size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="🔍 რომელი თემა გაინტერესებს?"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-purple-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Premium Access CTA */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <TbBolt size={24} className="text-yellow-400" />
                        <span className="font-bold text-lg">სრული წვდომა ყველა სტატიაზე</span>
                    </div>
                    <ul className="space-y-2 mb-4">
                        {[
                            '12 პრემიუმ სტატია ვაიბ კოდინგზე',
                            'ექსპერტების ექსკლუზიური ანალიზი',
                            'რეალური პროექტების Case Studies',
                            'მუდმივი წვდომა განახლებებზე'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                                <TbCheck size={18} className="text-green-400 flex-shrink-0" />
                                <span className="text-white/90">{item}</span>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => setIsPremiumModalOpen(true)}
                        className="inline-flex items-center gap-2 bg-white text-purple-700 font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform shadow-lg"
                    >
                        <TbSparkles size={18} />
                        მიიღე წვდომა უფასოდ
                        <TbArrowRight size={18} />
                    </button>
                </div>
            </motion.div>

            {/* Section Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">📚 ყველა სტატია</h2>
                <span className="text-sm text-purple-600 font-medium">{filteredArticles.length} სტატია</span>
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
                                href={`/encyclopedia/vibe-coding/${article.id}`}
                                className={`
                                    group block relative overflow-hidden rounded-2xl p-5 h-full
                                    transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                                    ${article.isFree
                                        ? 'bg-white border-2 border-green-200 hover:border-green-400 hover:shadow-xl hover:shadow-green-100'
                                        : 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-100'
                                    }
                                `}
                            >
                                {/* Popular Badge for premium */}
                                {!article.isFree && (
                                    <div className="absolute top-0 right-0">
                                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl flex items-center gap-1">
                                            <TbFlame size={12} /> პოპულარული
                                        </div>
                                    </div>
                                )}

                                {/* Badge */}
                                <div className={`
                                    inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold mb-3
                                    ${article.isFree
                                        ? 'bg-green-100 text-green-700 border border-green-200'
                                        : 'bg-purple-100 text-purple-700 border border-purple-200'
                                    }
                                `}>
                                    {article.isFree ? (
                                        <>
                                            <TbBook size={14} />
                                            უფასო
                                        </>
                                    ) : (
                                        <>
                                            {isLocked ? <TbLock size={14} /> : <TbSparkles size={14} />}
                                            პრემიუმ
                                        </>
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-3 group-hover:text-purple-700 transition-colors line-clamp-2">
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
                                        <span>{Math.floor(Math.random() * 500) + 100} მკითხველი</span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className={`
                                    flex items-center gap-1 text-sm font-bold
                                    ${article.isFree ? 'text-green-600' : 'text-purple-600'}
                                `}>
                                    {article.isFree ? 'წაიკითხე ახლავე' : 'გახსენი სტატია'}
                                    <TbArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Bottom CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center py-8 border-t border-gray-100"
            >
                <p className="text-gray-600 mb-4">გსურს ყველა სტატიის წაკითხვა?</p>
                <button
                    onClick={() => setIsPremiumModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-4 rounded-xl hover:scale-105 transition-transform shadow-xl"
                >
                    <TbSparkles size={20} />
                    მიიღე სრული წვდომა უფასოდ
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
                source="vibe-coding"
            />
        </div>
    );
}
