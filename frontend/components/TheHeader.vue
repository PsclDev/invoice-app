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
    class="flex items-center justify-center gap-6 p-1 sm:justify-between sm:p-5"
  >
    <div class="hidden sm:block">
      <button @click="toggleLanguage()">
        <Icon name="fontisto:language" size="32" />
      </button>
    </div>
    <TheNavbar />
    <div class="hidden sm:block">
      <button @click="toggleColorMode()">
        <Icon :name="colorIcon" size="32" />
      </button>
    </div>
  </header>
</template>
