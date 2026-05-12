'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { TbLoader2 } from 'react-icons/tb';
import { InsightCard } from './InsightCard';
import { Badge } from '@/components/ui/badge';
import { tagToSlug } from '@/lib/slug';

interface Insight {
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
}

interface InsightsFeedProps {
    initialInsights: Insight[];
    initialHasMore: boolean;
    activeTag?: string | null;
    allTags?: string[];
}

export function InsightsFeed({ initialInsights, initialHasMore, activeTag, allTags = [] }: InsightsFeedProps) {
    const [insights, setInsights] = useState<Insight[]>(initialInsights);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const observerRef = useRef<HTMLDivElement>(null);

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore || insights.length === 0) return;
        setIsLoading(true);

        try {
            const lastSlug = insights[insights.length - 1].slug;
            const params = new URLSearchParams({
                afterSlug: lastSlug,
                limit: '10',
                status: 'published',
            });
            if (activeTag) params.set('tag', activeTag);

            const res = await fetch(`/api/insights?${params}`);
            const data = await res.json();

            if (data.success) {
                const newInsights = data.data.items;
                setInsights((prev) => [...prev, ...newInsights]);
                setHasMore(data.data.pagination.hasNextPage);
            }
        } catch {
            // Silent fail
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, hasMore, insights, activeTag]);

    // Intersection observer for infinite scroll
    useEffect(() => {
        const target = observerRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { rootMargin: '200px' }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [loadMore]);

    return (
        <div className="space-y-6">
            {/* Tag filter */}
            {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <a href="/insights">
                        <Badge
                            variant={!activeTag ? 'default' : 'outline'}
                            className="cursor-pointer"
                        >
                            All
                        </Badge>
                    </a>
                    {allTags.map((tag) => (
                        <a key={tag} href={`/insights?tag=${encodeURIComponent(tagToSlug(tag))}`}>
                            <Badge
                                variant={activeTag === tag ? 'default' : 'outline'}
                                className="cursor-pointer"
                            >
                                #{tag}
                            </Badge>
                        </a>
                    ))}
                </div>
            )}

            {/* Feed */}
            <div className="flex flex-col gap-6 max-w-2xl mx-auto">
                {insights.map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                ))}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={observerRef} className="flex justify-center py-8">
                {isLoading && (
                    <TbLoader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                )}
                {!hasMore && insights.length > 0 && (
                    <p className="text-sm text-muted-foreground">All insights loaded</p>
                )}
            </div>
        </div>
    );
}
