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
  title: "Andrew Altair | AI ინოვატორი და კონტენტ კრეატორი",
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
  authors: [{ name: "Andrew Altair" }],
  creator: "Andrew Altair",
  openGraph: {
    title: "Andrew Altair | AI ინოვატორი და კონტენტ კრეატორი",
    description: "ხელოვნური ინტელექტის ექსპერტი. AI-ს შესახებ სტატიები, ტუტორიალები და რჩევები.",
    type: "website",
    locale: "ka_GE",
    siteName: "Andrew Altair",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@andrewaltair",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD Schema with geo-targeting for Georgia
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Andrew Altair',
  url: 'https://andrewaltair.ge',
  jobTitle: 'AI Expert & Tech Consultant',
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
    name: 'Andrew Altair AI',
    location: 'Tbilisi, Georgia'
  }
};

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

