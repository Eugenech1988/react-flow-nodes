import { config as baseConfig } from './base.js';

// Self-lint: use base config (no React/Node specifics needed for plain JS config files)
export default [
  { ignores: ['node_modules/**'] },
  ...baseConfig,
  {
    files: ['*.js'],
    rules: {
      // Allow require() in JS config files
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
