<script lang="ts" setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
    default: '',
  },
  color: {
    type: String as PropType<ButtonColor>,
    required: false,
    default: 'green',
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});

defineEmits(['click']);
</script>

<template>
  <button
    :disabled="disabled"
    class="w-full rounded py-2 font-bold"
    :class="{
      'bg-blue-600 hover:bg-blue-700': color === ButtonColor.BLUE,
      'bg-spring-green-600 hover:bg-spring-green-700':
        color === ButtonColor.GREEN,
      'bg-amber-600 hover:bg-amber-700': color === ButtonColor.ORANGE,
      'bg-red-600 hover:bg-red-700': color === ButtonColor.RED,
      'bg-slate-400 hover:bg-slate-500': color === ButtonColor.GRAY,
      'cursor-not-allowed opacity-50	': disabled,
    }"
    @click="$emit('click')"
  >
    <span :class="{ 'hidden sm:block': icon !== '' }">{{ $t(label) }}</span>
    <div :class="{ 'sm:hidden': icon !== '', hidden: icon === '' }">
      <Icon :name="icon" size="32" />
    </div>
  </button>
</template>
~/models
