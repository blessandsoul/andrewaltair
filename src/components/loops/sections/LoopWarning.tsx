import { TbAlertTriangle } from 'react-icons/tb';
import { WarningSection } from '@/types/article';

// warning_section for LOOPS: calm amber box, no pulsing red neon.
export default function LoopWarning({ section }: { section: WarningSection }) {
    return (
        <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 flex items-center gap-2.5 scroll-mt-24">
                <TbAlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
                {section.heading}
            </h2>
            {section.body && <p className="text-gray-600 mb-5 leading-relaxed">{section.body}</p>}
            <div className="space-y-3">
                {section.warnings.map((w, i) => (
                    <div key={i} className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 md:p-5">
                        <h3 className="font-bold text-amber-900 mb-1.5">{w.title}</h3>
                        <p className="text-gray-700 text-sm md:text-base leading-relaxed">{w.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
