'use client';

import dynamic from 'next/dynamic';
import CourseMarkdown from './CourseMarkdown';
import type { CourseNotebookLesson, NotebookCodeCell, NotebookOutput } from '@/types/course';
import { TbChevronDown } from 'react-icons/tb';

const CodeBlock = dynamic(() => import('./CodeBlock'), {
    ssr: false,
    loading: () => (
        <pre className="my-2 p-4 rounded-xl bg-[#282c34] text-zinc-400 text-sm overflow-x-auto"><code>იტვირთება…</code></pre>
    ),
});

function OutputView({ outputs }: { outputs: NotebookOutput[] }) {
    if (!outputs || outputs.length === 0) return null;
    return (
        <details className="group mt-1 ml-0 sm:ml-10 rounded-lg border border-gray-200 bg-gray-50/70 overflow-hidden">
            <summary className="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer select-none text-xs font-medium text-gray-500 hover:text-gray-700">
                <TbChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-0 -rotate-90" />
                გამოტანა
            </summary>
            <div className="px-3 pb-3 pt-1 space-y-2">
                {outputs.map((o, i) =>
                    o.kind === 'image' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} src={o.src} alt="ნოუთბუქის გამოტანა" loading="lazy" className="max-w-full h-auto rounded-md border border-gray-200 bg-white" />
                    ) : (
                        <pre key={i} className={`text-xs overflow-x-auto rounded-md p-3 whitespace-pre-wrap break-words ${o.stream === 'stderr' ? 'bg-red-50 text-red-700' : 'bg-white text-gray-700 border border-gray-100'}`}>
                            <code style={{ fontFamily: 'var(--font-code, monospace)' }}>{o.text}</code>
                        </pre>
                    )
                )}
            </div>
        </details>
    );
}

function CodeCell({ cell }: { cell: NotebookCodeCell }) {
    return (
        <div className="my-4">
            <div className="flex gap-0 sm:gap-3">
                <div className="hidden sm:block pt-3 w-7 shrink-0 text-right">
                    <span className="text-[11px] font-mono text-emerald-600/70">[{cell.executionCount ?? ' '}]</span>
                </div>
                <div className="flex-1 min-w-0">
                    <CodeBlock code={cell.source} language={cell.language || 'python'} />
                </div>
            </div>
            <OutputView outputs={cell.outputs} />
        </div>
    );
}

export default function NotebookViewer({ lesson }: { lesson: CourseNotebookLesson }) {
    return (
        <div className="course-notebook">
            {lesson.cells.map((cell, i) =>
                cell.type === 'markdown'
                    ? <CourseMarkdown key={i} content={cell.source} />
                    : <CodeCell key={i} cell={cell} />
            )}
        </div>
    );
}
