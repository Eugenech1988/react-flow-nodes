import { config as reactConfig } from '@pipeline/eslint-config/react-internal';

export default [{ ignores: ['dist/**', 'node_modules/**'] }, ...reactConfig];
