import 'server-only';
import { createServerI18next } from 'next-i18next/server';
import i18nConfig from './config';

export const { getT, getResources, generateI18nStaticParams } =
  createServerI18next(i18nConfig);