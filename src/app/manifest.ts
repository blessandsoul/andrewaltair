import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Andrew Altair AI',
        short_name: 'Altair AI',
        description: 'AI ინოვატორი და კონტენტ კრეატორი - ხელოვნური ინტელექტის ექსპერტი',
        start_url: '/',
        display: 'standalone',
        background_color: '#0a0a0f',
        theme_color: '#6366f1',
        orientation: 'portrait-primary',
        categories: ['education', 'technology', 'productivity'],
        lang: 'ka',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
        screenshots: [
            {
                src: '/images/screenshot-wide.png',
                sizes: '1280x720',
                type: 'image/png',
                // @ts-expect-error - form_factor is valid but not in types
                form_factor: 'wide',
            },
            {
                src: '/images/screenshot-narrow.png',
                sizes: '750x1334',
                type: 'image/png',
                // @ts-expect-error - form_factor is valid but not in types
                form_factor: 'narrow',
            },
        ],
        shortcuts: [
            {
                name: 'ბლოგი',
                short_name: 'ბლოგი',
                description: 'AI სიახლეები და სტატიები',
                url: '/blog',
                icons: [{ src: '/images/icon-blog.png', sizes: '96x96' }],
            },
            {
                name: 'AI ინსტრუმენტები',
                short_name: 'Tools',
                description: 'AI ინსტრუმენტების კატალოგი',
                url: '/tools',
                icons: [{ src: '/images/icon-tools.png', sizes: '96x96' }],
            },
        ],
    }
}
