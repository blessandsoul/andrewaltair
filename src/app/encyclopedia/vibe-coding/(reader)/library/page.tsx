import type { Metadata } from 'next';
import MobileArticleList from './MobileArticleList';

export const metadata: Metadata = {
    title: 'Vibe Coding სტატიები - AI პროგრამირების ბიბლიოთეკა | Andrew Altair',
    description: '12+ დეტალური სტატია Vibe Coding-ზე. ისწავლე AI-ასისტირებული პროგრამირება, Cursor, Claude, ChatGPT და მეტი.',
    keywords: ['vibe coding', 'AI პროგრამირება', 'cursor', 'claude', 'chatgpt', 'სტატიები'],
    openGraph: {
        title: 'Vibe Coding სტატიები - AI პროგრამირების ბიბლიოთეკა',
        description: '12+ დეტალური სტატია Vibe Coding-ზე. ისწავლე AI-ასისტირებული პროგრამირება.',
        type: 'website',
    }
};

export default function VibeCodingLibraryPage() {
    return (
        <div className="pt-20 pb-24 px-4 lg:px-8 min-h-screen lg:pt-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
                    ✨ ვაიბ კოდინგის ბიბლიოთეკა
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                    აირჩიეთ სტატია
                </h1>
                <p className="text-gray-500 text-lg max-w-2xl">
                    აირჩიეთ სასურველი თემა და დაიწყეთ AI პროგრამირების სწავლა ახლავე
                </p>
            </div>

            <MobileArticleList />
        </div>
    );
}

