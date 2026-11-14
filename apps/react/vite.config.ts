import { defineConfig } from 'vitest/config';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import type { Plugin } from 'vite';
import type { RolldownOutputOptions, WarningHandler } from 'rolldown';

const appSrc = path.resolve(import.meta.dirname, './src');
const uiSrc = path.resolve(import.meta.dirname, '../../packages/ui/src');

const workspaceAliases: Plugin = {
  name: 'workspace-source-aliases',
  enforce: 'pre' as const,
  resolveId(source, importer) {
    if (!source.startsWith('@/')) return null;

    const isUiSource = importer?.includes(
      `${path.sep}packages${path.sep}ui${path.sep}src${path.sep}`,
    );
    const sourceRoot = isUiSource ? uiSrc : appSrc;

    return this.resolve(path.resolve(sourceRoot, source.slice(2)), importer, {
      skipSelf: true,
    });
  },
};

interface IChunkGroup {
  name: string;
  test: RegExp;
}

const CHUNK_GROUPS: IChunkGroup[] = [
  {
    name: 'vendor-react',
    test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
  },
  {
    name: 'vendor-flow',
    test: /[\\/]node_modules[\\/]@xyflow[\\/]/,
  },
  {
    name: 'vendor-charts',
    test: /[\\/]node_modules[\\/](recharts|d3-.*|victory-vendor|react-smooth|react-simple-animate)[\\/]/,
  },
  {
    name: 'vendor-trpc',
    test: /[\\/]node_modules[\\/](@trpc|@tanstack[\\/]react-query|@tanstack[\\/]query-core|superjson)[\\/]/,
  },
  {
    name: 'vendor-table',
    test: /[\\/]node_modules[\\/]@tanstack[\\/]react-table[\\/]/,
  },
  {
    name: 'vendor-ui',
    test: /[\\/]node_modules[\\/](@radix-ui|@base-ui|framer-motion|motion|lucide-react|sonner)[\\/]/,
  },
  {
    name: 'vendor-forms',
    test: /[\\/]node_modules[\\/](react-hook-form|@hookform|zod)[\\/]/,
  },
  {
    name: 'vendor-utils',
    test: /[\\/]node_modules[\\/](date-fns|dayjs|clsx|tailwind-merge|class-variance-authority)[\\/]/,
  },
  {
    name: 'vendor-html-image',
    test: /[\\/]node_modules[\\/](html-to-image|dagre|@dagrejs)[\\/]/,
  },
];

const IGNORED_WARNINGS: RegExp[] = [/\[MODULE_LEVEL_DIRECTIVE\][\s\S]*react-compiler-runtime/];

const onwarn: WarningHandler = (warning, warn) => {
  const message =
    typeof warning === 'string'
      ? warning
      : typeof warning === 'object' && warning !== null && 'message' in warning
        ? String((warning as { message: unknown }).message ?? '')
        : '';

  if (IGNORED_WARNINGS.some((re) => re.test(message))) {
    return;
  }

  warn(warning);
};

const manualChunks: RolldownOutputOptions['manualChunks'] = (id: string) => {
  if (!id.includes('node_modules')) return undefined;

  for (const group of CHUNK_GROUPS) {
    if (group.test.test(id)) return group.name;
  }

  return undefined;
};

export default defineConfig({
  plugins: [react(), tailwindcss(), babel({ presets: [reactCompilerPreset()] }), workspaceAliases],
  resolve: {
    alias: {
      'react/compiler-runtime': 'react-compiler-runtime',
      react: path.resolve(import.meta.dirname, './node_modules/react'),
      'react-dom': path.resolve(import.meta.dirname, './node_modules/react-dom'),
      'react/jsx-runtime': path.resolve(import.meta.dirname, './node_modules/react/jsx-runtime.js'),
      'react/jsx-dev-runtime': path.resolve(
        import.meta.dirname,
        './node_modules/react/jsx-dev-runtime.js',
      ),
    },
  },
  preview: {
    port: 5173,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-dev-runtime',
      'react/jsx-runtime',
      'react-compiler-runtime',
    ],
  },
  build: {
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      onwarn,
      output: {
        manualChunks,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    server: {
      deps: {
        inline: [/@pipeline\/.*/],
      },
    },
  },
});
