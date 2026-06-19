'use client';

import type { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

// Heavy highlighter loads lazily, client-only.
const CodeBlock = dynamic(() => import('./CodeBlock'), {
    ssr: false,
    loading: () => (
        <pre className="my-6 p-4 rounded-xl bg-[#282c34] text-zinc-400 text-sm overflow-x-auto">
            <code>იტვირთება…</code>
        </pre>
    ),
});

// Extract plain text from rendered children. MUST produce the same string that
// the ingest's headingVisibleText() produced, so heading ids match the TOC.
function nodeText(node: ReactNode): string {
    if (node == null || typeof node === 'boolean') return '';
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(nodeText).join('');
    if (typeof node === 'object' && 'props' in node) {
        return nodeText((node as { props?: { children?: ReactNode } }).props?.children);
    }
    return '';
}

// Byte-identical to scripts/ingest-ai-for-beginners.ts slugifyHeading + TableOfContents.
const slugify = (t: string) =>
    t.toLowerCase().replace(/[^a-zა-ჰ0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 50);

type Kids = { children?: ReactNode };

export default function CourseMarkdown({ content, className }: { content: string; className?: string }) {
    return (
        <div className={cn('course-md max-w-none text-[1.05rem] leading-[1.85] text-gray-700', className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ children }: Kids) => <h2 id={slugify(nodeText(children))} className="scroll-mt-28 text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-4">{children}</h2>,
                    h2: ({ children }: Kids) => <h2 id={slugify(nodeText(children))} className="scroll-mt-28 text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">{children}</h2>,
                    h3: ({ children }: Kids) => <h3 id={slugify(nodeText(children))} className="scroll-mt-28 text-xl font-semibold text-gray-900 mt-8 mb-3">{children}</h3>,
                    h4: ({ children }: Kids) => <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-2">{children}</h4>,
                    p: ({ children }: Kids) => <p className="my-4">{children}</p>,
                    a: ({ href, children }: Kids & { href?: string }) => {
                        const external = !!href && /^https?:/i.test(href);
                        return <a href={href} className="text-emerald-700 font-medium underline decoration-emerald-300 underline-offset-2 hover:decoration-emerald-600" {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}</a>;
                    },
                    ul: ({ children }: Kids) => <ul className="my-4 ml-5 list-disc space-y-1.5 marker:text-emerald-500">{children}</ul>,
                    ol: ({ children }: Kids) => <ol className="my-4 ml-5 list-decimal space-y-1.5 marker:text-emerald-600 marker:font-semibold">{children}</ol>,
                    li: ({ children }: Kids) => <li className="pl-1 leading-relaxed">{children}</li>,
                    blockquote: ({ children }: Kids) => <blockquote className="my-5 border-l-4 border-emerald-300 bg-emerald-50/40 px-4 py-2 rounded-r-lg text-gray-600 [&>p]:my-1.5">{children}</blockquote>,
                    hr: () => <hr className="my-8 border-gray-100" />,
                    strong: ({ children }: Kids) => <strong className="font-semibold text-gray-900">{children}</strong>,
                    img: ({ src, alt }: { src?: string; alt?: string }) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={src} alt={alt || ''} loading="lazy" className="my-6 rounded-2xl shadow-md border border-gray-100 max-w-full h-auto" />
                    ),
                    table: ({ children }: Kids) => <div className="my-6 overflow-x-auto rounded-xl border border-gray-100"><table className="w-full text-sm text-left border-collapse">{children}</table></div>,
                    thead: ({ children }: Kids) => <thead className="bg-gray-50 text-gray-700">{children}</thead>,
                    th: ({ children }: Kids) => <th className="px-4 py-2.5 font-semibold border-b border-gray-100">{children}</th>,
                    td: ({ children }: Kids) => <td className="px-4 py-2.5 border-b border-gray-50 align-top">{children}</td>,
                    pre: ({ children }: Kids) => <>{children}</>,
                    code: ({ className: cls, children }: Kids & { className?: string }) => {
                        const match = /language-(\w+)/.exec(cls || '');
                        const text = String(children ?? '').replace(/\n$/, '');
                        if (match || text.includes('\n')) {
                            return <CodeBlock code={text} language={match ? match[1] : 'text'} />;
                        }
                        return <code className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[0.88em]">{children}</code>;
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
