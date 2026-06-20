'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    TbRefresh, TbBolt, TbTarget, TbCoin, TbArrowRight, TbBook, TbPlayerPlayFilled,
} from 'react-icons/tb';
import { LOOPS_DATA, getAllArticles } from '@/data/loopsContent';

const LEARN = [
    { icon: TbRefresh, title: 'რა არის ციკლი', desc: 'მარტივი ახსნა ერთი სურათით: როგორ მუშაობს აგენტი მიზნის მიღწევამდე.' },
    { icon: TbBolt, title: 'ტრიგერი და მიზანი', desc: 'ციკლის ორი ნაწილი: რა იწყებს მას და რა აჩერებს.' },
    { icon: TbTarget, title: 'რეალური მაგალითები', desc: 'მზა ციკლები, რომელთა გამეორებაც შენც შეგიძლია.' },
    { icon: TbCoin, title: 'სად გამოდგება', desc: 'სად მუშაობს ციკლი კარგად, სად ცუდად, და რატომ ღირს ის ძვირი.' },
];

export default function LoopsLanding() {
    const lessons = getAllArticles();
    const firstLesson = lessons[0];

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* soft brand wash, not a full-bleed AI gradient */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 right-0 w-[620px] h-[620px] bg-indigo-100/50 rounded-full blur-3xl" />
                <div className="absolute top-1/3 -left-40 w-[480px] h-[480px] bg-violet-100/40 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 md:py-24">
                {/* Hero, centered over the wash */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
                        <TbRefresh size={18} className="text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-700">მინი კურსი AI ციკლებზე</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-5 leading-tight">
                        ციკლები <span className="text-indigo-600">(Loops)</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                        ისწავლე, როგორ ამუშავებ AI აგენტს დამოუკიდებლად, სანამ ის მიზანს არ მიაღწევს.
                        ისე მარტივად ახსნილი, რომ მეათე კლასელიც მიხვდება.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {firstLesson && (
                            <Link
                                href={`/encyclopedia/loops/${firstLesson.id}`}
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all hover:scale-105"
                            >
                                <TbPlayerPlayFilled size={18} />
                                დაიწყე სწავლა
                            </Link>
                        )}
                        <Link
                            href="/encyclopedia/loops/library"
                            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-gray-800 rounded-xl font-semibold border border-gray-200 shadow-sm hover:border-indigo-300 transition-all"
                        >
                            <TbBook size={18} className="text-indigo-600" />
                            ყველა გაკვეთილი
                        </Link>
                    </div>
                </motion.div>

                {/* What you'll learn, 2x2 (not a three-equal-card row) */}
                <div className="mt-20 md:mt-28">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">რას ისწავლი</h2>
                    <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
                        {LEARN.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="flex gap-4 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm"
                            >
                                <div className="shrink-0 w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <item.icon size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Lesson list, as a numbered stack */}
                <div className="mt-20 md:mt-28">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">გაკვეთილები</h2>
                    <div className="space-y-3 max-w-3xl mx-auto">
                        {lessons.map((lesson, i) => (
                            <motion.div
                                key={lesson.id}
                                initial={{ opacity: 0, x: -16 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.06 }}
                            >
                                <Link
                                    href={`/encyclopedia/loops/${lesson.id}`}
                                    className="flex items-center gap-4 p-4 md:p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group"
                                >
                                    <span className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold">
                                        {i + 1}
                                    </span>
                                    <span className="flex-1 font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                        {lesson.title}
                                    </span>
                                    <TbArrowRight className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" size={20} />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* closing line */}
                <div className="mt-20 md:mt-28 text-center">
                    <p className="text-gray-500">
                        {LOOPS_DATA.categories.length} ნაწილი, {lessons.length} მოკლე გაკვეთილი, სრულიად უფასოდ.
                    </p>
                </div>
            </div>
        </div>
    );
}
