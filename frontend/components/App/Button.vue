<script lang="ts" setup>
import { ButtonColor } from '~/types';

defineProps({
  label: {
    type: String,
    required: true,
  },
  color: {
    type: String as PropType<ButtonColor>,
    required: false,
    default: 'green',
  },
});

defineEmits(['click']);
</script>

<template>
  <button
    class="w-full rounded py-2 font-bold"
    :class="{
      'bg-amber-600 text-white hover:bg-amber-700': color === ButtonColor.BLUE,
      'bg-spring-green-600 hover:bg-spring-green-700':
        color === ButtonColor.GREEN,
      'bg-blue-600 hover:bg-blue-700': color === ButtonColor.ORANGE,
      'bg-red-600 hover:bg-red-700': color === ButtonColor.RED,
    }"
    @click="$emit('click')"
  >
    {{ $t(label) }}
  </button>
</template>
