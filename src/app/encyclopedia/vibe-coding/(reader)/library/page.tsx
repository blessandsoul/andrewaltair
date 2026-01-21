import type { Metadata } from 'next';
import { TbBook, TbSearch, TbLock } from 'react-icons/tb';
import { VIBE_CODING_DATA } from '@/data/vibeCodingContent';
import Link from 'next/link';
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
        <div className="pt-20 pb-24 px-4 min-h-screen lg:pt-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">📚 აირჩიეთ სტატია</h1>
                <p className="text-gray-500 text-sm">აირჩიეთ სასურველი თემა კითხვის დასაწყებად</p>
            </div>

            <MobileArticleList />
        </div>
    );
}
