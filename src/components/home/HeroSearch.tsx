'use client';

import { useState } from 'react';
import { TbSearch } from 'react-icons/tb';
import { cn } from '@/lib/utils';
import { SearchDialog } from '@/components/interactive/SearchDialog';

export function HeroSearch() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <>
            <div
                className={cn(
                    "relative w-full max-w-md transition-all duration-300 cursor-pointer",
                    "hover:scale-[1.02]"
                )}
                onClick={() => setIsSearchOpen(true)}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />

                <div className="relative flex items-center group">
                    <TbSearch className="absolute left-4 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />

                    <div
                        className="w-full pl-12 pr-12 py-3 sm:py-4 text-base sm:text-lg rounded-xl border border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-background hover:border-primary/50 shadow-sm transition-all text-muted-foreground"
                    >
                        რისი სწავლა გსურს დღეს? (მაგ: ChatGPT, Midjourney...)
                    </div>

                    <div className="absolute right-3 flex items-center gap-2">
                        <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>
                </div>
            </div>

            <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
