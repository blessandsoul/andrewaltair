/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🐳 Docker: Standalone output for optimized container builds
  output: 'standalone',

  // 🛡️ Security: Remove X-Powered-By header
  poweredByHeader: false,

  // 🧹 Clean up: Remove console.log from production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';
    // In dev mode, we need 'unsafe-eval' for React Refresh to work
    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://counter.top.ge https://www.google-analytics.com"
      : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://counter.top.ge https://www.google-analytics.com";

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; ${scriptSrc}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://region1.google-analytics.com https://www.google-analytics.com https://api.groq.com; frame-src 'self' https://www.youtube.com https://player.vimeo.com; media-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests`,
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/feed.xml',
        destination: '/api/rss',
      },
    ];
  },
};

export default nextConfig;
