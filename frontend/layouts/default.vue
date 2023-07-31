<template>
  <div class="flex flex-col justify-between sm:justify-start p-2 sm:p-5 h-full">
    <TheHeader class="order-last sm:order-first" />
    <slot class="order-first sm:order-last" />
  </div>
</template>
