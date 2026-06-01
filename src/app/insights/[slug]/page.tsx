export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { InsightPageClient } from '@/components/insights/InsightPageClient';
import { InsightService } from '@/services/insight.service';
import { parseInsightBody } from '@/lib/insight-content';

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

        // OG/Twitter parsers + Google News expect ISO-8601, not Date.toString().
        // insight.publishedAt comes from Mongo .lean() as a Date — serializing it
        // via Next's metadata layer previously emitted "Wed May 27 2026 ..." which
        // Facebook/Google News failed to parse.
        const publishedIso = new Date(insight.publishedAt).toISOString();
        const modifiedIso = new Date(insight.updatedAt || insight.publishedAt).toISOString();

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
                locale: 'ka_GE',
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

        // Parse the bot-emitted content body once. parseInsightBody strips
        // the headline first-line (already rendered as <h1>) and trailing
        // "წყარო:" attribution lines (already rendered in the source-link block).
        // The cleaned text feeds both the JSON-LD articleBody and the client renderer.
        const parsedBody = parseInsightBody(
            insight.content,
            insight.seo?.metaTitle || insight.sourceTitle
        );
        const cleanBody = parsedBody.paragraphs.join('\n\n');

        // Schema.org: NewsArticle (replaces prior SocialMediaPosting).
        // NewsArticle is the type Google looks for to surface a page in News /
        // Top Stories carousel; SocialMediaPosting is for "I posted this to a
        // social platform" wrappers and is ineligible. Required fields per
        // https://developers.google.com/search/docs/appearance/structured-data/article
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
            inLanguage: 'ka-GE',
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
                    width: 600,
                    height: 60,
                },
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
                    parsedBody={parsedBody}
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
