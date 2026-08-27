import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Manrope, Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { AuthProvider } from "@/lib/auth";
import { ToastProvider } from "@/components/ui/toast";
import { ConfirmDialogProvider } from "@/components/ui/confirm-dialog";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { FamilyAnalytics } from "@/components/analytics/FamilyAnalytics";
import { Agentation } from "agentation";
import { siteMetadata, siteViewport } from "@/config/metadata";
import { personSchema, organizationSchema, aiNowOrganizationSchema, websiteSchema, faqPageSchema } from "@/config/json-ld";
import { safeJsonLd } from "@/lib/json-ld";

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
        <meta name="ainow-ga4-destination" content="G-LHWNXVZ9B9" />
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
        {/* aiNOW sister-brand entity: merges by @id with ainow.ge#organization
            and carries founder -> #person, associating the two domains for SEO */}
        <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: safeJsonLd(aiNowOrganizationSchema) }} />
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
              <FamilyAnalytics
                measurementIds={["G-LHWNXVZ9B9", "G-7YH89CPYF7"]}
                consentStorageKey="cookie_consent"
                renderBanner={false}
              />
              {process.env.NODE_ENV === "development" && <Agentation />}
            </ConfirmDialogProvider>
          </ToastProvider>
        </AuthProvider>

        {/* aiSTAFF support-chat widget removed on request: the aiNOW support bot
            does not belong on the personal brand site (Andrew personal is not
            aiNOW company). This bottom-right slot is reserved for Andrew's own
            presence (camera / video) instead. */}
      </body>
    </html>
  );
}
