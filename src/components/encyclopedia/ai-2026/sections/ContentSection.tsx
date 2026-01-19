'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ContentSection as ContentSectionType } from '@/types/ai2026Article';

interface ContentSectionProps {
    section: ContentSectionType;
}

// Parse special patterns from the content
function parseContent(content: string) {
    const lines = content.split('\n');
    const elements: Array<{ type: string; content: string; header?: string }> = [];
    let currentBlock: { type: string; content: string; header?: string } | null = null;

    lines.forEach(line => {
        // Check for section headers (### N. Title)
        if (line.match(/^###\s+\d+\.\s+/)) {
            if (currentBlock) elements.push(currentBlock);
            currentBlock = { type: 'header', content: line };
            return;
        }

        // Check for special patterns
        if (line.startsWith('რა არის ეს:')) {
            if (currentBlock) elements.push(currentBlock);
            currentBlock = { type: 'definition', header: 'რა არის ეს:', content: line.replace('რა არის ეს:', '').trim() };
            return;
        }

        if (line.startsWith('სცენარი')) {
            if (currentBlock) elements.push(currentBlock);
            currentBlock = { type: 'scenario', header: line.includes(':') ? line.split(':')[0] + ':' : 'სცენარი:', content: line.replace(/^სცენარი[^:]*:/, '').trim() };
            return;
        }

        if (line.startsWith('რატომ ხარ დებილი')) {
            if (currentBlock) elements.push(currentBlock);
            currentBlock = { type: 'wakeup', header: 'რატომ ხარ დებილი:', content: line.replace(/^რატომ ხარ დებილი[^:]*:/, '').trim() };
            return;
        }

        if (line.startsWith('ვინ გადარჩება?')) {
            if (currentBlock) elements.push(currentBlock);
            currentBlock = { type: 'survivor', header: 'ვინ გადარჩება?', content: '' };
            return;
        }

        if (line.startsWith('აგრესიული რეალობა:')) {
            if (currentBlock) elements.push(currentBlock);
            currentBlock = { type: 'aggressive', header: 'აგრესიული რეალობა:', content: line.replace('აგრესიული რეალობა:', '').trim() };
            return;
        }

        // If we're in a block, append content
        if (currentBlock) {
            currentBlock.content += '\n' + line;
        } else {
            // Default content block
            currentBlock = { type: 'default', content: line };
        }
    });

    if (currentBlock) elements.push(currentBlock);
    return elements;
}

export default function ContentSection({ section }: ContentSectionProps) {
    const elements = parseContent(section.content);

    const renderElement = (element: { type: string; content: string; header?: string }, index: number) => {
        switch (element.type) {
            case 'header':
                // Extract number and title from ### N. Title format
                const headerMatch = element.content.match(/^###\s+(\d+)\.\s+(.+)/);
                if (headerMatch) {
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="mb-8"
                        >
                            <h3 className="flex items-center gap-4 text-2xl md:text-3xl font-bold text-gray-900 uppercase">
                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 border border-yellow-200 text-lg">
                                    {headerMatch[1]}
                                </span>
                                <span className="border-b-2 border-yellow-400 pb-1">{headerMatch[2]}</span>
                            </h3>
                        </motion.div>
                    );
                }
                return null;

            case 'definition':
                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="border-l-4 border-blue-500 bg-blue-50 p-6 rounded-r-lg mb-6"
                    >
                        <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2 block">
                            {element.header}
                        </span>
                        <div className="prose prose-gray max-w-none">
                            <ReactMarkdown>{element.content}</ReactMarkdown>
                        </div>
                    </motion.div>
                );

            case 'scenario':
                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🎬</span>
                            <span className="text-gray-700 font-semibold uppercase text-sm tracking-wider">
                                {element.header}
                            </span>
                        </div>
                        <div className="prose prose-gray max-w-none text-gray-700">
                            <ReactMarkdown>{element.content}</ReactMarkdown>
                        </div>
                    </motion.div>
                );

            case 'wakeup':
                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-xl mb-6 shadow-sm border border-red-200"
                    >
                        <div className="relative bg-red-50 p-6 rounded-xl">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">☠️</span>
                                <span className="text-red-600 font-bold uppercase text-sm tracking-wider">
                                    {element.header}
                                </span>
                            </div>
                            <div className="prose prose-gray max-w-none text-gray-800">
                                <ReactMarkdown>{element.content}</ReactMarkdown>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'survivor':
                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="border-l-4 border-green-500 bg-green-50 p-6 rounded-r-lg mb-6"
                    >
                        <span className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-2 block">
                            {element.header}
                        </span>
                        <div className="prose prose-gray max-w-none">
                            <ReactMarkdown>{element.content}</ReactMarkdown>
                        </div>
                    </motion.div>
                );

            case 'aggressive':
                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="border-l-4 border-red-500 bg-red-50 p-6 rounded-r-lg mb-6"
                    >
                        <span className="text-red-600 font-semibold text-sm uppercase tracking-wider mb-2 block">
                            {element.header}
                        </span>
                        <div className="prose prose-gray max-w-none">
                            <ReactMarkdown>{element.content}</ReactMarkdown>
                        </div>
                    </motion.div>
                );

            default:
                return (
                    <div key={index} className="prose prose-lg prose-gray max-w-none mb-4">
                        <ReactMarkdown>{element.content}</ReactMarkdown>
                    </div>
                );
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="py-12 px-4 md:px-8"
        >
            <div className="max-w-4xl mx-auto">
                {elements.map((element, index) => renderElement(element, index))}
            </div>
        </motion.section>
    );
}
