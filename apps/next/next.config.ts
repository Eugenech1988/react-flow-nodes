import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@pipeline/contracts', '@pipeline/ui'],
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
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
