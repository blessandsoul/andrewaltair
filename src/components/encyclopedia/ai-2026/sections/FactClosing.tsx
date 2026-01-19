'use client';

import { motion } from 'framer-motion';
import { FactSection } from '@/types/ai2026Article';

interface FactClosingProps {
    section: FactSection;
}

export default function FactClosing({ section }: FactClosingProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-16 px-4 md:px-8"
        >
            <div className="max-w-3xl mx-auto">
                {/* Clean light card */}
                <div className="relative">
                    <motion.div
                        initial={{ scale: 0.95 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gray-50 border border-gray-200 rounded-2xl p-8 md:p-10 text-center shadow-sm"
                    >
                        {/* Shield Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                            className="text-6xl mb-6"
                        >
                            🛡️
                        </motion.div>

                        {/* Content */}
                        <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                            {section.content.replace(/🛡️\s*/, '')}
                        </p>

                        {/* Decorative line */}
                        <div className="mt-8 h-px bg-gray-200" />

                        {/* Author signature */}
                        <p className="mt-6 text-gray-900 font-semibold text-sm uppercase tracking-wider">
                            Alpha Architect
                        </p>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}
