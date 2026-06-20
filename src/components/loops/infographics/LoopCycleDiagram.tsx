import { LoopCycleSection } from '@/types/loopsArticle';
import { LoopIcon } from './loopIcons';

// Signature visual: the repeat-until-goal loop, drawn once so the whole
// concept clicks. SVG scales to the column; nodes use foreignObject so the
// Georgian labels and Tabler icons render with the page font.
export default function LoopCycleDiagram({ section }: { section: LoopCycleSection }) {
    const stroke = '#4f46e5'; // indigo-600, brand-anchored
    return (
        <section>
            <div>
                {section.heading && (
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{section.heading}</h2>
                )}
                {section.intro && (
                    <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl">{section.intro}</p>
                )}

                <div className="rounded-3xl border border-indigo-100 bg-gradient-to-b from-indigo-50/60 to-white p-3 md:p-6 shadow-sm">
                    <svg viewBox="0 0 880 470" className="w-full h-auto" role="img"
                        aria-label={`${section.trigger}, ${section.work}, ${section.check}, ${section.done}`}>
                        <defs>
                            <marker id="loopArrow" markerWidth="12" markerHeight="12" refX="8" refY="4" orient="auto">
                                <path d="M0,0 L8,4 L0,8 Z" fill={stroke} />
                            </marker>
                            <style>{`
                                @media (prefers-reduced-motion: no-preference) {
                                    .loop-flow { stroke-dasharray: 10 8; animation: loopDash 1.4s linear infinite; }
                                }
                                @keyframes loopDash { to { stroke-dashoffset: -36; } }
                            `}</style>
                        </defs>

                        {/* straight connectors */}
                        <line x1="248" y1="95" x2="332" y2="95" stroke={stroke} strokeWidth="3" markerEnd="url(#loopArrow)" />
                        <line x1="548" y1="95" x2="632" y2="95" stroke={stroke} strokeWidth="3" markerEnd="url(#loopArrow)" />
                        {/* yes -> done */}
                        <line x1="780" y1="150" x2="780" y2="296" stroke={stroke} strokeWidth="3" markerEnd="url(#loopArrow)" />
                        {/* the loop back: check -> work (the heart of the picture) */}
                        <path className="loop-flow" d="M 700 150 C 700 250, 440 250, 440 152" fill="none" stroke={stroke} strokeWidth="4" markerEnd="url(#loopArrow)" />

                        {/* arrow labels */}
                        <text x="560" y="232" fill={stroke} fontSize="22" fontWeight="700" textAnchor="middle"
                            style={{ fontFamily: 'inherit' }}>{section.no}</text>
                        <text x="800" y="228" fill="#16a34a" fontSize="22" fontWeight="700"
                            style={{ fontFamily: 'inherit' }}>დიახ</text>

                        {/* nodes */}
                        <Node x={40} y={40} icon="bolt" tone="amber" label={section.trigger} />
                        <Node x={340} y={40} icon="robot" tone="indigo" label={section.work} />
                        <Node x={640} y={40} icon="target" tone="sky" label={section.check} diamond />
                        <Node x={640} y={300} icon="check" tone="green" label={section.done} />
                    </svg>
                </div>

                {section.caption && (
                    <p className="text-sm text-gray-500 mt-4 text-center max-w-2xl mx-auto">{section.caption}</p>
                )}
            </div>
        </section>
    );
}

const TONES: Record<string, { bg: string; border: string; icon: string }> = {
    amber: { bg: '#fffbeb', border: '#fcd34d', icon: '#d97706' },
    indigo: { bg: '#eef2ff', border: '#c7d2fe', icon: '#4f46e5' },
    sky: { bg: '#f0f9ff', border: '#bae6fd', icon: '#0284c7' },
    green: { bg: '#f0fdf4', border: '#bbf7d0', icon: '#16a34a' },
};

function Node({ x, y, icon, label, tone, diamond }: {
    x: number; y: number; icon: string; label: string; tone: string; diamond?: boolean;
}) {
    const t = TONES[tone] || TONES.indigo;
    return (
        <foreignObject x={x} y={y} width={200} height={120}>
            <div
                // @ts-ignore xmlns is valid on foreignObject HTML root
                xmlns="http://www.w3.org/1999/xhtml"
                style={{ height: '100%', background: t.bg, borderColor: t.border, borderRadius: diamond ? 28 : 18 }}
                className="h-full border-2 flex flex-col items-center justify-center gap-1.5 px-3 text-center shadow-sm"
            >
                <span style={{ color: t.icon, display: 'flex' }}><LoopIcon name={icon} className="w-7 h-7" /></span>
                <span className="font-bold text-gray-900 text-[15px] leading-tight">{label}</span>
            </div>
        </foreignObject>
    );
}
