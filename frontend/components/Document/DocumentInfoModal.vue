<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  documentId: {
    type: String,
    required: true,
  },
});

const { documentId } = toRefs(props);
const store = useDocumentStore();
const document = await store.getById(documentId.value);
const { formatDescription, formatTaxRate, isInvoice } = useDocumentHelper();
const { formatToEur } = useCurrencyHelper();
const { formatDate } = useCustomDateHelper();

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <UModal
    :model-value="modelValue"
    :ui="{ width: 'sm:max-w-4xl' }"
    @close="emit('update:modelValue', !modelValue)"
  >
    <UCard
      :ui="{ divide: 'divide-y divide-slate-100 dark:divide-neutral-800' }"
    >
      <template #header>
        <div class="flex justify-between">
          <p>{{ $t('DOCUMENTS.MODAL.INFO.TITLE') }}</p>
          <button @click="emit('update:modelValue', !modelValue)">
            <Icon name="formkit:close" size="24" />
          </button>
        </div>
      </template>
      <div class="flex w-full flex-col items-center justify-center gap-5">
        <div class="flex w-full flex-col gap-5">
          <AppGroup>
            <AppViewItem
              label="DOCUMENTS.LABELS.DATE_OF_ISSUE"
              :value="formatDate(document.dateOfIssue, false)"
            />
            <AppViewItem
              v-if="isInvoice(document)"
              label="DOCUMENTS.LABELS.DUE_DATE"
              :value="formatDate(document.dueDate, false)"
            />
          </AppGroup>

          <div class="grid w-full grid-cols-1 gap-2">
            <AppViewItem
              label="DOCUMENTS.LABELS.DESCRIPTION"
              :value="formatDescription(document.description)"
            />
          </div>

          <div class="grid w-full gap-2 sm:grid-cols-5">
            <AppViewItem
              label="DOCUMENTS.LABELS.SUBTOTAL"
              :value="formatToEur(document.subTotal)"
            />
            <AppViewItem
              label="DOCUMENTS.LABELS.TAX_RATE"
              :value="formatTaxRate(document.taxRate)"
            />
            <AppViewItem
              label="DOCUMENTS.LABELS.TAX"
              :value="formatToEur(document.tax)"
            />
            <AppViewItem
              v-if="isInvoice(document)"
              label="DOCUMENTS.LABELS.ALREADY_PAID"
              :value="formatToEur(document.alreadyPaid)"
            />

            <AppViewItem
              label="DOCUMENTS.LABELS.TOTAL"
              :value="formatToEur(document.total)"
            />
          </div>
        </div>
      </div>
    </UCard>
  </UModal>
</template>
