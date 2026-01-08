'use client';

import Link from 'next/link';
import { TbChevronRight, TbHome } from 'react-icons/tb';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
            <Link
                href="/"
                className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
                <TbHome size={16} />
                <span className="sr-only">მთავარი</span>
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-1.5">
                    <TbChevronRight size={14} className="text-muted-foreground/50" />
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="hover:text-foreground transition-colors truncate max-w-[150px] sm:max-w-none"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-foreground font-medium truncate max-w-[150px] sm:max-w-none">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
}
