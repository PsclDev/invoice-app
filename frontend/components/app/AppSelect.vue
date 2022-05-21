<template>
  <div>
    <label v-if="!hideLabel" for="select" class="form-label">{{
      $t(`enums.${labels}.title`)
    }}</label>
    <select
      v-if="viewMode === ViewMode.EDIT"
      id="select"
      v-model="localValue"
      class="form-select"
    >
      <option v-if="value === 'select'" value="select" selected>
        {{ $t('common.select') }}
      </option>
      <option v-for="item of Object.keys(type)" :key="item" :value="item">
        {{ $t(`enums.${labels}.${item.toLocaleLowerCase()}`) }}
      </option>
    </select>
    <div v-else>
      <template v-if="value === 'select'">
        {{ $t('common.select') }}
      </template>
      <template v-else>
        {{ $t(`enums.${labels}.${value.toLowerCase()}`) }}
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { AppEnums, ViewMode } from '~/types';

export default Vue.extend({
  name: 'AppSelect',
  props: {
    hideLabel: {
      type: Boolean,
      default: false,
    },
    viewMode: {
      type: String as () => ViewMode,
      required: true,
    },
    labels: {
      type: String,
      required: true,
    },
    type: {
      type: Object as () => AppEnums,
      required: true,
    },
    value: {
      type: String,
      default: 'select',
    },
  },
  data() {
    return {
      ViewMode,
    };
  },
  computed: {
    localValue: {
      get(): string {
        return this.value;
      },
      set(localValue: string) {
        this.$emit('input', localValue);
      },
    },
  },
});
</script>
