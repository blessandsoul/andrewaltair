import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { AuthProvider } from "@/lib/auth";
import { ToastProvider } from "@/components/ui/toast";
import { ConfirmDialogProvider } from "@/components/ui/confirm-dialog";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { CookieBanner } from "@/components/ui/CookieBanner";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-georgian",
  subsets: ["georgian", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://andrewaltair.ge'),
  title: {
    default: "Andrew Altair | AI ინოვატორი და კონტენტ კრეატორი",
    template: "%s | Andrew Altair"
  },
  description: "ხელოვნური ინტელექტის ექსპერტი. AI-ს შესახებ სტატიები, ტუტორიალები, ვიდეოები და რჩევები. გაიგეთ მეტი ChatGPT-ს, მანქანური სწავლების და ტექნოლოგიების მომავლის შესახებ.",
  keywords: [
    "AI Expert Georgia",
    "Andrew Altair",
    "Tech News Tbilisi",
    "Artificial Intelligence Georgia",
    "ხელოვნური ინტელექტი",
    "ტექნოლოგიები",
    "Vibe Coding",
    "AI",
    "ChatGPT",
    "მანქანური სწავლება",
    "ნეირონული ქსელები",
    "საქართველო"
  ],
  authors: [{ name: "Andrew Altair", url: "https://andrewaltair.ge" }],
  creator: "Andrew Altair",
  publisher: "Andrew Altair",
  alternates: {
    canonical: "https://andrewaltair.ge",
    types: {
      'application/rss+xml': 'https://andrewaltair.ge/feed.xml',
    },
  },
  openGraph: {
    title: "Andrew Altair | AI ინოვატორი და კონტენტ კრეატორი",
    description: "ხელოვნური ინტელექტის ექსპერტი. AI-ს შესახებ სტატიები, ტუტორიალები და რჩევები.",
    type: "website",
    locale: "ka_GE",
    siteName: "Andrew Altair",
    url: "https://andrewaltair.ge",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Andrew Altair - AI ინოვატორი",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@andr3waltair",
    site: "@andr3waltair",
    images: ["/og-image.png"],
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
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
  },
  category: 'technology',
};

// Extended JSON-LD Schemas
const jsonLdSchemas = [
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
      'https://www.linkedin.com/in/andrewaltair'
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


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                  // Light theme is default, no action needed
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchemas) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${notoGeorgian.variable} antialiased font-georgian`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ToastProvider>
            <ConfirmDialogProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
              <CookieBanner />
            </ConfirmDialogProvider>
          </ToastProvider>
        </AuthProvider>
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID || ''} />


      </body>
    </html>
  );
}

