import type { Metadata } from 'next';
import AI2026ArticleList from './AI2026ArticleList';

export const metadata: Metadata = {
    title: 'AI 2026 სტატიები - მომავლის გზამკვლევი | Andrew Altair',
    description: 'AI 2026: კაცობრიობის დიდი ფილტრი და სხვა ფუტურისტული სტატიები.',
    keywords: ['AI 2026', 'Future', 'Human 2.0', 'სტატიები'],
    openGraph: {
        title: 'AI 2026 სტატიები - მომავლის გზამკვლევი',
        description: 'AI 2026: კაცობრიობის დიდი ფილტრი და სხვა ფუტურისტული სტატიები.',
        type: 'website',
    }
};

export default function AI2026LibraryPage() {
    return (
        <div className="pt-20 pb-24 px-4 lg:px-8 min-h-screen lg:pt-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
                    🚀 AI 2026 გზამკვლევი
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                    აირჩიეთ სტატია
                </h1>
                <p className="text-gray-500 text-lg max-w-2xl">
                    გაიგე როგორ გამოიყურება მომავალი და როგორ მოემზადო მისთვის
                </p>
            </div>

            <AI2026ArticleList />
        </div>
    );
}


