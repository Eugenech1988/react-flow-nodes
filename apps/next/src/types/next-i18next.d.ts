import 'next-i18next/proxy';
import type { i18n as I18n } from 'i18next';

declare module 'next-i18next/proxy' {
  interface I18nConfig {
    onPreInitI18next?: (i18nInstance: I18n) => void;
  }
}
