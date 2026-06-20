'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TbMenu2, TbX, TbRefresh, TbSearch } from 'react-icons/tb';
import { LOOPS_DATA } from '@/data/loopsContent';

// Clone of VibeReaderSidebar for the LOOPS course. All lessons are free, so the
// lock logic is dropped. Indigo theme, link prefix /encyclopedia/loops/.
export default function LoopsReaderSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const pathname = usePathname();

    const allArticles = useMemo(
        () => LOOPS_DATA.categories.flatMap(cat => cat.articles),
        []
    );

    const filteredArticles = useMemo(() => {
        if (!search.trim()) return allArticles;
        return allArticles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));
    }, [allArticles, search]);

    const currentSlug = pathname.split('/').pop();

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed z-[90] p-3.5 bg-white rounded-full shadow-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all active:scale-95"
                style={{ bottom: '96px', right: '16px' }}
                aria-label="Toggle menu"
            >
                {isOpen ? <TbX size={22} className="text-gray-900" /> : <TbMenu2 size={22} className="text-gray-900" />}
            </button>

            {isOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/50 z-[68]" onClick={() => setIsOpen(false)} />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-[69] w-[85vw] max-w-80
                    bg-white border-r border-gray-200 flex flex-col
                    transform transition-transform duration-300 ease-in-out
                    lg:translate-x-0 lg:static lg:w-80 lg:max-w-none lg:z-auto
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="p-5 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl">
                            <TbRefresh size={22} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">ციკლები</h2>
                            <p className="text-xs text-gray-500">Loops ბიბლიოთეკა</p>
                        </div>
                    </div>

                    <div className="relative">
                        <TbSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ძიება..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                        />
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-4">
                    <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        გაკვეთილები
                    </p>
                    <ul className="space-y-1">
                        {filteredArticles.map((article, idx) => {
                            const isActive = currentSlug === article.id;
                            return (
                                <li key={article.id}>
                                    <Link
                                        href={`/encyclopedia/loops/${article.id}`}
                                        onClick={() => setIsOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                                            transition-all duration-200
                                            ${isActive
                                                ? 'bg-indigo-100 text-indigo-700 font-medium'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }
                                        `}
                                    >
                                        <span className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            {idx + 1}
                                        </span>
                                        <span className="truncate">{article.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {filteredArticles.length === 0 && (
                        <p className="px-3 py-4 text-sm text-gray-500 text-center">
                            გაკვეთილი ვერ მოიძებნა
                        </p>
                    )}
                </nav>
            </aside>
        </>
    );
}
