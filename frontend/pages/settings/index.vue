<script setup lang="ts">
import { useStorage } from '@vueuse/core';

const colorMode = useColorMode();
const { toggleLanguage, toggleColorMode } = useToggleSettings();

const useDarkMode = ref(colorMode.preference === 'dark');
watch(useDarkMode, () => {
  toggleColorMode();
});

const useGerman = ref(
  useStorage(LocalStorageKeys.Language, 'en').value === 'de',
);
watch(useGerman, () => {
  toggleLanguage();
});
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-5">
    <h1 class="text-2xl sm:hidden">{{ $t('SETTINGS.TITLE') }}</h1>
    <div class="flex gap-5 sm:hidden">
      <ClientOnly>
        <div class="flex items-center gap-3">
          <p>{{ $t('SETTINGS.DARKMODE') }}:</p>
          <UToggle v-model="useDarkMode" />
        </div>
        <div class="flex items-center gap-3">
          <p>{{ $t('SETTINGS.GERMAN') }}:</p>
          <UToggle v-model="useGerman" />
        </div>
      </ClientOnly>
    </div>
  </div>
</template>
