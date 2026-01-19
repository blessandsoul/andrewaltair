'use client'

interface ArticleSchemaProps {
    title: string
    description: string
    author: {
        name: string
        url?: string
    }
    datePublished: string
    dateModified?: string
    image?: string
    url: string
    category?: string
    tags?: string[]
    wordCount?: number
    articleBody?: string
    headline?: string
}

export default function ArticleSchema({
    title,
    description,
    author,
    datePublished,
    dateModified,
    image,
    url,
    category,
    tags,
    wordCount
}: ArticleSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "author": {
            "@type": "Person",
            "name": author.name,
            ...(author.url && { "url": author.url })
        },
        "publisher": {
            "@type": "Organization",
            "name": "AndrewAltair.GE",
            "logo": {
                "@type": "ImageObject",
                "url": "https://andrewaltair.ge/images/logo.png"
            }
        },
        "datePublished": datePublished,
        ...(dateModified && { "dateModified": dateModified }),
        ...(image && {
            "image": {
                "@type": "ImageObject",
                "url": image
            }
        }),
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url
        },
        ...(category && { "articleSection": category }),
        ...(tags && tags.length > 0 && { "keywords": tags.join(", ") }),
        ...(wordCount && { "wordCount": wordCount }),
        "inLanguage": "ka-GE"
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
        />
    )
}

// Breadcrumb Schema for SEO
export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
        />
    )
}

// Website Schema
export function WebsiteSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "AndrewAltair.GE",
        "url": "https://andrewaltair.ge",
        "description": "AI ინოვაციები, ტექნოლოგიები და მომავალი",
        "inLanguage": "ka-GE",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://andrewaltair.ge/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
        />
    )
}

// FAQ Schema for Rich Results
export function FAQSchema({ items }: { items: { question: string; answer: string }[] }) {
    if (!items || items.length === 0) return null;

    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": items.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
        />
    )
}
