import { getArticleById, getAllArticles, getAdjacentArticles } from "@/data/loopsContent";
import { notFound } from "next/navigation";
import LoopsArticleRenderer from "@/components/loops/LoopsArticleRenderer";
import ArticleSchema, { BreadcrumbSchema, FAQSchema } from "@/components/blog/ArticleSchema";
import { Metadata } from "next";
import fs from 'fs';
import path from 'path';
import { LoopsArticleData } from "@/types/loopsArticle";

interface Props {
    params: Promise<{ slug: string }>
}

async function getJsonData(slug: string): Promise<LoopsArticleData | null> {
    const filePath = path.join(process.cwd(), 'src/data/encyclopedia/loops', `${slug}.json`);
    try {
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContent) as LoopsArticleData;
        }
    } catch (error) {
        console.error(`Error reading/parsing JSON for slug ${slug}:`, error);
    }
    return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = getArticleById(slug);
    const jsonData = await getJsonData(slug);

    if (!article && !jsonData) notFound();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge';

    const title = jsonData
        ? `${jsonData.meta.title} | ენციკლოპედია`
        : `${article?.title} | ენციკლოპედია`;

    const description = jsonData
        ? jsonData.meta.description
        : (article?.content.substring(0, 160).replace(/[#*]/g, "") + "...");

    const tags = jsonData?.meta.tags || article?.tags || [];
    const keywords = tags.join(", ");

    const url = `${siteUrl}/encyclopedia/loops/${slug}`;
    const imageUrl = `${siteUrl}/encyclopedia/loops/${slug}/opengraph-image`;

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
            images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
            tags,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
        alternates: { canonical: url },
    };
}

export default async function LoopsArticlePage({ params }: Props) {
    const { slug } = await params;
    const jsonData = await getJsonData(slug);

    if (!jsonData) {
        notFound();
    }

    const all = getAllArticles();
    const index = all.findIndex((a) => a.id === slug);
    const { prev, next } = getAdjacentArticles(slug);

    return (
        <>
            <ArticleSchema
                title={jsonData.meta.title}
                description={jsonData.meta.description || ""}
                author={{ name: jsonData.schema_org?.author?.name || "Andrew Altair" }}
                datePublished={jsonData.schema_org?.datePublished || new Date().toISOString()}
                url={`https://andrewaltair.ge/encyclopedia/loops/${slug}`}
                articleBody={jsonData.meta.description}
                headline={jsonData.meta.title}
                image={`https://andrewaltair.ge/encyclopedia/loops/${slug}/opengraph-image`}
                tags={jsonData.meta.tags}
            />

            <BreadcrumbSchema
                items={[
                    { name: "Encyclopedia", url: "https://andrewaltair.ge/encyclopedia" },
                    { name: "Loops", url: "https://andrewaltair.ge/encyclopedia/loops" },
                    { name: jsonData.meta.title, url: `https://andrewaltair.ge/encyclopedia/loops/${slug}` }
                ]}
            />

            {jsonData.faq_schema && <FAQSchema items={jsonData.faq_schema} />}

            <LoopsArticleRenderer
                data={jsonData}
                position={{ index, total: all.length }}
                prev={prev ? { id: prev.id, title: prev.title } : null}
                next={next ? { id: next.id, title: next.title } : null}
            />
        </>
    );
}
