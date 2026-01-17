'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
    TbBrain,
    TbPhoto,
    TbCode,
    TbMusic,
    TbCpu,
    TbSparkles
} from 'react-icons/tb';

type Category = 'All' | 'LLMs' | 'Visual' | 'Dev' | 'Audio' | 'Auto';

interface Tool {
    label: string;
    href: string;
    category: Category;
    isNew?: boolean;
}

const tools: Tool[] = [
    // LLMs
    { label: 'ChatGPT', href: '/encyclopedia?q=ChatGPT', category: 'LLMs' },
    { label: 'Claude', href: '/encyclopedia?q=Claude', category: 'LLMs' },
    { label: 'Gemini', href: '/encyclopedia?q=Gemini', category: 'LLMs' },
    { label: 'Grok', href: '/encyclopedia?q=Grok', category: 'LLMs', isNew: true },
    { label: 'Perplexity', href: '/tools?q=Perplexity', category: 'LLMs' },
    { label: 'Copilot', href: '/tools?q=Copilot', category: 'LLMs' },
    { label: 'Qwen', href: '/encyclopedia?q=Qwen', category: 'LLMs' },
    { label: 'Nano Banana', href: '/prompts?q=Banana', category: 'LLMs' },

    // Visual
    { label: 'Midjourney', href: '/prompts?category=midjourney', category: 'Visual' },
    { label: 'Sora', href: '/encyclopedia?q=Sora', category: 'Visual', isNew: true },
    { label: 'Runway', href: '/tools?q=Runway', category: 'Visual' },
    { label: 'Kling', href: '/tools?q=Kling', category: 'Visual', isNew: true },
    { label: 'Higgsfield', href: '/tools?q=Higgsfield', category: 'Visual' },

    // Dev / Coding
    { label: 'Cursor', href: '/tools?q=Cursor', category: 'Dev' },
    { label: 'Windsurf', href: '/tools?q=Windsurf', category: 'Dev', isNew: true },
    { label: 'v0', href: '/tools?q=v0', category: 'Dev' },
    { label: 'Bolt.new', href: '/tools?q=Bolt', category: 'Dev', isNew: true },
    { label: 'Replit', href: '/tools?q=Replit', category: 'Dev' },
    { label: 'Lovable', href: '/tools?q=Lovable', category: 'Dev' },
    { label: 'Google AI Studio', href: '/tools?q=Studio', category: 'Dev' },

    // Audio
    { label: 'Suno', href: '/tools?q=Suno', category: 'Audio' },
    { label: 'Udio', href: '/tools?q=Udio', category: 'Audio' },
    { label: 'ElevenLabs', href: '/tools?q=ElevenLabs', category: 'Audio' },

    // Automation / Other
    { label: 'N8N', href: '/tools?q=n8n', category: 'Auto' },
    { label: 'Zapier', href: '/tools?q=Zapier', category: 'Auto' },
    { label: 'NotebookLM', href: '/tools?q=NotebookLM', category: 'Auto', isNew: true },
];

const categories: { id: Category; label: string; icon: any }[] = [
    { id: 'All', label: 'ყველა', icon: TbSparkles },
    { id: 'LLMs', label: 'Chatbots', icon: TbBrain },
    { id: 'Visual', label: 'ვიზუალი', icon: TbPhoto },
    { id: 'Dev', label: 'კოდინგი', icon: TbCode },
    { id: 'Audio', label: 'აუდიო', icon: TbMusic },
    { id: 'Auto', label: 'Workflow', icon: TbCpu },
];

export function HeroTags() {
    const [activeCategory, setActiveCategory] = useState<Category>('All');

    const filteredTools = activeCategory === 'All'
        ? tools
        : tools.filter(t => t.category === activeCategory);

    return (
        <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1 bg-secondary/30 backdrop-blur-sm rounded-xl border border-primary/10 w-fit">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300",
                            activeCategory === cat.id
                                ? "bg-primary text-primary-foreground shadow-md scale-105"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        )}
                    >
                        <cat.icon className="w-3.5 h-3.5" />
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Tags Grid */}
            <div className="flex flex-wrap items-center gap-2 min-h-[80px] content-start">
                {filteredTools.map((tool) => (
                    <Link
                        key={tool.label}
                        href={tool.href}
                        className="group"
                    >
                        <Badge
                            variant="secondary"
                            className={cn(
                                "px-3 py-1.5 text-sm transition-all duration-300 cursor-pointer border hover:border-primary/30",
                                "hover:scale-105 hover:shadow-lg hover:-translate-y-0.5",
                                "bg-background/50 backdrop-blur-sm",
                                tool.isNew && "border-accent/40 bg-accent/5 pr-2.5"
                            )}
                        >
                            <span className="opacity-70 group-hover:opacity-100 transition-opacity">#</span>
                            {tool.label}
                            {tool.isNew && (
                                <span className="ml-2 inline-flex h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                            )}
                        </Badge>
                    </Link>
                ))}
            </div>
        </div>
    );
}
