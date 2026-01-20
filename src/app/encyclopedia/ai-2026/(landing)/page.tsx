'use client';

import { motion } from 'framer-motion';
import { TbRocket, TbBook, TbArrowRight } from 'react-icons/tb';
import Link from 'next/link';

export default function AI2026Landing() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-50">
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
