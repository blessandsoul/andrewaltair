import type { Metadata } from 'next';
import EncyclopediaPage from '@/components/encyclopedia/EncyclopediaPage';

export const metadata: Metadata = {
    title: 'ენციკლოპედია - AI და პროგრამირების სრული გაიდები | Andrew Altair',
    description: 'სრული ენციკლოპედია AI პროგრამირებაზე, ვიდეო გაკვეთილები, case studies და ექსპერტების ანალიზი. Vibe Coding, AI ინსტრუმენტები და მეტი.',
    keywords: ['ენციკლოპედია', 'vibe coding', 'AI პროგრამირება', 'ვიდეო გაკვეთილები', 'case studies'],
    openGraph: {
        title: 'ენციკლოპედია - AI და პროგრამირების სრული გაიდები',
        description: 'სრული ენციკლოპედია AI პროგრამირებაზე, ვიდეო გაკვეთილები და ექსპერტების ანალიზი',
        type: 'website',
    }
};

export default function Encyclopedia() {
    return <EncyclopediaPage />;
}
