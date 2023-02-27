<template>
  <button
    @click="onClick"
    type="button"
    class="text-zinc-900 font-bold text-center bg-gradient-to-r hover:bg-gradient-to-br focus:ring-4 focus:outline-none rounded-lg px-5 h-9"
    :disabled="disabled"
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
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  }
});

const { type, disabled } = toRefs(props);

const colors = computed(() => {
  let classes = '';
  switch (type.value) {
    case 'update':
      classes =
        'from-orange-400 to-amber-400 focus:ring-orange-300 dark:focus:ring-amber-800';
      break;
    case 'delete':
      classes =
        'from-red-500 to-rose-700 focus:ring-red-300 dark:focus:ring-rose-800';
      break;
    default:
      classes =
        'from-lime-400 to-emerald-400 focus:ring-lime-300 dark:focus:ring-lime-800';
      break;
  }
  if (disabled.value) {
    classes += ' disabled:opacity-50';
  }

  return classes;
});

const emit = defineEmits(['click']);

const onClick = () => {
  emit('click');
};
</script>
