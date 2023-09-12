<script lang="ts" setup>
import { ButtonColor, Client, ViewMode } from '~/types';

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
const { isCompany, getName } = useClientHelper();
const store = useClientStore();
const openDeleteModal = ref(false);

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

      <AppGroup v-if="client.documents && client.documents.length > 0">
        <AppViewItem
          label="CLIENTS.LABELS.DOCUMENTS"
          :value="client.documents.length"
        />
      </AppGroup>
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
      title-key="CLIENTS.MODAL.TITLE"
      :title-props="{ name: getName(client) }"
      content-key="CLIENTS.MODAL.CONTENT"
      @confirm="onDelete"
    />
  </div>
</template>
