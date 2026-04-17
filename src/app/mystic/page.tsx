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

const siteUrl = 'https://andrewaltair.ge';

const mysticTools = [
    { name: 'ტაროტი', slug: 'tarot', description: 'AI ტაროტის წაკითხვა' },
    { name: 'ჰოროსკოპი', slug: 'horoscope', description: 'დღიური და კვირეული ჰოროსკოპი' },
    { name: 'ნუმეროლოგია', slug: 'numerology', description: 'რიცხვების მისტიკური მნიშვნელობა' },
    { name: 'სიზმრები', slug: 'dreams', description: 'სიზმრების AI ინტერპრეტაცია' },
    { name: 'ყავის ფინჯანი', slug: 'coffee', description: 'ყავის ნალექის წაკითხვა' },
    { name: 'გადალი', slug: 'fortune', description: 'AI მკითხაობა' },
];

const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${siteUrl}/mystic#collection`,
    url: `${siteUrl}/mystic`,
    name: 'AI მისტიკური ინსტრუმენტები | Andrew Altair',
    description: 'AI-ით ამოძრავებული მისტიკური ინსტრუმენტები: ჰოროსკოპი, ტაროტი, სიზმრების ინტერპრეტაცია, ნუმეროლოგია.',
    inLanguage: 'ka',
    isPartOf: { '@id': `${siteUrl}/#website` },
    mainEntity: {
        '@type': 'ItemList',
        numberOfItems: mysticTools.length,
        itemListElement: mysticTools.map((tool, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'SoftwareApplication',
                name: tool.name,
                description: tool.description,
                url: `${siteUrl}/mystic/${tool.slug}`,
                applicationCategory: 'LifestyleApplication',
                operatingSystem: 'Web',
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'GEL' },
                inLanguage: 'ka',
            },
        })),
    },
};

export default function MysticPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />
            <MysticClient />
        </>
    );
}
