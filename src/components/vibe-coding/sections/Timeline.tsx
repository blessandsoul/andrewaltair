'use client';

import { motion } from 'framer-motion';
import { TimelineSection } from '@/types/vibeCodingArticle';
import { useState } from 'react';

interface TimelineProps {
    section: TimelineSection;
}

export default function Timeline({ section }: TimelineProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="py-20 px-6 relative">
            <div className="max-w-4xl mx-auto">
                {/* Section Heading */}
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold mb-6 text-white"
                >
                    {section.heading}
                </motion.h2>

                {/* Intro Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-gray-400 mb-12 leading-relaxed"
                >
                    {section.intro.trim()}
                </motion.p>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00f3ff] via-[#a855f7] to-[#ff00ff]" />

                    {/* Events */}
                    <div className="space-y-12">
                        {section.events.map((event, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative flex items-start gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}
                                onMouseEnter={() => setActiveIndex(index)}
                                onMouseLeave={() => setActiveIndex(null)}
                            >
                                {/* Node */}
                                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 z-10">
                                    <motion.div
                                        animate={{
                                            boxShadow: activeIndex === index
                                                ? '0 0 20px 4px rgba(0, 243, 255, 0.6)'
                                                : '0 0 10px 2px rgba(0, 243, 255, 0.3)'
                                        }}
                                        className="w-4 h-4 rounded-full bg-[#00f3ff] border-2 border-[#050510]"
                                    />
                                </div>

                                {/* Content Card */}
                                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                                    }`}>
                                    {/* Year Badge */}
                                    <span className="inline-block px-3 py-1 mb-3 text-sm font-mono font-bold rounded bg-[#00f3ff]/10 text-[#00f3ff] border border-[#00f3ff]/30">
                                        {event.year}
                                    </span>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {event.title}
                                    </h3>

                                    {/* Description - Shows on hover */}
                                    <motion.p
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                            height: activeIndex === index ? 'auto' : 0,
                                            opacity: activeIndex === index ? 1 : 0
                                        }}
                                        className="text-gray-400 text-sm overflow-hidden"
                                    >
                                        {event.desc}
                                    </motion.p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Body Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 text-gray-300 leading-relaxed space-y-4"
                >
                    {section.body.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph.trim()}</p>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
