<template>
  <div
    class="bg-slate-50 text-slate-600 dark:bg-zinc-900 dark:text-slate-100 min-w-screen min-h-screen overflow-hidden"
  >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Invoice-App` : 'Invoice-App';
  }
});
</script>
