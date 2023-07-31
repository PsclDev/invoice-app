export function useToggleSettings() {
  const i18n = useI18n();
  const colorMode = useColorMode();

  function toggleLanguage() {
    i18n.setLocale(i18n.getLocaleCookie() === 'en' ? 'de' : 'en');
  }

  function toggleColorMode() {
    colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light';
  }

  return { toggleLanguage, toggleColorMode };
}
