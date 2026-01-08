'use client';
import { getArticleById, getAdjacentArticles, AI_ETHICS_DATA } from "@/data/aiEthicsContent";
import { notFound } from "next/navigation";
import EncyclopediaArticleViewer from "@/components/encyclopedia/EncyclopediaArticleViewer";

export default function AIEthicsArticlePage({ params }: { params: { slug: string } }) {
    const article = getArticleById(params.slug);
    if (!article) notFound();
    const { prev, next } = getAdjacentArticles(article.id);
    const allArticles = AI_ETHICS_DATA.categories.flatMap(c => c.articles);
    const relatedArticles = allArticles.filter(a => a.id !== article.id).slice(0, 2);
    return <div className="p-6 lg:p-12 mt-16 lg:mt-0"><EncyclopediaArticleViewer article={article} prevArticle={prev} nextArticle={next} sectionSlug="ai-ethics" sectionTitle="AI ეთიკა" isLocked={!article.isFree} relatedArticles={relatedArticles} /></div>;
}
