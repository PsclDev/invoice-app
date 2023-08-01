<template>
  <div class="flex h-full flex-col justify-between p-2 sm:justify-start sm:p-5">
    <TheHeader class="order-last sm:order-first" />
    <slot class="order-first sm:order-last" />
  </div>
</template>
