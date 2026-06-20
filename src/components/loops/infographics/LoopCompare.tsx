import { LoopCompareSection, LoopCompareColumn } from '@/types/loopsArticle';
import { LoopIcon } from './loopIcons';
import { TbCheck } from 'react-icons/tb';

// Two-column comparison with Georgian labels (our own component, so the chrome
// is never the English "Pros / Cons / WINNER" of the shared universal one).
const ACCENTS: Record<string, { bg: string; border: string; chip: string; text: string; bullet: string }> = {
    indigo: { bg: 'bg-indigo-50', border: 'border-indigo-100', chip: 'bg-white text-indigo-600', text: 'text-indigo-900', bullet: 'text-indigo-500' },
    green: { bg: 'bg-green-50', border: 'border-green-100', chip: 'bg-white text-green-600', text: 'text-green-900', bullet: 'text-green-500' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-100', chip: 'bg-white text-amber-600', text: 'text-amber-900', bullet: 'text-amber-500' },
    rose: { bg: 'bg-rose-50', border: 'border-rose-100', chip: 'bg-white text-rose-600', text: 'text-rose-900', bullet: 'text-rose-500' },
    sky: { bg: 'bg-sky-50', border: 'border-sky-100', chip: 'bg-white text-sky-600', text: 'text-sky-900', bullet: 'text-sky-500' },
};

function Column({ col }: { col: LoopCompareColumn }) {
    const a = ACCENTS[col.accent || 'indigo'] || ACCENTS.indigo;
    return (
        <div className={`rounded-2xl ${a.bg} border ${a.border} p-6`}>
            <h3 className={`flex items-center gap-2 font-bold text-lg mb-4 ${a.text}`}>
                <span className={`w-9 h-9 rounded-full ${a.chip} flex items-center justify-center shadow-sm`}>
                    <LoopIcon name={col.icon} className="w-5 h-5" />
                </span>
                {col.title}
            </h3>
            <ul className="space-y-2.5">
                {col.items.map((item, i) => (
                    <li key={i} className={`flex gap-2 text-sm ${a.text}`}>
                        <TbCheck className={`w-4 h-4 mt-0.5 shrink-0 ${a.bullet}`} />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
            {col.example && (
                <p className="mt-4 pt-4 border-t border-black/5 text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">მაგალითი: </span>{col.example}
                </p>
            )}
        </div>
    );
}

export default function LoopCompare({ section }: { section: LoopCompareSection }) {
    return (
        <section className="px-4 md:px-6 py-8 md:py-12">
            <div className="max-w-4xl mx-auto">
                {section.heading && (
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{section.heading}</h2>
                )}
                {section.intro && (
                    <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl">{section.intro}</p>
                )}
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <Column col={section.left} />
                    <Column col={section.right} />
                </div>
            </div>
        </section>
    );
}
