<script lang="ts" setup>
import { reset } from '@formkit/core';
import { omit } from 'lodash';
import { PropType } from 'nuxt/dist/app/compat/capi';

import {
  ButtonColor,
  Client,
  ClientForm,
  FormMode,
  Gender,
  ViewMode,
} from '~/types';

const props = defineProps({
  modelValue: {
    type: String as PropType<ViewMode>,
    required: true,
  },
  formMode: {
    type: String as PropType<FormMode>,
    required: true,
  },
  clientId: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(['update:modelValue']);

const store = useClientStore();
const { modelValue, formMode, clientId } = toRefs(props);

const formId = (Math.random() + 1).toString(36).substring(7);
const form = reactive<ClientForm>({
  company: '',
  vat: '',
  gender: Gender.MALE,
  firstname: '',
  lastname: '',
  email: '',
  street: '',
  postalCode: '',
  city: '',
});

const client = ref<Client | null>(null);
if (formMode.value === FormMode.EDIT) {
  client.value = store.getById(clientId.value);
  const formValues = omit(client.value, [
    'id',
    'createdAt',
    'updatedAt',
    'documents',
  ]);
  Object.assign(form, formValues);
}

function onSave() {
  if (formMode.value === FormMode.CREATE) {
    store.create(clientId.value, form);
  } else {
    store.update(clientId.value, form);
  }

  emits(
    'update:modelValue',
    modelValue.value === ViewMode.EDIT ? ViewMode.VIEW : ViewMode.EDIT,
  );
}

function onCancel() {
  reset(formId);
  emits(
    'update:modelValue',
    modelValue.value === ViewMode.EDIT ? ViewMode.VIEW : ViewMode.EDIT,
  );
}
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center gap-5">
    <FormKit
      :id="formId"
      v-model="form"
      type="form"
      :actions="false"
      form-class="w-full"
    >
      <div class="flex w-full flex-col gap-5">
        <div
          v-if="formMode === FormMode.CREATE || form.company"
          class="grid w-full grid-cols-1 gap-2 sm:grid-cols-3"
        >
          <div class="flex w-full flex-col gap-2">
            <p class="font-bold">{{ $t('CLIENTS.LABELS.COMPANY') }}:</p>
            <FormKit type="text" name="company" validation="required" />
          </div>
          <div class="flex w-full flex-col gap-2">
            <p class="font-bold">{{ $t('CLIENTS.LABELS.VAT') }}:</p>
            <FormKit type="text" name="vat" validation="required" />
          </div>
        </div>
        <div class="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
          <div class="flex w-full flex-col gap-2">
            <p class="font-bold">{{ $t('CLIENTS.LABELS.GENDER') }}:</p>
            <FormKit
              type="select"
              name="gender"
              validation="required"
              :options="{
                MALE: $t('CLIENTS.GENDER.MALE'),
                FEMALE: $t('CLIENTS.GENDER.FEMALE'),
                DIVERS: $t('CLIENTS.GENDER.DIVERS'),
              }"
            />
          </div>
          <div class="flex w-full flex-col gap-2">
            <p class="font-bold">{{ $t('CLIENTS.LABELS.FIRSTNAME') }}:</p>
            <FormKit type="text" name="firstname" validation="required" />
          </div>
          <div class="flex w-full flex-col gap-2">
            <p class="font-bold">{{ $t('CLIENTS.LABELS.LASTNAME') }}:</p>
            <FormKit type="text" name="lastname" validation="required" />
          </div>
        </div>
        <div class="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
          <div class="flex w-full flex-col gap-2">
            <p class="font-bold">{{ $t('CLIENTS.LABELS.STREET') }}:</p>
            <FormKit type="text" name="street" validation="required" />
          </div>
          <div class="flex w-full flex-col gap-2">
            <p class="font-bold">{{ $t('CLIENTS.LABELS.POSTAL_CODE') }}:</p>
            <FormKit type="text" name="postalCode" validation="required" />
          </div>
          <div class="flex w-full flex-col gap-2">
            <p class="font-bold">{{ $t('CLIENTS.LABELS.CITY') }}:</p>
            <FormKit type="text" name="city" validation="required" />
          </div>
        </div>
        <div class="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
          <div class="flex w-full flex-col gap-2">
            <p class="font-bold">{{ $t('CLIENTS.LABELS.EMAIL') }}:</p>
            <FormKit type="email" name="email" validation="email" />
          </div>
        </div>
      </div>
    </FormKit>
    <div class="flex w-full gap-5">
      <AppButton label="COMMON.BUTTONS.SAVE" @click="onSave" />
      <AppButton
        label="COMMON.BUTTONS.CANCEL"
        :color="ButtonColor.ORANGE"
        @click="onCancel"
      />
    </div>
  </div>
</template>
