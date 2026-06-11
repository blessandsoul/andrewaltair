import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleRenderer from '@/components/encyclopedia/ArticleRenderer';
import { ArticleData } from '@/types/article';
import fs from 'fs';
import path from 'path';

// JSON data location
const DATA_DIR = path.join(process.cwd(), 'src/data/encyclopedia/ai-2026');

async function getJsonData(slug: string): Promise<ArticleData | null> {
    const filePath = path.join(DATA_DIR, `${slug}.json`);

    try {
        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            return null;
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent) as ArticleData;
    } catch (error) {
        console.error(`Error reading data for slug ${slug}:`, error);
        return null;
    }
}

interface PageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const data = await getJsonData(params.slug);

    // real 404 status (not a soft-404 shell with placeholder metadata)
    if (!data) notFound();

    const imageUrl = 'https://andrewaltair.ge/og.png'

    return {
        title: `${data.meta.title} | AI 2026`,
        description: data.meta.description || data.seo?.excerpt,
        openGraph: {
            title: data.meta.title,
            description: data.meta.description || data.seo?.excerpt,
            type: 'article',
            publishedTime: data.meta.last_updated,
            tags: data.meta.tags,
            images: [{ url: imageUrl, width: 1200, height: 630, alt: data.meta.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title: data.meta.title,
            description: data.meta.description || data.seo?.excerpt,
            images: [imageUrl],
        },
        alternates: {
            canonical: `https://andrewaltair.ge/encyclopedia/ai-2026/${params.slug}`,
        },
    };
}

export default async function AI2026ArticlePage({ params }: PageProps) {
    const data = await getJsonData(params.slug);

    if (!data) {
        notFound();
    }

    // Add JSON-LD Schema — full Article node wired into the site @id graph
    // (matches the publisher/author entities in src/config/json-ld.ts)
    const siteUrl = 'https://andrewaltair.ge';
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.meta.title,
        description: data.meta.description || data.seo?.excerpt,
        image: [`${siteUrl}/og.png`],
        author: {
            '@type': 'Person',
            '@id': `${siteUrl}/#person`,
            name: data.meta.author?.name || 'Andrew Altair',
            url: `${siteUrl}/about`,
        },
        publisher: {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'Andrew Altair',
            logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/logo.png`,
                width: 512,
                height: 512,
            },
        },
        datePublished: data.meta.last_updated,
        dateModified: data.meta.last_updated,
        inLanguage: 'ka-GE',
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${siteUrl}/encyclopedia/ai-2026/${params.slug}`,
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ArticleRenderer data={data} />
        </>
    );
}
