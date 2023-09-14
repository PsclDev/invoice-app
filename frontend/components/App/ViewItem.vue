<script lang="ts" setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
});
</script>

<template>
  <div class="flex w-full flex-col sm:gap-2">
    <p class="font-bold">{{ $t(label) }}:</p>
    <p class="whitespace-pre-line">{{ value }}</p>
  </div>
</template>
