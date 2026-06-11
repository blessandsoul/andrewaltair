import type { Metadata } from 'next';
import EncyclopediaPage from '@/components/encyclopedia/EncyclopediaPage';

export const metadata: Metadata = {
    title: 'ენციკლოპედია - AI და პროგრამირების სრული გაიდები',
    description: 'სრული ენციკლოპედია AI პროგრამირებაზე, ვიდეო გაკვეთილები, case studies და ექსპერტების ანალიზი. Vibe Coding, AI ინსტრუმენტები და მეტი.',
    keywords: ['ენციკლოპედია', 'vibe coding', 'AI პროგრამირება', 'ვიდეო გაკვეთილები', 'case studies'],
    alternates: { canonical: '/encyclopedia' },
    openGraph: {
        title: 'ენციკლოპედია - AI და პროგრამირების სრული გაიდები',
        description: 'სრული ენციკლოპედია AI პროგრამირებაზე, ვიდეო გაკვეთილები და ექსპერტების ანალიზი',
        type: 'website',
        url: 'https://andrewaltair.ge/encyclopedia',
    }
};

export default function Encyclopedia() {
    return <EncyclopediaPage />;
}
