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
    // eslint-disable-next-line vue/require-prop-types
    value: {
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
