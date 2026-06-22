/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🐳 Docker: Standalone output for optimized container builds
  output: 'standalone',

  // 🛡️ Security: Remove X-Powered-By header
  poweredByHeader: false,



  images: {
    // Explicit allowlist — the old `hostname: '**'` wildcard let anyone use
    // /_next/image as an open optimizer proxy for ANY https URL (CPU-DoS vector
    // on a 1-CPU box). External news images (insight sourceImage) render with
    // `unoptimized` and bypass the optimizer entirely.
    remotePatterns: [
      { protocol: 'https', hostname: 'andrewaltair.ge' },
      { protocol: 'https', hostname: 'www.andrewaltair.ge' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
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
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://counter.top.ge https://www.google-analytics.com https://aistaff.ge"
      : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://counter.top.ge https://www.google-analytics.com https://aistaff.ge";

    // LiveKit signaling endpoint the browser must reach for the workshop broadcast.
    // Derived from NEXT_PUBLIC_LIVEKIT_URL so dev (ws://localhost) and prod (wss://livekit.*) both work.
    let lkConnect = '';
    try {
      const lkUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || process.env.LIVEKIT_URL || '';
      if (lkUrl) {
        const u = new URL(lkUrl);
        const secure = u.protocol === 'wss:' || u.protocol === 'https:';
        lkConnect = `${secure ? 'wss' : 'ws'}://${u.host} ${secure ? 'https' : 'http'}://${u.host}`;
      }
    } catch {
      lkConnect = '';
    }

    return [
      // Block indexing of admin pages at HTTP header level
      {
        source: '/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      // Block indexing of Next.js RSC payload URLs (`?_rsc=*`) — Google was crawling them as separate pages
      {
        source: '/:path*',
        has: [{ type: 'query', key: '_rsc' }],
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
            value: 'camera=(self), microphone=(self), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; ${scriptSrc}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' ${lkConnect} https://aistaff.ge wss://aistaff.ge https://region1.google-analytics.com https://www.google-analytics.com https://generativelanguage.googleapis.com; frame-src 'self' https://aistaff.ge https://www.youtube.com https://player.vimeo.com; media-src 'self' https: blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests`,
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
      // NOTE: the old `/feed.xml → /api/rss` rewrite pointed at a route that
      // does not exist; the real feed is served by src/app/feed.xml/route.ts.
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
    // Native module — don't let the bundler try to inline its .node binding (diploma rasterizer)
    serverComponentsExternalPackages: ['@resvg/resvg-js'],
    // Tree-shake heavy icon barrels (react-icons/tb etc.) — smaller admin bundle, faster compile
    optimizePackageImports: ['react-icons', 'lucide-react', '@phosphor-icons/react', 'recharts'],
    // src/instrumentation.ts runs SEO data migrations once per container boot
    instrumentationHook: true,
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
