import type { Metadata } from 'next';
import QuizClient from './QuizClient';

export const metadata: Metadata = {
    title: 'AI ინსტრუმენტების ქვიზი',
    description: 'გაიგე რომელი AI ინსტრუმენტი გიხდება 4 კითხვით. ChatGPT, Claude, Midjourney — შენს საჭიროებებზე მორგებული რეკომენდაცია.',
    openGraph: {
        title: 'AI ინსტრუმენტების ქვიზი',
        description: 'გაიგე რომელი AI ინსტრუმენტი გიხდება 4 კითხვით.',
        type: 'website',
        images: [{ url: '/og.png', width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AI ინსტრუმენტების ქვიზი',
        description: 'გაიგე რომელი AI ინსტრუმენტი გიხდება 4 კითხვით.',
    },
    alternates: {
        canonical: 'https://andrewaltair.ge/quiz',
    },
};

export default function QuizPage() {
    return <QuizClient />;
}
