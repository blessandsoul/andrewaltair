import { getArticleById, getAdjacentArticles, AI_BASICS_DATA } from "@/data/aiBasicsContent";
import { getAI2026Article, getAI2026AdjacentArticles } from "@/data/ai2026Content";
import { notFound } from "next/navigation";
import EncyclopediaArticleViewer from "@/components/encyclopedia/EncyclopediaArticleViewer";
import AI2026ArticleRenderer from "@/components/encyclopedia/ai-2026/AI2026ArticleRenderer";
import { Metadata } from 'next';

interface PageProps {
    params: { slug: string };
}

// Generate Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const ai2026Article = getAI2026Article(params.slug);

    if (ai2026Article) {
        return {
            title: `${ai2026Article.meta.title} | Andrew Altair Encyclopedia`,
            description: ai2026Article.seo.excerpt,
            openGraph: {
                title: ai2026Article.meta.title,
                description: ai2026Article.seo.excerpt,
                type: 'article',
                publishedTime: '2026-01-19',
                authors: [ai2026Article.meta.author.name],
                tags: ai2026Article.meta.tags,
                images: [
                    {
                        url: 'https://andrewaltair.ge/og/ai-2026.jpg',
                        width: 1200,
                        height: 630,
                        alt: ai2026Article.meta.title,
                    },
                ],
            },
        };
    }

    const basicArticle = getArticleById(params.slug);
    if (basicArticle) {
        return {
            title: `${basicArticle.title} | Andrew Altair Encyclopedia`,
            description: basicArticle.content.substring(0, 160) + '...', // Simple excerpt
        };
    }

    return {
        title: 'Not Found | Andrew Altair Encyclopedia'
    };
}

export default function AIBasicsArticlePage({ params }: PageProps) {
    // Check for AI 2026 Article first
    const ai2026Article = getAI2026Article(params.slug);

    if (ai2026Article) {
        const { prev, next } = getAI2026AdjacentArticles(params.slug);
        const prevLink = prev ? { slug: prev.meta.slug, title: prev.meta.title } : null;
        const nextLink = next ? { slug: next.meta.slug, title: next.meta.title } : null;

        // Structured Data (JSON-LD)
        const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: ai2026Article.meta.title,
            description: ai2026Article.seo.excerpt,
            author: {
                '@type': 'Person',
                name: ai2026Article.meta.author.name,
            },
        };

        return (
            <>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <AI2026ArticleRenderer
                    data={ai2026Article}
                    prev={prevLink}
                    next={nextLink}
                />
            </>
        );
    }

    // Fallback to Standard Article
    const article = getArticleById(params.slug);
    if (!article) notFound();

    const { prev, next } = getAdjacentArticles(article.id);
    const allArticles = AI_BASICS_DATA.categories.flatMap(c => c.articles);
    const relatedArticles = allArticles.filter(a => a.id !== article.id).slice(0, 2);

    return (
        <div className="p-6 lg:p-12 mt-16 lg:mt-0">
            <EncyclopediaArticleViewer
                article={article}
                prevArticle={prev}
                nextArticle={next}
                sectionSlug="ai-basics"
                sectionTitle="AI საფუძვლები"
                isLocked={!article.isFree}
                relatedArticles={relatedArticles}
            />
        </div>
    );
}
