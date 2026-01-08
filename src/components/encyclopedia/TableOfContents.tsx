'use client';

import { useEffect, useState } from 'react';
import { TbList, TbChevronRight } from 'react-icons/tb';

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
    const [items, setItems] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        // Parse markdown headings
        const headingRegex = /^(#{1,3})\s+(.+)$/gm;
        const headings: TOCItem[] = [];
        let match;

        while ((match = headingRegex.exec(content)) !== null) {
            const level = match[1].length;
            const text = match[2].trim();
            const id = text
                .toLowerCase()
                .replace(/[^a-zა-ჰ0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .slice(0, 50);

            headings.push({ id, text, level });
        }

        setItems(headings);
    }, [content]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-80px 0px -80% 0px' }
        );

        items.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [items]);

    if (items.length < 3) return null;

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="bg-secondary/30 rounded-xl p-4 mb-8 border border-border/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 w-full text-left font-semibold text-sm"
            >
                <TbList size={18} />
                <span>სარჩევი</span>
                <TbChevronRight
                    size={16}
                    className={`ml-auto transition-transform ${isOpen ? 'rotate-90' : ''}`}
                />
            </button>

            {isOpen && (
                <nav className="mt-3 space-y-1">
                    {items.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => scrollToHeading(item.id)}
                            className={`
                                block w-full text-left text-sm py-1.5 px-2 rounded-lg transition-all
                                ${item.level === 1 ? 'font-medium' : ''}
                                ${item.level === 2 ? 'pl-4 text-muted-foreground' : ''}
                                ${item.level === 3 ? 'pl-6 text-muted-foreground/80 text-xs' : ''}
                                ${activeId === item.id
                                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                    : 'hover:bg-secondary'}
                            `}
                        >
                            {item.text}
                        </button>
                    ))}
                </nav>
            )}
        </div>
    );
}
