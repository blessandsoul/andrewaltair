import { TbBulb } from 'react-icons/tb';

// callout / fact for LOOPS: calm indigo tip box.
export default function LoopCallout({ content, title }: { content: string; title?: string }) {
    return (
        <aside className="border-l-4 border-indigo-400 bg-indigo-50 rounded-r-xl p-5 flex gap-3">
            <TbBulb className="w-6 h-6 text-indigo-500 shrink-0 mt-0.5" />
            <div>
                {title && <h3 className="font-bold text-indigo-900 mb-1">{title}</h3>}
                <p className="text-gray-800 leading-relaxed">{content}</p>
            </div>
        </aside>
    );
}
