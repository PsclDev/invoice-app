import { useStorage } from '@vueuse/core';

export function useToggleSettings() {
  const i18n = useI18n();
  const colorMode = useColorMode();

  function toggleLanguage() {
    const curLang = useStorage(LocalStorageKeys.Language, 'en');

    i18n.setLocale(curLang.value === 'en' ? 'de' : 'en');
    curLang.value = curLang.value === 'en' ? 'de' : 'en';
  }

  function toggleColorMode() {
    colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light';
  }

  return { toggleLanguage, toggleColorMode };
}
