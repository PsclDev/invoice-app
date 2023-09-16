<script lang="ts" setup>
import { Document, FormMode, ViewMode } from '~/types';

defineProps({
  doc: {
    type: Object as PropType<Document>,
    required: true,
  },
});

const { formatDate } = useCustomDateHelper();
const formRef = ref([]);
const mode = ref<ViewMode>(ViewMode.VIEW);
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center px-4 sm:px-12">
    <div
      class="flex w-full justify-around gap-5 pb-3 text-slate-400 dark:text-slate-600"
    >
      <small class="text-center">
        {{ $t('COMMON.LABELS.CREATED_AT') }}:
        {{ formatDate(doc.createdAt, true) }}
      </small>
      <small class="text-center">
        {{ $t('COMMON.LABELS.UPDATED_AT') }}:
        {{ formatDate(doc.updatedAt, true) }}
      </small>
    </div>
    <DocumentView v-if="mode === ViewMode.VIEW" v-model="mode" :doc="doc" />
    <DocumentForm
      v-if="mode === ViewMode.EDIT"
      ref="formRef"
      v-model="mode"
      :form-mode="FormMode.EDIT"
      :document-id="doc.id"
    />
  </div>
</template>
