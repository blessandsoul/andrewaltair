export const jsonLdSchemas = [
    // Person Schema
    {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': 'https://andrewaltair.ge/#person',
        name: 'Andrew Altair',
        url: 'https://andrewaltair.ge',
        image: 'https://andrewaltair.ge/logo.png',
        jobTitle: 'AI Expert & Tech Consultant',
        description: 'AI ინოვატორი და კონტენტ კრეატორი საქართველოში',
        nationality: {
            '@type': 'Country',
            name: 'Georgia'
        },
        homeLocation: {
            '@type': 'Place',
            name: 'Tbilisi, Georgia'
        },
        areaServed: {
            '@type': 'Country',
            name: 'Georgia'
        },
        sameAs: [
            'https://www.youtube.com/@AndrewAltair',
            'https://www.instagram.com/andr3waltair/',
            'https://www.tiktok.com/@andrewaltair',
            'https://t.me/andr3waltairchannel',
            'https://www.facebook.com/andr3waltair',
            'https://www.threads.net/@andr3waltair',
            'https://x.com/andr3waltair',
            'https://www.linkedin.com/in/andr3waltair'
        ],
        worksFor: {
            '@type': 'Organization',
            '@id': 'https://andrewaltair.ge/#organization'
        }
    },
    // Organization Schema
    {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': 'https://andrewaltair.ge/#organization',
        name: 'Andrew Altair AI',
        url: 'https://andrewaltair.ge',
        logo: {
            '@type': 'ImageObject',
            url: 'https://andrewaltair.ge/logo.png',
            width: 512,
            height: 512
        },
        description: 'AI-ფოკუსირებული პლატფორმა განათლების, მისტიური ინსტრუმენტებისა და ტექნოლოგიური სიახლეებისთვის',
        founder: {
            '@type': 'Person',
            '@id': 'https://andrewaltair.ge/#person'
        },
        areaServed: 'Georgia',
        sameAs: [
            'https://www.youtube.com/@AndrewAltair',
            'https://www.instagram.com/andr3waltair/',
            'https://www.facebook.com/andr3waltair',
            'https://x.com/andr3waltair',
            'https://www.linkedin.com/in/andrewaltair'
        ]
    },
    // WebSite Schema with SearchAction
    {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': 'https://andrewaltair.ge/#website',
        name: 'Andrew Altair',
        url: 'https://andrewaltair.ge',
        description: 'AI ინოვატორი და კონტენტ კრეატორი - ხელოვნური ინტელექტის ექსპერტი',
        publisher: {
            '@type': 'Organization',
            '@id': 'https://andrewaltair.ge/#organization'
        },
        inLanguage: ['ka', 'en'],
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://andrewaltair.ge/search?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
        }
    }
];
