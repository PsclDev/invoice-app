<script setup>
import { useStorage } from '@vueuse/core';

const i18n = useI18n();
const curLang = useStorage(LocalStorageKeys.Language, 'en');

i18n.setLocale(curLang.value);
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html,
body,
#__nuxt {
  @apply w-full h-full p-0 m-0 bg-slate-100 dark:bg-neutral-950 text-black dark:text-white;
}
</style>
