import type { I18nConfig } from 'next-i18next/proxy';

const i18nConfig: I18nConfig = {
  supportedLngs: ['en', 'uk'],
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'marketing', 'inquiry', 'about', 'careers', 'contacts', 'blog'],
  localeParamName: 'locale',
  resourceLoader: (language, namespace) => import(`./locales/${language}/${namespace}.json`),
};

export default i18nConfig;