'use client';

import { motion } from 'framer-motion';
import { MythsFactsSection } from '@/types/vibeCodingArticle';
import { TbX, TbCheck } from 'react-icons/tb';

interface MythsFactsProps {
    section: MythsFactsSection;
}

export default function MythsFacts({ section }: MythsFactsProps) {
    return (
        <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Section Heading */}
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold mb-12 text-gray-900"
                >
                    {section.heading}
                </motion.h2>

                {/* Myth/Fact Pairs */}
                <div className="space-y-6">
                    {section.pairs.map((pair, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="grid md:grid-cols-2 gap-4"
                        >
                            {/* Myth */}
                            <div className="p-5 rounded-xl bg-red-50 border border-red-200 group hover:border-red-400 transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-red-100 text-red-500 flex-shrink-0">
                                        <TbX className="w-5 h-5" strokeWidth={3} />
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase tracking-wider text-red-600 font-bold mb-2 block">
                                            მითი
                                        </span>
                                        <p className="text-gray-700">{pair.myth}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Fact */}
                            <div className="p-5 rounded-xl bg-green-50 border border-green-200 group hover:border-green-400 transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-green-100 text-green-600 flex-shrink-0">
                                        <TbCheck className="w-5 h-5" strokeWidth={3} />
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase tracking-wider text-green-600 font-bold mb-2 block">
                                            რეალობა
                                        </span>
                                        <p className="text-gray-700">{pair.fact}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Body Text */}
                {section.body && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-12 text-gray-700 leading-relaxed space-y-4"
                    >
                        {section.body.split('\n\n').map((paragraph, idx) => (
                            <p
                                key={idx}
                                dangerouslySetInnerHTML={{
                                    __html: paragraph
                                        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900">$1</strong>')
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
