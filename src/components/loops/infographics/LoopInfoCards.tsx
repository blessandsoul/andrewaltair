import { LoopCardsSection } from '@/types/loopsArticle';
import { LoopIcon } from './loopIcons';

// Grid of icon cards. Cell count follows the card count, so this never
// collapses into the generic "three identical feature cards" row.
export default function LoopInfoCards({ section }: { section: LoopCardsSection }) {
    const cols = section.columns === 3
        ? 'sm:grid-cols-2 lg:grid-cols-3'
        : 'sm:grid-cols-2';

    return (
        <section className="px-4 md:px-6 py-8 md:py-12">
            <div className="max-w-4xl mx-auto">
                {section.heading && (
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{section.heading}</h2>
                )}
                {section.intro && (
                    <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl">{section.intro}</p>
                )}

                <div className={`grid grid-cols-1 ${cols} gap-4`}>
                    {section.cards.map((card, i) => (
                        <div key={i}
                            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
                            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                                <LoopIcon name={card.icon} className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1.5 leading-snug">{card.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
