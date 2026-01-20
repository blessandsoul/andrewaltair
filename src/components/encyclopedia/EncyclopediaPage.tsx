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
    TbChartPie
} from 'react-icons/tb';
import { useState } from 'react';
import Link from 'next/link';
import { EncyclopediaSearch, useEncyclopediaSearch } from './EncyclopediaSearch';

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
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100 hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                        <TbBook size={28} className="text-white" />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 border border-green-200">
                                        <TbCircleCheck size={14} className="text-green-600" />
                                        <span className="text-xs font-semibold text-green-700">ხელმისაწვდომი</span>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Vibe Coding</h2>
                                <p className="text-gray-600 text-sm mb-4">AI-ასისტირებული პროგრამირება. 12+ სტატია.</p>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div className="flex items-center gap-1.5">
                                        <TbStar size={16} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-semibold text-gray-900">4.9/5</span>
                                    </div>
                                    <TbArrowRight size={20} className="text-purple-600 group-hover:translate-x-1 transition-transform" />
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

                {/* Vibe Coding Detailed Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-purple-100"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <TbGift size={24} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">რას იღებთ Vibe Coding წვდომით</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {[
                            { title: '12 პრემიუმ სტატია', value: '50₾' },
                            { title: 'Andrej Karpathy ექსკლუზიური ანალიზი', value: '30₾' },
                            { title: '2025 ინსტრუმენტების სრული რეიტინგი', value: '25₾' },
                            { title: 'პროფესიონალური Prompting სტრატეგიები', value: '40₾' },
                            { title: 'რეალური პროექტების case studies', value: '35₾' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                                <TbCircleCheck size={24} className="text-green-500 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{item.title}</p>
                                    <p className="text-sm text-purple-600 font-semibold">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <div>
                            <p className="text-sm opacity-90 mb-1 flex items-center gap-1"><TbGift className="w-4 h-4" /> სულ ღირებულება:</p>
                            <p className="text-3xl font-bold">180₾</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm opacity-90 mb-1 flex items-center justify-end gap-1">💰 თქვენი ფასი:</p>
                            <p className="text-3xl font-bold">0₾</p>
                            <p className="text-xs opacity-75">(კოდით - დროებითი წვდომა)</p>
                        </div>
                    </div>
                </motion.div>

                {/* Comparison Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-purple-100"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
                        <TbChartBar className="text-purple-600" /> შედარება
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-4 px-4 font-semibold text-gray-700">ფუნქცია</th>
                                    <th className="text-center py-4 px-4 font-semibold text-gray-700">უფასო</th>
                                    <th className="text-center py-4 px-4 font-semibold text-purple-600 bg-purple-50 rounded-t-xl">კოდით</th>
                                    <th className="text-center py-4 px-4 font-semibold text-pink-600 bg-pink-50 rounded-t-xl">პრემიუმ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { feature: 'ძირითადი სტატიები', free: '2', code: '12', premium: '12' },
                                    { feature: 'ექსპერტების ანალიზი', free: false, code: true, premium: true },
                                    { feature: 'ინსტრუმენტების შედარება', free: 'TOP-3', code: '15+', premium: '15+' },
                                    { feature: 'რეალური case studies', free: false, code: true, premium: true },
                                    { feature: 'ხანგრძლივობა', free: '-', code: '1 საათი', premium: 'უვადოდ' },
                                    { feature: 'ფასი', free: '0₾', code: '0₾', premium: '29₾/თვე' }
                                ].map((row, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4 font-medium text-gray-900">{row.feature}</td>
                                        <td className="py-4 px-4 text-center text-gray-600">
                                            {typeof row.free === 'boolean' ? (
                                                row.free ? <TbCheck className="mx-auto text-green-500" /> : <TbX className="mx-auto text-red-400" />
                                            ) : row.free}
                                        </td>
                                        <td className="py-4 px-4 text-center font-medium text-purple-600 bg-purple-50">
                                            {typeof row.code === 'boolean' ? (
                                                row.code ? <TbCheck className="mx-auto text-green-600" /> : <TbX className="mx-auto text-red-500" />
                                            ) : (
                                                (row.code === '12' || row.code === '15+') ? <span className="flex items-center justify-center gap-1"><TbCheck size={14} /> {row.code}</span> : row.code
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-center font-medium text-pink-600 bg-pink-50">
                                            {typeof row.premium === 'boolean' ? (
                                                row.premium ? <TbCheck className="mx-auto text-green-600" /> : <TbX className="mx-auto text-red-500" />
                                            ) : (
                                                (row.premium === '12' || row.premium === '15+') ? <span className="flex items-center justify-center gap-1"><TbCheck size={14} /> {row.premium}</span> : row.premium
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Testimonials */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-12"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
                        <TbUsers className="text-purple-600" /> რას ამბობენ მომხმარებლები
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                text: 'ერთ საათში ვისწავლე მეტი ვიდრე 3 თვეში YouTube-დან',
                                author: 'ნიკა ბ.',
                                rating: 5
                            },
                            {
                                text: 'Andrej Karpathy-ს ანალიზი ღირს ყველაფერს',
                                author: 'გიორგი მ.',
                                rating: 5
                            },
                            {
                                text: 'საუკეთესო ინვესტიცია ჩემს კარიერაში',
                                author: 'ანა კ.',
                                rating: 5
                            }
                        ].map((testimonial, idx) => (
                            <div key={idx} className="bg-white rounded-xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <TbStar key={i} size={20} className="text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                                <p className="text-sm font-semibold text-purple-600">- {testimonial.author}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                >
                    <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl">
                        <h3 className="text-2xl font-bold mb-4">მზად ხარ დასაწყებად?</h3>
                        <p className="text-lg opacity-90 mb-6">შეუერთდი ათასობით დეველოპერს რომლებიც უკვე იყენებენ AI-ს</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/encyclopedia/vibe-coding"
                                className="px-8 py-4 rounded-xl bg-white text-purple-600 font-semibold hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                            >
                                <TbRocket className="w-5 h-5" />
                                დაიწყე უფასოდ
                            </Link>
                            <a
                                href="https://t.me/andr3waltairchannel"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 rounded-xl bg-transparent border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors flex items-center gap-2"
                            >
                                <TbBrandTelegram size={20} />
                                პრემიუმის მიღება
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
