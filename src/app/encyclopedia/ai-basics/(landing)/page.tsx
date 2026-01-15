import type { Metadata } from 'next';
import { TbBrain, TbBook, TbArrowRight, TbBrandTelegram, TbCircleCheck, TbGift, TbRocket } from 'react-icons/tb';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'AI საფუძვლები - სრული გზამკვლევი 2026 | Andrew Altair',
    description: 'რა არის ხელოვნური ინტელექტი? ისტორია, მოდელები (ChatGPT, Gemini, Claude), გამოყენების სფეროები და ეთიკა.',
};

export default function AIBasicsLandingPage() {
    return (
        <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#fafafa' }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-200/40 via-cyan-200/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-indigo-200/40 via-purple-200/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200 mb-6">
                        <TbBrain size={20} className="text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">AI საფუძვლები</span>
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent leading-tight pb-2">
                        რა არის ხელოვნური ინტელექტი?
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        გაიგე ყველაფერი AI-ს შესახებ: ისტორიიდან თანამედროვე მოდელებამდე.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/encyclopedia/ai-basics/library" className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:scale-105 transition-transform shadow-lg flex items-center gap-2">
                            <TbBook size={20} /> წაიკითხე სრულად <TbArrowRight size={20} />
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-blue-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <TbGift size={24} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">რას ვისწავლით?</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { title: 'განმარტება', value: 'რა არის AI და როგორ მუშაობს' },
                            { title: 'მოდელები', value: 'ChatGPT, Gemini, Claude, Copilot' },
                            { title: 'ისტორია', value: 'ტურინგიდან დღევანდელობამდე' },
                            { title: 'გავლენა', value: 'მედიცინა, ბიზნესი, ხელოვნება' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
                                <TbCircleCheck size={24} className="text-green-500 shrink-0 mt-0.5" />
                                <div className="flex-1"><p className="font-medium text-gray-900">{item.title}</p><p className="text-sm text-blue-600 font-semibold">{item.value}</p></div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
