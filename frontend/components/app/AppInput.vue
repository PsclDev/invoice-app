<template>
  <div>
    <label :for="title" class="form-label">
      {{ title }}
    </label>
    <div v-if="mode === 'edit'">
      <input
        :id="title"
        class="form-control"
        type="text"
        :value="value"
        @input="$emit('input', $event.target.value)"
      />
    </div>
    <div v-else>{{ value }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'AppInput',
  props: {
    title: {
      type: String,
      required: true,
    },
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
