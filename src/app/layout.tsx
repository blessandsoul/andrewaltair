import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Manrope, Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { AuthProvider } from "@/lib/auth";
import { ToastProvider } from "@/components/ui/toast";
import { ConfirmDialogProvider } from "@/components/ui/confirm-dialog";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { Agentation } from "agentation";
import { siteMetadata, siteViewport } from "@/config/metadata";
import { personSchema, organizationSchema, websiteSchema, faqPageSchema } from "@/config/json-ld";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-georgian",
  subsets: ["georgian", "latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
});

export const metadata: Metadata = siteMetadata;
export const viewport = siteViewport;

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
          // Sets html[data-route] before first paint so the admin-only CSS that
          // hides the aiSTAFF chat widget applies with no flash. LayoutWrapper
          // keeps it in sync on client-side navigation.
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  document.documentElement.dataset.route =
                    location.pathname.indexOf('/admin') === 0 ? 'admin' : 'site';
                } catch (e) {}
              })();
            `,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }} />
        {/* /feed.xml emits RSS 2.0 — advertising it as application/atom+xml was a
            feed-validator error; a single correctly-typed link is enough */}
        <link rel="alternate" type="application/rss+xml" title="Andrew Altair RSS" href="https://andrewaltair.ge/feed.xml" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="https://andrewaltair.ge/sitemap.xml" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${notoGeorgian.variable} ${manrope.variable} antialiased font-georgian`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ToastProvider>
            <ConfirmDialogProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
              <CookieBanner />
              {process.env.NODE_ENV === "development" && <Agentation />}
            </ConfirmDialogProvider>
          </ToastProvider>
        </AuthProvider>

        {/* Google Analytics (gtag.js) — single analytics loader.
            GTM-P4T74Z4G was loading IN ADDITION to gtag (double-tagging, double
            main-thread cost). If GTM is ever needed for extra pixels, route GA4
            through the container and remove this gtag block instead. */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-7YH89CPYF7" strategy="afterInteractive" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-7YH89CPYF7');
          `}
        </Script>

        {/* aiSTAFF support-chat widget removed on request: the aiNOW support bot
            does not belong on the personal brand site (Andrew personal is not
            aiNOW company). This bottom-right slot is reserved for Andrew's own
            presence (camera / video) instead. */}
      </body>
    </html>
  );
}
