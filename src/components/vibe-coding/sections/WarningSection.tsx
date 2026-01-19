'use client';

import { motion } from 'framer-motion';
import { WarningSection as WarningSectionType } from '@/types/vibeCodingArticle';
import { TbAlertTriangle } from 'react-icons/tb';

interface WarningSectionProps {
    section: WarningSectionType;
}

export default function WarningSection({ section }: WarningSectionProps) {
    return (
        <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Warning Container with Pulsing Border */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-2xl overflow-hidden"
                >
                    {/* Pulsing Red Border Effect */}
                    <motion.div
                        animate={{
                            boxShadow: [
                                '0 0 20px 0px rgba(255, 0, 0, 0.3)',
                                '0 0 40px 5px rgba(255, 0, 0, 0.5)',
                                '0 0 20px 0px rgba(255, 0, 0, 0.3)',
                            ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-2xl border-2 border-red-500/50"
                    />

                    {/* Dark Red Gradient Background -> Light Red */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-red-50" />

                    {/* Content */}
                    <div className="relative z-10 p-8">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="p-3 rounded-xl bg-red-500/20 text-red-400"
                            >
                                <TbAlertTriangle className="w-8 h-8" />
                            </motion.div>
                            <h2 className="text-3xl md:text-4xl font-bold text-red-600">
                                {section.heading}
                            </h2>
                        </div>

                        {/* Intro Body */}
                        <p className="text-gray-700 mb-8 leading-relaxed">
                            {section.body}
                        </p>

                        {/* Warning Cards */}
                        <div className="space-y-4">
                            {section.warnings.map((warning, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-5 rounded-xl bg-red-50 border border-red-200 hover:border-red-400 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <TbAlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-bold text-red-300 mb-2">
                                                {warning.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                {warning.desc}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
