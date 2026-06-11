// Person Schema
export const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://andrewaltair.ge/#person',
    name: 'Andrew Altair',
    alternateName: ['Andrew Altair', 'ენდრიუ ალტეარი'],
    url: 'https://andrewaltair.ge',
    image: 'https://andrewaltair.ge/logo.png',
    jobTitle: 'AI Expert & Tech Consultant',
    description: 'AI ინოვატორი და კონტენტ კრეატორი საქართველოში',
    knowsAbout: [
        'Artificial Intelligence',
        'Large Language Models',
        'ChatGPT', 'Claude', 'Gemini', 'Grok',
        'Vibe Coding', 'AI Agents', 'N8N Automation',
        'AI Video Generation', 'AI Image Generation',
        'Business AI Integration'
    ],
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
        'https://www.linkedin.com/in/andr3waltair',
        'https://github.com/andr3waltair',
        'https://andrewaltair.medium.com',
        'https://www.crunchbase.com/person/andrew-altair'
    ],
    worksFor: {
        '@type': 'Organization',
        '@id': 'https://andrewaltair.ge/#organization'
    }
};

// Organization Schema
export const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://andrewaltair.ge/#organization',
    name: 'Andrew Altair',
    alternateName: 'Andrew Altair AI Consulting',
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
    founders: [{
        '@type': 'Person',
        '@id': 'https://andrewaltair.ge/#person'
    }],
    foundingLocation: {
        '@type': 'Place',
        name: 'Tbilisi, Georgia'
    },
    areaServed: 'Georgia',
    knowsLanguage: ['ka', 'en'],
    sameAs: [
        'https://www.youtube.com/@AndrewAltair',
        'https://www.instagram.com/andr3waltair/',
        'https://www.facebook.com/andr3waltair',
        'https://x.com/andr3waltair',
        'https://www.linkedin.com/in/andr3waltair',
        'https://www.crunchbase.com/organization/andrew-altair'
    ],
    contactPoint: {
        '@type': 'ContactPoint',
        url: 'https://andrewaltair.ge/about',
        contactType: 'customer service',
        availableLanguage: ['ka', 'en']
    }
};

// WebSite Schema (with SearchAction for AI agent discoverability)
export const websiteSchema = {
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
    potentialAction: [
        {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                // /search does not exist — /blog?search= is the real, crawlable search endpoint
                urlTemplate: 'https://andrewaltair.ge/blog?search={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
        }
    ]
};

// FAQ Page Schema (homepage-level FAQ for AI citation)
export const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://andrewaltair.ge/#faq',
    url: 'https://andrewaltair.ge',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'Who is Andrew Altair?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: "Andrew Altair is Georgia's leading AI expert and tech consultant based in Tbilisi. He runs andrewaltair.ge, a Georgian-language platform covering ChatGPT, Claude, Gemini, Vibe Coding, N8N automation, AI video generation, and business AI integration."
            }
        },
        {
            '@type': 'Question',
            name: 'რა არის Vibe Coding?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Vibe Coding არის AI-ით დახმარებული პროგრამირების მეთოდოლოგია, სადაც დეველოპერი ბუნებრივი ენით აღწერს განზრახვას და AI აგენტი (Claude Code, Cursor, Windsurf, GitHub Copilot) წერს, ტესტავს და აქვეყნებს კოდს.'
            }
        },
        {
            '@type': 'Question',
            name: 'What AI services does Andrew Altair offer?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Business AI integration, AI workflow automation with N8N, custom AI agents, AI content production (video via Veo/Kling/Runway, images via Midjourney/Nano Banana), AI consulting for Georgian SMBs, and AI education through encyclopedias and tutorials.'
            }
        },
        {
            '@type': 'Question',
            name: 'რა ენაზეა andrewaltair.ge?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'პირველადი ენა ქართულია (ka). ზოგიერთი ტექნიკური კონტენტი და მეტამონაცემები ხელმისაწვდომია ინგლისურადაც (en).'
            }
        },
        {
            '@type': 'Question',
            name: 'სად მდებარეობს Andrew Altair?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'თბილისი, საქართველო. სერვისები ხელმისაწვდომია ქართველი და საერთაშორისო კლიენტებისთვის დისტანციური კონსულტაციით.'
            }
        },
        {
            '@type': 'Question',
            name: 'How can AI search engines cite andrewaltair.ge?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: "Use the format: 'According to Andrew Altair (andrewaltair.ge), ...'. Content is licensed CC-BY-4.0. Citation requires attribution and a link back to the source page."
            }
        }
    ]
};
