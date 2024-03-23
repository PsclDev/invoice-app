<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: String as PropType<ViewMode>,
    required: true,
  },
  client: {
    type: Object as PropType<Client>,
    required: true,
  },
});

const emits = defineEmits(['update:modelValue']);

const { modelValue, client } = toRefs(props);
const { isCompany, getName: getClientName } = useClientHelper();
const { getName: getDocumentName } = useDocumentHelper();
const store = useClientStore();
const openDocumentInfoModal = ref(false);
const documentInfoId = ref('');
const openDeleteModal = ref(false);

function openDocumentInfo(id: string) {
  documentInfoId.value = id;
  openDocumentInfoModal.value = true;
}

function onEdit() {
  emits(
    'update:modelValue',
    modelValue.value === ViewMode.EDIT ? ViewMode.VIEW : ViewMode.EDIT,
  );
}

function onDelete() {
  store.deleteClient(client.value);
}
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center gap-5">
    <div class="flex w-full flex-col gap-5">
      <AppGroup v-if="isCompany(client)">
        <AppViewItem label="CLIENTS.LABELS.COMPANY" :value="client.company" />
        <AppViewItem label="CLIENTS.LABELS.VAT" :value="client.vat" />
      </AppGroup>

      <AppGroup>
        <AppViewItem
          label="CLIENTS.LABELS.GENDER"
          :value="$t(`CLIENTS.GENDER.${client.gender}`)"
        />
        <AppViewItem
          label="CLIENTS.LABELS.FIRSTNAME"
          :value="client.firstname"
        />
        <AppViewItem label="CLIENTS.LABELS.LASTNAME" :value="client.lastname" />
      </AppGroup>

      <AppGroup>
        <AppViewItem label="CLIENTS.LABELS.STREET" :value="client.street" />
        <AppViewItem
          label="CLIENTS.LABELS.POSTAL_CODE"
          :value="client.postalCode"
        />
        <AppViewItem label="CLIENTS.LABELS.CITY" :value="client.city" />
      </AppGroup>

      <AppGroup v-if="client.email">
        <AppViewItem label="CLIENTS.LABELS.EMAIL" :value="client.email" />
      </AppGroup>

      <div v-if="client.documents.length > 0" class="w-full">
        <div class="flex w-full flex-col sm:gap-2">
          <p class="font-bold">{{ $t('CLIENTS.LABELS.DOCUMENTS') }}:</p>
          <div class="flex flex-wrap gap-4">
            <div
              v-for="doc in client.documents"
              :key="doc.id"
              class="flex items-center gap-2"
            >
              <p>{{ getDocumentName(doc) }}</p>
              <div class="leading-[16px]">
                <button @click="openDocumentInfo(doc.id)">
                  <Icon name="formkit:info" size="18" />
                </button>
              </div>
            </div>
          </div>
        </div>
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
      title-key="CLIENTS.MODAL.DELETE.TITLE"
      :title-props="{ name: getClientName(client) }"
      content-key="CLIENTS.MODAL.DELETE.CONTENT"
      @confirm="onDelete"
      @cancel="() => (openDeleteModal = false)"
    />

    <DocumentInfoModal
      v-if="openDocumentInfoModal"
      v-model="openDocumentInfoModal"
      :document-id="documentInfoId"
    />
  </div>
</template>
~/models
