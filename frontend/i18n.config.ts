import deLoc from '~/assets/i18n/de.json';
import enLoc from '~/assets/i18n/en.json';

export default defineI18nConfig(() => ({
  legacy: false,
  strategy: 'no_prefix',
  locales: ['en', 'de'],
  locale: 'en',
  defaultLocale: 'en',
  lazy: true,
  messages: {
    en: enLoc,
    de: deLoc,
  },
}));
