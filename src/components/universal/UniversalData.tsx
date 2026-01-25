'use client';
import { motion } from 'framer-motion';
import { StatGrid, ComparisonTablePro, ProsConsCards, TimelineVertical, ProcessSteps } from '@/types/universalSections';
import { TbCheck, TbX, TbArrowRight } from 'react-icons/tb';

// 6. Stat Grid
export function StatGridComponent({ data }: { data: StatGrid }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-10">
            {data.stats.map((stat, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-gray-50 text-center border border-gray-100 hover:border-blue-100 transition-colors">
                    <div className="text-3xl md:text-4xl font-black mb-2" style={{ color: stat.color || '#3b82f6' }}>{stat.value}</div>
                    <div className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-1">{stat.label}</div>
                    {stat.desc && <div className="text-xs text-gray-500">{stat.desc}</div>}
                </div>
            ))}
        </div>
    );
}

// 7. Comparison Table Pro
export function ComparisonTableProComponent({ data }: { data: ComparisonTablePro }) {
    return (
        <div className="overflow-x-auto my-10 rounded-2xl border border-gray-200">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-4 font-medium text-gray-500">Feature</th>
                        {data.items.map((item, idx) => (
                            <th key={idx} className={`p-4 font-bold text-lg ${item.is_winner ? 'text-green-700 bg-green-50/50' : 'text-gray-900'}`}>
                                {item.name} {item.is_winner && <span className="ml-1 text-xs bg-green-200 text-green-800 px-1.5 py-0.5 rounded">WINNER</span>}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.features.map((feature, fIdx) => (
                        <tr key={fIdx}>
                            <td className="p-4 font-medium text-gray-700 bg-white">{feature}</td>
                            {data.items.map((item, iIdx) => (
                                <td key={iIdx} className={`p-4 text-center ${item.is_winner ? 'bg-green-50/10' : 'bg-white'}`}>
                                    {typeof item.values[fIdx] === 'boolean' ? (
                                        item.values[fIdx] ? <TbCheck className="w-6 h-6 text-green-500 mx-auto" /> : <TbX className="w-6 h-6 text-red-400 mx-auto opacity-50" />
                                    ) : (
                                        <span className="text-gray-900 font-semibold">{item.values[fIdx]}</span>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// 8. Pros Cons Cards
export function ProsConsCardsComponent({ data }: { data: ProsConsCards }) {
    return (
        <div className="grid md:grid-cols-2 gap-6 my-10">
            <div className="p-6 rounded-2xl bg-green-50 border border-green-100">
                <h3 className="flex items-center gap-2 text-green-800 font-bold mb-4 text-lg">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm"><TbCheck /></div>
                    Pros
                </h3>
                <ul className="space-y-3">
                    {data.pros.map((p, i) => <li key={i} className="flex gap-2 text-green-900 text-sm"><TbCheck className="w-4 h-4 mt-0.5 shrink-0 opacity-60" /> {p}</li>)}
                </ul>
            </div>
            <div className="p-6 rounded-2xl bg-red-50 border border-red-100">
                <h3 className="flex items-center gap-2 text-red-800 font-bold mb-4 text-lg">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-red-600 shadow-sm"><TbX /></div>
                    Cons
                </h3>
                <ul className="space-y-3">
                    {data.cons.map((c, i) => <li key={i} className="flex gap-2 text-red-900 text-sm"><TbX className="w-4 h-4 mt-0.5 shrink-0 opacity-60" /> {c}</li>)}
                </ul>
            </div>
        </div>
    );
}

// 9. Timeline Vertical
export function TimelineVerticalComponent({ data }: { data: TimelineVertical }) {
    return (
        <div className="my-12 ml-4 border-l-2 border-gray-100 space-y-8">
            {data.events.map((event, idx) => (
                <div key={idx} className="relative pl-8">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-purple-500 shadow-sm" />
                    <div className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">{event.date}</div>
                    <h4 className="font-bold text-xl text-gray-900 mb-2">{event.title}</h4>
                    <p className="text-gray-600 leading-relaxed text-sm">{event.desc}</p>
                </div>
            ))}
        </div>
    );
}

// 10. Process Steps
export function ProcessStepsComponent({ data }: { data: ProcessSteps }) {
    return (
        <div className="my-12 space-y-6">
            {data.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4 md:gap-6 group">
                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-bold text-xl shadow-lg relative group-hover:scale-110 transition-transform">
                        {idx + 1}
                        {idx !== data.steps.length - 1 && <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-gray-200 -z-10" />}
                    </div>
                    <div className="pt-1 pb-8">
                        <h4 className="font-bold text-xl text-gray-900 mb-2">{step.title}</h4>
                        <p className="text-gray-600">{step.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
