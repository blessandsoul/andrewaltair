import type { Metadata } from 'next';
import VibeCodingLanding from '@/components/vibe-coding/VibeCodingLanding';

export const metadata: Metadata = {
    title: 'Vibe Coding ენციკლოპედია - AI პროგრამირების სრული გაიდი | Andrew Altair',
    description: 'სრული სახელმძღვანელო AI-ასისტირებულ პროგრამირებაზე. ისწავლე Cursor, Claude, ChatGPT პროფესიონალურად. 12+ პრემიუმ სტატია, ექსპერტების ანალიზი, რეალური case studies.',
    keywords: ['vibe coding', 'AI პროგრამირება', 'cursor', 'claude', 'chatgpt', 'andrej karpathy', 'glue coding'],
    openGraph: {
        title: 'Vibe Coding ენციკლოპედია - AI პროგრამირების სრული გაიდი',
        description: 'სრული სახელმძღვანელო AI-ასისტირებულ პროგრამირებაზე. 12+ პრემიუმ სტატია, ექსპერტების ანალიზი.',
        type: 'website',
    }
};

export default function VibeCodingEncyclopediaPage() {
    return <VibeCodingLanding />;
}
