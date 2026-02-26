import type { Metadata } from 'next';
import MysticClient from './MysticClient';

export const metadata: Metadata = {
    title: 'AI მისტიკური ინსტრუმენტები',
    description: 'AI-ით ამოძრავებული მისტიკური ინსტრუმენტები: ჰოროსკოპი, ტაროტი, სიზმრების ინტერპრეტაცია, ნუმეროლოგია და სხვა.',
    openGraph: {
        title: 'AI მისტიკური ინსტრუმენტები',
        description: 'AI-ით ამოძრავებული ჰოროსკოპი, ტაროტი, სიზმრების ინტერპრეტაცია.',
        type: 'website',
        images: [{ url: '/og.png', width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AI მისტიკური ინსტრუმენტები',
        description: 'AI-ით ამოძრავებული ჰოროსკოპი, ტაროტი, სიზმრების ინტერპრეტაცია.',
    },
    alternates: {
        canonical: 'https://andrewaltair.ge/mystic',
    },
};

export default function MysticPage() {
    return <MysticClient />;
}
