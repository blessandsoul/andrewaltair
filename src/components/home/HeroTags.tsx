'use client';

import { Badge } from '@/components/ui/badge';
import { TbTrendingUp } from 'react-icons/tb';
import Link from 'next/link';

const tags = [
    { label: 'ChatGPT 5', href: '/tags/chatgpt' },
    { label: 'Midjourney', href: '/tags/midjourney' },
    { label: 'AI აგენტები', href: '/tags/agents' },
    { label: 'ბიზნესი', href: '/tags/business' },
    { label: 'უფასო', href: '/tags/free' }
];

export function HeroTags() {
    return (
        <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <span className="text-sm text-muted-foreground flex items-center gap-1 mr-2">
                <TbTrendingUp className="w-4 h-4 text-accent" />
                პოპულარული:
            </span>
            {tags.map((tag) => (
                <Link key={tag.label} href={tag.href}>
                    <Badge
                        variant="secondary"
                        className="px-3 py-1 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer border-transparent hover:border-primary/20"
                    >
                        #{tag.label}
                    </Badge>
                </Link>
            ))}
        </div>
    );
}
