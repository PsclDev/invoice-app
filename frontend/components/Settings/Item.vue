<script lang="ts" setup>
import { debounce } from 'lodash';
import { Setting } from 'types';

const props = defineProps({
  setting: {
    type: Object as PropType<Setting>,
    required: true,
  },
});
const emits = defineEmits(['unsavedChanges']);
const { setting } = toRefs(props);
const store = useSettingStore();

const initialValue = ref(setting.value.value);
const disabled = ref(true);

watch(
  setting.value,
  debounce(() => {
    disabled.value = initialValue.value === setting.value.value;
    emits('unsavedChanges', !disabled.value);
  }, 300),
  { deep: true },
);

function onDiscard() {
  setting.value.value = initialValue.value;
  disabled.value = true;
}

async function onSave() {
  initialValue.value = setting.value.value;
  disabled.value = true;
  await store.updateSetting(setting.value);
}

defineExpose({
  onDiscard,
  onSave,
});
</script>

<template>
  <div class="flex w-full items-center gap-2">
    <div
      class="flex w-full grow flex-col justify-center gap-2 sm:flex-row sm:items-center"
    >
      <p class="sm:w-1/4 sm:text-right lg:w-1/6">{{ setting.title }}:</p>
      <div class="flex grow items-center gap-5">
        <div class="grow">
          <FormKit v-model="setting.value" :type="setting.inputType" />
        </div>
        <button
          :class="disabled ? 'opacity-25' : 'text-indigo-500'"
          @click="onSave"
        >
          <Icon name="material-symbols:save-rounded" size="32" />
        </button>
      </div>
    </div>
  </div>
</template>
