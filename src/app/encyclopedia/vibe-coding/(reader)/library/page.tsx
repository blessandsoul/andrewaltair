import type { Metadata } from 'next';
import { TbBook } from 'react-icons/tb';

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
        <div className="flex items-center justify-center p-6 lg:p-12 min-h-[50vh] mt-20 lg:mt-0">
            <div className="text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
                    <TbBook size={48} className="text-muted-foreground/50" />
                </div>
                <h2 className="text-3xl font-bold mb-3 tracking-tight">აირჩიეთ სტატია</h2>
                <p className="text-muted-foreground max-w-sm mx-auto text-lg">
                    აირჩიეთ სასურველი თემა მარცხენა მენიუდან კითხვის დასაწყებად
                </p>
            </div>
        </div>
    );
}
