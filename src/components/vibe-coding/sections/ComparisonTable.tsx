'use client';

import { motion } from 'framer-motion';
import { ComparisonTableSection } from '@/types/vibeCodingArticle';
import { useState } from 'react';

interface ComparisonTableProps {
    section: ComparisonTableSection;
}

// Light Theme Version
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
                    className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 break-words hyphens-auto"
                >
                    {section.heading}
                </motion.h2>

                {/* Intro Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-gray-600 mb-10 leading-relaxed break-words"
                >
                    {section.intro}
                </motion.p>

                {/* Desktop Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="hidden md:block overflow-hidden rounded-xl border border-purple-200 bg-white shadow-sm"
                >
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-purple-100 bg-purple-50">
                                {section.table_headers.map((header, idx) => (
                                    <th
                                        key={idx}
                                        className="px-6 py-4 text-left text-sm font-bold text-purple-700 uppercase tracking-wider"
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
                                            ? 'rgba(168, 85, 247, 0.05)'
                                            : 'transparent'
                                    }}
                                    className="border-b border-gray-100 transition-colors cursor-default"
                                >
                                    {row.map((cell, cellIdx) => (
                                        <td
                                            key={cellIdx}
                                            className={`px-6 py-4 ${cellIdx === 0 ? 'font-semibold text-gray-900' : 'text-gray-600'
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
                            className="p-5 rounded-xl border border-purple-100 bg-white shadow-sm hover:border-purple-300 transition-colors"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-3 break-words">{row[0]}</h3>
                            <div className="space-y-3 text-sm">
                                {row.slice(1).map((cell, cellIdx) => (
                                    <div key={cellIdx} className="flex flex-row justify-between items-start gap-4 border-b border-dashed border-gray-100 last:border-0 pb-2 last:pb-0">
                                        <span className="text-purple-600 font-medium whitespace-nowrap text-sm mt-0.5">
                                            {section.table_headers[cellIdx + 1]}:
                                        </span>
                                        <span className="text-gray-700 font-medium text-right break-words text-sm flex-1">
                                            {cell}
                                        </span>
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
                    className="mt-12 text-gray-700 leading-relaxed space-y-6 break-words"
                >
                    {section.body.split('###').filter(Boolean).map((subsection, idx) => {
                        const lines = subsection.trim().split('\n');
                        const title = lines[0].trim();
                        const content = lines.slice(1).join('\n').trim();

                        return (
                            <div key={idx} className="space-y-3">
                                {title && (
                                    <h3 className="text-xl font-bold text-purple-700 break-words hyphens-auto">
                                        {title.replace(/^\d+\.\s*/, '')}
                                    </h3>
                                )}
                                <div
                                    className="text-gray-700"
                                    dangerouslySetInnerHTML={{
                                        __html: content
                                            .replace(/\*\*(.+?)\*\*/g, '<strong class="text-purple-700 font-bold">$1</strong>')
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
