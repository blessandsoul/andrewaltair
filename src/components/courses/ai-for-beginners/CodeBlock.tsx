'use client';

// Lazy-loaded syntax highlighter. Imported via dynamic({ ssr:false }) from
// CourseMarkdown / NotebookViewer so react-syntax-highlighter stays out of the
// server bundle and the initial client chunk (protects the 1-CPU VPS build).
import { useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { TbCopy, TbCheck } from 'react-icons/tb';

SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('markup', markup);

const ALIAS: Record<string, string> = { sh: 'bash', shell: 'bash', html: 'markup', xml: 'markup', text: 'text', plaintext: 'text' };

export default function CodeBlock({ code, language = 'text' }: { code: string; language?: string }) {
    const [copied, setCopied] = useState(false);
    const lang = ALIAS[language] || language;

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* clipboard blocked — ignore */ }
    };

    return (
        <div className="my-6 overflow-hidden rounded-xl border border-zinc-700/80 bg-[#282c34] shadow-sm">
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-700/60">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">{language}</span>
                <button
                    onClick={copy}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-zinc-700/70 hover:bg-zinc-600 text-zinc-200 transition-colors"
                >
                    {copied
                        ? <><TbCheck className="w-3.5 h-3.5 text-emerald-400" /> დაკოპირდა</>
                        : <><TbCopy className="w-3.5 h-3.5" /> კოპირება</>}
                </button>
            </div>
            <SyntaxHighlighter
                language={lang}
                style={oneDark}
                customStyle={{ margin: 0, background: 'transparent', padding: '1rem 1.1rem', fontSize: '0.85rem', lineHeight: 1.65 }}
                codeTagProps={{ style: { fontFamily: 'var(--font-code, monospace)' } }}
                wrapLongLines
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}
