<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  tabs: {
    type: Array as PropType<string[]>,
    required: true,
  },
  translate: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();
const { tabs, translate } = toRefs(props);
const emit = defineEmits(['update:modelValue']);
const activeTab = ref(tabs.value[0]);

emit('update:modelValue', activeTab.value);

function getTabName(tab: string): string {
  return translate.value ? t(`DASHBOARD.TABS.${tab}`) : tab;
}

function buildOptions() {
  const options: Record<string, string> = {};
  tabs.value.forEach((tab) => {
    options[tab] = getTabName(tab);
  });
  return options;
}

watch(activeTab, () => {
  emit('update:modelValue', activeTab.value);
});
</script>

<template>
  <div class="sm:hidden">
    <FormKit v-model="activeTab" type="select" :options="buildOptions()" />
  </div>
  <ul class="hidden gap-2 rounded-lg text-center text-sm sm:flex">
    <li
      v-for="tab in tabs"
      :key="tab"
      class="w-full cursor-pointer"
      @click="activeTab = tab"
    >
      <a
        :class="
          activeTab === tab
            ? 'font-bold bg-slate-200 dark:bg-neutral-700 shadow'
            : ''
        "
        class="inline-block w-full rounded border border-slate-300 bg-slate-100 p-4 hover:border-slate-400 hover:font-medium dark:border-neutral-800 dark:bg-neutral-900 hover:dark:border-neutral-500"
        >{{ getTabName(tab) }}
      </a>
    </li>
  </ul>
</template>
