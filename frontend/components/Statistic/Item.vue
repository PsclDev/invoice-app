<script lang="ts" setup>
const randomValue = useRandomValue();

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  hidden: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const { hidden } = toRefs(props);

const blur = ref(hidden.value);
</script>

<template>
  <div class="flex select-none flex-col items-center">
    <span
      class="cursor-pointer text-3xl font-bold"
      :class="blur ? 'blur-md' : ''"
      @click="blur = !blur"
      >{{ blur ? randomValue.Number() : value }}</span
    >
    <span class="text-lg text-gray-500">{{ $t(label) }}</span>
  </div>
</template>
