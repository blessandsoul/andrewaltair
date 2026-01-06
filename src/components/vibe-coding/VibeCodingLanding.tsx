'use client';

import { motion } from 'framer-motion';
import {
    Lock,
    LockOpen,
    MagnifyingGlass,
    List,
    X,
    CaretLeft,
    CaretRight,
    TelegramLogo,
    Book,
    ArrowRight,
    CheckCircle,
    Star,
    Gift,
    Share,
    Users,
    Calendar,
    Trophy,
    Download,
    Sparkle
} from '@phosphor-icons/react';
import { useState } from 'react';
import Link from 'next/link';

export default function VibeCodingLanding() {
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [referralCode] = useState('USER123');

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#fafafa' }}>
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-purple-200/40 via-pink-200/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-blue-200/40 via-cyan-200/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-200/30 to-fuchsia-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 mb-6">
                        <Sparkle size={20} className="text-purple-600" weight="fill" />
                        <span className="text-sm font-medium text-purple-700">AI-ასისტირებული პროგრამირების სრული გაიდი</span>
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight pb-2">
                        Vibe Coding ბიბლიოთეკა
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        სრული სახელმძღვანელო AI-თან წყვილში პროგრამირებაზე.
                        ისწავლე როგორ გამოიყენო Claude, ChatGPT და Cursor პროფესიონალურად.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/encyclopedia/vibe-coding/library"
                            className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                        >
                            <Book size={20} weight="fill" />
                            წაიკითხე სტატიები
                            <ArrowRight size={20} weight="bold" />
                        </Link>

                        <a
                            href="https://t.me/andr3waltairchannel"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 rounded-xl bg-white border-2 border-purple-200 text-purple-600 font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2"
                        >
                            <TelegramLogo size={20} weight="fill" />
                            პრემიუმის მიღება
                        </a>
                    </div>
                </motion.div>

                {/* Value Proposition */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-purple-100"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Gift size={24} className="text-white" weight="fill" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">💎 რას იღებთ წვდომით</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {[
                            { title: '10 პრემიუმ სტატია', value: '50₾' },
                            { title: 'Andrej Karpathy ექსკლუზიური ანალიზი', value: '30₾' },
                            { title: '2025 ინსტრუმენტების სრული რეიტინგი', value: '25₾' },
                            { title: 'პროფესიონალური Prompting სტრატეგიები', value: '40₾' },
                            { title: 'რეალური პროექტების case studies', value: '35₾' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                                <CheckCircle size={24} className="text-green-500 shrink-0 mt-0.5" weight="fill" />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{item.title}</p>
                                    <p className="text-sm text-purple-600 font-semibold">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <div>
                            <p className="text-sm opacity-90 mb-1">🎯 სულ ღირებულება:</p>
                            <p className="text-3xl font-bold">180₾</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm opacity-90 mb-1">💰 თქვენი ფასი:</p>
                            <p className="text-3xl font-bold">0₾</p>
                            <p className="text-xs opacity-75">(კოდით - დროებითი წვდომა)</p>
                        </div>
                    </div>
                </motion.div>

                {/* Comparison Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-purple-100"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">📊 შედარება</h2>

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
                                    { feature: 'ძირითადი სტატიები', free: '2', code: '✅ 12', premium: '✅ 12' },
                                    { feature: 'ექსპერტების ანალიზი', free: '❌', code: '✅', premium: '✅' },
                                    { feature: 'ინსტრუმენტების შედარება', free: 'TOP-3', code: '✅ 15+', premium: '✅ 15+' },
                                    { feature: 'რეალური case studies', free: '❌', code: '✅', premium: '✅' },
                                    { feature: 'ხანგრძლივობა', free: '-', code: '1 საათი', premium: 'უვადოდ' },
                                    { feature: 'ფასი', free: '0₾', code: '0₾', premium: '29₾/თვე' }
                                ].map((row, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4 font-medium text-gray-900">{row.feature}</td>
                                        <td className="py-4 px-4 text-center text-gray-600">{row.free}</td>
                                        <td className="py-4 px-4 text-center font-medium text-purple-600 bg-purple-50">{row.code}</td>
                                        <td className="py-4 px-4 text-center font-medium text-pink-600 bg-pink-50">{row.premium}</td>
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
                    transition={{ delay: 0.3 }}
                    className="mb-12"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">💬 რას ამბობენ მომხმარებლები</h2>

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
                                        <Star key={i} size={20} className="text-yellow-400" weight="fill" />
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
                    transition={{ delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl">
                        <h3 className="text-2xl font-bold mb-4">მზად ხარ დასაწყებად?</h3>
                        <p className="text-lg opacity-90 mb-6">შეუერთდი ათასობით დეველოპერს რომლებიც უკვე იყენებენ AI-ს</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/encyclopedia/vibe-coding/library"
                                className="px-8 py-4 rounded-xl bg-white text-purple-600 font-semibold hover:scale-105 transition-transform shadow-lg"
                            >
                                დაიწყე უფასოდ
                            </Link>
                            <a
                                href="https://t.me/andr3waltairchannel"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 rounded-xl bg-transparent border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
                            >
                                <TelegramLogo size={20} weight="fill" className="inline mr-2" />
                                პრემიუმის მიღება
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
