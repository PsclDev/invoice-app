<script lang="ts" setup>
const props = defineProps({
  doc: {
    type: Object as PropType<Document>,
    required: true,
  },
});

const store = useDocumentStore();
const clientStore = useClientStore();
const { doc } = toRefs(props);
const { isOffer, getName } = useDocumentHelper();
const { formatDate } = useCustomDateHelper();
const openDocumentSendModal = ref(false);
const mode = ref<ViewMode>(ViewMode.VIEW);
const client = ref({} as Client);
client.value = await clientStore.getById(doc.value.clientId);

const convertDocument = async () => {
  await store.convert(doc.value);
};

const onSendDocument = () => {
  if (!client.value.email) {
    store.printDocument(doc.value.id);
  }

  openDocumentSendModal.value = true;
};

const commonActions = ref<Action[]>([
  {
    icon: 'ri:send-plane-fill',
    func: onSendDocument,
  },
]);

const offerActions = ref<Action[]>([
  {
    icon: 'ri:file-copy-2-fill',
    func: convertDocument,
  },
]);
</script>

<template>
  <AppAccordion
    :id="doc.id"
    :title="getName(doc, client)"
    :icon="
      isOffer(doc) ? 'fa6-solid:file-invoice' : 'fa6-solid:file-invoice-dollar'
    "
    :actions="[
      ...(isOffer(doc) && !doc.invoiceId ? offerActions : []),
      ...commonActions,
    ]"
  >
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
        v-model="mode"
        :form-mode="FormMode.EDIT"
        :document-id="doc.id"
      />
    </div>

    <DocumentSendModal
      v-model="openDocumentSendModal"
      :document-id="doc.id"
      :title="getName(doc, client)"
    />
  </AppAccordion>
</template>
~/models
