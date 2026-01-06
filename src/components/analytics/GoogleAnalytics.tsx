'use client'

import Script from 'next/script'

interface GoogleAnalyticsProps {
    GA_MEASUREMENT_ID: string
}

export function GoogleAnalytics({ GA_MEASUREMENT_ID }: GoogleAnalyticsProps) {
    // Don't load in development
    if (process.env.NODE_ENV !== 'production') {
        return null
    }

    // Check if user has accepted cookies
    const hasConsent = typeof window !== 'undefined'
        ? localStorage.getItem('cookie_consent') === 'accepted'
        : false

    if (!hasConsent) {
        return null
    }

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_MEASUREMENT_ID}', {
                        page_title: document.title,
                        page_location: window.location.href,
                    });
                `}
            </Script>
        </>
    )
}

// Track custom events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        })
    }
}

// Pre-defined event helpers
export const analytics = {
    // TbSearch events
    trackSearch: (query: string, resultsCount: number) => {
        trackEvent('search', 'engagement', query, resultsCount)
    },

    // ID copy events
    trackIdCopy: (id: string) => {
        trackEvent('copy_id', 'engagement', id)
    },

    // Page view
    trackPageView: (path: string, title: string) => {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
                page_path: path,
                page_title: title,
            })
        }
    },

    // Button clicks
    trackClick: (buttonName: string, location: string) => {
        trackEvent('click', 'ui_interaction', `${buttonName}_${location}`)
    },
}
