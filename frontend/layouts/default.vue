<template>
  <div class="flex h-full w-full flex-col p-2 sm:p-5">
    <TheHeader
      class="fixed bottom-0 left-1/2 w-full -translate-x-1/2 bg-slate-100 pb-3 dark:bg-neutral-950 sm:static sm:left-0 sm:mb-5 sm:translate-x-0 sm:pb-0"
    />
    <slot />
    <UNotifications />
  </div>
</template>
