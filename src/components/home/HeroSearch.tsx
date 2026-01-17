'use client';

import { useState } from 'react';
import { TbSearch, TbCommand } from 'react-icons/tb';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function HeroSearch() {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={cn(
            "relative w-full max-w-md transition-all duration-300",
            isFocused ? "scale-105" : "scale-100"
        )}>
            <div className={cn(
                "absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-xl transition-opacity duration-300",
                isFocused ? "opacity-100" : "opacity-0"
            )} />

            <div className="relative flex items-center group">
                <TbSearch className={cn(
                    "absolute left-4 w-5 h-5 transition-colors duration-300",
                    isFocused ? "text-primary" : "text-muted-foreground"
                )} />

                <Input
                    type="text"
                    placeholder="რისი სწავლა გსურს დღეს? (მაგ: ChatGPT, Midjourney...)"
                    className="pl-12 pr-12 py-3 sm:py-4 text-base sm:text-lg rounded-xl border-primary/20 bg-background/50 backdrop-blur-sm focus:bg-background focus:border-primary/50 shadow-sm transition-all h-auto"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />

                <div className="absolute right-3 flex items-center gap-2">
                    <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>
            </div>
        </div>
    );
}
