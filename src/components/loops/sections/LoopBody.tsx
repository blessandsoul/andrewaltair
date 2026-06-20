import { sanitizeHtml } from '@/lib/sanitize';

// Renders a lesson body string: \n\n paragraphs, `- ` / `1.` lists, **bold**.
// Indigo brand, no neon. Shared by LoopText and LoopOutro. No own width (the
// reader shell owns the column).
export default function LoopBody({ body, className = '' }: { body: string; className?: string }) {
    const blocks = body.split('\n\n').map(b => b.trim()).filter(Boolean);

    return (
        <div className={`space-y-4 text-gray-700 leading-relaxed ${className}`}>
            {blocks.map((block, i) => {
                const isList = block.startsWith('- ') || /^\d+\.\s/.test(block);
                if (isList) {
                    const items = block.split('\n').map(l => l.trim()).filter(Boolean);
                    return (
                        <ul key={i} className="space-y-2">
                            {items.map((item, j) => (
                                <li key={j} className="flex gap-2.5">
                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                    <span dangerouslySetInnerHTML={{
                                        __html: sanitizeHtml(
                                            item.replace(/^[\d.\-*]+\s*/, '')
                                                .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
                                        )
                                    }} />
                                </li>
                            ))}
                        </ul>
                    );
                }
                const html = sanitizeHtml(
                    block.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-indigo-700">$1</strong>')
                );
                return <p key={i} dangerouslySetInnerHTML={{ __html: html }} />;
            })}
        </div>
    );
}
