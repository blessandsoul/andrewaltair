import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

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
    "ხელოვნური ინტელექტი",
    "AI",
    "ChatGPT",
    "მანქანური სწავლება",
    "ნეირონული ქსელები",
    "ტექნოლოგიები",
    "საქართველო",
    "Andrew Altair"
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
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${notoGeorgian.variable} antialiased font-georgian`}
        suppressHydrationWarning
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}

