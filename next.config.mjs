/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🐳 Docker: Standalone output for optimized container builds
  output: 'standalone',

  // 🛡️ Security: Remove X-Powered-By header
  poweredByHeader: false,



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
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';
    // In dev mode, we need 'unsafe-eval' for React Refresh to work
    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://counter.top.ge https://www.google-analytics.com"
      : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://counter.top.ge https://www.google-analytics.com";

    return [
      // Block indexing of admin pages at HTTP header level
      {
        source: '/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
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
            value: `default-src 'self'; ${scriptSrc}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://region1.google-analytics.com https://www.google-analytics.com https://generativelanguage.googleapis.com; frame-src 'self' https://www.youtube.com https://player.vimeo.com; media-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests`,
          },
        ],
      },
    ];
  },
  // Redirect trailing slashes to canonical URLs (fixes 404s from /page/ → /page)
  trailingSlash: false,

  async redirects() {
    return [
      {
        source: '/vibe-coding',
        destination: '/vibe',
        permanent: true,
      },
      // SEO: www → non-www (301)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.andrewaltair.ge' }],
        destination: 'https://andrewaltair.ge/:path*',
        permanent: true,
      },
      // E-E-A-T: author page convention
      { source: '/author/andrew-altair', destination: '/about', permanent: true },
      { source: '/author/andrewaltair', destination: '/about', permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/feed.xml',
        destination: '/api/rss',
      },
      // Serve uploaded files statically for OG images (Facebook crawler compatibility)
      {
        source: '/uploads/:path*',
        destination: '/api/files/:path*',
      },
    ];
  },

  // Increase timeout for static page generation (helps with OOM/timeout on low-resource VPS)
  staticPageGenerationTimeout: 180,

  // Reduce build-time memory pressure on low-RAM VPS (build was OOM-killed)
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
};

// 🧹 Clean up: Remove console.log only in production builds
if (process.env.NODE_ENV === 'production') {
  nextConfig.compiler = {
    removeConsole: {
      exclude: ['error', 'warn'],
    },
  };
}

export default nextConfig;
