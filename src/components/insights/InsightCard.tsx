'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TbExternalLink, TbFlame, TbHeart, TbBrain, TbHandClick, TbBulb, TbEye, TbCalendar } from 'react-icons/tb';
import { cn } from '@/lib/utils';
import { tagToSlug } from '@/lib/slug';
import { Badge } from '@/components/ui/badge';
import { PersonaLikeStack } from '@/components/ai/PersonaLikeStack';

interface InsightCardProps {
    insight: {
        id: string;
        slug: string;
        content: string;
        excerpt: string;
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
        likedBy?: { personaId: string; name: string }[];
    };
}

const REACTION_CONFIG = [
    { key: 'fire', icon: TbFlame, label: 'Fire' },
    { key: 'love', icon: TbHeart, label: 'Love' },
    { key: 'mindblown', icon: TbBrain, label: 'Mind Blown' },
    { key: 'applause', icon: TbHandClick, label: 'Applause' },
    { key: 'insightful', icon: TbBulb, label: 'Insightful' },
] as const;

export function InsightCard({ insight }: InsightCardProps) {
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
                if (data.success) {
                    setReactions(data.data);
                }
            }
        } catch {
            // Silent fail for reactions
        } finally {
            setIsReacting(false);
        }
    };

    const publishedDate = new Date(insight.publishedAt).toLocaleDateString('ka-GE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <article className="bg-card border border-border rounded-2xl overflow-hidden transition-all hover:border-primary/20 hover:shadow-lg">
            {/* Source Image */}
            {insight.sourceImage && (
                <Link href={`/insights/${insight.slug}`}>
                    <div className="relative w-full aspect-[2/1] overflow-hidden">
                        <Image
                            src={insight.sourceImage}
                            alt={insight.sourceTitle || 'Source preview'}
                            fill
                            className="object-cover transition-transform hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 640px"
                        />
                        {/* Domain badge */}
                        <div className="absolute bottom-3 left-3">
                            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs">
                                {insight.sourceDomain}
                            </Badge>
                        </div>
                        {insight.likedBy && insight.likedBy.length > 0 && (
                            <div className="absolute top-3 right-3 z-10">
                                <PersonaLikeStack likedBy={insight.likedBy} overlay size="xs" max={4} showCount={false} />
                            </div>
                        )}
                    </div>
                </Link>
            )}

            {/* Content */}
            <div className="p-5 space-y-4">
                {/* Full text */}
                <Link href={`/insights/${insight.slug}`} className="block">
                    <div className="text-foreground whitespace-pre-line leading-relaxed text-[15px]">
                        {insight.content}
                    </div>
                </Link>

                {/* Tags */}
                {insight.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {insight.tags.slice(0, 6).map((tag) => (
                            <Link key={tag} href={`/insights?tag=${encodeURIComponent(tagToSlug(tag))}`}>
                                <Badge
                                    variant="outline"
                                    className="text-xs hover:bg-primary/10 transition-colors cursor-pointer"
                                >
                                    #{tag}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Source link */}
                <a
                    href={insight.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                    <TbExternalLink className="w-4 h-4 shrink-0" />
                    <span className="truncate">{insight.sourceTitle || insight.sourceUrl}</span>
                </a>

                {/* Footer: date, views, reactions */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <TbCalendar className="w-3.5 h-3.5" />
                            {publishedDate}
                        </span>
                        <span className="flex items-center gap-1">
                            <TbEye className="w-3.5 h-3.5" />
                            {insight.views}
                        </span>
                    </div>

                    {/* Reactions */}
                    <div className="flex items-center gap-1">
                        {REACTION_CONFIG.map(({ key, icon: Icon }) => {
                            const count = reactions[key as keyof typeof reactions];
                            return (
                                <button
                                    key={key}
                                    onClick={() => handleReaction(key)}
                                    disabled={isReacting}
                                    className={cn(
                                        'flex items-center gap-0.5 px-1.5 py-1 rounded-full text-xs transition-colors',
                                        'hover:bg-primary/10 text-muted-foreground hover:text-primary',
                                        count > 0 && 'text-primary/70'
                                    )}
                                    aria-label={`React with ${key}`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {count > 0 && <span>{count}</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </article>
    );
}
