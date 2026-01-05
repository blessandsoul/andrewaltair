import type { Metadata } from 'next';
import VibeCodingLibraryV2 from '@/components/vibe-coding/VibeCodingLibraryV2';

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
    return <VibeCodingLibraryV2 />;
}
