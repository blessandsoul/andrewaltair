export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { InsightPageClient } from '@/components/insights/InsightPageClient';
import { InsightService } from '@/services/insight.service';

function safeEncodeURIComponent(str: string): string {
    try {
        return encodeURIComponent(str)
    } catch {
        return encodeURIComponent(str.replace(/[\uD800-\uDFFF]/g, ''))
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    try {
        const insight = await InsightService.getInsightBySlug(slug);
        if (!insight) return { title: 'Insight Not Found | Andrew Altair' };

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge';

        let imageUrl = insight.sourceImage;
        if (imageUrl && !imageUrl.startsWith('http')) {
            if (imageUrl.includes('/uploads/')) {
                imageUrl = `${siteUrl}${imageUrl}`;
            }
        }
        if (!imageUrl) {
            imageUrl = `${siteUrl}/api/og?title=${safeEncodeURIComponent(insight.excerpt.slice(0, 60))}&type=insight`;
        }

        return {
            title: `${insight.seo?.metaTitle || insight.excerpt.slice(0, 60)} | Andrew Altair`,
            description: insight.seo?.metaDescription || insight.excerpt,
            openGraph: {
                title: insight.seo?.metaTitle || insight.excerpt.slice(0, 60),
                description: insight.seo?.metaDescription || insight.excerpt,
                url: `${siteUrl}/insights/${slug}`,
                images: [{ url: imageUrl }],
                type: 'article',
                siteName: 'Andrew Altair',
                authors: [insight.author?.name || 'Andrew Altair'],
                publishedTime: insight.publishedAt as unknown as string,
            },
            twitter: {
                card: 'summary_large_image',
                title: insight.seo?.metaTitle || insight.excerpt.slice(0, 60),
                description: insight.seo?.metaDescription || insight.excerpt,
                images: [imageUrl],
            },
            alternates: {
                canonical: insight.seo?.canonicalUrl || `${siteUrl}/insights/${slug}`,
            },
        };
    } catch (error) {
        console.error(`[generateMetadata] Error for /insights/${slug}:`, error);
        return { title: 'Andrew Altair | Insights' };
    }
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    try {
        const rawInsight = await InsightService.getInsightBySlug(slug);
        if (!rawInsight) return notFound();

        // Increment views
        InsightService.incrementViews(rawInsight._id).catch(() => {});

        // Get related content
        const [relatedPosts, relatedInsights] = await Promise.all([
            InsightService.getRelatedPosts(rawInsight.relatedPosts || []),
            InsightService.getRelatedInsights(rawInsight.relatedInsights || []),
        ]);

        const insight = JSON.parse(JSON.stringify({
            ...rawInsight,
            views: (rawInsight.views || 0) + 1,
        }));

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge';

        let imageUrl = insight.sourceImage;
        if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = `${siteUrl}${imageUrl}`;
        }

        // Schema.org: SocialMediaPosting
        const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'SocialMediaPosting',
            headline: insight.seo?.metaTitle || insight.excerpt.slice(0, 60),
            text: insight.content,
            image: imageUrl ? [imageUrl] : [],
            datePublished: insight.publishedAt,
            dateModified: insight.updatedAt || insight.publishedAt,
            author: {
                '@type': 'Person',
                name: insight.author?.name || 'Andrew Altair',
                url: siteUrl,
            },
            publisher: {
                '@type': 'Organization',
                name: 'Andrew Altair',
                logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
            },
            sharedContent: {
                '@type': 'WebPage',
                url: insight.sourceUrl,
                headline: insight.sourceTitle,
            },
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `${siteUrl}/insights/${slug}`,
            },
        };

        const breadcrumbLd = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'Insights', item: `${siteUrl}/insights` },
                { '@type': 'ListItem', position: 3, name: insight.seo?.metaTitle || 'Insight', item: `${siteUrl}/insights/${slug}` },
            ],
        };

        return (
            <article>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
                />

                <InsightPageClient
                    insight={insight}
                    relatedPosts={JSON.parse(JSON.stringify(relatedPosts))}
                    relatedInsights={JSON.parse(JSON.stringify(relatedInsights))}
                />
            </article>
        );
    } catch (error) {
        console.error(`[InsightPage] Error rendering /insights/${slug}:`, error);
        return notFound();
    }
}
