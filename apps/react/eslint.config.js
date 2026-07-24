import { defineConfig, globalIgnores } from 'eslint/config';
import { config as reactConfig } from '@pipeline/eslint-config/react-internal';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactRefresh from 'eslint-plugin-react-refresh';
import vitest from '@vitest/eslint-plugin';
import globals from 'globals';

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  ...reactConfig,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-compiler': reactCompiler,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    files: ['src/**/*.test.{ts,tsx}', 'src/**/setupTests.ts'],
    plugins: { vitest },
    languageOptions: {
      globals: { ...globals.browser, ...vitest.environments.env.globals },
      parserOptions: { project: null },
    },
    rules: { ...vitest.configs.recommended.rules },
  },
]);
