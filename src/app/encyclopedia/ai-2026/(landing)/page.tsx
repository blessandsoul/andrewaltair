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
            </div>
        </div>
    );
}
