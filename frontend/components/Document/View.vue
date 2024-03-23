<script lang="ts" setup>
const { formatDate } = useCustomDateHelper();
const { isInvoice, getName: getDocumentName } = useDocumentHelper();
const { getName: getClientName } = useClientHelper();

const props = defineProps({
  modelValue: {
    type: String as PropType<ViewMode>,
    required: true,
  },
  doc: {
    type: Object as PropType<Document>,
    required: true,
  },
});

const emits = defineEmits(['update:modelValue']);

const { modelValue, doc } = toRefs(props);
const { formatDescription, formatTaxRate } = useDocumentHelper();
const { formatToEur } = useCurrencyHelper();
const documentStore = useDocumentStore();
const clientStore = useClientStore();
const client = await clientStore.getById(doc.value.clientId);
const openClientInfoModal = ref(false);
const openDeleteModal = ref(false);

function onEdit() {
  emits(
    'update:modelValue',
    modelValue.value === ViewMode.EDIT ? ViewMode.VIEW : ViewMode.EDIT,
  );
}

function onDelete() {
  documentStore.deleteDocument(doc.value);
}
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center gap-5">
    <div class="flex w-full flex-col gap-5">
      <AppGroup>
        <AppGroup class="items-end">
          <AppViewItem
            label="DOCUMENTS.LABELS.CLIENT"
            :value="getClientName(client)"
          />
          <button @click="() => (openClientInfoModal = true)">
            <Icon name="formkit:info" size="21" />
          </button>
        </AppGroup>
        <AppViewItem
          label="DOCUMENTS.LABELS.DATE_OF_ISSUE"
          :value="formatDate(doc.dateOfIssue, false)"
        />
        <AppViewItem
          v-if="isInvoice(doc)"
          label="DOCUMENTS.LABELS.DUE_DATE"
          :value="formatDate(doc.dueDate, false)"
        />
      </AppGroup>

      <div class="grid w-full grid-cols-1 gap-2">
        <AppViewItem
          label="DOCUMENTS.LABELS.DESCRIPTION"
          :value="formatDescription(doc.description)"
        />
      </div>

      <div class="grid w-full gap-2 sm:grid-cols-5">
        <AppViewItem
          label="DOCUMENTS.LABELS.SUBTOTAL"
          :value="formatToEur(doc.subTotal)"
        />
        <AppViewItem
          label="DOCUMENTS.LABELS.TAX_RATE"
          :value="formatTaxRate(doc.taxRate)"
        />
        <AppViewItem
          label="DOCUMENTS.LABELS.TAX"
          :value="formatToEur(doc.tax)"
        />
        <AppViewItem
          v-if="isInvoice(doc)"
          label="DOCUMENTS.LABELS.ALREADY_PAID"
          :value="formatToEur(doc.alreadyPaid)"
        />

        <AppViewItem
          label="DOCUMENTS.LABELS.TOTAL"
          :value="formatToEur(doc.total)"
        />
      </div>
    </div>
    <div class="flex w-full gap-5">
      <AppButton
        label="COMMON.BUTTONS.EDIT"
        :color="ButtonColor.BLUE"
        @click="onEdit"
      />
      <AppButton
        label="COMMON.BUTTONS.DELETE"
        :color="ButtonColor.RED"
        @click="() => (openDeleteModal = true)"
      />
    </div>

    <AppConfirmModal
      v-model="openDeleteModal"
      title-key="DOCUMENTS.MODAL.DELETE.TITLE"
      :title-props="{ name: getDocumentName(doc) }"
      content-key="DOCUMENTS.MODAL.DELETE.CONTENT"
      @confirm="onDelete"
      @cancel="() => (openDeleteModal = false)"
    />

    <ClientInfoModal v-model="openClientInfoModal" :client="client" />
  </div>
</template>
~/models
