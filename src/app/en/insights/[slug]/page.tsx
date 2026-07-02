// ISR: render on demand, serve cached for 2 min. English insights surface.
export const revalidate = 120;
export const dynamicParams = true;

import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { lookupRedirect } from '@/lib/seo-redirects';
import { InsightPageClient } from '@/components/insights/InsightPageClient';
import { InsightService } from '@/services/insight.service';
import { parseInsightBody } from '@/lib/insight-content';
import { getInitialComments, commentJsonLd } from '@/lib/server-comments';
import { stripBrand } from '@/lib/seo-title';
import ViewBeacon from '@/components/analytics/ViewBeacon';
import { safeJsonLd } from '@/lib/json-ld';

function safeEncodeURIComponent(str: string): string {
    try {
        return encodeURIComponent(str)
    } catch {
        return encodeURIComponent(str.replace(/[\uD800-\uDFFF]/g, ''))
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    let insight;
    try {
        insight = await InsightService.getInsightBySlug(slug);
    } catch (error) {
        console.error(`[generateMetadata] Error for /en/insights/${slug}:`, error);
        throw error;
    }

    if (!insight) {
        const target = await lookupRedirect(`/en/insights/${slug}`);
        if (target) permanentRedirect(target);
        notFound();
    }

    // A non-EN insight typed under /en/insights belongs on the KA surface.
    if (insight.language !== 'en') permanentRedirect(`/insights/${slug}`);

    {
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

        const publishedIso = new Date(insight.publishedAt).toISOString();
        const modifiedIso = new Date(insight.updatedAt || insight.publishedAt).toISOString();

        return {
            title: stripBrand(insight.seo?.metaTitle || insight.excerpt.slice(0, 60)),
            description: insight.seo?.metaDescription || insight.excerpt,
            alternates: {
                canonical: insight.seo?.canonicalUrl || `${siteUrl}/en/insights/${slug}`,
            },
            openGraph: {
                title: insight.seo?.metaTitle || insight.excerpt.slice(0, 60),
                description: insight.seo?.metaDescription || insight.excerpt,
                url: `${siteUrl}/en/insights/${slug}`,
                images: [{ url: imageUrl }],
                type: 'article',
                siteName: 'Andrew Altair',
                locale: 'en_US',
                authors: [insight.author?.name || 'Andrew Altair'],
                publishedTime: publishedIso,
                modifiedTime: modifiedIso,
                tags: insight.tags,
                section: insight.categories?.[0] || 'AI',
            },
            twitter: {
                card: 'summary_large_image',
                title: insight.seo?.metaTitle || insight.excerpt.slice(0, 60),
                description: insight.seo?.metaDescription || insight.excerpt,
                images: [imageUrl],
            },
        };
    }
}

export default async function EnInsightPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    let rawInsight;
    try {
        rawInsight = await InsightService.getInsightBySlug(slug);
    } catch (error) {
        console.error(`[EnInsightPage] DB error for /en/insights/${slug}:`, error);
        throw error;
    }

    if (!rawInsight) notFound();

    // A non-EN insight typed under /en/insights belongs on the KA surface.
    if (rawInsight.language !== 'en') permanentRedirect(`/insights/${slug}`);

    {
        const [relatedPosts, relatedInsights] = await Promise.all([
            InsightService.getRelatedPosts(rawInsight.relatedPosts || []).catch(() => []),
            InsightService.getRelatedInsights(rawInsight.relatedInsights || []).catch(() => []),
        ]);

        const insight = JSON.parse(JSON.stringify({
            ...rawInsight,
            views: rawInsight.views || 0,
        }));

        const initialComments = await getInitialComments(rawInsight._id.toString()).catch(() => []);

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge';

        let imageUrl = insight.sourceImage;
        if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = `${siteUrl}${imageUrl}`;
        }

        const parsedBody = parseInsightBody(
            insight.content,
            insight.seo?.metaTitle || insight.sourceTitle
        );
        const cleanBody = parsedBody.paragraphs.join('\n\n');

        const publishedIsoLd = new Date(insight.publishedAt).toISOString();
        const modifiedIsoLd = new Date(insight.updatedAt || insight.publishedAt).toISOString();
        const wordCount = cleanBody.split(/\s+/).filter(Boolean).length;
        const headlineLd = (insight.seo?.metaTitle || insight.excerpt).slice(0, 110);

        const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: headlineLd,
            description: insight.seo?.metaDescription || insight.excerpt,
            articleBody: cleanBody,
            image: imageUrl ? [imageUrl] : [],
            datePublished: publishedIsoLd,
            dateModified: modifiedIsoLd,
            inLanguage: 'en-US',
            articleSection: insight.categories?.[0] || 'AI',
            keywords: Array.isArray(insight.tags) ? insight.tags.join(', ') : '',
            wordCount,
            isBasedOn: insight.sourceUrl,
            author: {
                '@type': 'Person',
                '@id': `${siteUrl}/#person`,
                name: insight.author?.name || 'Andrew Altair',
                url: `${siteUrl}/about`,
            },
            publisher: {
                '@type': 'Organization',
                '@id': `${siteUrl}/#organization`,
                name: 'Andrew Altair',
                url: siteUrl,
                logo: {
                    '@type': 'ImageObject',
                    url: `${siteUrl}/logo.png`,
                    width: 512,
                    height: 512,
                },
            },
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `${siteUrl}/en/insights/${slug}`,
            },
            ...commentJsonLd(initialComments),
        };

        const breadcrumbLd = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'Insights', item: `${siteUrl}/en/insights` },
                { '@type': 'ListItem', position: 3, name: insight.seo?.metaTitle || 'Insight', item: `${siteUrl}/en/insights/${slug}` },
            ],
        };

        return (
            <article>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }}
                />

                <ViewBeacon type="insight" id={insight._id || insight.id} />
                <InsightPageClient
                    insight={insight}
                    parsedBody={parsedBody}
                    relatedPosts={JSON.parse(JSON.stringify(relatedPosts))}
                    relatedInsights={JSON.parse(JSON.stringify(relatedInsights))}
                    initialComments={initialComments}
                    locale="en"
                />
            </article>
        );
    }
}
