<template>
  <FormKit
    outer-class="$remove:mb-4 w-full md:w-3/4 mb-5"
    inner-class="$remove:max-w-md"
    input-class="text-slate-600 dark:text-slate-100"
    placeholder="Search"
    v-model="modelValue"
    :delay="300"
  />
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
});

const modelValue = ref(props.modelValue);
const emit = defineEmits(['update:modelValue']);

watch(modelValue, (value) => {
  if (value.length > 0 && value.length < 3) return;

  emit('update:modelValue', value);
});
</script>
