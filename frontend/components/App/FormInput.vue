<script lang="ts" setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <p class="font-bold">{{ $t(label) }}: {{ required ? '*' : '' }}</p>
    <slot />
  </div>
</template>
