/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
      MONGODB_URI: process.env.MONGODB_URI,
    },
    experimental: {
      // Updated from serverActions: true to match Next.js 15
      serverActions: {
        enabled: true
      }
    },
    // Moved from experimental.serverComponentsExternalPackages
    serverExternalPackages: ['mongoose'],
    webpack: (config, { isServer }) => {
      // Add any needed webpack configurations
      return config;
    },
    // Add security headers
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on'
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains'
            },
            {
              key: 'X-Frame-Options',
              value: 'SAMEORIGIN'
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin'
            }
          ]
        }
      ];
    }
  };
  
  export default nextConfig;