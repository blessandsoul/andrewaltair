import { SectionStandard } from '@/types/article';
import LoopBody from './LoopBody';

// section_standard for LOOPS: clean indigo body, no neon glow / cyan bullets.
export default function LoopText({ section }: { section: SectionStandard }) {
    return (
        <section>
            {section.heading && (
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 scroll-mt-24">{section.heading}</h2>
            )}
            {section.highlight_quote && (
                <blockquote className="my-6 border-l-4 border-indigo-300 bg-indigo-50/60 rounded-r-xl px-5 py-4">
                    <p className="text-lg font-semibold text-gray-900 italic">{`„${section.highlight_quote.text}“`}</p>
                    <footer className="text-sm text-indigo-600 mt-2 font-medium">
                        {section.highlight_quote.author}, {section.highlight_quote.year}
                    </footer>
                </blockquote>
            )}
            <LoopBody body={section.body} />
        </section>
    );
}
