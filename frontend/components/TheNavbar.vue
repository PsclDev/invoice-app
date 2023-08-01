<script setup>
const items = ref([
  {
    name: 'NAVIGATION.DASHBOARD',
    path: '/',
    icon: 'material-symbols:query-stats',
  },
  {
    name: 'NAVIGATION.CLIENTS',
    path: '/clients',
    icon: 'material-symbols:manage-accounts',
  },
  {
    name: 'NAVIGATION.DOCUMENTS',
    path: '/documents',
    icon: 'material-symbols:document-scanner-rounded',
  },
  {
    name: 'NAVIGATION.SETTINGS',
    path: '/settings',
    icon: 'material-symbols:settings-rounded',
  },
]);
</script>

<template>
  <nav
    class="flex w-4/5 justify-between gap-5 border-t-2 border-slate-200 px-4 pt-4 sm:w-2/3 sm:border-t-0 md:gap-16 md:px-6 md:py-3 lg:w-1/3"
  >
    <NuxtLink
      v-for="item in items"
      :key="item.path"
      :to="item.path"
      exact
      class="hover:text-spring-green-700"
    >
      <span class="hidden sm:block">{{ $t(item.name) }}</span>
      <div class="sm:hidden">
        <Icon :name="item.icon" size="32" />
      </div>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.router-link-exact-active {
  @apply font-bold text-spring-green-600;

  div {
    .icon {
      @apply text-spring-green-600;
    }
  }
}
</style>
