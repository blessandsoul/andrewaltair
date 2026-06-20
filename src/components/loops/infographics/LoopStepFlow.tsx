import { LoopStepsSection } from '@/types/loopsArticle';

// Numbered vertical step flow for a worked example, step by step.
export default function LoopStepFlow({ section }: { section: LoopStepsSection }) {
    return (
        <section>
            <div>
                {section.heading && (
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{section.heading}</h2>
                )}
                {section.intro && (
                    <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl">{section.intro}</p>
                )}

                <div className="space-y-5">
                    {section.steps.map((step, i) => (
                        <div key={i} className="flex gap-4 md:gap-5 group">
                            <div className="shrink-0 w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md relative group-hover:scale-105 transition-transform">
                                {i + 1}
                                {i !== section.steps.length - 1 && (
                                    <span className="absolute top-11 left-1/2 -translate-x-1/2 w-0.5 h-7 bg-indigo-200" />
                                )}
                            </div>
                            <div className="pt-0.5 pb-3">
                                <h3 className="font-bold text-gray-900 mb-1 leading-snug">{step.title}</h3>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
