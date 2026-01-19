'use client';

import { motion } from 'framer-motion';
import { ChecklistSection as ChecklistSectionType } from '@/types/vibeCodingArticle';
import { useState } from 'react';
import { TbCheck } from 'react-icons/tb';

interface ChecklistSectionProps {
    section: ChecklistSectionType;
}

export default function ChecklistSection({ section }: ChecklistSectionProps) {
    const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

    const toggleItem = (index: number) => {
        const newChecked = new Set(checkedItems);
        if (newChecked.has(index)) {
            newChecked.delete(index);
        } else {
            newChecked.add(index);
        }
        setCheckedItems(newChecked);
    };

    return (
        <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Section Heading */}
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold mb-10 text-gray-900"
                >
                    {section.heading}
                </motion.h2>

                {/* Checklist */}
                <div className="space-y-4 mb-12">
                    {section.checklist.map((item, index) => (
                        <motion.button
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => toggleItem(index)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left group ${checkedItems.has(index)
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 shadow-sm'
                                }`}
                        >
                            {/* Checkbox */}
                            <div
                                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${checkedItems.has(index)
                                    ? 'border-green-500 bg-green-500'
                                    : 'border-gray-300 group-hover:border-purple-400'
                                    }`}
                            >
                                {checkedItems.has(index) && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 500 }}
                                    >
                                        <TbCheck className="w-4 h-4 text-black" strokeWidth={3} />
                                    </motion.div>
                                )}
                            </div>

                            {/* Text */}
                            <span
                                className={`flex-1 transition-colors ${checkedItems.has(index)
                                    ? 'text-green-700 font-medium'
                                    : 'text-gray-700 group-hover:text-gray-900'
                                    }`}
                            >
                                {item}
                            </span>
                        </motion.button>
                    ))}
                </div>

                {/* Progress Indicator */}
                <div className="mb-12">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">თქვენი პროგრესი</span>
                        <span className="text-[#00ff41] font-mono">
                            {checkedItems.size}/{section.checklist.length}
                        </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(checkedItems.size / section.checklist.length) * 100}%` }}
                            className="h-full bg-gradient-to-r from-[#00f3ff] to-[#00ff41] rounded-full"
                        />
                    </div>
                </div>

                {/* Body Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-gray-700 leading-relaxed space-y-4"
                >
                    {section.body.split('\n\n').map((paragraph, idx) => {
                        // Handle step headers like **ნაბიჯი 1:**
                        if (paragraph.includes('**ნაბიჯი')) {
                            return (
                                <div key={idx} className="p-4 rounded-lg bg-gray-50 border border-gray-200 shadow-sm">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: paragraph
                                                .replace(/\*\*(.+?)\*\*/g, '<strong class="text-purple-600">$1</strong>')
                                                .replace(/\n/g, '<br />')
                                        }}
                                    />
                                </div>
                            );
                        }
                        return (
                            <p
                                key={idx}
                                dangerouslySetInnerHTML={{
                                    __html: paragraph
                                        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900">$1</strong>')
                                }}
                            />
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
