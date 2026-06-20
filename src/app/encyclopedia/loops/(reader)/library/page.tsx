import type { Metadata } from 'next';
import LoopsArticleList from './LoopsArticleList';

export const metadata: Metadata = {
    title: 'ციკლების ბიბლიოთეკა - ყველა გაკვეთილი | Loops',
    description: 'ყველა გაკვეთილი AI ციკლებზე (Loops) ერთ ადგილას. აირჩიე გაკვეთილი და დაიწყე სწავლა.',
    alternates: { canonical: '/encyclopedia/loops/library' },
};

export default function LoopsLibraryPage() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="max-w-3xl mx-auto px-4 pt-12 pb-2 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">ციკლების ბიბლიოთეკა</h1>
                <p className="text-gray-600">აირჩიე გაკვეთილი და დაიწყე სწავლა</p>
            </div>
            <LoopsArticleList />
        </div>
    );
}
