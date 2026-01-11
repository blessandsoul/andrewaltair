/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🐳 Docker: Standalone output for optimized container builds
  output: 'standalone',

  // ⚡ Performance optimizations
  swcMinify: true,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@phosphor-icons/react', 'lucide-react', 'react-icons'],
    serverComponentsExternalPackages: ['mongoose', 'bcryptjs'],
  },

  // 🚀 Build optimizations
  distDir: '.next',
  compress: true,

  // 🛡️ Security: Remove X-Powered-By header
  poweredByHeader: false,

  // 🧹 Clean up: Remove console.log from production builds (not supported by Turbo)
  compiler: process.env.NODE_ENV === 'production' ? {
    removeConsole: {
      exclude: ['error', 'warn'],
    },
  } : {},

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
      {
        protocol: 'https',
        hostname: 'andrewaltair.ge',
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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://counter.top.ge; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https://region1.google-analytics.com https://www.google-analytics.com; frame-src 'self' https://www.youtube.com https://player.vimeo.com;",
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/files/:path*',
        destination: 'https://andrewaltair.ge/api/files/:path*'
      },
      {
        source: '/api/tracking/:path*',
        destination: 'https://andrewaltair.ge/api/tracking/:path*'
      },
      {
        source: '/feed.xml',
        destination: '/api/rss',
      },
    ];
  },
};

export default nextConfig;
