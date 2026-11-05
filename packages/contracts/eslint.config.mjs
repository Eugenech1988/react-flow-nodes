import { config as baseConfig } from '@pipeline/eslint-config/base';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ...baseConfig,
];
