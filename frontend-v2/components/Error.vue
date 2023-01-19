<template>
  <div
    class="flex flex-col items-center gap-5 justify-center text-2xl text-red-500"
  >
    <p class="text-4xl">Error occurred:</p>
    <p v-if="error.includes('ECONNREFUSED')">Failed to reach api</p>
    <p v-else>unkown reason</p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  error: {
    type: String,
    required: true,
  },
});

const { error } = toRefs(props);
</script>
