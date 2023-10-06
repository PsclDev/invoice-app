<script lang="ts" setup>
import { reset } from '@formkit/core';
import { omit } from 'lodash';

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
const randomValue = useRandomValue();
const { modelValue, formMode, clientId } = toRefs(props);

const formId = randomValue.Id();
const clientType = ref<'private' | 'company'>('private');
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
  <FormKit
    :id="formId"
    v-slot="{ state: { valid: formIsValid } }"
    v-model="form"
    type="form"
    :actions="false"
    form-class="w-full"
  >
    <div class="flex w-full flex-col items-center justify-center gap-5">
      <div class="flex w-full flex-col gap-5">
        <AppGroup v-if="formMode === FormMode.CREATE || form.company">
          <AppFormInput
            v-if="formMode === FormMode.CREATE"
            label="CLIENTS.LABELS.TYPE"
          >
            <FormKit
              v-model="clientType"
              type="radio"
              :options="{
                private: $t('CLIENTS.TYPE.PRIVATE'),
                company: $t('CLIENTS.TYPE.COMPANY'),
              }"
            />
          </AppFormInput>
          <AppFormInput
            v-if="clientType === 'company' || form.company"
            label="CLIENTS.LABELS.COMPANY"
            :required="true"
          >
            <FormKit type="text" name="company" validation="required" />
          </AppFormInput>
          <AppFormInput
            v-if="clientType === 'company' || form.company"
            label="CLIENTS.LABELS.VAT"
            :required="true"
          >
            <FormKit type="text" name="vat" validation="required" />
          </AppFormInput>
        </AppGroup>

        <AppGroup>
          <AppFormInput label="CLIENTS.LABELS.GENDER" :required="true">
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
          <AppFormInput label="CLIENTS.LABELS.FIRSTNAME" :required="true">
            <FormKit type="text" name="firstname" validation="required" />
          </AppFormInput>
          <AppFormInput label="CLIENTS.LABELS.LASTNAME" :required="true">
            <FormKit type="text" name="lastname" validation="required" />
          </AppFormInput>
        </AppGroup>

        <AppGroup>
          <AppFormInput label="CLIENTS.LABELS.STREET" :required="true">
            <FormKit type="text" name="street" validation="required" />
          </AppFormInput>
          <AppFormInput label="CLIENTS.LABELS.POSTAL_CODE" :required="true">
            <FormKit type="text" name="postalCode" validation="required" />
          </AppFormInput>
          <AppFormInput label="CLIENTS.LABELS.CITY" :required="true">
            <FormKit type="text" name="city" validation="required" />
          </AppFormInput>
        </AppGroup>

        <AppGroup>
          <AppFormInput label="CLIENTS.LABELS.EMAIL">
            <FormKit type="email" name="email" validation="email" />
          </AppFormInput>
        </AppGroup>
      </div>
      <div class="flex w-full gap-5">
        <AppButton
          label="COMMON.BUTTONS.CANCEL"
          :color="ButtonColor.GRAY"
          @click="onCancel"
        />
        <AppButton
          label="COMMON.BUTTONS.SAVE"
          :disabled="!formIsValid"
          @click="onSave"
        />
      </div>
    </div>
  </FormKit>
</template>
