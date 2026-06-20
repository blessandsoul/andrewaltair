import Link from 'next/link';
import { TbArrowRight } from 'react-icons/tb';
import { SectionOutro } from '@/types/article';
import LoopBody from './LoopBody';

// section_outro for LOOPS: indigo recap card + CTA (no cyan-black button).
export default function LoopOutro({ section }: { section: SectionOutro }) {
    return (
        <section className="rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 scroll-mt-24">{section.heading}</h2>
            <LoopBody body={section.body} />
            {section.call_to_action && (
                <Link
                    href={section.call_to_action.url}
                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all hover:scale-105"
                >
                    {section.call_to_action.text}
                    <TbArrowRight className="w-5 h-5" />
                </Link>
            )}
        </section>
    );
}
