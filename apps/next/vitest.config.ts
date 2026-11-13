import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    tsconfigPaths: true,
  },

  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
    passWithNoTests: true,
    coverage: {
      exclude: [
        'node_modules/**',
        'src/main.tsx',
        'src/setupTests.ts',
        'src/shared/lib/i18n/config.ts',
        'src/shared/lib/app-url.ts',
        'src/shared/lib/sanity/client.ts',
        'src/shared/lib/sanity/queries.ts',
        'src/shared/lib/types.ts',
        '**/*.helpers.{ts,tsx}',
        '**/*.d.ts',
        '**/index.ts',
        '**/types.ts',
        '**/constants.{ts,tsx}',
      ],
    },
  },
});
