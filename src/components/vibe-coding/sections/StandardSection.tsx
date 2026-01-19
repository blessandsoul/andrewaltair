'use client';

import { motion } from 'framer-motion';
import { SectionStandard } from '@/types/vibeCodingArticle';

interface StandardSectionProps {
    section: SectionStandard;
    renderWithGlossary: (text: string) => React.ReactNode;
}

export default function StandardSection({ section, renderWithGlossary }: StandardSectionProps) {
    return (
        <section className="py-8 md:py-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Section Heading */}
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 break-words hyphens-auto"
                >
                    {section.heading}
                </motion.h2>

                {/* Highlight Quote - Glowing Blockquote */}
                {section.highlight_quote && (
                    <motion.blockquote
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative my-12 p-8 text-center"
                    >
                        {/* Glowing border effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00f3ff]/10 via-[#a855f7]/10 to-[#ff00ff]/10 blur-sm" />
                        <div className="absolute inset-0 rounded-xl border border-[#00f3ff]/50 bg-white shadow-lg" />

                        <div className="relative z-10">
                            <p className="text-2xl md:text-3xl font-bold text-gray-900 italic mb-4">
                                &ldquo;{section.highlight_quote.text}&rdquo;
                            </p>
                            <footer className="text-[#a855f7] font-semibold">
                                — {section.highlight_quote.author}, {section.highlight_quote.year}
                            </footer>
                        </div>
                    </motion.blockquote>
                )}

                {/* Body Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-gray-700 leading-relaxed space-y-4 break-words"
                >
                    {section.body.split('\n\n').map((paragraph, idx) => {
                        // Handle markdown-style lists
                        if (paragraph.trim().startsWith('1.') || paragraph.trim().startsWith('-')) {
                            const items = paragraph.split('\n').filter(line => line.trim());
                            return (
                                <ul key={idx} className="list-none space-y-2 ml-4">
                                    {items.map((item, itemIdx) => (
                                        <li key={itemIdx} className="flex items-start gap-2">
                                            <span className="text-[#00f3ff] mt-1 font-bold">▸</span>
                                            <span>{renderWithGlossary(item.replace(/^[\d\.\-\*]\s*/, '').trim())}</span>
                                        </li>
                                    ))}
                                </ul>
                            );
                        }

                        // Handle bold text **text**
                        const formattedText = paragraph.replace(
                            /\*\*(.+?)\*\*/g,
                            '<strong class="text-[#a855f7] font-semibold">$1</strong>'
                        );

                        return (
                            <p
                                key={idx}
                                dangerouslySetInnerHTML={{ __html: formattedText }}
                            />
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
