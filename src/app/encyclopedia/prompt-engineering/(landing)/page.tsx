import type { Metadata } from 'next';
import { TbSparkles, TbBook, TbArrowRight, TbBrandTelegram, TbCircleCheck, TbStar, TbGift, TbChartBar, TbBulb, TbRocket, TbLock } from 'react-icons/tb';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Prompt Engineering ენციკლოპედია | Andrew Altair',
    description: 'სრული სახელმძღვანელო Prompt Engineering-ზე. Chain-of-Thought, Few-Shot, მზა პრომპტების ბიბლიოთეკა და მეტი.',
    keywords: ['prompt engineering', 'AI prompts', 'ChatGPT prompts', 'Claude prompts'],
    openGraph: {
        title: 'Prompt Engineering ენციკლოპედია',
        description: 'სრული სახელმძღვანელო Prompt Engineering-ზე',
        type: 'website',
    }
};

export default function PromptEngineeringLandingPage() {
    return (
        <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#fafafa' }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-violet-200/40 via-purple-200/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-indigo-200/40 via-violet-200/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200 mb-6">
                        <TbSparkles size={20} className="text-violet-600" />
                        <span className="text-sm font-medium text-violet-700">AI-თან კომუნიკაციის ხელოვნება</span>
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 bg-clip-text text-transparent leading-tight pb-2">
                        Prompt Engineering
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        ისწავლე AI-სთან ეფექტური კომუნიკაცია. Chain-of-Thought, Few-Shot და მზა პრომპტების ბიბლიოთეკა.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/encyclopedia/prompt-engineering/library" className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:scale-105 transition-transform shadow-lg flex items-center gap-2">
                            <TbBook size={20} />
                            წაიკითხე სტატიები
                            <TbArrowRight size={20} />
                        </Link>
                        <a href="https://t.me/andr3waltairchannel" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-xl bg-white border-2 border-violet-200 text-violet-600 font-semibold hover:bg-violet-50 transition-colors flex items-center gap-2">
                            <TbBrandTelegram size={20} />
                            პრემიუმის მიღება
                        </a>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-violet-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                            <TbGift size={24} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">რას ისწავლით</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {[
                            { title: 'Chain-of-Thought ტექნიკა', value: 'ნაბიჯ-ნაბიჯ აზროვნება' },
                            { title: 'Few-Shot Prompting', value: 'მაგალითებით სწავლება' },
                            { title: 'System Prompts', value: 'AI-ს პიროვნების შექმნა' },
                            { title: 'მზა პრომპტები', value: '50+ შაბლონი' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
                                <TbCircleCheck size={24} className="text-green-500 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{item.title}</p>
                                    <p className="text-sm text-violet-600 font-semibold">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center">
                    <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-2xl">
                        <h3 className="text-2xl font-bold mb-4">მზად ხარ დასაწყებად?</h3>
                        <p className="text-lg opacity-90 mb-6">გახდი Prompt Engineering ექსპერტი</p>
                        <Link href="/encyclopedia/prompt-engineering/library" className="px-8 py-4 rounded-xl bg-white text-violet-600 font-semibold hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2">
                            <TbRocket className="w-5 h-5" />
                            დაიწყე უფასოდ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
