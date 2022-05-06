<template>
  <div>
    <label for="gender" class="form-label">{{ $t('gender.title') }}</label>
    <select
      v-if="viewMode === ViewMode.EDIT"
      id="gender"
      v-model="localValue"
      class="form-select"
    >
      <option selected disabled>{{ $t('gender.choose') }}</option>
      <option value="MALE">{{ $t('gender.male') }}</option>
      <option value="FEMALE">{{ $t('gender.female') }}</option>
      <option value="DIVERS">{{ $t('gender.divers') }}</option>
    </select>
    <div v-else>
      {{ $t(`gender.${value.toLowerCase()}`) }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ViewMode } from '~/types/viewMode';

export default Vue.extend({
  name: 'AppGenderSelect',
  props: {
    viewMode: {
      type: String as () => ViewMode,
      required: true,
    },
    value: {
      type: String,
      required: true,
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
