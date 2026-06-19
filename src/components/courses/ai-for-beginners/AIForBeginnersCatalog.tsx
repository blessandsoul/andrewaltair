'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TbNotebook, TbFileText, TbChevronRight } from 'react-icons/tb';
import manifestJson from '@/data/courses/ai-for-beginners/manifest.json';
import type { CourseManifest } from '@/types/course';
import { courseBase } from './accent';
import ModuleIcon from './ModuleIcon';

const manifest = manifestJson as CourseManifest;

export default function AIForBeginnersCatalog() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {manifest.modules.map((m, idx) => (
                <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(idx * 0.05, 0.3) }}
                    className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all"
                >
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                            <ModuleIcon name={m.icon} size={24} />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-emerald-600/70">{String(m.order).padStart(2, '0')}</span>
                                <h3 className="text-lg font-bold text-gray-900 leading-tight">{m.title}</h3>
                            </div>
                            {m.description && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{m.description}</p>}
                        </div>
                    </div>

                    <ul className="space-y-1">
                        {m.lessons.map((l) => (
                            <li key={l.slug}>
                                <Link
                                    href={`${courseBase}/${l.slug}`}
                                    className="group flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                                >
                                    {l.kind === 'notebook'
                                        ? <TbNotebook size={16} className="shrink-0 text-emerald-500" />
                                        : <TbFileText size={16} className="shrink-0 text-gray-400 group-hover:text-emerald-500" />}
                                    <span className="truncate flex-1">{l.title}</span>
                                    {l.kind === 'notebook'
                                        ? <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-600 shrink-0">კოდი</span>
                                        : l.readingMinutes ? <span className="text-[11px] text-gray-400 shrink-0">{l.readingMinutes}'</span> : null}
                                    <TbChevronRight size={14} className="shrink-0 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            ))}
        </div>
    );
}
