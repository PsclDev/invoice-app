import { useStorage } from '@vueuse/core';

export function useToggleSettings() {
  const i18n = useI18n();
  const colorMode = useColorMode();
  const currentLanguage = useStorage(LocalStorageKeys.Language, 'en');

  function toggleLanguage() {
    const newLanguage = currentLanguage.value === 'en' ? 'de' : 'en';
    i18n.setLocale(newLanguage);
    currentLanguage.value = newLanguage;
  }

  function toggleColorMode() {
    colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light';
  }

  return { currentLanguage, toggleLanguage, toggleColorMode };
}
