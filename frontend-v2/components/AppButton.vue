<template>
  <button
    type="button"
    class="text-zinc-900 font-bold text-center bg-gradient-to-r hover:bg-gradient-to-br focus:ring-4 focus:outline-none rounded-lg px-5 py-1.5"
    :class="colors"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String,
    required: false,
    default: ''
  }
});

const { type } = toRefs(props);

const colors = computed(() => {
  switch (type.value) {
    case 'update':
      return 'from-orange-400 to-amber-400 focus:ring-orange-300 dark:focus:ring-amber-800';
    case 'delete':
      return 'from-red-500 to-rose-700 focus:ring-red-300 dark:focus:ring-rose-800';
    default:
      return 'from-lime-400 to-emerald-400 focus:ring-lime-300 dark:focus:ring-lime-800';
  }
});
</script>
