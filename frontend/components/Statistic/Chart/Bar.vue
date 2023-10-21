<script setup>
import loadash from 'lodash';
import { Bar } from 'vue-chartjs';

defineProps({
  data: {
    type: Object,
    required: true,
  },
  options: {
    type: Object,
    required: true,
  },
});

const key = ref(0);

const handleResize = loadash.debounce(() => {
  key.value += 1;
}, 750);

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div>
    <Bar :key="key" :options="options" :data="data" />
  </div>
</template>
