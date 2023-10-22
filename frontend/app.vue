<script setup>
import { useStorage } from '@vueuse/core';

const healthStore = useHealthStore();
healthStore.getHealth();

const i18n = useI18n();
const curLang = useStorage(LocalStorageKeys.Language, 'en');

i18n.setLocale(curLang.value);

useHead({
  titleTemplate: (chunk) => {
    return chunk ? `${chunk} | Invoice App` : 'Invoice App';
  },
});
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
  @apply min-h-screen p-0 m-0 bg-slate-100 dark:bg-neutral-950 text-black dark:text-white;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.15s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
