<template>
  <div>
    <label v-if="!hideLabel" :for="title" class="form-label">
      {{ title }}
    </label>
    <div v-if="viewMode === ViewMode.EDIT">
      <input
        :id="title"
        class="form-control"
        :type="type"
        :value="value"
        :disabled="disabled"
        @input="$emit('input', $event.target.value)"
        @change="$emit('valueChanged', $event.target.value)"
      />
    </div>
    <div v-else>{{ value + postfix }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ViewMode } from '~/types';

export default Vue.extend({
  name: 'AppInput',
  props: {
    hideLabel: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    viewMode: {
      type: String as () => ViewMode,
      required: true,
    },
    // eslint-disable-next-line vue/require-prop-types
    value: {
      required: true,
    },
    postfix: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ViewMode,
    };
  },
});
</script>
