import { config as baseConfig } from '@pipeline/eslint-config/base';

export default [
  { ignores: ['**/dist/**', '**/.turbo/**', '**/coverage/**'] },
  ...baseConfig,
];
