'use client';

import { motion } from 'framer-motion';
import { SectionIntro } from '@/types/vibeCodingArticle';

interface HeroIntroProps {
    section: SectionIntro;
}

export default function HeroIntro({ section }: HeroIntroProps) {
    return (
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-20 bg-white">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-purple-50/30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent opacity-50" />

            {/* Grain overlay */}
            <div className="absolute inset-0 opacity-40 mix-blend-multiply"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat'
                }}
            />

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                {/* Main Heading with Gradient */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-gray-900"
                >
                    <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
                        {section.heading.replace(/👋\s*/, '')}
                    </span>
                </motion.h1>

                {/* Body Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                    className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto"
                >
                    {section.body.split('\n\n').slice(0, 2).map((paragraph, idx) => (
                        <p key={idx} className="mb-6">
                            {paragraph.trim()}
                        </p>
                    ))}
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-12"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-6 h-10 mx-auto rounded-full border-2 border-purple-400/50 flex items-start justify-center p-2"
                    >
                        <motion.div className="w-1.5 h-3 bg-purple-500 rounded-full" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
