import type { Metadata } from 'next';
import VibeCodingLanding from '@/components/vibe-coding/VibeCodingLanding';

export const metadata: Metadata = {
    title: 'Vibe Coding - AI პროგრამირების სრული გაიდი | Andrew Altair',
    description: 'სრული სახელმძღვანელო AI-ასისტირებულ პროგრამირებაზე. ისწავლე Cursor, Claude, ChatGPT პროფესიონალურად. 10+ პრემიუმ სტატია, ექსპერტების ანალიზი, რეალური case studies.',
    keywords: ['vibe coding', 'AI პროგრამირება', 'cursor', 'claude', 'chatgpt', 'andrej karpathy', 'glue coding'],
    openGraph: {
        title: 'Vibe Coding - AI პროგრამირების სრული გაიდი',
        description: 'სრული სახელმძღვანელო AI-ასისტირებულ პროგრამირებაზე. 10+ პრემიუმ სტატია, ექსპერტების ანალიზი.',
        type: 'website',
        images: [
            {
                url: '/images/vibe-coding-og.jpg',
                width: 1200,
                height: 630,
                alt: 'Vibe Coding Guide'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Vibe Coding - AI პროგრამირების სრული გაიდი',
        description: 'სრული სახელმძღვანელო AI-ასისტირებულ პროგრამირებაზე',
    }
};

export default function VibeCodingLandingPage() {
    return <VibeCodingLanding />;
}
