'use client';

// Consumes the pre-computed headings[] from the lesson JSON (ids already match
// CourseMarkdown's heading slugger), so it never re-parses raw markdown.
import { useEffect, useState } from 'react';
import { TbList, TbChevronRight } from 'react-icons/tb';
import type { CourseHeading } from '@/types/course';

export default function CourseTableOfContents({ headings }: { headings: CourseHeading[] }) {
    const [activeId, setActiveId] = useState('');
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); }),
            { rootMargin: '-80px 0px -80% 0px' }
        );
        headings.forEach((h) => { const el = document.getElementById(h.id); if (el) observer.observe(el); });
        return () => observer.disconnect();
    }, [headings]);

    if (headings.length < 3) return null;

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top, behavior: 'smooth' });
    };

    return (
        <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 w-full text-left font-semibold text-sm text-gray-800">
                <TbList size={18} className="text-emerald-600" />
                <span>სარჩევი</span>
                <TbChevronRight size={16} className={`ml-auto transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            {isOpen && (
                <nav className="mt-3 space-y-0.5">
                    {headings.map((h, i) => (
                        <button
                            key={i}
                            onClick={() => scrollTo(h.id)}
                            className={`block w-full text-left text-sm py-1.5 px-2 rounded-lg transition-all
                                ${h.level === 1 ? 'font-medium' : ''}
                                ${h.level === 2 ? 'pl-3 text-gray-600' : ''}
                                ${h.level === 3 ? 'pl-6 text-gray-500 text-xs' : ''}
                                ${activeId === h.id ? 'bg-emerald-100 text-emerald-700 font-medium' : 'hover:bg-emerald-100/60'}`}
                        >
                            {h.text}
                        </button>
                    ))}
                </nav>
            )}
        </div>
    );
}
