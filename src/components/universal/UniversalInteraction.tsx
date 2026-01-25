'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQAccordion, CTABannerWide, ProductCardMini, QuizWidget, DownloadBox } from '@/types/universalSections';
import { useState } from 'react';
import { TbChevronDown, TbDownload, TbExternalLink, TbStar, TbCircleCheck } from 'react-icons/tb';

// 16. FAQ Accordion
export function FAQAccordionComponent({ data }: { data: FAQAccordion }) {
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    return (
        <div className="my-12 max-w-3xl mx-auto">
            {data.items.map((item, idx) => (
                <div key={idx} className="border-b border-gray-100">
                    <button onClick={() => setOpenIdx(openIdx === idx ? null : idx)} className="w-full py-5 flex items-center justify-between text-left focus:outline-none group">
                        <span className={`text-lg font-bold transition-colors ${openIdx === idx ? 'text-purple-600' : 'text-gray-900 group-hover:text-purple-600'}`}>
                            {item.q}
                        </span>
                        <TbChevronDown className={`w-5 h-5 transition-transform duration-300 ${openIdx === idx ? 'rotate-180 text-purple-600' : 'text-gray-400'}`} />
                    </button>
                    <AnimatePresence>
                        {openIdx === idx && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="pb-6 text-gray-600 leading-relaxed text-balance">
                                    {item.a}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}

// 17. CTA Banner Wide
export function CTABannerWideComponent({ data }: { data: CTABannerWide }) {
    return (
        <div className="my-16 relative rounded-3xl overflow-hidden bg-gray-900 text-white min-h-[300px] flex items-center justify-center text-center px-6">
            {data.bg_image && <img src={data.bg_image} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />}
            <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">{data.title}</h2>
                {data.desc && <p className="text-xl text-gray-200 mb-8 font-light">{data.desc}</p>}
                <a href={data.button_url} className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform">
                    {data.button_text} <TbArrowRight className="w-5 h-5" />
                </a>
            </div>
        </div>
    );
}

function TbArrowRight(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg> }


// 18. Product Card Mini
export function ProductCardMiniComponent({ data }: { data: ProductCardMini }) {
    return (
        <a href={data.link || '#'} target="_blank" className="block group my-8">
            <div className="flex items-center gap-5 p-5 bg-white rounded-xl border border-gray-100 shadow-sm group-hover:shadow-md group-hover:border-purple-100 transition-all">
                <img src={data.icon_url || `https://ui-avatars.com/api/?name=${data.name}&background=random`} className="w-16 h-16 rounded-xl object-cover shadow-sm bg-gray-50" />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-gray-900 text-lg truncate group-hover:text-purple-600 transition-colors">{data.name}</h4>
                        {data.rating && (
                            <div className="flex items-center gap-1 text-amber-400 text-sm font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                                <TbStar className="fill-current w-3.5 h-3.5" /> {data.rating}
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">{data.desc}</p>
                </div>
                <TbExternalLink className="w-5 h-5 text-gray-300 group-hover:text-purple-500" />
            </div>
        </a>
    );
}

// 19. Quiz Widget
export function QuizWidgetComponent({ data }: { data: QuizWidget }) {
    const [selected, setSelected] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const opts = data.options;
    const isCorrect = selected !== null && opts[selected]?.is_correct;

    return (
        <div className="my-12 p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Quiz</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{data.question}</h3>

            <div className="space-y-3">
                {opts.map((opt, idx) => {
                    const isSel = selected === idx;
                    const statusColor = submitted
                        ? (opt.is_correct ? 'bg-green-100 border-green-300 text-green-900' : (isSel ? 'bg-red-100 border-red-300 text-red-900' : 'bg-white border-gray-200 opacity-50'))
                        : (isSel ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 hover:border-indigo-300');

                    return (
                        <button key={idx} disabled={submitted} onClick={() => setSelected(idx)} className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all ${statusColor}`}>
                            {opt.text}
                        </button>
                    )
                })}
            </div>

            {!submitted && selected !== null && (
                <button onClick={() => setSubmitted(true)} className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors">Check Answer</button>
            )}

            {submitted && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <TbCircleCheck className="w-6 h-6 shrink-0" />
                    <div>
                        <p className="font-bold">{isCorrect ? 'Correct!' : 'Incorrect'}</p>
                        <p className="text-sm mt-1 opacity-90">{data.correct_message || (isCorrect ? 'Great job!' : 'Try again.')}</p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

// 20. Download Box
export function DownloadBoxComponent({ data }: { data: DownloadBox }) {
    return (
        <div className="my-10 p-1 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            <div className="bg-white rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
                    <TbDownload className="w-8 h-8 text-gray-400" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="font-bold text-xl text-gray-900 mb-1">{data.title}</h4>
                    <div className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-3">
                        {data.file_type && <span className="uppercase bg-gray-100 px-1.5 rounded text-xs py-0.5">{data.file_type}</span>}
                        {data.file_size}
                    </div>
                </div>
                <a href={data.download_url} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-2">
                    Download <TbDownload className="w-4 h-4" />
                </a>
            </div>
        </div>
    )
}
