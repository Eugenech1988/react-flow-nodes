import tseslint from 'typescript-eslint';
import { config as baseConfig } from './base.js';

export const config = [
  ...baseConfig,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
];
