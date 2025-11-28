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
  // External packages configuration
  serverExternalPackages: [],
  // Development configuration
  devIndicators: {
    appIsrStatus: false,
  },
};

export default nextConfig;
