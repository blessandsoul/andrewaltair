import { getArticleById, getAllArticles } from "@/data/vibeCodingContent";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ArticleSchema, { BreadcrumbSchema } from "@/components/blog/ArticleSchema";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Link from 'next/link';
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";

// Force static generation for all articles
export async function generateStaticParams() {
    const articles = getAllArticles();
    return articles.map((article) => ({
        slug: article.id,
    }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const article = getArticleById(params.slug);
    if (!article) return {};

    return {
        title: `${article.title} | Vibe Coding`,
        description: article.content.substring(0, 160).replace(/[#*]/g, "") + "...",
        openGraph: {
            title: article.title,
            description: article.content.substring(0, 160).replace(/[#*]/g, "") + "...",
            type: "article",
        },
    };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
    const article = getArticleById(params.slug);

    if (!article) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
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

            {/* Navigation Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="container max-w-4xl mx-auto px-4 h-16 flex items-center">
                    <Link href="/encyclopedia/vibe-coding" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <CaretLeft size={20} />
                        <span>უკან ბიბლიოთეკაში</span>
                    </Link>
                </div>
            </div>

            <main className="container max-w-4xl mx-auto px-4 py-12">
                <article className="prose prose-lg dark:prose-invert max-w-none">
                    <h1>{article.title}</h1>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            }
                        }}
                    >
                        {article.content}
                    </ReactMarkdown>
                </article>
            </main>
        </div>
    );
}
