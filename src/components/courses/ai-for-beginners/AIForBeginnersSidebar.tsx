'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TbMenu2, TbX, TbSearch, TbNotebook, TbFileText, TbSchool } from 'react-icons/tb';
import manifestJson from '@/data/courses/ai-for-beginners/manifest.json';
import type { CourseManifest } from '@/types/course';
import { courseBase } from './accent';
import ModuleIcon from './ModuleIcon';

const manifest = manifestJson as CourseManifest;

export default function AIForBeginnersSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const pathname = usePathname();

    const q = search.trim().toLowerCase();
    const modules = useMemo(() => {
        if (!q) return manifest.modules;
        return manifest.modules
            .map((m) => ({ ...m, lessons: m.lessons.filter((l) => l.title.toLowerCase().includes(q)) }))
            .filter((m) => m.lessons.length > 0);
    }, [q]);

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed z-[90] p-3.5 bg-white rounded-full shadow-xl border border-emerald-200 text-emerald-600 active:scale-95 transition-all"
                style={{ bottom: '96px', right: '16px' }}
                aria-label="მენიუ"
            >
                {isOpen ? <TbX size={22} /> : <TbMenu2 size={22} />}
            </button>

            {isOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-[68]" onClick={() => setIsOpen(false)} />}

            <aside
                className={`fixed inset-y-0 left-0 z-[69] w-[85vw] max-w-80 bg-white border-r border-gray-200 flex flex-col
                    transform transition-transform duration-300 ease-in-out
                    lg:translate-x-0 lg:static lg:w-80 lg:max-w-none lg:z-auto
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex-shrink-0">
                    <Link href={courseBase} className="flex items-center gap-3 mb-4 group">
                        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                            <TbSchool size={22} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors leading-tight">AI დამწყებთათვის</h2>
                            <p className="text-xs text-gray-500">{manifest.totals.lessons} გაკვეთილი · {manifest.totals.modules} მოდული</p>
                        </div>
                    </Link>
                    <div className="relative">
                        <TbSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text" placeholder="ძიება..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                        />
                    </div>
                </div>

                {/* Modules */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-4">
                    {modules.map((m) => (
                        <div key={m.id}>
                            <p className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                <ModuleIcon name={m.icon} size={14} className="shrink-0 text-emerald-500" />
                                <span className="truncate">{m.title}</span>
                            </p>
                            <ul className="space-y-0.5">
                                {m.lessons.map((l) => {
                                    const href = `${courseBase}/${l.slug}`;
                                    const isActive = pathname === href;
                                    return (
                                        <li key={l.slug}>
                                            <Link
                                                href={href}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                                                    ${isActive ? 'bg-emerald-100 text-emerald-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                                            >
                                                {l.kind === 'notebook'
                                                    ? <TbNotebook size={15} className="shrink-0 text-emerald-500/80" />
                                                    : <TbFileText size={15} className="shrink-0 text-gray-400" />}
                                                <span className="truncate">{l.title}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                    {modules.length === 0 && <p className="px-3 py-4 text-sm text-gray-500 text-center">ვერ მოიძებნა</p>}
                </nav>
            </aside>
        </>
    );
}
