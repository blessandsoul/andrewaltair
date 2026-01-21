'use client';

import { motion } from 'framer-motion';
import {
    TbLock,
    TbLockOpen,
    TbSearch,
    TbList,
    TbX,
    TbChevronLeft,
    TbChevronRight,
    TbBrandTelegram,
    TbBook,
    TbArrowRight,
    TbCircleCheck,
    TbStar,
    TbGift,
    TbShare,
    TbUsers,
    TbCalendar,
    TbTrophy,
    TbDownload,
    TbSparkles,
    TbChartBar,
    TbBulb,
    TbRocket,
    TbDeviceLaptop,
    TbCheck,
    TbClock
} from 'react-icons/tb';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { FAQSchema } from '@/components/blog/ArticleSchema';
import { useAuth } from '@/lib/auth';
import { VIBE_CODING_DATA } from '@/data/vibeCodingContent';

// FAQ data for SEO
const vibeCodingFAQs = [
    {
        question: "რა არის Vibe Coding?",
        answer: "Vibe Coding არის AI-ასისტირებული პროგრამირების მეთოდი, სადაც დეველოპერი აღწერს რა სურს ბუნებრივ ენაზე და AI გენერირებს კოდს. ტერმინი Andrej Karpathy-მ შემოიღო 2025 წელს."
    },
    {
        question: "რომელი ინსტრუმენტები გამოიყენება Vibe Coding-ში?",
        answer: "ძირითადი ინსტრუმენტებია: Cursor IDE, Windsurf, Claude Code, ChatGPT, და Claude. ეს AI-კოდის ასისტენტები გეხმარებიან კოდის გენერაციაში, debugging-ში და refactoring-ში."
    },
    {
        question: "შემიძლია Vibe Coding უფასოდ?",
        answer: "დიახ! ChatGPT-ს აქვს უფასო ვერსია, Cursor IDE-ს აქვს უფასო trial, ხოლო Claude აქვს ლიმიტირებული უფასო წვდომა. Andrew Altair-ზე ასევე გაქვთ უფასო სასწავლო მასალები."
    },
    {
        question: "რამდენ ხანშია შესაძლებელი Vibe Coding-ის სწავლა?",
        answer: "საფუძვლები შეგიძლიათ ისწავლოთ რამდენიმე საათში. სრული proficiency-სთვის საჭიროა 2-4 კვირა პრაქტიკა. Andrew Altair-ის კურსი გეხმარებათ სწავლის დაჩქარებაში."
    }
];

export default function VibeCodingLanding() {
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [referralCode] = useState('USER123');
    const [search, setSearch] = useState('');
    const { user } = useAuth();

    // Flatten all articles from categories for mobile list
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

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#fafafa' }}>
            {/* FAQ Schema for SEO */}
            <FAQSchema items={vibeCodingFAQs} />

            {/* === MOBILE ARTICLE LIST (მობილურზე პირველი რასაც ხედავს) === */}
            <div className="lg:hidden pt-20 pb-6 px-4 bg-white border-b border-gray-100">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">📚 აირჩიეთ სტატია</h1>
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
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                    />
                </div>

                {/* Article List */}
                <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                    {filteredArticles.map((article) => {
                        const isLocked = !article.isFree && user?.email !== 'andrewaltair@icloud.com';

                        return (
                            <Link
                                key={article.id}
                                href={`/encyclopedia/vibe-coding/${article.id}`}
                                className="block bg-gray-50 hover:bg-purple-50 p-4 rounded-xl border border-gray-100 transition-all active:scale-[0.98]"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="font-medium text-gray-900 line-clamp-2 leading-snug text-sm">
                                        {article.title}
                                    </h3>
                                    {isLocked ? (
                                        <TbLock size={16} className="text-gray-400 flex-shrink-0" />
                                    ) : (
                                        <TbBook size={16} className="text-purple-500 flex-shrink-0" />
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
                        <TbSparkles size={20} className="text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">AI-ასისტირებული პროგრამირების სრული გაიდი</span>
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight pb-2">
                        ვაიბ კოდინგის ბიბლიოთეკა
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
                            <TbBook size={20} />
                            წაიკითხე სტატიები
                            <TbArrowRight size={20} />
                        </Link>

                        <a
                            href="https://t.me/andr3waltairchannel"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 rounded-xl bg-white border-2 border-purple-200 text-purple-600 font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2"
                        >
                            <TbBrandTelegram size={20} />
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
                            <TbGift size={24} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">რას იღებთ წვდომით</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {[
                            { title: '10 პრემიუმ სტატია', value: '50₾' },
                            { title: 'ანდრეი კარპატის ექსკლუზიური ანალიზი', value: '30₾' },
                            { title: '2025 ინსტრუმენტების სრული რეიტინგი', value: '25₾' },
                            { title: 'პროფესიონალური პრომპტინგის სტრატეგიები', value: '40₾' },
                            { title: 'რეალური პროექტების ქეისები', value: '35₾' }
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
                    transition={{ delay: 0.2 }}
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
                    transition={{ delay: 0.3 }}
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
                    transition={{ delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl">
                        <h3 className="text-2xl font-bold mb-4">მზად ხარ დასაწყებად?</h3>
                        <p className="text-lg opacity-90 mb-6">შეუერთდი ათასობით დეველოპერს რომლებიც უკვე იყენებენ AI-ს</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/encyclopedia/vibe-coding/library"
                                className="px-8 py-4 rounded-xl bg-white text-purple-600 font-semibold hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                            >
                                <TbBook size={20} />
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
