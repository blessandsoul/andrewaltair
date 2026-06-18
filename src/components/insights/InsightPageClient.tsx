'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TbExternalLink, TbFlame, TbHeart, TbBrain, TbHandClick, TbBulb, TbEye, TbCalendar, TbArrowLeft, TbShare, TbClock } from 'react-icons/tb';
import { cn } from '@/lib/utils';
import { tagToSlug } from '@/lib/slug';
import { Badge } from '@/components/ui/badge';
import { InsightRelatedPosts } from './InsightRelatedPosts';
import { Comments } from '@/components/interactive/Comments';
import { PersonaLikeStack } from '@/components/ai/PersonaLikeStack';

interface InsightPageClientProps {
    /** Parsed content body — headline first-line + "წყარო:" attribution
     *  lines stripped (those render in dedicated UI blocks). Server-computed in
     *  page.tsx via parseInsightBody() so JSON-LD articleBody and rendered
     *  paragraphs agree byte-for-byte. */
    parsedBody: {
        paragraphs: string[];
        readingMinutes: number;
        chars: number;
    };
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
        likedBy?: { personaId: string; name: string }[];
        author: {
            name: string;
            avatar?: string;
            role?: string;
        };
        seo?: {
            metaTitle?: string;
            metaDescription?: string;
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
    initialComments?: any[];
    /** Render locale. 'ka' (default, /insights) or 'en' (/en/insights). Drives
     *  link prefixes, date formatting, and the few UI strings on this page. */
    locale?: 'ka' | 'en';
}

const REACTION_CONFIG = [
    { key: 'fire', icon: TbFlame, label: 'Fire' },
    { key: 'love', icon: TbHeart, label: 'Love' },
    { key: 'mindblown', icon: TbBrain, label: 'Mind Blown' },
    { key: 'applause', icon: TbHandClick, label: 'Applause' },
    { key: 'insightful', icon: TbBulb, label: 'Insightful' },
] as const;

export function InsightPageClient({ insight, parsedBody, relatedPosts, relatedInsights, initialComments, locale = 'ka' }: InsightPageClientProps) {
    const [reactions, setReactions] = useState(insight.reactions);
    const [isReacting, setIsReacting] = useState(false);

    const isEn = locale === 'en';
    const basePath = isEn ? '/en/insights' : '/insights';
    const dateLocale = isEn ? 'en-US' : 'ka-GE';

    // Sources without an og:image (e.g. perplexity.ai) leave sourceImage empty;
    // fall back to the site's generated OG title-card so the article still has a hero.
    const heroImage = insight.sourceImage
        || `/api/og?title=${encodeURIComponent((insight.seo?.metaTitle || insight.sourceTitle || 'Insight').slice(0, 90))}&type=insight`;

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

    const publishedDate = new Date(insight.publishedAt).toLocaleDateString(dateLocale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Back link */}
                <Link
                    href={basePath}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <TbArrowLeft className="w-4 h-4" />
                    Insights
                </Link>

                {/* Headline (H1) — required for SEO + accessibility outline.
                    Before: page had no article-level H1; Google semantic crawler
                    saw site-header H1 only, no signal that this URL is about a
                    specific story. */}
                {(insight.seo?.metaTitle || insight.sourceTitle) && (
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                        {insight.seo?.metaTitle || insight.sourceTitle}
                    </h1>
                )}

                {/* Source image */}
                {heroImage && (
                    <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden mb-6">
                        <Image
                            src={heroImage}
                            alt={insight.sourceTitle || 'Source preview'}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 640px"
                            priority
                            // external news CDN — bypass the optimizer (remotePatterns is a strict allowlist now)
                            unoptimized
                        />
                        <div className="absolute bottom-3 left-3">
                            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                                {insight.sourceDomain}
                            </Badge>
                        </div>
                    </div>
                )}

                {/* Content — rendered as semantic <p> tags from parsedBody.paragraphs
                    (headline first-line + "წყარო:" attribution lines already removed
                    server-side). Each paragraph gets its own block for proper outline
                    structure + screen-reader navigation. */}
                <div className="space-y-4 mb-6">
                    {parsedBody.paragraphs.map((para, i) => (
                        <p
                            key={i}
                            className="text-foreground leading-relaxed text-[17px] md:text-[18px]"
                        >
                            {para}
                        </p>
                    ))}
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
                            <Link key={tag} href={`${basePath}?tag=${encodeURIComponent(tagToSlug(tag))}`}>
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
                        {parsedBody.readingMinutes > 0 && (
                            <span className="flex items-center gap-1.5" title={isEn ? `${parsedBody.chars} chars` : `${parsedBody.chars} სიმბოლო`}>
                                <TbClock className="w-4 h-4" />
                                {parsedBody.readingMinutes} {isEn ? 'min' : 'წთ'}
                            </span>
                        )}
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
                        <h2 className="text-lg font-semibold text-foreground">
                            {isEn ? 'Related insights' : 'მსგავსი ინსაითები'}
                        </h2>
                        <div className="grid gap-3">
                            {relatedInsights.map((related) => (
                                <Link
                                    key={related.slug}
                                    href={`${basePath}/${related.slug}`}
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

                {insight.likedBy && insight.likedBy.length > 0 && (
                    <div className="mt-8">
                        <PersonaLikeStack likedBy={insight.likedBy} />
                    </div>
                )}

                {/* Comments (incl. AI personas) */}
                <Comments postId={insight.id} initialComments={initialComments} className="mt-10 pt-6 border-t border-border" />

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
