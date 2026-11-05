import { config as baseConfig } from '@pipeline/eslint-config/base';

/**
 * Root ESLint config — covers only root-level config files.
 * Each app/package has its own eslint.config.* extending @pipeline/eslint-config.
 */
export default [
  {
    // Only lint root-level files; apps and packages have their own configs.
    ignores: [
      'apps/**',
      'packages/**',
      '**/dist/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/node_modules/**',
    ],
  },
  ...baseConfig,
];
