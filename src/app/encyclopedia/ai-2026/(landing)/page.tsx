'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { TbRocket, TbBook, TbArrowRight, TbGift, TbCircleCheck, TbSearch, TbLock } from 'react-icons/tb';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { AI_2026_DATA } from '@/data/ai2026Content';

export default function AI2026Landing() {
    const [search, setSearch] = useState('');
    const { user } = useAuth();

    // Flatten all articles from categories for mobile list
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
        <div className="min-h-screen relative overflow-hidden bg-gray-50">
            {/* === ARTICLE LIST (ყველა ეკრანზე პირველი რასაც ხედავს) === */}
            <div className="pt-20 pb-6 px-4 bg-white border-b border-gray-100">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">🚀 აირჩიეთ სტატია</h1>
                    <p className="text-gray-500 text-sm">აირჩიეთ სასურველი თემა კითხვის დასაწყებად</p>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <TbSearch size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="ძიება..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    />
                </div>

                {/* Article List */}
                <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                    {filteredArticles.map((article) => {
                        const isLocked = !article.isFree && user?.email !== 'andrewaltair@icloud.com';

                        return (
                            <Link
                                key={article.id}
                                href={`/encyclopedia/ai-2026/${article.id}`}
                                className="block bg-gray-50 hover:bg-blue-50 p-4 rounded-xl border border-gray-100 transition-all active:scale-[0.98]"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="font-medium text-gray-900 line-clamp-2 leading-snug text-sm">
                                        {article.title}
                                    </h3>
                                    {isLocked ? (
                                        <TbLock size={16} className="text-gray-400 flex-shrink-0" />
                                    ) : (
                                        <TbBook size={16} className="text-blue-500 flex-shrink-0" />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {filteredArticles.length === 0 && (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <TbSearch size={20} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm">სტატია ვერ მოიძებნა</p>
                    </div>
                )}
            </div>
            {/* === END MOBILE ARTICLE LIST === */}

            {/* Animated Background - distinct form Vibe Coding */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-200/40 via-cyan-200/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-tr from-indigo-200/40 via-blue-200/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-6">
                        <TbRocket size={20} className="text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">მომავლის გზამკვლევი 2026+</span>
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent leading-tight pb-2">
                        AI 2026: დიდი ფილტრი
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        ეს არ არის პროგნოზი, ეს არის განაჩენი. გაიგე, როგორ გამოიყურება სამყარო, სადაც შენ ან 'არქიტექტორი' ხარ, ან 'რესურსი'.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/encyclopedia/ai-2026/library"
                            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                        >
                            <TbBook size={20} />
                            წაიკითხე სტატიები
                            <TbArrowRight size={20} />
                        </Link>
                    </div>
                </motion.div>

                {/* Value Proposition */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-blue-100"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <TbGift size={24} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">რას იღებთ წვდომით</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {[
                            { title: '12 ექსკლუზიური სტატია', value: '60₾' },
                            { title: 'გადარჩენის სტრატეგიები 2026', value: '45₾' },
                            { title: 'მომავლის პროფესიების რეიტინგი', value: '35₾' },
                            { title: 'AI ინსტრუმენტების ნაკრები', value: '30₾' },
                            { title: 'კარიერული ტრანსფორმაციის გეგმა', value: '40₾' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
                                <TbCircleCheck size={24} className="text-green-500 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{item.title}</p>
                                    <p className="text-sm text-blue-600 font-semibold">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <div>
                            <p className="text-sm opacity-90 mb-1 flex items-center gap-1"><TbGift className="w-4 h-4" /> სულ ღირებულება:</p>
                            <p className="text-3xl font-bold">210₾</p>
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
                    className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-blue-100"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
                        შედარება
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-4 px-4 font-semibold text-gray-700">ფუნქცია</th>
                                    <th className="text-center py-4 px-4 font-semibold text-gray-700">უფასო</th>
                                    <th className="text-center py-4 px-4 font-semibold text-blue-600 bg-blue-50 rounded-t-xl">კოდით</th>
                                    <th className="text-center py-4 px-4 font-semibold text-cyan-600 bg-cyan-50 rounded-t-xl">პრემიუმ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { feature: 'ძირითადი სტატიები', free: '1', code: 'All', premium: 'All' },
                                    { feature: 'გადარჩენის სტრატეგიები', free: false, code: true, premium: true },
                                    { feature: 'პროფესიების პროგნოზი', free: 'Top 3', code: 'სრული', premium: 'სრული' },
                                    { feature: 'AI ინსტრუმენტები', free: false, code: true, premium: true },
                                    { feature: 'წვდომა', free: 'შეზღუდული', code: '1 თვე', premium: 'უვადო' },
                                    { feature: 'ფასი', free: '0₾', code: '0₾', premium: '49₾' }
                                ].map((row, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4 font-medium text-gray-900">{row.feature}</td>
                                        <td className="py-4 px-4 text-center text-gray-600">
                                            {typeof row.free === 'boolean' ? (
                                                row.free ? '✅' : '❌'
                                            ) : row.free}
                                        </td>
                                        <td className="py-4 px-4 text-center font-medium text-blue-600 bg-blue-50">
                                            {typeof row.code === 'boolean' ? (
                                                row.code ? '✅' : '❌'
                                            ) : row.code}
                                        </td>
                                        <td className="py-4 px-4 text-center font-medium text-cyan-600 bg-cyan-50">
                                            {typeof row.premium === 'boolean' ? (
                                                row.premium ? '✅' : '❌'
                                            ) : row.premium}
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
                        რას ამბობენ მკითხველები
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                text: 'ეს გზამკვლევი თვალებს აგიხელს. მივხვდი, რატომ უნდა ვისწავლო AI ახლავე.',
                                author: 'დათო ნ.',
                                rating: 5
                            },
                            {
                                text: 'პროგნოზები იმდენად ზუსტია, რომ ცოტა შემეშინდა კიდეც.',
                                author: 'მარიამ ს.',
                                rating: 5
                            },
                            {
                                text: 'აუცილებელი საკითხავი ყველასთვის, ვისაც მომავალში დასაქმება უნდა.',
                                author: 'გიგი ვ.',
                                rating: 5
                            }
                        ].map((testimonial, idx) => (
                            <div key={idx} className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow">
                                <div className="flex gap-1 mb-4 text-yellow-500">
                                    {'⭐'.repeat(testimonial.rating)}
                                </div>
                                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                                <p className="text-sm font-semibold text-blue-600">- {testimonial.author}</p>
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
                    <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-2xl">
                        <h3 className="text-2xl font-bold mb-4">მზად ხარ დიდი ფილტრისთვის?</h3>
                        <p className="text-lg opacity-90 mb-6">ნუ დარჩები ბორტს მიღმა. დაიწყე მომზადება დღესვე.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/encyclopedia/ai-2026/library"
                                className="px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                            >
                                <TbBook className="w-5 h-5" />
                                დაიწყე კითხვა
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
