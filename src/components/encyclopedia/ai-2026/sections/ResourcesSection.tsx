'use client';

import { motion } from 'framer-motion';
import { ResourcesSection as ResourcesSectionType } from '@/types/ai2026Article';
import { TbExternalLink } from 'react-icons/tb';

interface ResourcesSectionProps {
    section: ResourcesSectionType;
}

export default function ResourcesSection({ section }: ResourcesSectionProps) {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="py-12 px-4 md:px-8"
        >
            <div className="max-w-5xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                        📚 რესურსები
                    </h3>
                    <div className="h-1 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full" />
                </motion.div>

                {/* Resource Categories */}
                <div className="space-y-10">
                    {section.categories.map((category, cIndex) => (
                        <div key={cIndex}>
                            <h4 className="text-xl font-semibold text-gray-900 mb-6">
                                {category.name}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {category.items.map((item, iIndex) => (
                                    <motion.div
                                        key={iIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: iIndex * 0.05 }}
                                        whileHover={{ y: -4, scale: 1.02 }}
                                        className="group relative bg-white border border-gray-200 rounded-xl p-5 cursor-pointer transition-all hover:shadow-md hover:border-blue-200"
                                    >
                                        {/* Glow effect on hover */}
                                        <div className="absolute inset-0 rounded-xl bg-blue-50/0 group-hover:bg-blue-50/50 transition-all" />

                                        <div className="relative">
                                            <div className="flex items-start justify-between gap-2">
                                                <h5 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                                    {item.title}
                                                </h5>
                                                {item.link && (
                                                    <TbExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0 transition-colors" />
                                                )}
                                            </div>
                                            {item.author && (
                                                <p className="text-gray-500 text-sm mt-1">
                                                    {item.author}
                                                </p>
                                            )}
                                            {item.desc && (
                                                <p className="text-gray-600 text-sm mt-2">
                                                    {item.desc}
                                                </p>
                                            )}
                                        </div>

                                        {/* Clickable link overlay */}
                                        {item.link && (
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="absolute inset-0 z-10"
                                            />
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
