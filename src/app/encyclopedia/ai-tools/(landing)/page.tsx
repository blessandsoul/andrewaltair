import type { Metadata } from 'next';
import { TbTools, TbBook, TbArrowRight, TbBrandTelegram, TbCircleCheck, TbGift, TbRocket } from 'react-icons/tb';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'AI ინსტრუმენტები - კატალოგი 2025 | Andrew Altair',
    description: '100+ AI ინსტრუმენტის კატალოგი. Midjourney, DALL-E, Runway, ElevenLabs და მეტი.',
};

export default function AIToolsLandingPage() {
    return (
        <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#fafafa' }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-orange-200/40 via-amber-200/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-yellow-200/40 via-orange-200/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 mb-6">
                        <TbTools size={20} className="text-orange-600" />
                        <span className="text-sm font-medium text-orange-700">100+ AI ინსტრუმენტი</span>
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent leading-tight pb-2">
                        AI ინსტრუმენტები
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        სრული კატალოგი 2025 წლის საუკეთესო AI ინსტრუმენტებით.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/encyclopedia/ai-tools/library" className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold hover:scale-105 transition-transform shadow-lg flex items-center gap-2">
                            <TbBook size={20} /> წაიკითხე სტატიები <TbArrowRight size={20} />
                        </Link>
                        <a href="https://t.me/andr3waltairchannel" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-xl bg-white border-2 border-orange-200 text-orange-600 font-semibold hover:bg-orange-50 transition-colors flex items-center gap-2">
                            <TbBrandTelegram size={20} /> პრემიუმის მიღება
                        </a>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-orange-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                            <TbGift size={24} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">კატეგორიები</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { title: 'გამოსახულება', value: 'Midjourney, DALL-E, Flux' },
                            { title: 'ვიდეო', value: 'Runway, Pika, Kling' },
                            { title: 'აუდიო', value: 'ElevenLabs, Suno' },
                            { title: 'ტექსტი', value: 'ChatGPT, Claude, Gemini' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100">
                                <TbCircleCheck size={24} className="text-green-500 shrink-0 mt-0.5" />
                                <div className="flex-1"><p className="font-medium text-gray-900">{item.title}</p><p className="text-sm text-orange-600 font-semibold">{item.value}</p></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center">
                    <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-2xl">
                        <h3 className="text-2xl font-bold mb-4">აღმოაჩინე AI ინსტრუმენტები</h3>
                        <Link href="/encyclopedia/ai-tools/library" className="px-8 py-4 rounded-xl bg-white text-orange-600 font-semibold hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2">
                            <TbRocket className="w-5 h-5" /> დაიწყე აღმოჩენა
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
