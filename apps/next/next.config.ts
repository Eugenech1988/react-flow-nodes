import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  transpilePackages: ['@pipeline/contracts', '@pipeline/ui', '@xyflow/react'],
  experimental: {
    agentFeedback: true,
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@base-ui/react',
      '@pipeline/ui',
      '@xyflow/react',
    ],
  },
  outputFileTracingRoot: path.join(__dirname, '../../'),
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-site',
          },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
              svgo: true,
              titleProp: true,
            },
          },
        ],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
