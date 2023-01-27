<template>
  <div
    class="flex flex-col items-center gap-5 justify-center text-2xl text-red-500"
  >
    <p class="text-4xl">{{ $t('pages.error.title') }}</p>
    <p v-if="error.includes('ECONNREFUSED')">
      {{ $t('pages.error.no-response') }}
    </p>
    <div v-else class="flex flex-col items-center">
      <p>{{ $t('pages.error.unkown') }}</p>
      <p class="text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  error: {
    type: String,
    required: true
  }
});

const { error } = toRefs(props);
</script>
