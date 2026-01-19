'use client';

import { motion } from 'framer-motion';
import { ComparisonTableSection } from '@/types/vibeCodingArticle';
import { useState } from 'react';

interface ComparisonTableProps {
    section: ComparisonTableSection;
}

export default function ComparisonTable({ section }: ComparisonTableProps) {
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    return (
        <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto">
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
                    className="text-gray-400 mb-10 leading-relaxed"
                >
                    {section.intro}
                </motion.p>

                {/* Desktop Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="hidden md:block overflow-hidden rounded-xl border border-[#00f3ff]/20 backdrop-blur-sm bg-[#0a0a1a]/50"
                >
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#00f3ff]/20 bg-[#00f3ff]/5">
                                {section.table_headers.map((header, idx) => (
                                    <th
                                        key={idx}
                                        className="px-6 py-4 text-left text-sm font-bold text-[#00f3ff] uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {section.table_rows.map((row, rowIdx) => (
                                <motion.tr
                                    key={rowIdx}
                                    onMouseEnter={() => setHoveredRow(rowIdx)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    animate={{
                                        backgroundColor: hoveredRow === rowIdx
                                            ? 'rgba(0, 243, 255, 0.08)'
                                            : 'transparent'
                                    }}
                                    className="border-b border-white/5 transition-colors cursor-default"
                                >
                                    {row.map((cell, cellIdx) => (
                                        <td
                                            key={cellIdx}
                                            className={`px-6 py-4 ${cellIdx === 0 ? 'font-semibold text-white' : 'text-gray-400'
                                                } ${cellIdx === row.length - 1 ? 'text-lg' : ''}`}
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                    {section.table_rows.map((row, rowIdx) => (
                        <motion.div
                            key={rowIdx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: rowIdx * 0.1 }}
                            className="p-4 rounded-xl border border-[#00f3ff]/20 bg-[#0a0a1a]/50 backdrop-blur-sm"
                        >
                            <h3 className="text-lg font-bold text-white mb-3">{row[0]}</h3>
                            <div className="space-y-2 text-sm">
                                {row.slice(1).map((cell, cellIdx) => (
                                    <div key={cellIdx} className="flex justify-between">
                                        <span className="text-gray-500">
                                            {section.table_headers[cellIdx + 1]}:
                                        </span>
                                        <span className="text-gray-300">{cell}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Body Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-12 text-gray-300 leading-relaxed space-y-6"
                >
                    {section.body.split('###').filter(Boolean).map((subsection, idx) => {
                        const lines = subsection.trim().split('\n');
                        const title = lines[0].trim();
                        const content = lines.slice(1).join('\n').trim();

                        return (
                            <div key={idx} className="space-y-3">
                                {title && (
                                    <h3 className="text-xl font-bold text-[#00f3ff]">
                                        {title.replace(/^\d+\.\s*/, '')}
                                    </h3>
                                )}
                                <div
                                    className="text-gray-300"
                                    dangerouslySetInnerHTML={{
                                        __html: content
                                            .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
                                            .replace(/\n/g, '<br />')
                                    }}
                                />
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
