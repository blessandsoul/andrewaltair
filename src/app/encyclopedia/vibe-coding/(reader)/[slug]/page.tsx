import { getArticleById, getAdjacentArticles } from "@/data/vibeCodingContent";
import { notFound } from "next/navigation";
import VibeArticleViewer from "@/components/vibe-coding/VibeArticleViewer";
import ArticleSchema, { BreadcrumbSchema } from "@/components/blog/ArticleSchema";
import { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const article = getArticleById(slug);

    if (!article) {
        return {
            title: "Article Not Found",
        };
    }

    const title = `${article.title} | Andrew Altair Encyclopedia`;
    const description = article.content.substring(0, 160).replace(/[#*]/g, "") + "...";
    const url = `https://andrewaltair.ge/encyclopedia/vibe-coding/${article.id}`;
    const imageUrl = `https://andrewaltair.ge/encyclopedia/vibe-coding/${article.id}/opengraph-image`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url,
            type: "article",
            publishedTime: new Date().toISOString(), // In real app, use article date
            authors: ["Andrew Altair"],
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
    };
}

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params
    const article = getArticleById(slug);

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
            />
        </div>
    );
}
