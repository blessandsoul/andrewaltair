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

    if (!data) {
        return {
            title: 'Not Found',
            description: 'The page you are looking for does not exist.'
        };
    }

    return {
        title: `${data.meta.title} | AI 2026`,
        description: data.meta.description || data.seo?.excerpt,
        openGraph: {
            title: data.meta.title,
            description: data.meta.description || data.seo?.excerpt,
            type: 'article',
            publishedTime: data.meta.last_updated,
            tags: data.meta.tags
        }
    };
}

export default async function AI2026ArticlePage({ params }: PageProps) {
    const data = await getJsonData(params.slug);

    if (!data) {
        notFound();
    }

    // Add JSON-LD Schema
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.meta.title,
        description: data.meta.description || data.seo?.excerpt,
        author: {
            '@type': 'Person',
            name: data.meta.author?.name || 'Alpha Architect'
        },
        datePublished: data.meta.last_updated,
        // image: data.meta.image
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
