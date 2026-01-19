import { Metadata } from 'next';
import VibeCodingArticleRenderer from '@/components/vibe-coding/VibeCodingArticleRenderer';
import vibeCodingData from '@/data/vibeCodingArticle.json';
import { VibeCodingArticleData } from '@/types/vibeCodingArticle';

const data = vibeCodingData as VibeCodingArticleData;

export const metadata: Metadata = {
    title: `${data.meta.title} | Andrew Altair Encyclopedia`,
    description: data.meta.description,
    keywords: data.meta.tags,
    openGraph: {
        title: data.meta.title,
        description: data.meta.description,
        type: 'article',
        publishedTime: data.schema_org.datePublished,
        authors: [data.schema_org.author.name],
        images: [
            {
                url: '/og/vibe-coding-guide.png',
                width: 1200,
                height: 630,
                alt: data.meta.title,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: data.meta.title,
        description: data.meta.description,
    },
};

// Generate FAQ Schema
function generateFAQSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.faq_schema.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    };
}

// Generate Article Schema
function generateArticleSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.meta.title,
        description: data.meta.description,
        datePublished: data.schema_org.datePublished,
        dateModified: data.meta.last_updated,
        author: {
            '@type': 'Person',
            name: data.schema_org.author.name,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Andrew Altair',
            logo: {
                '@type': 'ImageObject',
                url: 'https://andrewaltair.ge/logo.png',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://andrewaltair.ge/encyclopedia/vibe-coding/what-is-vibe-coding',
        },
    };
}

export default function WhatIsVibeCodingPage() {
    return (
        <>
            {/* Schema.org JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateArticleSchema()),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateFAQSchema()),
                }}
            />

            {/* Article Content */}
            <VibeCodingArticleRenderer data={data} />
        </>
    );
}
