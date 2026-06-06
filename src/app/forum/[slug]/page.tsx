export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TbExternalLink, TbArrowLeft, TbEye } from 'react-icons/tb';

import { ForumService } from '@/services/forum.service';
import { ForumThread, type ForumPostView } from '@/components/forum/ForumThread';
import { ForumCampSplit } from '@/components/forum/ForumCampSplit';
import { ForumPredictions } from '@/components/forum/ForumPredictions';
import { ForumCouncil } from '@/components/forum/ForumCouncil';
import { ForumTabs } from '@/components/forum/ForumTabs';
import { ForumLikeStack, type ForumLiker } from '@/components/forum/ForumLikeStack';
import { ForumDisclaimer } from '@/components/forum/ForumDisclaimer';
import { ForumSubscribeButton } from '@/components/forum/ForumSubscribeButton';
import { ForumAskBox } from '@/components/forum/ForumAskBox';

interface TopicView {
    id: string;
    slug: string;
    titleKa: string;
    summaryKa: string;
    sourceUrl: string;
    sourceImage?: string;
    sourceDomain?: string;
    postCount?: number;
    views?: number;
    verdictKa?: string;
    likedBy?: ForumLiker[];
}

function resolveImage(src: string | undefined, siteUrl: string): string | null {
    if (!src) return null;
    return src.startsWith('http') ? src : `${siteUrl}${src}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const data = await ForumService.getTopicBySlug(slug);
    if (!data) return { title: 'თემა ვერ მოიძებნა | Andrew Altair' };

    const t = data.topic as unknown as TopicView;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge';
    const img = resolveImage(t.sourceImage, siteUrl);

    return {
        title: `${t.titleKa} | ფორუმი`,
        description: t.summaryKa,
        alternates: { canonical: `${siteUrl}/forum/${slug}` },
        openGraph: {
            title: t.titleKa,
            description: t.summaryKa,
            url: `${siteUrl}/forum/${slug}`,
            type: 'article',
            images: img ? [{ url: img }] : [],
        },
    };
}

export default async function ForumTopicPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await ForumService.getTopicBySlug(slug);
    if (!data) return notFound();

    ForumService.incrementViews((data.topic as unknown as TopicView).id).catch(() => {});

    const topic = JSON.parse(JSON.stringify(data.topic)) as TopicView;
    const allPosts = JSON.parse(JSON.stringify(data.posts)) as ForumPostView[];
    const debate = allPosts.filter((p) => !p.isPrediction);
    const predictions = allPosts.filter((p) => p.isPrediction);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge';
    const img = resolveImage(topic.sourceImage, siteUrl);

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-10 max-w-3xl">
                <Link href="/forum" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    <TbArrowLeft className="w-4 h-4" />
                    ფორუმი
                </Link>

                <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-on-surface">{topic.titleKa}</h1>

                {img && (
                    <div className="mt-4 rounded-2xl overflow-hidden border border-border/40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={topic.titleKa} className="w-full object-cover" />
                    </div>
                )}

                <p className="mt-4 text-on-surface-variant leading-relaxed">{topic.summaryKa}</p>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                    <span className="inline-flex items-center gap-1 text-on-surface-variant">
                        <TbEye className="w-4 h-4" />
                        {topic.views || 0} ნახვა
                    </span>
                    {topic.sourceUrl && (
                        <a
                            href={topic.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                            <TbExternalLink className="w-4 h-4" />
                            {topic.sourceDomain || 'წყარო'}
                        </a>
                    )}
                    {topic.likedBy && topic.likedBy.length > 0 && (
                        <ForumLikeStack likedBy={topic.likedBy} size="xs" max={6} />
                    )}
                    <ForumSubscribeButton scope="forum" />
                </div>

                <div className="my-6">
                    <ForumDisclaimer />
                </div>

                <ForumCouncil posts={debate} />

                {topic.verdictKa && (
                    <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                        <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                            დებატის შეჯამება
                        </div>
                        <p className="text-sm text-on-surface leading-relaxed">{topic.verdictKa}</p>
                    </div>
                )}

                <ForumTabs
                    opinionsCount={topic.postCount || debate.length}
                    predictionsCount={predictions.length}
                    opinions={
                        <>
                            <ForumCampSplit posts={debate} />
                            <div className="mb-4 flex justify-end">
                                <ForumAskBox topicId={topic.id} />
                            </div>
                            <ForumThread posts={debate} topicId={topic.id} />
                        </>
                    }
                    predictions={<ForumPredictions posts={predictions} />}
                />
            </div>
        </main>
    );
}
