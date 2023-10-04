<script setup lang="ts">
import { ButtonColor } from '~/types';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  documentId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const { documentId } = toRefs(props);

const emit = defineEmits(['update:modelValue']);
const store = useDocumentStore();
</script>

<template>
  <UModal
    :model-value="modelValue"
    @close="emit('update:modelValue', !modelValue)"
  >
    <UCard
      :ui="{ divide: 'divide-y divide-slate-100 dark:divide-neutral-800' }"
    >
      <template #header>
        <div class="flex justify-between">
          <p>
            {{ $t('DOCUMENTS.MODAL.SEND.TITLE', { name: title }) }}
          </p>
          <button @click="emit('update:modelValue', !modelValue)">
            <Icon name="formkit:close" size="24" />
          </button>
        </div>
      </template>
      <div class="flex w-full flex-col items-center justify-center gap-5">
        <div class="flex w-full flex-col gap-5">
          {{ $t('DOCUMENTS.MODAL.SEND.CONTENT') }}
        </div>
      </div>
      <template #footer>
        <div class="flex w-full gap-5">
          <AppButton
            label="DOCUMENTS.MODAL.SEND.PRINT"
            icon="material-symbols:print"
            :color="ButtonColor.BLUE"
            @click="store.printDocument(documentId)"
          />
          <AppButton
            label="DOCUMENTS.MODAL.SEND.MAIL"
            icon="material-symbols:send"
            :color="ButtonColor.BLUE"
            @click="store.sendDocument(documentId)"
          />
          <AppButton
            label="DOCUMENTS.MODAL.SEND.DELAYED_MAIL"
            icon="material-symbols:schedule-send"
            :color="ButtonColor.ORANGE"
            @click="store.sendDocumentDelayed(documentId)"
          />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
