<template>
  <div>
    <label :for="title" class="form-label">
      {{ title }}
    </label>
    <div v-if="viewMode === ViewMode.EDIT">
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
import ViewMode from '~/types/viewMode';

export default Vue.extend({
  name: 'AppInput',
  props: {
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
  },
  data() {
    return {
      ViewMode,
    };
  },
});
</script>

<style lang="scss" scoped></style>
