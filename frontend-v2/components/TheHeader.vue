<template>
  <div class="flex items-center justify-between">
    <div>
      <Icon
        @click="changeLanguage"
        class="cursor-pointer hover:text-emerald-500"
        size="40px"
        name="material-symbols:language"
      />
    </div>

    <div class="flex gap-5 md:gap-16 bg-white dark:bg-slate-900 rounded-md p-3">
      <NuxtLink to="/" exact class="hover:text-emerald-500">
        <div class="md:hidden">
          <Icon size="40px" name="material-symbols:query-stats" />
        </div>
        <div class="hidden md:block">
          <span class="text-xl">{{ $t("header.dashboard") }}</span>
        </div>
      </NuxtLink>

      <NuxtLink to="/clients" exact class="hover:text-emerald-500">
        <div class="md:hidden">
          <Icon size="40px" name="material-symbols:manage-accounts" />
        </div>
        <div class="hidden md:block">
          <span class="text-xl">{{ $t("header.clients") }}</span>
        </div>
      </NuxtLink>

      <NuxtLink to="/documents" exact class="hover:text-emerald-500">
        <div class="md:hidden">
          <Icon size="40px" name="material-symbols:document-scanner-rounded" />
        </div>
        <div class="hidden md:block">
          <span class="text-xl">{{ $t("header.documents") }}</span>
        </div>
      </NuxtLink>

      <NuxtLink to="/settings" exact class="hover:text-emerald-500">
        <div class="md:hidden">
          <Icon size="40px" name="material-symbols:settings-rounded" />
        </div>
        <div class="hidden md:block">
          <span class="text-xl">{{ $t("header.settings") }}</span>
        </div>
      </NuxtLink>
    </div>

    <div>
      <Icon
        @click="switchTheme"
        class="cursor-pointer hover:text-emerald-500"
        size="40px"
        :name="
          colorMode.preference === 'dark'
            ? 'material-symbols:light-mode'
            : 'material-symbols:dark-mode'
        "
      />
    </div>
  </div>
</template>

<script setup>
const i18n = useI18n();
const colorMode = useColorMode();

function changeLanguage() {
  const curLang = i18n.getLocaleCookie();
  i18n.setLocale(curLang === "en" ? "de" : "en");
}

function switchTheme() {
  colorMode.preference = colorMode.preference === "light" ? "dark" : "light";
}
</script>

<style scoped>
.router-link-exact-active {
  @apply text-emerald-400;
}
</style>
