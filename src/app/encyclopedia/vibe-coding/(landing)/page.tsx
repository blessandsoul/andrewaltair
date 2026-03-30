import type { Metadata } from 'next';
import VibeCodingLanding from '@/components/vibe-coding/VibeCodingLanding';
import { getAllArticles } from '@/data/vibeCodingContent';

export const metadata: Metadata = {
    title: 'Vibe Coding ენციკლოპედია - AI პროგრამირების სრული გაიდი | Andrew Altair',
    description: 'სრული სახელმძღვანელო AI-ასისტირებულ პროგრამირებაზე. ისწავლე Cursor, Claude, ChatGPT პროფესიონალურად. 12+ პრემიუმ სტატია, ექსპერტების ანალიზი, რეალური case studies.',
    keywords: [
        'vibe coding',
        'AI პროგრამირება',
        'cursor',
        'claude',
        'chatgpt',
        'Vibe Coding სწავლება',
        'AI კოდირება ქართულად',
        'Cursor IDE სწავლება',
        'AI პროგრამირების კურსი',
        'prompt engineering',
        'AI კოდის ასისტენტი',
        'AI-ით პროგრამირება უფასოდ',
        'Windsurf IDE',
        'Claude Code',
        'AI კოდის გენერაცია',
        'ანდრეი კარპატი',
        'glue coding'
    ],
    openGraph: {
        title: 'Vibe Coding ენციკლოპედია - AI პროგრამირების სრული გაიდი',
        description: 'სრული სახელმძღვანელო AI-ასისტირებულ პროგრამირებაზე. 12+ პრემიუმ სტატია, ექსპერტების ანალიზი.',
        type: 'website',
    }
};

export default function VibeCodingEncyclopediaPage() {
    const articleCount = getAllArticles().length;

    const courseSchema = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        '@id': 'https://andrewaltair.ge/encyclopedia/vibe-coding#course',
        name: 'Vibe Coding ენციკლოპედია',
        description: 'სრული სახელმძღვანელო AI-ასისტირებულ პროგრამირებაზე. ისწავლე Cursor, Claude, ChatGPT პროფესიონალურად.',
        url: 'https://andrewaltair.ge/encyclopedia/vibe-coding',
        inLanguage: 'ka',
        educationalLevel: 'Beginner to Advanced',
        numberOfLessons: articleCount,
        teaches: ['Vibe Coding', 'AI Programming', 'Prompt Engineering', 'Cursor IDE', 'Claude Code', 'Windsurf IDE', 'N8N Automation'],
        provider: {
            '@type': 'Organization',
            '@id': 'https://andrewaltair.ge/#organization',
        },
        author: {
            '@type': 'Person',
            '@id': 'https://andrewaltair.ge/#person',
        },
        isAccessibleForFree: false,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
            />
            <VibeCodingLanding />
        </>
    );
}
