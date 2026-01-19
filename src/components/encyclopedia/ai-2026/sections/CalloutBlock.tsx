'use client';

import { motion } from 'framer-motion';
import { CalloutSection } from '@/types/ai2026Article';

interface CalloutBlockProps {
    section: CalloutSection;
}

const variantStyles = {
    warning: {
        border: 'border-red-500',
        icon: '⚠️',
        text: 'text-red-600',
        bg: 'bg-red-50',
    },
    tip: {
        border: 'border-blue-500',
        icon: '💡',
        text: 'text-blue-600',
        bg: 'bg-blue-50',
    },
    example: {
        border: 'border-yellow-500',
        icon: '📌',
        text: 'text-yellow-600',
        bg: 'bg-yellow-50',
    },
    counter: {
        border: 'border-purple-500',
        icon: '🤔',
        text: 'text-purple-600',
        bg: 'bg-purple-50',
    },
};

export default function CalloutBlock({ section }: CalloutBlockProps) {
    const style = variantStyles[section.variant] || variantStyles.warning;

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="py-6 px-4 md:px-8"
        >
            <div className="max-w-4xl mx-auto">
                <div className={`border-l-4 ${style.border} ${style.bg} p-6 rounded-r-xl`}>
                    <div className="flex items-start gap-4">
                        <span className="text-2xl flex-shrink-0">{style.icon}</span>
                        <div>
                            <span className={`${style.text} font-semibold text-sm uppercase tracking-wider block mb-2`}>
                                {section.variant === 'counter' ? 'Counter-Argument' : section.variant}
                            </span>
                            <p className="text-gray-700 leading-relaxed">
                                {section.content}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
