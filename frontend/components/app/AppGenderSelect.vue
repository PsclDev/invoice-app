<template>
  <div>
    <label for="gender" class="form-label">{{ $t('gender.title') }}</label>
    <select
      v-if="viewMode === ViewMode.EDIT"
      id="gender"
      v-model="localValue"
      class="form-select"
    >
      <option value="choose" selected>{{ $t('gender.choose') }}</option>
      <option :value="Gender.MALE">{{ $t('gender.male') }}</option>
      <option :value="Gender.FEMALE">{{ $t('gender.female') }}</option>
      <option :value="Gender.DIVERS">{{ $t('gender.divers') }}</option>
    </select>
    <div v-else>
      {{ $t(`gender.${value.toLowerCase()}`) }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Gender } from '~/types';
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
      default: 'choose',
    },
  },
  data() {
    return {
      ViewMode,
      Gender,
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
