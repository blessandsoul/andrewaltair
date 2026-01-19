'use client';

import { motion } from 'framer-motion';
import { SectionOutro } from '@/types/vibeCodingArticle';
import { TbRocket } from 'react-icons/tb';
import Link from 'next/link';

interface OutroSectionProps {
    section: SectionOutro;
}

export default function OutroSection({ section }: OutroSectionProps) {
    return (
        <section className="py-10 md:py-16 px-6 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#00f3ff]/5 via-transparent to-transparent" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Section Heading */}
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold mb-8 text-gray-900"
                >
                    {section.heading}
                </motion.h2>

                {/* Body Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-gray-700 leading-relaxed space-y-4 mb-12"
                >
                    {section.body.split('\n\n').map((paragraph, idx) => (
                        <p
                            key={idx}
                            dangerouslySetInnerHTML={{
                                __html: paragraph
                                    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-purple-600">$1</strong>')
                                    .replace(/\\\"(.+?)\\\"/g, '<em class="text-pink-600">"$1"</em>')
                            }}
                        />
                    ))}
                </motion.div>

                {/* Call to Action Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <Link
                        href={section.call_to_action.url}
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-[#00f3ff] to-[#a855f7] text-black hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] hover:scale-105"
                    >
                        <TbRocket className="w-6 h-6" />
                        {section.call_to_action.text}
                    </Link>
                </motion.div>

                {/* Decorative elements */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-[#00f3ff]/50 to-transparent" />
            </div>
        </section>
    );
}
