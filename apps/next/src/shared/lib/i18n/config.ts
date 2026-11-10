import type { I18nConfig } from 'next-i18next/proxy';

const i18nConfig: I18nConfig = {
  supportedLngs: ['en', 'ua'],
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'marketing', 'inquiry', 'about', 'careers', 'contacts'],
  localeParamName: 'locale',
  resourceLoader: (language, namespace) => import(`./locales/${language}/${namespace}.json`),
  onPreInitI18next: (i18nInstance) => {
    const ukrainianRule = i18nInstance.services.pluralResolver.getRule('uk');
    i18nInstance.services.pluralResolver.addRule('ua', ukrainianRule);
  },
};

export default i18nConfig;
