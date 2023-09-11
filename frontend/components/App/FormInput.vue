<script lang="ts" setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <p class="font-bold">{{ $t(label) }}:</p>
    <slot />
  </div>
</template>
