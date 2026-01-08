'use client';
import { getArticleById, getAdjacentArticles, PROMPT_ENGINEERING_DATA } from "@/data/promptEngineeringContent";
import { notFound } from "next/navigation";
import EncyclopediaArticleViewer from "@/components/encyclopedia/EncyclopediaArticleViewer";

export default function PromptEngineeringArticlePage({ params }: { params: { slug: string } }) {
    const article = getArticleById(params.slug);

    if (!article) {
        notFound();
    }

    const { prev, next } = getAdjacentArticles(article.id);

    // Get related articles (2 random from other categories)
    const allArticles = PROMPT_ENGINEERING_DATA.categories.flatMap(c => c.articles);
    const relatedArticles = allArticles
        .filter(a => a.id !== article.id)
        .slice(0, 2);

    return (
        <div className="p-6 lg:p-12 mt-16 lg:mt-0">
            <EncyclopediaArticleViewer
                article={article}
                prevArticle={prev}
                nextArticle={next}
                sectionSlug="prompt-engineering"
                sectionTitle="Prompt Engineering"
                isLocked={!article.isFree}
                relatedArticles={relatedArticles}
            />
        </div>
    );
}
