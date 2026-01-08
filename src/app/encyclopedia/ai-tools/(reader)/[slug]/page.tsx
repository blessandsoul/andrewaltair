'use client';
import { getArticleById, getAdjacentArticles, AI_TOOLS_DATA } from "@/data/aiToolsContent";
import { notFound } from "next/navigation";
import EncyclopediaArticleViewer from "@/components/encyclopedia/EncyclopediaArticleViewer";

export default function AIToolsArticlePage({ params }: { params: { slug: string } }) {
    const article = getArticleById(params.slug);
    if (!article) notFound();
    const { prev, next } = getAdjacentArticles(article.id);
    const allArticles = AI_TOOLS_DATA.categories.flatMap(c => c.articles);
    const relatedArticles = allArticles.filter(a => a.id !== article.id).slice(0, 2);
    return <div className="p-6 lg:p-12 mt-16 lg:mt-0"><EncyclopediaArticleViewer article={article} prevArticle={prev} nextArticle={next} sectionSlug="ai-tools" sectionTitle="AI ინსტრუმენტები" isLocked={!article.isFree} relatedArticles={relatedArticles} /></div>;
}
