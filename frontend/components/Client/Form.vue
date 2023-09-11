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
        <AppFormGroup v-if="formMode === FormMode.CREATE || form.company">
          <AppFormInput label="CLIENTS.LABELS.COMPANY">
            <FormKit type="text" name="company" validation="required" />
          </AppFormInput>
          <AppFormInput label="CLIENTS.LABELS.VAT">
            <FormKit type="text" name="vat" validation="required" />
          </AppFormInput>
        </AppFormGroup>

        <AppFormGroup>
          <AppFormInput label="CLIENTS.LABELS.GENDER">
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
          </AppFormInput>
          <AppFormInput label="CLIENTS.LABELS.FIRSTNAME">
            <FormKit type="text" name="firstname" validation="required" />
          </AppFormInput>
          <AppFormInput label="CLIENTS.LABELS.LASTNAME">
            <FormKit type="text" name="lastname" validation="required" />
          </AppFormInput>
        </AppFormGroup>

        <AppFormGroup>
          <AppFormInput label="CLIENTS.LABELS.STREET">
            <FormKit type="text" name="street" validation="required" />
          </AppFormInput>
          <AppFormInput label="CLIENTS.LABELS.POSTAL_CODE">
            <FormKit type="text" name="postalCode" validation="required" />
          </AppFormInput>
          <AppFormInput label="CLIENTS.LABELS.CITY">
            <FormKit type="text" name="city" validation="required" />
          </AppFormInput>
        </AppFormGroup>

        <AppFormGroup>
          <AppFormInput label="CLIENTS.LABELS.EMAIL">
            <FormKit type="email" name="email" validation="email" />
          </AppFormInput>
        </AppFormGroup>
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
