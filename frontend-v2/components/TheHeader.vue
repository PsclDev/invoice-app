<template>
  <div class="flex items-center justify-between">
    <div>
      <Icon
        @click="changeLanguage"
        class="cursor-pointer text-4xl hover:text-emerald-300"
        name="material-symbols:language"
      />
    </div>

    <div
      class="flex gap-5 md:gap-16 bg-slate-100 dark:bg-zinc-800 rounded-lg py-2 md:py-3 px-4 md:px-6"
    >
      <NuxtLink to="/" exact class="hover:text-emerald-300">
        <div class="md:hidden">
          <Icon class="text-4xl" name="material-symbols:query-stats" />
        </div>
        <div class="hidden md:block">
          <span class="text-2xl">{{ $t('header.dashboard') }}</span>
        </div>
      </NuxtLink>

      <NuxtLink to="/clients" exact class="hover:text-emerald-300">
        <div class="md:hidden">
          <Icon class="text-4xl" name="material-symbols:manage-accounts" />
        </div>
        <div class="hidden md:block">
          <span class="text-2xl">{{ $t('header.clients') }}</span>
        </div>
      </NuxtLink>

      <NuxtLink to="/documents" exact class="hover:text-emerald-300">
        <div class="md:hidden">
          <Icon
            class="text-4xl"
            name="material-symbols:document-scanner-rounded"
          />
        </div>
        <div class="hidden md:block">
          <span class="text-2xl">{{ $t('header.documents') }}</span>
        </div>
      </NuxtLink>

      <NuxtLink to="/settings" exact class="hover:text-emerald-300">
        <div class="md:hidden">
          <Icon class="text-4xl" name="material-symbols:settings-rounded" />
        </div>
        <div class="hidden md:block">
          <span class="text-2xl">{{ $t('header.settings') }}</span>
        </div>
      </NuxtLink>
    </div>

    <div>
      <Icon
        @click="switchTheme"
        class="cursor-pointer text-4xl hover:text-emerald-300"
        :name="
          colorMode.preference === 'dark'
            ? 'material-symbols:light-mode'
            : 'material-symbols:dark-mode'
        "
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const i18n = useI18n();
const colorMode = useColorMode();

function changeLanguage() {
  const curLang = i18n.getLocaleCookie();
  i18n.setLocale(curLang === 'en' ? 'de' : 'en');
}

function switchTheme() {
  colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light';
}
</script>

<style lang="scss" scoped>
.router-link-exact-active {
  @apply font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400;

  div {
    .icon {
      @apply text-emerald-400;
    }
  }
}
</style>
