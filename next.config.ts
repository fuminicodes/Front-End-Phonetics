import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Configure headers and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
        ],
      },
    ];
  },
  // Rewrites for development mocking (only when USE_MOCKS=true)
  async rewrites() {
    if (process.env.NODE_ENV === 'development' && process.env.USE_MOCKS === 'true') {
      return [
        {
          source: '/api/phoneme-analysis/:path*',
          destination: '/api/mocked/phoneme-analysis/:path*',
        },
      ];
    }
    return [];
  },
  
  // External packages configuration
  serverExternalPackages: [],
  
  // Development configuration - removed invalid devIndicators config
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@tanstack/react-query', 'jose', 'zod'],
  },
};

export default nextConfig;
