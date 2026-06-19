import type { Metadata } from 'next';
import { TbBooks } from 'react-icons/tb';
import AIForBeginnersCatalog from '@/components/courses/ai-for-beginners/AIForBeginnersCatalog';

export const metadata: Metadata = {
    title: 'ყველა გაკვეთილი | AI დამწყებთათვის',
    description: 'AI დამწყებთათვის კურსის სრული სარჩევი: მოდულები, გაკვეთილები და პრაქტიკული ნოუთბუქები. Microsoft-ის ღია კურსის ქართული თარგმანი.',
    alternates: { canonical: 'https://andrewaltair.ge/encyclopedia/ai-for-beginners/library' },
    openGraph: { title: 'AI დამწყებთათვის — ყველა გაკვეთილი', type: 'website' },
};

export default function AIForBeginnersLibraryPage() {
    return (
        <div className="pt-20 lg:pt-10 pb-24 px-4 lg:px-8 min-h-screen max-w-6xl mx-auto">
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
                    <TbBooks size={16} /> კურსის სარჩევი
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">ყველა გაკვეთილი</h1>
                <p className="text-gray-500 text-lg max-w-2xl">
                    აირჩიე მოდული და დაიწყე სწავლა: თეორია გაკვეთილებში, პრაქტიკა ნოუთბუქებში.
                </p>
            </div>
            <AIForBeginnersCatalog />
        </div>
    );
}
