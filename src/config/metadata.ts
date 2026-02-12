import type { Metadata, Viewport } from "next";

export const siteViewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
};

export const siteMetadata: Metadata = {
    metadataBase: new URL('https://andrewaltair.ge'),
    // icons managed by Next.js file-based API (src/app/icon.png)
    manifest: '/manifest.json',
    title: {
        default: "Andrew Altair | AI ექსპერტი საქართველოში",
        template: "%s | Andrew Altair"
    },
    description: "AI ინოვატორი საქართველოში 🇬🇪. ვასწავლი როგორ გამოიყენო ხელოვნური ინტელექტი (AI) რეალურ ცხოვრებაში — შემოსავლის ზრდისთვის, ბიზნესის ავტომატიზაციისთვის და კონკურენტული უპირატესობისთვის. პირველი AI მარკეტფლეისი საქართველოში: ბოტები, პრომპტები, ტუტორიალები.",
    keywords: [
        // Brand & Core
        "Andrew Altair",
        "ენდრიუ ალტეირი",
        "AI Expert Georgia",
        "AI ექსპერტი საქართველოში",
        "ხელოვნური ინტელექტი საქართველოში",

        // High-Intent Services
        "AI კონსულტანტი საქართველოში",
        "AI chatbot შექმნა ქართულად",
        "ბიზნეს პროცესების ავტომატიზაცია AI",
        "AI ბიზნესისთვის თბილისში",
        "AI ინტეგრაცია ბიზნესში",

        // High-Intent Learning
        "AI კურსები ქართულად",
        "prompt engineering კურსი საქართველოში",
        "ChatGPT სწავლება ქართულად",

        // Marketplace & Products
        "AI პრომპტები მარკეტფლეისი",
        "AI ბოტები საქართველო",
        "AI ინსტრუმენტები",

        // Tools & Platforms
        "ChatGPT ქართულად",
        "N8N ავტომატიზაცია",
        "AI აგენტები ბიზნესისთვის",

        // Geo-local
        "AI სერვისები თბილისში",
        "ხელოვნური ინტელექტი",
        "მანქანური სწავლება",
        "Generative AI",
        "AI მარკეტფლეისი საქართველო",
    ],
    authors: [{ name: "Andrew Altair", url: "https://andrewaltair.ge" }],
    creator: "Andrew Altair",
    publisher: "Andrew Altair",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: "Andrew Altair | AI ექსპერტი საქართველოში",
        description: "ისწავლე AI ტექნოლოგიები, გამოიყენე ბიზნესის ზრდისთვის და გახდი ლიდერი ციფრულ ეპოქაში. პირველი AI მარკეტფლეისი და ენციკლოპედია ქართულად.",
        url: 'https://andrewaltair.ge',
        siteName: 'Andrew Altair AI',
        locale: 'ka_GE',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Andrew Altair | AI ექსპერტი საქართველოში",
        description: "ისწავლე AI ტექნოლოგიები და გაზარდე შენი ბიზნესი ხელოვნური ინტელექტის დახმარებით.",
        creator: '@AndrewAltair',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    category: 'technology',
};
