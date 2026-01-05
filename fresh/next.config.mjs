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
    ],
  },
  async headers() {
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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https://region1.google-analytics.com https://www.google-analytics.com;",
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
