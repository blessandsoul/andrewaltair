import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['andrewaltair.ge'],
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
