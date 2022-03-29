<template>
  <div v-if="mode === 'edit'">edit</div>
  <div v-else>view</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ClientComponent',
  props: {
    mode: {
      type: String,
      required: true,
    },
    value: {},
  },
});
</script>

<style lang="scss" scoped>
</style>