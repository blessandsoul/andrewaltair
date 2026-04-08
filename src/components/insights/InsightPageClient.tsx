'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TbExternalLink, TbFlame, TbHeart, TbBrain, TbHandClick, TbBulb, TbEye, TbCalendar, TbArrowLeft, TbShare } from 'react-icons/tb';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { InsightRelatedPosts } from './InsightRelatedPosts';

interface InsightPageClientProps {
    insight: {
        id: string;
        slug: string;
        content: string;
        sourceUrl: string;
        sourceTitle: string;
        sourceDomain: string;
        sourceImage: string;
        tags: string[];
        publishedAt: string;
        views: number;
        reactions: {
            fire: number;
            love: number;
            mindblown: number;
            applause: number;
            insightful: number;
        };
        author: {
            name: string;
            avatar?: string;
            role?: string;
        };
    };
    relatedPosts: {
        slug: string;
        title: string;
        excerpt: string;
        coverImage?: string;
        coverImages?: { horizontal?: string };
        categories: string[];
    }[];
    relatedInsights: {
        id: string;
        slug: string;
        content: string;
        excerpt: string;
        sourceUrl: string;
        sourceDomain: string;
        sourceImage: string;
        tags: string[];
        publishedAt: string;
        views: number;
        reactions: {
            fire: number;
            love: number;
            mindblown: number;
            applause: number;
            insightful: number;
        };
    }[];
}

const REACTION_CONFIG = [
    { key: 'fire', icon: TbFlame, label: 'Fire' },
    { key: 'love', icon: TbHeart, label: 'Love' },
    { key: 'mindblown', icon: TbBrain, label: 'Mind Blown' },
    { key: 'applause', icon: TbHandClick, label: 'Applause' },
    { key: 'insightful', icon: TbBulb, label: 'Insightful' },
] as const;

export function InsightPageClient({ insight, relatedPosts, relatedInsights }: InsightPageClientProps) {
    const [reactions, setReactions] = useState(insight.reactions);
    const [isReacting, setIsReacting] = useState(false);

    const handleReaction = async (reaction: string) => {
        if (isReacting) return;
        setIsReacting(true);

        try {
            const res = await fetch(`/api/insights/${insight.id}/react`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reaction }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success) setReactions(data.data);
            }
        } catch {
            // Silent fail
        } finally {
            setIsReacting(false);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            await navigator.share({ title: insight.sourceTitle, url });
        } else {
            await navigator.clipboard.writeText(url);
        }
    };

    const publishedDate = new Date(insight.publishedAt).toLocaleDateString('ka-GE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Back link */}
                <Link
                    href="/insights"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <TbArrowLeft className="w-4 h-4" />
                    Insights
                </Link>

                {/* Source image */}
                {insight.sourceImage && (
                    <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden mb-6">
                        <Image
                            src={insight.sourceImage}
                            alt={insight.sourceTitle || 'Source preview'}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 640px"
                            priority
                        />
                        <div className="absolute bottom-3 left-3">
                            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                                {insight.sourceDomain}
                            </Badge>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="text-foreground whitespace-pre-line leading-relaxed text-[16px] mb-6">
                    {insight.content}
                </div>

                {/* Source link */}
                <a
                    href={insight.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex items-center gap-2 p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors mb-6"
                >
                    <TbExternalLink className="w-5 h-5 text-primary shrink-0" />
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                            {insight.sourceTitle || 'Source'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {insight.sourceDomain}
                        </p>
                    </div>
                </a>

                {/* Tags */}
                {insight.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {insight.tags.map((tag) => (
                            <Link key={tag} href={`/insights?tag=${tag}`}>
                                <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">
                                    #{tag}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Meta + Reactions */}
                <div className="flex items-center justify-between py-4 border-y border-border mb-8">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <TbCalendar className="w-4 h-4" />
                            {publishedDate}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <TbEye className="w-4 h-4" />
                            {insight.views}
                        </span>
                        <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-primary transition-colors" aria-label="Share">
                            <TbShare className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {REACTION_CONFIG.map(({ key, icon: Icon }) => {
                            const count = reactions[key as keyof typeof reactions];
                            return (
                                <button
                                    key={key}
                                    onClick={() => handleReaction(key)}
                                    disabled={isReacting}
                                    className={cn(
                                        'flex items-center gap-1 px-2.5 py-1.5 rounded-full text-sm transition-colors',
                                        'hover:bg-primary/10 text-muted-foreground hover:text-primary',
                                        count > 0 && 'bg-primary/5 text-primary/80'
                                    )}
                                    aria-label={`React with ${key}`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {count > 0 && <span className="text-xs">{count}</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Related articles */}
                <InsightRelatedPosts posts={relatedPosts} />

                {/* Related insights */}
                {relatedInsights.length > 0 && (
                    <section className="mt-8 space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">
                            მსგავსი ინსაითები
                        </h3>
                        <div className="grid gap-3">
                            {relatedInsights.map((related) => (
                                <Link
                                    key={related.slug}
                                    href={`/insights/${related.slug}`}
                                    className="p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors"
                                >
                                    <p className="text-sm text-foreground line-clamp-3">
                                        {related.excerpt}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {related.sourceDomain}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Author */}
                <div className="flex items-center gap-3 mt-10 pt-6 border-t border-border">
                    {insight.author.avatar && (
                        <Image
                            src={insight.author.avatar}
                            alt={insight.author.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    )}
                    <div>
                        <p className="text-sm font-medium text-foreground">{insight.author.name}</p>
                        {insight.author.role && (
                            <p className="text-xs text-muted-foreground">{insight.author.role}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
