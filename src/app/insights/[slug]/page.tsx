// ISR: render on demand, serve cached for 2 min (insights publish 30-50/day).
// force-dynamic made every crawler hit a live Mongo round-trip + view write.
// View counting moved to the /api/views beacon so this page stays cacheable.
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

    // DB errors must surface as 500 (crawler retries later), only a truly
    // missing insight may 404. notFound() here — before any streaming starts —
    // guarantees a real 404 status instead of a soft-404 200 shell.
    let insight;
    try {
        insight = await InsightService.getInsightBySlug(slug);
    } catch (error) {
        console.error(`[generateMetadata] Error for /insights/${slug}:`, error);
        throw error;
    }

    if (!insight) {
        // migration-generated rename? (Redirect collection: timestamp/hyphen reslugs)
        const target = await lookupRedirect(`/insights/${slug}`);
        if (target) permanentRedirect(target);
        notFound();
    }

    // EN insights live under /en/insights — 301 the KA path to their real home.
    if (insight.language === 'en') permanentRedirect(`/en/insights/${slug}`);

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

        // OG/Twitter parsers + Google News expect ISO-8601, not Date.toString().
        // insight.publishedAt comes from Mongo .lean() as a Date — serializing it
        // via Next's metadata layer previously emitted "Wed May 27 2026 ..." which
        // Facebook/Google News failed to parse.
        const publishedIso = new Date(insight.publishedAt).toISOString();
        const modifiedIso = new Date(insight.updatedAt || insight.publishedAt).toISOString();

        return {
            // bare title — the root layout template appends "| Andrew Altair" once;
            // the previous manual append produced "… | Andrew Altair | Andrew Altair"
            title: stripBrand(insight.seo?.metaTitle || insight.excerpt.slice(0, 60)),
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
    }
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Existence check OUTSIDE any try/catch: a wrapping catch used to swallow
    // NEXT_NOT_FOUND after streaming had flushed a 200 — soft-404 for dead slugs.
    // DB errors rethrow as 500 so crawlers retry instead of deindexing.
    let rawInsight;
    try {
        rawInsight = await InsightService.getInsightBySlug(slug);
    } catch (error) {
        console.error(`[InsightPage] DB error for /insights/${slug}:`, error);
        throw error;
    }

    if (!rawInsight) notFound();

    // EN insights live under /en/insights — 301 the KA path to their real home.
    if (rawInsight.language === 'en') permanentRedirect(`/en/insights/${slug}`);

    {
        // Get related content — non-critical, falls back to empty
        const [relatedPosts, relatedInsights] = await Promise.all([
            InsightService.getRelatedPosts(rawInsight.relatedPosts || []).catch(() => []),
            InsightService.getRelatedInsights(rawInsight.relatedInsights || []).catch(() => []),
        ]);

        const insight = JSON.parse(JSON.stringify({
            ...rawInsight,
            views: rawInsight.views || 0,
        }));

        // SSR-seed AI-persona comments (SEO: text in HTML + JSON-LD)
        const initialComments = await getInitialComments(rawInsight._id.toString()).catch(() => []);

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
                    width: 512,
                    height: 512,
                },
            },
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `${siteUrl}/insights/${slug}`,
            },
            ...commentJsonLd(initialComments),
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
                />
            </article>
        );
    }
}
