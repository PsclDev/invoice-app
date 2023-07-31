<script setup lang="ts">
const colorMode = useColorMode();
const { toggleLanguage, toggleColorMode } = useToggleSettings();

const colorIcon = computed(() => {
  return colorMode.preference === 'light'
    ? 'solar:moon-bold'
    : 'solar:sun-bold';
});
</script>

<template>
  <header
    class="flex justify-center sm:justify-between gap-6 items-center p-1 sm:p-5"
  >
    <div class="hidden sm:block">
      <button @click="toggleLanguage()">
        <Icon name="fontisto:language" size="32" />
      </button>
    </div>
    <TheNavbar />
    <div class="hidden sm:block">
      <!-- used because of hydration issues with the useColorMode composable -->
      <ClientOnly>
        <button @click="toggleColorMode()">
          <Icon :name="colorIcon" size="32" />
        </button>
      </ClientOnly>
    </div>
  </header>
</template>
