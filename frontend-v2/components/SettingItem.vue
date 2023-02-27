<template>
  <div class="grid grid-cols-8 gap-2 md:gap-5 w-full items-center">
    <div class="col-span-8 md:col-auto xl:col-span-2">
      <p class="font-bold md:text-end">{{ setting.title }}:</p>
    </div>
    <div class="col-span-8 md:col-span-5">
      <FormKit type="form" :actions="false" v-model="form">
        <FormKit
          name="setting"
          outer-class="$remove:mb-4"
          inner-class="max-w-xl"
          input-class="text-slate-600 dark:text-slate-100"
          :type="setting.inputType"
          :mask="setting.inputMask"
        />
      </FormKit>
    </div>
    <div class="col-span-8 md:col-span-1">
      <AppButton
        type="update"
        :disabled="setting.value === form.setting"
        @click="onClick"
        >Update</AppButton
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { SettingResponse } from '~~/types';

const props = defineProps({
  setting: {
    type: Object as PropType<SettingResponse>,
    required: true
  }
});

const { setting } = toRefs(props);
const form = ref({
  setting: setting.value.value
});

const settingsStore = useSettingsStore();

const onClick = () => {
  settingsStore.updateSetting(setting.value.id, form.value.setting);
  setting.value.value = form.value.setting;
};
</script>
