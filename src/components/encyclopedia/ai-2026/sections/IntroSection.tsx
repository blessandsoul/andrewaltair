'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { IntroSection as IntroSectionType } from '@/types/ai2026Article';

interface IntroSectionProps {
    section: IntroSectionType;
}

export default function IntroSection({ section }: IntroSectionProps) {
    // Split content into paragraphs
    const paragraphs = section.content.split('\n\n').filter(p => p.trim());

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="my-12"
        >
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-10 shadow-sm">
                <div className="max-w-4xl mx-auto">
                    {paragraphs.map((paragraph, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            {index === 0 ? (
                                // First paragraph: Large, bold
                                <p className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed mb-6">
                                    {paragraph}
                                </p>
                            ) : (
                                // Other paragraphs: Standard body text
                                <div className="prose prose-lg prose-gray max-w-none mb-4">
                                    <ReactMarkdown>{paragraph}</ReactMarkdown>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
