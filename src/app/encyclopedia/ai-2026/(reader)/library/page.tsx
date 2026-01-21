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
        <div className="pt-20 pb-24 px-4 min-h-screen lg:pt-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">🚀 აირჩიეთ სტატია</h1>
                <p className="text-gray-500 text-sm">აირჩიეთ სასურველი თემა კითხვის დასაწყებად</p>
            </div>

            <AI2026ArticleList />
        </div>
    );
}

