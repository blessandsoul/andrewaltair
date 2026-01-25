import { getArticleById, getAdjacentArticles } from "@/data/vibeCodingContent";
import { getCurrentUser } from "@/lib/server-auth";
import { notFound } from "next/navigation";
import VibeArticleViewer from "@/components/vibe-coding/VibeArticleViewer";
import ArticleRenderer from "@/components/encyclopedia/ArticleRenderer";
import ArticleSchema, { BreadcrumbSchema, FAQSchema } from "@/components/blog/ArticleSchema";
import { Metadata } from "next";
import fs from 'fs';
import path from 'path';
import { ArticleData } from "@/types/article";

interface Props {
    params: Promise<{ slug: string }>
}

async function getJsonData(slug: string): Promise<ArticleData | null> {
    const filePath = path.join(process.cwd(), 'src/data/encyclopedia/vibe-coding', `${slug}.json`);
    try {
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContent) as ArticleData;
        }
    } catch (error) {
        console.error(`Error reading/parsing JSON for slug ${slug}:`, error);
    }
    return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const article = getArticleById(slug);
    const jsonData = await getJsonData(slug);

    if (!article && !jsonData) {
        return {
            title: "Article Not Found",
        };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge'

    // Prefer jsonData for metadata if available
    const title = jsonData
        ? `${jsonData.meta.title} | Andrew Altair Encyclopedia`
        : `${article?.title} | Andrew Altair Encyclopedia`;

    const description = jsonData
        ? jsonData.meta.description
        : article?.content.substring(0, 160).replace(/[#*]/g, "") + "...";

    const tags = jsonData?.meta.tags || article?.tags || [];
    const keywords = tags.join(", ");

    const url = `${siteUrl}/encyclopedia/vibe-coding/${slug}`;
    const imageUrl = `${siteUrl}/encyclopedia/vibe-coding/${slug}/opengraph-image`;

    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            url,
            type: "article",
            publishedTime: jsonData?.schema_org?.datePublished || new Date().toISOString(),
            authors: ["Andrew Altair", jsonData?.schema_org?.author?.name || ""].filter(Boolean),
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            tags: tags,
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
    const jsonData = await getJsonData(slug);
    const user = await getCurrentUser();

    if (!article && !jsonData) {
        notFound();
    }

    // If generic article exists, get adjacent links (legacy support)
    // If it's a new JSON-only article, we might need a way to find adjacent refs.
    // For now, assume 'article' exists in vibeCodingContent.ts even if we use JSON render.
    // My previous tasks updated vibeCodingContent.ts to include these slugs, so article SHOULD exist.
    const adjacent = article ? getAdjacentArticles(article.id) : { prev: undefined, next: undefined };

    // Rich Renderer Path
    if (jsonData) {
        return (
            <>
                <ArticleSchema
                    title={jsonData.meta.title}
                    description={jsonData.meta.description || ""}
                    author={{ name: jsonData.schema_org?.author?.name || "Andrew Altair" }}
                    datePublished={jsonData.schema_org?.datePublished || new Date().toISOString()}
                    url={`https://andrewaltair.ge/encyclopedia/vibe-coding/${slug}`}
                    articleBody={jsonData.meta.description} // Full body is complex in JSON, using description/summary
                    headline={jsonData.meta.title}
                    image={`https://andrewaltair.ge/encyclopedia/vibe-coding/${slug}/opengraph-image`}
                    tags={jsonData.meta.tags}
                />

                <BreadcrumbSchema
                    items={[
                        { name: "Encyclopedia", url: "https://andrewaltair.ge/encyclopedia" },
                        { name: "Vibe Coding", url: "https://andrewaltair.ge/encyclopedia/vibe-coding" },
                        { name: jsonData.meta.title, url: `https://andrewaltair.ge/encyclopedia/vibe-coding/${slug}` }
                    ]}
                />

                {/* FAQ Schema Injection if available */}
                {jsonData.faq_schema && <FAQSchema items={jsonData.faq_schema} />}

                {/* 
                    Wrapper div to match layout if needed, 
                    but VibeCodingArticleRenderer is designed to take full screen typically 
                    (e.g., min-h-screen bg-[#050510]).
                    If we want it inside the sidebar layout, we shouldn't wrap it in a padded div 
                    if the renderer handles its own layout.
                    
                    However, [slug]/page.tsx is likely rendered INSIDE a layout that includes the sidebar.
                    Let's check if VibeCodingArticleRenderer adds its own background.
                    Answer: Yes, it has `min-h-screen bg-[#050510]`.
                    
                    The sidebar layout is probably in `layout.tsx` of `(reader)` or parent.
                    If standard render uses `div className="p-6 lg:p-12"`, we might want to avoid that for Rich Render
                    if Rich Render expects full width.
                 */}

                <ArticleRenderer data={jsonData} />

                {/* 
                    TODO: Add Navigation Footer specifically for Rich Articles if VibeCodingArticleRenderer doesn't have it.
                    For now, rely on Sidebar for navigation. 
                */}
            </>
        );
    }

    // Standard Markdown Fallback
    if (article) {
        return (
            <div className="p-6 lg:p-12 mt-16 lg:mt-0">
                <ArticleSchema
                    title={article.title}
                    description={article.content.substring(0, 160).replace(/[#*]/g, "") + "..."}
                    author={{ name: "Andrew Altair" }}
                    datePublished={new Date().toISOString()}
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
                    prevArticle={adjacent.prev}
                    nextArticle={adjacent.next}
                    isLocked={!article.isFree && user?.email !== 'andrewaltair@icloud.com'}
                />
            </div>
        );
    }

    return null;
}
