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
const store = useClientStore();

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
      <div v-if="client.company" class="grid w-full grid-cols-3">
        <div class="flex w-full flex-col gap-2">
          <p class="font-bold">{{ $t('CLIENTS.LABELS.COMPANY') }}:</p>
          <p>{{ client.company }}</p>
        </div>
        <div class="flex w-full flex-col gap-2">
          <p class="font-bold">{{ $t('CLIENTS.LABELS.VAT') }}:</p>
          <p>{{ client.vat }}</p>
        </div>
      </div>
      <div class="grid w-full grid-cols-3">
        <div class="flex w-full flex-col gap-2">
          <p class="font-bold">{{ $t('CLIENTS.LABELS.GENDER') }}:</p>
          <p>{{ $t(`CLIENTS.GENDER.${client.gender}`) }}</p>
        </div>
        <div class="flex w-full flex-col gap-2">
          <p class="font-bold">{{ $t('CLIENTS.LABELS.FIRSTNAME') }}:</p>
          <p>{{ client.firstname }}</p>
        </div>
        <div class="flex w-full flex-col gap-2">
          <p class="font-bold">{{ $t('CLIENTS.LABELS.LASTNAME') }}:</p>
          <p>{{ client.lastname }}</p>
        </div>
      </div>
      <div class="grid w-full grid-cols-3">
        <div class="flex w-full flex-col gap-2">
          <p class="font-bold">{{ $t('CLIENTS.LABELS.STREET') }}:</p>
          <p>{{ client.street }}</p>
        </div>
        <div class="flex w-full flex-col gap-2">
          <p class="font-bold">{{ $t('CLIENTS.LABELS.POSTAL_CODE') }}:</p>
          <p>{{ client.postalCode }}</p>
        </div>
        <div class="flex w-full flex-col gap-2">
          <p class="font-bold">{{ $t('CLIENTS.LABELS.CITY') }}:</p>
          <p>{{ client.city }}</p>
        </div>
      </div>
      <div v-if="client.email" class="grid w-full grid-cols-3">
        <div class="flex w-full flex-col gap-2">
          <p class="font-bold">{{ $t('CLIENTS.LABELS.EMAIL') }}:</p>
          <p>{{ client.email }}</p>
        </div>
      </div>
      <div class="grid w-full grid-cols-3">
        <div class="w-full">
          {{ $t('CLIENTS.LABELS.DOCUMENTS') }}: {{ client.documents?.length }}
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
        @click="onDelete"
      />
    </div>
  </div>
</template>
