<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="flex w-full flex-col items-center gap-5">
    <h2 class="text-2xl">{{ $t(title) }}</h2>
    <div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
      <slot />
    </div>
  </div>
</template>
