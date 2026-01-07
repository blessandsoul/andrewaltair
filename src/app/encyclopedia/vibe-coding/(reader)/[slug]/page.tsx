'use client';

import { getArticleById, getAdjacentArticles } from "@/data/vibeCodingContent";
import { notFound } from "next/navigation";
import VibeArticleViewer from "@/components/vibe-coding/VibeArticleViewer";
import ArticleSchema, { BreadcrumbSchema } from "@/components/blog/ArticleSchema";

// Note: generateStaticParams and generateMetadata need to be separate or handled in a server component wrapper
// BUT since this was a client component before (reading params), we should keep it server if possible
// The previous implementation was mixing server and client which is tricky in Next.js 14
// Let's make this page a Server Component that renders a Client Component (VibeArticleViewer)

export default function ArticlePage({ params }: { params: { slug: string } }) {
    const article = getArticleById(params.slug);

    if (!article) {
        notFound();
    }

    const { prev, next } = getAdjacentArticles(article.id);

    return (
        <div className="p-6 lg:p-12 mt-16 lg:mt-0">
            {/* Schema Injection */}
            <ArticleSchema
                title={article.title}
                description={article.content.substring(0, 160).replace(/[#*]/g, "") + "..."}
                author={{ name: "Andrew Altair" }}
                datePublished={new Date().toISOString()} //Ideally this should be in the data
                url={`https://andrewaltair.ge/encyclopedia/vibe-coding/${article.id}`}
                articleBody={article.content}
                headline={article.title}
                image={`https://andrewaltair.ge/encyclopedia/vibe-coding/${article.id}/opengraph-image`}
            />

            <BreadcrumbSchema
                items={[
                    { name: "Encyclopedia", url: "https://andrewaltair.ge/encyclopedia" },
                    { name: "Vibe Coding", url: "https://andrewaltair.ge/encyclopedia/vibe-coding" },
                    { name: article.title, url: `https://andrewaltair.ge/encyclopedia/vibe-coding/${article.id}` }
                ]}
            />

            <VibeArticleViewer
                article={article}
                prevArticle={prev}
                nextArticle={next}
                isLocked={!article.isFree} // Basic logic for now, enhanced logic in V2
                onUnlock={() => {
                    // Logic to open modal - for now alert or we can use Context to trigger modal in layout
                    alert("Exclusive content coming soon! Join Telegram channel.");
                    window.open("https://t.me/andr3waltairchannel", "_blank");
                }}
            />
        </div>
    );
}
