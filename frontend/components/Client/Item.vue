<script lang="ts" setup>
import { Client, FormMode, ViewMode } from '~/types';

const props = defineProps({
  client: {
    type: Object as PropType<Client>,
    required: true,
  },
});

const i18n = useI18n();
const { client } = toRefs(props);
const formRef = ref([]);
const mode = ref<ViewMode>(ViewMode.VIEW);

const formatDate = (date: Date | undefined) => {
  if (!date) return;

  const format =
    i18n.locale.value === 'de' ? 'DD.MM.YYYY HH:mm:ss' : 'YYYY-MM-DD HH:mm:ss';
  return useDateFormat(date, format).value.replace('"', '');
};
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center px-4 sm:px-12">
    <div
      class="flex w-full justify-around gap-5 pb-3 text-slate-400 dark:text-slate-600"
    >
      <small class="text-center">
        {{ $t('COMMON.LABELS.CREATED_AT') }}:
        {{ formatDate(client.createdAt) }}
      </small>
      <small class="text-center">
        {{ $t('COMMON.LABELS.UPDATED_AT') }}:
        {{ formatDate(client.updatedAt) }}
      </small>
    </div>
    <ClientView v-if="mode === ViewMode.VIEW" v-model="mode" :client="client" />
    <ClientForm
      v-if="mode === ViewMode.EDIT"
      ref="formRef"
      v-model="mode"
      :form-mode="client.id.includes('new-') ? FormMode.CREATE : FormMode.EDIT"
      :client-id="client.id"
    />
  </div>
</template>
