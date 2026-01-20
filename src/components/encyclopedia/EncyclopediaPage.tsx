'use client';

import { motion } from 'framer-motion';
import {
    TbBook,
    TbVideo,
    TbSparkles,
    TbArrowRight,
    TbLock,
    TbCircleCheck,
    TbStar,
    TbGift,
    TbUsers,
    TbCalendar,
    TbBrandTelegram,
    TbCheck,
    TbX,
    TbBulb,
    TbRocket,
    TbDeviceLaptop,
    TbChartBar,
    TbClock,
    TbSearch,
    TbChartPie,
    TbCode,
    TbFlame
} from 'react-icons/tb';
import { useState } from 'react';
import Link from 'next/link';
import { EncyclopediaSearch, useEncyclopediaSearch } from './EncyclopediaSearch';
import { getTotalArticleCount as getTotalArticleCountVibe } from '@/data/vibeCodingContent';
import { getTotalArticleCount } from '@/data/ai2026Content';

export default function EncyclopediaPage() {
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [referralCode] = useState('USER123');
    const { isOpen: isSearchOpen, open: openSearch, close: closeSearch } = useEncyclopediaSearch();

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#fafafa' }}>
            {/* Global Search Modal */}
            <EncyclopediaSearch isOpen={isSearchOpen} onClose={closeSearch} />

            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-purple-200/40 via-pink-200/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-blue-200/40 via-cyan-200/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-200/30 to-fuchsia-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 mb-6">
                        <TbBook size={20} className="text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">სრული ენციკლოპედია AI და პროგრამირებაზე</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight pb-2 flex items-center justify-center gap-4">
                        <TbBook className="text-purple-600" /> ენციკლოპედია
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        ყველაფერი რაც გჭირდება AI-ით პროგრამირების შესასწავლად.
                        სტატიები, ვიდეოები, case studies და ექსპერტების ანალიზი ერთ ადგილას.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <button
                            onClick={openSearch}
                            className="inline-flex items-center gap-2 px-5 py-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-purple-300"
                        >
                            <TbSearch size={20} className="text-purple-600" />
                            <span className="font-medium">ძიება</span>
                            <kbd className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-500">⌘K</kbd>
                        </button>
                        <Link
                            href="/encyclopedia/progress"
                            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105"
                        >
                            <TbChartPie size={20} />
                            <span className="font-medium">ჩემი პროგრესი</span>
                        </Link>
                    </div>
                </motion.div>

                {/* Sections Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">

                    {/* Section 1: Vibe Coding */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="group">
                        <Link href="/encyclopedia/vibe-coding">
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100 hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer h-full group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-100 transition-colors" />

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <TbCode size={28} className="text-white" />
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 border border-purple-200">
                                            <TbFlame size={14} className="text-purple-600 animate-pulse" />
                                            <span className="text-xs font-semibold text-purple-700">პოპულარული</span>
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">ვაიბ კოდინგი</h2>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">AI-ასისტირებული პროგრამირების სრული გზამკვლევი. ისწავლე როგორ წერო კოდი გონებით.</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-purple-50">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                            <TbBook size={16} className="text-purple-500" />
                                            <span>~{getTotalArticleCountVibe()} სტატია</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                                            <TbArrowRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* AI 2026 Section */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="group">
                        <Link href="/encyclopedia/ai-2026">
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer h-full group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-100 transition-colors" />

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <TbRocket size={28} className="text-white" />
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 border border-blue-200">
                                            <TbSparkles size={14} className="text-blue-600" />
                                            <span className="text-xs font-semibold text-blue-700">ახალი</span>
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">AI 2026</h2>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">კაცობრიობის დიდი ფილტრი. მომავლის პროფესიები და გადარჩენის გზამკვლევი.</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-blue-50">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                            <TbBook size={16} className="text-blue-500" />
                                            <span>1 სტატია</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            <TbArrowRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Section 8: Video Tutorials (Coming Soon) */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="group relative">
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 h-full opacity-60">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                                    <TbVideo size={28} className="text-white" />
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 border border-orange-200">
                                    <TbCalendar size={14} className="text-orange-600" />
                                    <span className="text-xs font-semibold text-orange-700">მალე</span>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">ვიდეო გაკვეთილები</h2>
                            <p className="text-gray-600 text-sm mb-4">50+ ვიდეო ტუტორიალი, 20+ საათი.</p>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <span className="text-sm font-semibold text-gray-500">იანვარი 2026</span>
                                <TbLock size={20} className="text-gray-400" />
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
                            <div className="text-center">
                                <TbSparkles size={32} className="mx-auto mb-2 text-orange-500" />
                                <p className="text-lg font-bold text-gray-900">მალე</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
