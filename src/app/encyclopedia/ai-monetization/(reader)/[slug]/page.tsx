'use client';
import { getArticleById, getAdjacentArticles, AI_MONETIZATION_DATA } from "@/data/aiMonetizationContent";
import { notFound } from "next/navigation";
import EncyclopediaArticleViewer from "@/components/encyclopedia/EncyclopediaArticleViewer";

export default function AIMonetizationArticlePage({ params }: { params: { slug: string } }) {
    const article = getArticleById(params.slug);
    if (!article) notFound();
    const { prev, next } = getAdjacentArticles(article.id);
    const allArticles = AI_MONETIZATION_DATA.categories.flatMap(c => c.articles);
    const relatedArticles = allArticles.filter(a => a.id !== article.id).slice(0, 2);
    return (
        <div className="p-6 lg:p-12 mt-16 lg:mt-0">
            <EncyclopediaArticleViewer article={article} prevArticle={prev} nextArticle={next} sectionSlug="ai-monetization" sectionTitle="AI მონეტიზაცია" isLocked={!article.isFree} relatedArticles={relatedArticles} />
        </div>
    );
}
