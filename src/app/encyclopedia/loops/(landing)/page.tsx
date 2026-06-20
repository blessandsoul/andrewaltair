import type { Metadata } from 'next';
import LoopsLanding from '@/components/loops/LoopsLanding';
import { getAllArticles } from '@/data/loopsContent';

export const metadata: Metadata = {
    title: 'ციკლები (Loops) - AI აგენტების ავტონომიური ციკლები | მინი კურსი',
    description: 'მარტივი ქართული მინი კურსი AI ციკლებზე (Loops). რა არის ციკლი, ტრიგერი და მიზანი, რეალური მაგალითები და სად გამოდგება ის. ისე მარტივად, რომ მეათე კლასელიც მიხვდება.',
    keywords: [
        'ციკლები',
        'loops',
        'AI აგენტი',
        'AI loops',
        'ავტომატიზაცია',
        'Codex',
        'Loop Library',
        'AI პროგრამირება ქართულად',
        'agentic loops',
        'LLM as a judge',
    ],
    alternates: { canonical: '/encyclopedia/loops' },
    openGraph: {
        title: 'ციკლები (Loops) - AI აგენტების ავტონომიური ციკლები',
        description: 'მარტივი ქართული მინი კურსი AI ციკლებზე: ტრიგერი, მიზანი, რეალური მაგალითები და შეზღუდვები.',
        type: 'website',
        url: 'https://andrewaltair.ge/encyclopedia/loops',
    },
};

export default function LoopsEncyclopediaPage() {
    const articleCount = getAllArticles().length;

    const courseSchema = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        '@id': 'https://andrewaltair.ge/encyclopedia/loops#course',
        name: 'ციკლები (Loops)',
        description: 'მარტივი ქართული მინი კურსი AI აგენტების ავტონომიურ ციკლებზე.',
        url: 'https://andrewaltair.ge/encyclopedia/loops',
        inLanguage: 'ka',
        educationalLevel: 'Beginner',
        numberOfLessons: articleCount,
        teaches: ['AI Loops', 'Agentic Automation', 'Triggers and Goals', 'LLM as a judge'],
        provider: {
            '@type': 'Organization',
            '@id': 'https://andrewaltair.ge/#organization',
        },
        author: {
            '@type': 'Person',
            '@id': 'https://andrewaltair.ge/#person',
        },
        isAccessibleForFree: true,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
            />
            <LoopsLanding />
        </>
    );
}
