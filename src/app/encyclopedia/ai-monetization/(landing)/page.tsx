import type { Metadata } from 'next';
import { TbCash, TbBook, TbArrowRight, TbBrandTelegram, TbCircleCheck, TbGift, TbRocket } from 'react-icons/tb';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'AI მონეტიზაცია - შემოსავალი AI-ით | Andrew Altair',
    description: 'ისწავლე AI-ით შემოსავლის მიღება. ფრილანსი, პროდუქტები, სააგენტო და მეტი.',
};

export default function AIMonetizationLandingPage() {
    return (
        <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#fafafa' }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-green-200/40 via-emerald-200/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-teal-200/40 via-green-200/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 mb-6">
                        <TbCash size={20} className="text-green-600" />
                        <span className="text-sm font-medium text-green-700">AI-ით შემოსავლის მიღება</span>
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent leading-tight pb-2">
                        AI მონეტიზაცია
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        ისწავლე როგორ მიიღო შემოსავალი AI უნარებით. ფრილანსი, პროდუქტები, სააგენტო.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/encyclopedia/ai-monetization/library" className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:scale-105 transition-transform shadow-lg flex items-center gap-2">
                            <TbBook size={20} />
                            წაიკითხე სტატიები
                            <TbArrowRight size={20} />
                        </Link>
                        <a href="https://t.me/andr3waltairchannel" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-xl bg-white border-2 border-green-200 text-green-600 font-semibold hover:bg-green-50 transition-colors flex items-center gap-2">
                            <TbBrandTelegram size={20} />
                            პრემიუმის მიღება
                        </a>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-green-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                            <TbGift size={24} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">რას ისწავლით</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {[
                            { title: 'AI ფრილანსი', value: '$30-200/საათი' },
                            { title: 'პროდუქტების შექმნა', value: 'პასიური შემოსავალი' },
                            { title: 'რეალური კეისები', value: '$2k-15k/თვე' },
                            { title: 'სააგენტოს დაწყება', value: 'სკალირება' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                                <TbCircleCheck size={24} className="text-green-500 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{item.title}</p>
                                    <p className="text-sm text-green-600 font-semibold">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center">
                    <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-2xl">
                        <h3 className="text-2xl font-bold mb-4">დაიწყე შემოსავლის მიღება</h3>
                        <Link href="/encyclopedia/ai-monetization/library" className="px-8 py-4 rounded-xl bg-white text-green-600 font-semibold hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2">
                            <TbRocket className="w-5 h-5" />
                            დაიწყე უფასოდ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
