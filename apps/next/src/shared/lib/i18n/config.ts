import type { I18nConfig } from 'next-i18next/proxy';

const i18nConfig: I18nConfig = {
  supportedLngs: ['en', 'ua'],
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'marketing', 'inquiry', 'about', 'careers'],
  localeParamName: 'locale',
  resourceLoader: (language, namespace) => import(`./locales/${language}/${namespace}.json`),
};

export default i18nConfig;
